---
title: 'Scoped Context'
date: 2022-06-06 16:00:09
category: react
thumbnail: './images/scoped-context/thumbnail.jpg'
---

![image-thumbnail](./images/scoped-context/thumbnail.jpg)

The [React Context API](https://reactjs.org/docs/context.html) lets you share global data across a React component tree. Any component below a Provider can read that Context's value.

Another way to say "components below a Provider can use its Context" is: **"a Consumer always reads from its nearest Provider."**

> `useContext()`
 always looks for the closest provider *above*
 the component that calls it. It searches upwards and **does not**
 consider providers in the component from which you're calling `useContext()` .  
[https://react.dev/reference/react/useContext#passing-data-deeply-into-the-tree](https://react.dev/reference/react/useContext#passing-data-deeply-into-the-tree)

```tsx
<ThemeContext.Provider value="dark">
  <Body />
  <ThemeContext.Provider value="light">
    <Footer />
  </ThemeContext.Provider>
  ...
</ThemeContext.Provider>
```

Inside `<Body />`, ThemeContext is dark. Inside `<Footer />`, it's light. You could say the ThemeContext value gets reassigned depending on scope.

This probably feels obvious, but there are use cases this behavior can't handle.

## Case: A compound component that extends another's Context

> This section is based on **[RFC: Context scoping for compound components](https://github.com/facebook/react/issues/23287)**.

![dialog-alertdialog relationship](./images/scoped-context/dialog-alertdialog.jpg)

```tsx

/*  1. AlertDialog uses the Dialog component internally.                                            */
/*  2. It uses the Dialog Context API, and Dialog.Trigger and Content use that Dialog Context.       */
/*  3. AlertDialog.Trigger and Dialog.Trigger each change the open value of the Context they reference to true. */

{/* 🐯 AlertDialog Provider */}
<AlertDialog.Root>
  {/* 🦁 Dialog Provider */}
  <Dialog.Root>
    {/* 🦁 Opens Dialog */}
    <Dialog.Trigger />
    <Dialog.Content>
      {/* 🐯 Opens AlertDialog */}
      <AlertDialog.Trigger />
    </Dialog.Content>
  </Dialog.Root>

  <AlertDialog.Content />
</AlertDialog.Root>
```

`AlertDialog` is built on top of `Dialog`, so `AlertDialog.Root` renders a `Dialog.Root` inside it.

When you click `AlertDialog.Trigger`, you'd expect it to update `AlertDialog`'s Context. But because **"a Consumer always reads from its nearest Provider,"** it updates Dialog's Context instead.

You might think the fix is to decouple Dialog and AlertDialog and give each its own Context. But as soon as you build yet another dialog out of the same component, the problem comes right back.

```tsx
// Create a Dialog Context
const FeedbackDialog = Dialog;
// Create a Dialog Context
const AnotherDialog = Dialog;

<FeedbackDialog.Root>
  <AnotherDialog.Root>
    <AnotherDialog.Trigger />
    <AnotherDialog.Content>
      {/* 💥 Opens AnotherDialog */}
      <FeedbackDialog.Trigger />
    </AnotherDialog.Content>
  </AnotherDialog.Root>
  <FeedbackDialog.Content />
</FeedbackDialog.Root>
```

<div style="opacity: 0.5; position: relative; top: -0.8em; left: -1em;" align="left">
  <sup>Giving each one its own Context doesn't solve the problem. It just moves it somewhere else.</sup>
</div>

Below are two libraries that tackle this need for scoped Contexts, and how each one solves it. (Officially, it still isn't settled whether this is a problem at all, or how it should be solved if it is.)

## Solution 1: [@radix-ui/context](https://github.com/radix-ui/primitives/tree/main/packages/react/context)

The idea is simple: the component that creates a Context takes a prop telling it which Context to use. A minimal version looks like this:

```tsx {6,11,22}
/* -------------------------------------------------------------------------- */
/*                                 Dialog                                     */
/* -------------------------------------------------------------------------- */
const DialogContext = createContext("DialogContext");

export const Root = ({ context: Context = DialogContext, children, name }) => {
  return <Context.Provider value={name}>{children}</Context.Provider>;
};

export const Trigger = ({ context: Context = DialogContext }) => {
  const contextValue = useContext(Context);
  return <div>DialogContext: {contextValue}</div>;
};

/* -------------------------------------------------------------------------- */
/*                                 AlertDialog                                */
/* -------------------------------------------------------------------------- */
const AlertDialogContext = createContext("AlertDialogContext");

export const Root = ({ children, name }) => {
  return (
    <Dialog.Root name={name} context={AlertDialogContext}>
      {children}
    </Dialog.Root>
  );
};

export const Trigger = () => {
  return <Dialog.Trigger context={AlertDialogContext} />;
};

/* -------------------------------------------------------------------------- */
/*                                     App                                    */
/* -------------------------------------------------------------------------- */
function App() {
  return (
    <AlertDialog.Root name="MyAlertDialog">
      <Dialog.Root name="MyDialog">
         {/* DialogContext: MyDialog */}
        <Dialog.Trigger />
        <Dialog.Content>
          {/* DialogContext: MyAlertDialog */}
          <AlertDialog.Trigger />
        </Dialog.Content>
      </Dialog.Root>

      <AlertDialog.Content />
    </AlertDialog.Root>
  );
}
```

<div style="opacity: 0.5; position: relative; top: -0.8em; left: -1em;" align="left">
  <sup><a href="https://codesandbox.io/s/stupefied-zhukovsky-etk9m" target="_blank">https://codesandbox.io/s/stupefied-zhukovsky-etk9m</a></sup>
</div>

`Dialog`'s `Root` doesn't always create its own Context. It can accept a different one through a prop, and its parts read from that injected Context too.

`AlertDialog` creates `AlertDialogContext` and passes it to DialogRoot, so it ends up reading a different Context from the plain Dialog components.

radix-ui's [createContextScope](https://github.com/radix-ui/primitives/blob/285aa0837f2405a05e983fc8fffd55f4cc368b5e/packages/react/context/src/createContext.tsx#L30) is a more polished version of the same idea.

### createContextScope

Let's walk through radix-ui's [AlertDialog](https://github.com/radix-ui/primitives/blob/285aa0837f2405a05e983fc8fffd55f4cc368b5e/packages/react/alert-dialog/src/AlertDialog.tsx#L19) and [Dialog implementation](https://github.com/radix-ui/primitives/blob/285aa0837f2405a05e983fc8fffd55f4cc368b5e/packages/react/dialog/src/Dialog.tsx#L27) to see how it works.

```tsx {10,24,27}
// Dialog
const [createDialogContext, createDialogScope] = createContextScope('Dialog');
const [DialogProvider, useDialogContext] = createDialogContext('Dialog');

const DialogRoot = (props) => {
  const { __scopeDialog } = props;

  // 1️⃣
  return (
    <DialogProvider scope={__scopeDialog}>...</DialogProvider>
  )
}

// AlertDialog
const [createAlertDialogContext, createAlertDialogScope] = createContextScope(
  'AlertDialog',
  [createDialogScope]
);
const useDialogScope = createDialogScope();

const AlertDialogRoot = (props) => {
  const { __scopeAlertDialog } = props
  // 2️⃣
  const dialogScope = useDialogScope(__scopeAlertDialog);

  return (
    <DialogRoot __scopeDialog={dialogScope.__scopeDialog}>...</DialogRoot>
  )
}
```

- 1️⃣ If DialogProvider gets a `scope` prop, it uses that scope's Context. If `scope` is undefined, it falls back to its own newly created Context.
- 2️⃣ AlertDialog calls the `useDialogScope` hook to **create a fresh Dialog Context and pass it to Dialog as `__scopeDialog`.**
- However the components are nested, AlertDialog's and Dialog's children each read the right context.

Both functions come from **createContextScope**: one builds a Context that can accept a scope (_createContext_), and the other creates a new Context to inject (_createScope_).

```tsx
function createContextScope(scopeName: string, createContextScopeDeps: CreateScope[] = []) {
  /* -----------------------------------------------------------------------------------------------
   * createContext
   * ---------------------------------------------------------------------------------------------*/

  function createContext(
    rootComponentName: string,
    defaultContext?: ContextValueType
  ) {
    return [Provider, useContext] as const;
  }

  /* -----------------------------------------------------------------------------------------------
   * createScope
   * ---------------------------------------------------------------------------------------------*/

  const createScope: CreateScope = () => {...};

  return [createContext, composeContextScopes(createScope, ...createContextScopeDeps)] as const;
}
```

Internally it has two parts: `createContext`, which returns a Provider and a useContext hook, and `createScope / composeContextScopes`, which merges the scope dependencies with the newly created scope.

#### 1. createContext

```tsx {11,17}
function createContext<ContextValueType extends object | null>(
  rootComponentName: string,
  defaultContext?: ContextValueType
) {
  const BaseContext = React.createContext(defaultContext);
  const index = defaultContexts.length;
  defaultContexts = [...defaultContexts, defaultContext];

  function Provider(props) {
    const { scope, children, ...context } = props;
    const Context = scope?.[scopeName][index] || BaseContext;

    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  function useContext(consumerName: string, scope: Scope<ContextValueType>) {
    const Context = scope?.[scopeName][index] || BaseContext;
    const context = React.useContext(Context);

    return context ?? defaultContext;
  }

  return [Provider, useContext] as const;
}
```

Both Provider and useContext use `scope?.[scopeName]` as the Context whenever it's set.

```tsx
const [createDialogContext, createDialogScope] = createContextScope('Dialog');

const DialogRoot = (props) => {
  const { __scopeDialog } = props;

  return (
    <DialogProvider scope={__scopeDialog}>...</DialogProvider>
  )
}

const [createAlertDialogContext, createAlertDialogScope] = createContextScope(
  'AlertDialog',
  [createDialogScope]
);

const AlertDialogRoot = (props) => {
  const dialogScope = useDialogScope(__scopeAlertDialog);

  return (
    <DialogRoot __scopeDialog={dialogScope.__scopeDialog}>...</DialogRoot>
  )
}
```

Here's what the Dialog Context receives as `scope` and scopeName in the code above:

**Dialog**
  - scope: `__scopeDialog`, received as a prop
  - scopeName: Dialog

**AlertDialog**
  - scope: `dialogScope.__scopeDialog`, the return value of `useDialogScope`
  - scopeName: Dialog

With plain `Dialog`, `scope` is undefined. With `AlertDialog`, it isn't.

#### 2. createScope / composeContextScopes

```tsx {3,11,34}
function createContextScope(scopeName: string, createContextScopeDeps: CreateScope[] = []) {
  /* ... */
  return [createContext, composeContextScopes(createScope, ...createContextScopeDeps)] as const;
}

const createScope: CreateScope = () => {
  return function useScope(scope: Scope) {
    const contexts = scope?.[scopeName] || scopeContexts;

    return React.useMemo(
      () => ({ [`__scope${scopeName}`]: { ...scope, [scopeName]: contexts } }),
      [scope, contexts]
    );
  };
};

function composeContextScopes(...scopes: CreateScope[]) {
  const createScope: CreateScope = () => {
    const scopeHooks = scopes.map((createScope) => {
      return {
        useScope: createScope(),
        scopeName: createScope.scopeName,
      }
    });

    return function useComposedScopes(overrideScopes) {
      const nextScopes = scopeHooks.reduce((nextScopes, { useScope, scopeName }) => {
        const scopeProps = useScope(overrideScopes);
        const currentScope = scopeProps[`__scope${scopeName}`];

        return { ...nextScopes, ...currentScope };
      }, {});

      return React.useMemo(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes }), [nextScopes]);
    };
  };

  createScope.scopeName = baseScope.scopeName;
  return createScope;
}
```

`createScope` is what builds the `__scope${scopeName}` value we just saw.

`composeContextScopes(createScope, ...createContextScopeDeps)` takes the scopes this scope depends on, creates their contexts relative to the current scope, and returns them.

```tsx
// AlertDialog.tsx
const [
  createAlertDialogContext,
  createAlertDialogScope,
] = createContextScope('AlertDialog', [createDialogScope]);
```

`createDialogScope` is passed in as `createContextScopeDeps` because the components built with `createAlertDialogContext` use the Dialog Context internally. So the dialog scope is declared as a dependency.

Without it, anything using `createAlertDialogScope` would throw an error because it can't find the right Dialog Context.

With a simple pair like Dialog and AlertDialog, ScopedContext might feel like overkill. But the more places a single component gets reused in, the harder these composition-driven Context scope problems become to manage.

## Solution 2: [Jotai](https://jotai.org/docs/api/core#provider)

The state management library Jotai lets you pass an optional `scope` prop when you create a Provider.

> A Provider accepts an optional prop `scope`
 that you can use for a scoped Provider. When using atoms with a scope, the provider with the same scope is used. The recommendation for the scope value is a unique symbol. The primary use case of scope is for library usage.  
[https://jotai.org/docs/api/core#provider](https://jotai.org/docs/api/core#provider)

```tsx
const myScope = Symbol('scope')

const anAtom = atom('')

const LibraryComponent = () => {
  const [value, setValue] = useAtom(anAtom, myScope)
  // ...
}

const LibraryRoot = ({ children }) => (
  <Provider scope={myScope}>{children}</Provider>
)
```

It works much like the first example.

```tsx {4,18}
// https://github.com/pmndrs/jotai/blob/main/src/core/Provider.ts

export const Provider = () => {
  const ScopeContainerContext = getScopeContext(scope)
  return createElement(
    ScopeContainerContext.Provider,
    {
      value: scopeContainerRef.current,
    },
    children
  )
}

const ScopeContextMap = new Map<Scope | undefined, ScopeContext>()

export const getScopeContext = (scope?: Scope) => {
  if (!ScopeContextMap.has(scope)) {
    ScopeContextMap.set(scope, createContext(createScopeContainer()))
  }
  return ScopeContextMap.get(scope) as ScopeContext
}

export function useAtomValue<Value>(
  atom: Atom<Value>,
  scope?: Scope
): Awaited<Value> {
  const ScopeContext = getScopeContext(scope)
  const { s: store } = useContext(ScopeContext)
  // ...
}
```

It creates a new Context per scope value, and when `useAtomValue` reads the context, it picks the one that matches the given scope.

## Wrapping Up

When I first came across Scoped Context in radix-ui, I thought it went against how React Context was designed, and was using Context in a way it wasn't meant for.

But once every component is offered as a composable piece, I think you do need scopes. Say a Dropdown Item is used as the Trigger for a Popover or a ContextMenu. If you can't set the Context scope of the shared [react-popover](https://github.com/radix-ui/primitives/tree/main/packages/react/popover) or [react-menu](https://github.com/radix-ui/primitives/tree/main/packages/react/menu) packages, the library would need some kind of hierarchy, like z-index, to decide which component becomes the top-level Provider.

Not many libraries seem to implement this yet, and the ones that do only agree on the general approach. I hope React offers something more standard for it soon.

## Reference

- [https://github.com/radix-ui/primitives/discussions/1091](https://github.com/radix-ui/primitives/discussions/1091)
- [https://github.com/facebook/react/issues/23287](https://github.com/facebook/react/issues/23287)
- [https://jotai.org/docs/api/core](https://jotai.org/docs/api/core#type-script)
  - [https://github.com/pmndrs/jotai/blob/main/src/core/Provider.ts](https://github.com/pmndrs/jotai/blob/main/src/core/Provider.ts)
  - [https://github.com/pmndrs/jotai/blob/main/src/core/useAtom.ts](https://github.com/pmndrs/jotai/blob/main/src/core/useAtom.ts)
