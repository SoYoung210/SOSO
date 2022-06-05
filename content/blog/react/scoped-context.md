---
title: 'Scoped Context'
date: 2022-06-05 16:00:09
category: react
thumbnail: './images/scoped-context/thumbnail.png'
---

React Context API를 사용할 때 반드시 지켜야 하는 규칙 동작 법칙이 있다. 대표적인 규칙은 Provider가 Consumer의 상단에 위치해야 한다는 것이고, 동작 법칙은 **“Consumer는 가장 가까운 Provider기준으로 동작한다”는 것이다.**

> `useContext()`
 always looks for the closest provider *above*
 the component that calls it. It searches upwards and **does not**
 consider providers in the component from which you’re calling `useContext()` .
[- React useContext Docs -](https://beta.reactjs.org/apis/usecontext#passing-data-deeply-into-the-tree)

```jsx
<ThemeContext.Provider value="dark">
  ...
  <ThemeContext.Provider value="light">
    <Footer />
  </ThemeContext.Provider>
  ...
</ThemeContext.Provider>
```

위와같이 의도적으로 Provider재선언을 통해 Consumer가 사용하는 값을 변경하고 싶은 경우에는 유용하겠지만, 이 동작법칙이 충족시키지 못하는 use-case가 존재한다.

## UseCase: Context를 확장한 Composition Component

아래 내용은 **[RFC: Context scoping for compound components](https://github.com/facebook/react/issues/23287)**내용을 기반으로 정리한 것이다.

```jsx
/* -------------------------------------------------------------------------- */
/*                                    사전설명                                    */
/* -------------------------------------------------------------------------- */

/*  1. AlertDialog는 내부에서 Dialog 컴포넌트를 사용한다.                                            */
/*  2. Dialog Context API를 사용하고 있고 Dialog.Trigger, Content에서 Dialog Context를 사용한다.     */
/*  3. AlertDialog.Trigger와 Dialog.Trigger는 각 컴포넌트가 참조하는 Context의 open값을 true로 변경한다. */

{/* 2️⃣ AlertDialog Provider */}
<AlertDialog.Root>
  {/* 1️⃣ Dialog Provider */}
  <Dialog.Root>
    {/* 1️⃣ Dialog를 Open하는 역할 */}
    <Dialog.Trigger />
    <Dialog.Content>
      {/* 2️⃣ AlertDialog를 Open하는 역할 */}
      <AlertDialog.Trigger />
    </Dialog.Content>
  </Dialog.Root>

  <AlertDialog.Content />
</AlertDialog.Root>
```

`AlertDialog`는 `Dialog`를 확장하여 만든 컴포넌트이고, 따라서 `AlertDialog.Root`는  `Dialog.Root`를 포함하며 DialogContext와 AlertDialog Context를 모두 가지고 있다. 

`AlertDialog.Trigger` 를 클릭했을 때 기대하는 동작은 `AlertDialog` 의 Context값이 변경되는 것이지만, **“Consumer는 가장 가까운 Provider기준으로 동작한다”**는 법칙에 의해 Dialog의 Context값을 변경하게 된다.

```jsx
<FeedbackDialog.Root>
  <AnotherDialog.Root>
    <AnotherDialog.Trigger />
    <AnotherDialog.Content>
			{/* FeedbackDialog와 AnotherDialog가 관련있다는 점이 지나치게 외부로 드러남. */}
      <FeedbackDialog.Trigger />
    </AnotherDialog.Content>
  </AnotherDialog.Root>
  <FeedbackDialog.Content />
</FeedbackDialog.Root>
```

모든 컴포넌트가 별도의 Context를 생성 하는것으로도 문제를 해결할 수 있지만, 사용하는 입장에서는 알기 어려운 배치 순서를 고려해야한다는 점에 있어서 좋은 API를 제공한다고 할 수 없다.

아직 이 현상이 문제인지, 문제라면 어떻게 해결 할지 공식적으로 정의된 부분은 없다. 이 현상을 문제로 바라본 라이브러리 몇 개의 해결책을 소개한다.

## Solution 1: [@radix-ui/context](https://github.com/radix-ui/primitives/tree/main/packages/react/context)

기본적인 컨셉은 “컴포넌트에 어떤 Context를 참조해야하는 지 직접 전달하는 방식”이다.

```jsx
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
        <Dialog.Trigger />
        <Dialog.Content>
          <AlertDialog.Trigger />
        </Dialog.Content>
      </Dialog.Root>

      <AlertDialog.Content />
    </AlertDialog.Root>
  );
}
```

Dialog의 Root에서는 직접 Context를 생성하는 것이 아니라 파라미터로 Context를 주입받을 수 있도록 되어 있고 AlertDialog에서는 이 점을 활용하여 AlertDialogContext를 생성하여 Dialog.Root에 주입하고 있다.

### Context Scope

radix-ui에서는 이 개념을 `createContextScope`로 구현했다.

```jsx
// Dialog
const [createDialogContext, createDialogScope] = createContextScope('Dialog');

// AlertDialog
const [
  createAlertDialogContext,
  createAlertDialogScope,
] = createContextScope('AlertDialog', [createDialogScope]);

const [AlertDialogContentProvider, useAlertDialogContentContext] =
  createAlertDialogContext('AlertDialogContent');
```

DialogScope를 주입받으면서 AlertDialogContext를 생성하는 함수를 반환한다. context를 다루는 코드를 살펴보기 전에 Dialog와 AlertDialog컴포넌트간의 관계를 정리해보자.

```jsx
// Dialog
const [createDialogContext, createDialogScope] = createContextScope('Dialog');
const [DialogProvider, useDialogContext] = createDialogContext('Dialog');

const DialogRoot = (props) => {
  const { __scopeDialog } = props;

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
	const dialogScope = useDialogScope(__scopeAlertDialog);

	return (
		<Dialog __scopeDialog={dialogScope.__scopeDialog}>...</Dialog>
	)
}
```

- DialogProvider는 scope라는 prop이 존재하면 해당 scope의 Context를 참조하고, undefined라면 새로 생성한 Context를 참조한다.
- AlertDialog에서는 useDialogScope hook을 사용해서 **Dialog Context를 새로 생성하고 이를 __scopeDialog라는 이름으로 Dialog에 전달한다.**
- 컴포넌트 위계에 관계 없이 AlertDialog와 Dialog 하위 컴포넌트에서 각각 알맞은 context를 참조할 수 있다.

이제 `createContextScope` 에서 return하는 **createContext**, **createScope**를 중심으로 ****세부적인 구현을 살펴보자.

```jsx
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

#### createContext

```jsx
function createContext<ContextValueType extends object | null>(
  rootComponentName: string,
  defaultContext?: ContextValueType
) {
  const BaseContext = React.createContext<ContextValueType>(defaultContext);
  const index = defaultContexts.length;
  defaultContexts = [...defaultContexts, defaultContext];

  function Provider(props) {
    const { scope, children, ...context } = props;
    const Context = scope?.[scopeName][index] || BaseContext;

    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  function useContext(consumerName: string, scope: Scope<ContextValueType | undefined>) {
    const Context = scope?.[scopeName][index] || BaseContext;
    const context = React.useContext(Context);

    return context ?? defaultContext;
  }

  return [Provider, useContext] as const;
}
```

Provider와 useContext에서 `scope?.[scopeName]` 값이 유효할 경우 해당 값을 Context로 사용하고 있다.

#### createScope

```jsx
const createScope: CreateScope = () => {
  const scopeContexts = defaultContexts.map((defaultContext) => {
    return React.createContext(defaultContext);
  });
  return function useScope(scope: Scope) {
    const contexts = scope?.[scopeName] || scopeContexts;

    return React.useMemo(
      () => ({ [`__scope${scopeName}`]: { ...scope, [scopeName]: contexts } }),
      [scope, contexts]
    );
  };
};
```

useScope에서 return되는 값을 살펴보면, `scope?.[scopeName]` 값을 참조하거나 defaultContexts 배열을 기준으로 새로운 context를 생성하고 있다.

앞서 살펴본 AlertDialog기준으로 흐름을 정리해보면 다음과 같다.

```jsx
/* -------------------------------------------------------------------------- */
/*                   1️⃣ DialogContext, createDialogScope생성                   */
/* -------------------------------------------------------------------------- */
const [createDialogContext, createDialogScope] = createContextScope('Dialog');

/* -------------------------------------------------------------------------- */
/*                2️⃣ AlertDialog에서 별도의 Dialog Context Scope생성               */
/* -------------------------------------------------------------------------- */
const [
  createAlertDialogContext,
  createAlertDialogScope
] = createContextScope('AlertDialog', [createDialogScope]);

const useDialogScope = createDialogScope();

/* -------------------------------------------------------------------------- */
/*       3️⃣ AlertDialog에서 생성한 DialogContext를 DialogProvider에 prop으로 전달    */
/* -------------------------------------------------------------------------- */

const AlertDialogRoot = () => {
  const dialogScope = useDialogScope();

  return <Dialog.Root __scopeDialog={dialogScope.__scopeDialog} />
}

const DialogRoot = () => {
  const { __scopeDialog } = props;
  return <DialogProvider scope={__scopeDialog} />
}
```

`DialogProvider` 는 아까 살펴본 createContext에서 반환하는 Provider이다.

```jsx
/* -------------------------------------------------------------------------- */
/*               4️⃣ scope?.[scopeName]에 Provider, Consumer가 존재함              */
/* -------------------------------------------------------------------------- */

function Provider(props) {
  const { scope, children, ...context } = props;
  const Context = scope?.[scopeName][index] || BaseContext;

  const value = React.useMemo(() => context, Object.values(context)) as ContextValueType;
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
```

AlertDialog에서 전달된 __scopeDialog에 Provider, Consumer가 존재하므로 AlertDialogRoot에서 사용하는 Dialog Provider는 Dialog에서 사용하는 Context와 다른 scope를 갖게 된다.

> AlertDialog에서 __scopeDialog 값을 만들어내는 코드는 [composeContextScopes](https://github.com/radix-ui/primitives/blob/main/packages/react/context/src/createContext.tsx#L119-L124)를 통해 이뤄진다.


Dialog와 AlertDialog라는 간단한 예시이기 때문에 ScopedContext가 필요하지 않다고 느껴질 수 있으나, 하나의 컴포넌트가 더 많은 곳에서 공통으로 사용될 수록 조합에 의한 Context 범위 문제는 다루기 어려워진다.

## Solution 2: [jotai](https://jotai.org/docs/api/core#provider)

상태관리 라이브러리인 Jotai에서도 Provider를 생성할 때 optional로 scope prop을 넘길 수 있다.

> A Provider accepts an optional prop `scope`
 that you can use for a scoped Provider. When using atoms with a scope, the provider with the same scope is used. The recommendation for the scope value is a unique symbol. The primary use case of scope is for library usage.

```jsx
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

원리는 첫 번째 예시와 비슷하다.

```jsx
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

scope값을 기준으로 새로운 Context를 생성하고 값을 사용할 때 (useAtomValue) scope값이 주어졌다면 해당 scope에 맞는 Context를 참조한다.

## 마무리

radix-ui에서 처음 Scoped Context라는 개념을 접했을 때는 React의 Context의 기본 디자인과 맞지 않고, scope를 적용해야하는 사용법이 잘못된 것이 아닌가 하는 생각에 좀더 가까웠던 것 같다.

하지만 모든 컴포넌트를 조합형으로 제공하는 상황에서는 Scope개념이 필요하다고 생각됐다. 예를 들어 Dropdown Item이 Popover혹은 ContextMenu의 Trigger로 쓰이는 경우에서 공통으로 사용되는 [react-popover](https://github.com/radix-ui/primitives/tree/main/packages/react/popover)나 [react-menu](https://github.com/radix-ui/primitives/tree/main/packages/react/menu)의 Context Scope을 지정해 줄 수 없다면 어떤 컴포넌트를 최상위 Provider로 선언할지 라이브러리 레벨에서 제공하는 z-index와 같은 위계 개념이 필요할 것이다.

아직 개념을 구현한 곳도 많지 않은 것 같고, 구현체도 큰 기조만 같은 상황이라 가까운 미래에 React에서 조금 더 정형화된 형태로 제공되면 좋을 것 같다.

## Reference

- [https://github.com/radix-ui/primitives/discussions/1091](https://github.com/radix-ui/primitives/discussions/1091)
- [https://github.com/facebook/react/issues/23287](https://github.com/facebook/react/issues/23287)
- [https://jotai.org/docs/api/core](https://jotai.org/docs/api/core#type-script)
  - [https://github.com/pmndrs/jotai/blob/main/src/core/Provider.ts](https://github.com/pmndrs/jotai/blob/main/src/core/Provider.ts)
  - [https://github.com/pmndrs/jotai/blob/main/src/core/useAtom.ts](https://github.com/pmndrs/jotai/blob/main/src/core/useAtom.ts)
