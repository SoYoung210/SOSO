---
title: 'Where Did All Those `import React from ‘react’` Go?'
date: 2022-02-20 17:00:09
category: react
thumbnail: './images/jsx-new-transform/thumbnail.png'
---

![image-thumbnail](./images/jsx-new-transform/thumbnail.png)

In this post, I look at the RFC document for the JSX Transform that shipped in [the React 17 release](https://reactjs.org/blog/2020/10/20/react-v17.html) and summarize what this change actually means.

> I've added my own commentary and a bit of speculation throughout. If you have any feedback on that, I'd appreciate a comment.

## The Trigger

![react-17](./images/jsx-new-transform/react-17.png)

React 17 was released on October 20, 2020. The reason I'm writing this post now, about a year and a half after that release, is that I recently ran into a **React is not defined** error while using [esbuild](https://esbuild.github.io/), and that error turned out to be related to the JSX Transform change that shipped with React 17.

![react-reference-error](./images/jsx-new-transform/react-reference-error.png)

I had a vague memory that **“from React 17 onward, you don't need `import React from ‘react’` anymore.”**, and my code had no React-import-related errors either. But looking at the build output, the error is exactly what you'd expect.

```jsx {5}
// built js output
// references React but there's no React import
function y(V) {
	// ...
	return React.createElement($, ...)
}
```

Looking at the symptoms so far, we can guess that:

- making it so you don't have to import React isn't a feature of React alone, and
- since it's not a React feature, it must be a "something" involved at build time — but that something isn't esbuild itself (without extra configuration).

As the phrase _'without extra configuration'_ suggests, esbuild does document a separate setup for React.

## [esbuild auto-import for JSX](https://esbuild.github.io/content-types/#auto-import-for-jsx)

The esbuild docs explain that, since React code gets converted to `React.createElement`, you either need to add `import * as React from ‘React’` to every file, or use [esbuild's inject](https://esbuild.github.io/api/#inject) to handle it all at once during the build.

> esbuild's inject feature is a kind of polyfill mechanism that replaces references to a global variable with an export from the injected file — you can use it to make references to `React` resolve to the `react` package.

```jsx
// react-shim.js
import * as React from 'react'
export { React }
```

```bash
esbuild app.jsx --bundle --inject:./react-shim.js --outfile=out.js
```

## So Then...

When I used React elsewhere, I never needed this kind of setup. More precisely, anywhere [babel](https://babeljs.io/) was already in the toolchain, I could use it without any extra configuration.

> Although [React 17 doesn’t contain new features](https://reactjs.org/blog/2020/08/10/react-v17-rc.html), it will provide support for a new version of the JSX transform. In this post, we will describe what it is and how to try it.

Reading [the New JSX Transform doc](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html) that shipped with React 17 explains this in detail. [A new JSX transform was developed together with babel](https://babeljs.io/blog/2020/03/16/7.9.0#a-new-jsx-transform-11154httpsgithubcombabelbabelpull11154), and one of its side effects is no longer needing to import React.

## A New Transform?

The pre-React-17 approach was to convert JSX into `React.createElement`.

> You need React 17+ together with babel 7.9.0+, but since babel 7.9.0 was deliberately released before React 17, chronologically 'after React 17' is the more accurate way to put it.

```jsx
import React from 'react';

function App() {
  return <h1>Hello World</h1>;
}

// 👇👇👇👇👇👇
import React from 'react';

function App() {
  return React.createElement('h1', null, 'Hello world');
}
```

The `JSX → React.createElement` approach had two major problems:

- Since it references React, your code always has to include an `import React from ‘react’` statement.
- It comes with a lot of constraints around performance and technical debt. (I'll cover this in the section introducing the related RFC document.)

The new approach converts JSX into the `jsx` function from `react/jsx-runtime`. On top of that, developers no longer need to declare a reference to `react/jsx-runtime` themselves — babel injects it during the build instead.

```jsx
function App() {
  return <h1>Hello World</h1>;
}

// 👇👇👇👇👇👇
import {jsx as _jsx} from 'react/jsx-runtime';

function App() {
  return _jsx('h1', { children: 'Hello world' });
}
```

> If you switch `@babel/preset-react`'s `runtime` between `automatic` and `classic` on [babel/repl](https://babeljs.io/repl/#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&corejs=3.6&spec=false&loose=false&code_lz=JYWwDg9gTgLgBAbwGbQO4EMoBMBKBTJAXziSghDgHIo90BjGSgKCaQFcA7B4CDuAMQgQAFAEpETAJA0YbKH2FM4yuJIA8ACwCMAPiUqD6rMABuOjcDUB6Y2f0HlR0-eAAma7b2Hr2ncvtwokyELOxcMDx8ghCuYhLSeLLycIrevgHenhYezgHqVr7-BkEhQA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=env%2Creact%2Cstage-2&prettier=false&targets=&version=7.17.5&externalPlugins=&assumptions=%7B%7D), you can see that the build output differs.

## [RFC] A Proposal for a New JSX Transform Approach ( [PR1](https://github.com/facebook/react/pull/15141) / [PR2](https://github.com/facebook/react/pull/16432) )

In 2019, [Sebastian Markbåge](https://github.com/sebmarkbage) wrote [an RFC](https://github.com/reactjs/rfcs/blob/createlement-rfc/text/0000-create-element-changes.md) arguing that the `createElement` approach needed to change. It proposes simplifying how `React.createElement` behaves, and ultimately removing the need for forwardRef.

> The content below omits or edits parts of the original RFC text.

### History

React 0.12 made a big change to how `key`, `ref`, and `defaultProps` behave. All three are now evaluated before `React.createElement(...)` is even called.

- If I had to guess at the _"big change"_ in React 0.12 that the RFC mentions...
  - (1) [breaking change key and ref removed from this.props](https://ko.reactjs.org/blog/2014/10/16/react-v0.12-rc1.html#breaking-change-key-and-ref-removed-from-thisprops): 
    This means key and ref are no longer treated as component props. key and ref exist to let something outside the component control it — they aren't values the component itself needs to know about. (There were apparently related performance issues too.)
      - `someElement.props.key` → `someElement.key` 
  - (2) [breaking change default props resolution](https://ko.reactjs.org/blog/2014/10/16/react-v0.12-rc1.html#breaking-change-default-props-resolution): `defaultProps` gets resolved at mount time rather than at the point the ReactElement is created — meaning it's evaluated earlier than the other properties.

`React.createElement` was a reasonable approach back when class components were the norm, but once function components became the dominant style, it became an approach worth reconsidering.

Here are a few of its more notable downsides:

- If a component has `defaultProps`, you need to add all sorts of dynamic tests around it. Since `defaultProps` can hold arbitrary values, it's hard to optimize for.
- Because `defaultProps` can't be used together with `React.lazy`, you always have to check whether `defaultProps` exists, even during the render phase.
- `children` gets passed to `React.createElement` as variadic arguments, which then have to be dynamically patched back onto props.
    - Passing `children` to `React.createElement` as variadic arguments means it looks like this:
        
        ```jsx
        <Foo bar="bar">
        	<div>hi</div>
        	<div>hi2</div>
        </Foo>
        
        // 👇👇👇👇👇👇
        React.createElement(
        	Foo,
        	{ bar: 'bar' },
        	React.createElement('div', null, 'hi'),
           // no argument at all if <div>hi2</div> isn't present
        	React.createElement('div', null, 'hi2'),
        )
        ```
        
- Any implementation built on `React.createElement` needs dynamic property lookup.
- Since you can't guarantee the immutability of the props you're given, you always have to clone them internally before use.
- Since `key` and `ref` have to be excluded from props, if they do end up included in props, you need to delete them.
- With a pattern like `<div {...props} />`, you have to check every single time whether key and ref got included.
- Since the converted result takes the form of `React.createElement`, the converted output always has to include a `React` import. Ideally, using JSX shouldn't require importing anything at all.

Beyond the performance issues, the new JSX Transform also exists to lower the knowledge barrier to using React. To reduce the need for things like `defaultProps` and `forwardRef` — and, further still, for JSX to become more **standardized** — React needs to break away from its more arcane legacy behavior.

### Proposal 1: Auto-import

The very first thing to remove is the constraint that **“React must be declared within JSX's scope.”**

Ideally, the moment an element gets created should be the transpiler's own runtime, but this approach comes with a few concerns.

First, React is split into DEV mode and PROD mode, and DEV mode is far more complex and far more dependent on React than PROD mode is.

Second, it's easier for users to adopt a new change through a new version of the react package than through a build-tool update.

For these reasons, the actual implementation still needs to live in the react package, and the RFC proposes something like this:

```jsx
function Foo() {
  return <div />;
}

// 👇👇👇👇👇👇
import {jsx} from "react";
function Foo() {
  return jsx('div', ...);
}
```

### Proposal 2: Separate `key` From Props

Previously, even though `key` was excluded from `this.props` access, `React.createElement` still treated it as just another argument alongside the other props. In the new `jsx` approach, key should be handled as a separate argument instead of being passed together with props.

```jsx
jsx('div', props, key)
```

> The RFC doesn't spell out the exact reasoning, but it seems to stem from a desire for easier maintenance and a cleaner separation between props and key.

### Proposal 3: Always Pass `children` as a Prop

Whereas `children` was passed to `createElement` as variadic arguments, the new approach always adds it to props instead.

The original reason for passing it variadically was to let DEV distinguish between static children and dynamic children.

> (Speculation) "To distinguish in DEV"?  
  What the RFC author means by "distinguishing static children from dynamic children in DEV" seems to be about warning, in DEV, when dynamic children — i.e., array-type children — don't have unique keys. Looking at [L462 ~ L479](https://github.com/facebook/react/blob/40eaa22d9af685c239f9d8d42b454d031791e76d/packages/react/src/ReactElementValidator.js#L462-L479) of [createElementWithValidation](https://github.com/facebook/react/blob/main/packages/react/src/ReactElementValidator.js#L413), you can see logic that validates key based on the `arguments` type.
    

The new proposal looks like this:

```jsx
<div>{a}{b}</div>
// 👇👇👇👇👇👇
jsx('div', { children: [a, b] })

<div>{a}</div>
// 👇👇👇👇👇👇
jsx('div', { children:a })
```

### Proposal 4: A DEV-only Transformer

In DEV, attributes like `__source` and `__self` aren't passed as props — they're passed as separate arguments instead. This gets solved by splitting off a dedicated DEV function.

```jsx
// function used only in DEV
jsxDEV(type, props, key, isStaticChildren, source, self)
```

### Proposal 5: Deprecate `defaultProps` in Function Components

Honestly, function components never needed this in the first place.

### Proposal 6: Deprecate `key` Spread

```jsx
let randomObj = {key: 'foo'};
let element = <div {...randomObj} />;
element.key; // 'foo' 
```

Since there's no static way to know whether `key` was passed, a dynamic lookup was always required. Because it can't be statically analyzed and the lookup is expensive, key is no longer supported through spread syntax.

### Proposal 7: Move `ref` Extraction to Class / forwardRef Render Time

This changes how `ref` is handled internally. A minor update starts warning on access to `element.ref`; the next major update copies ref onto both `props` and `element.ref`, but React then makes the change of using `props.ref` as the single source of truth for `forwardRef`.

## Wrapping Up

What I found interesting while putting this together wasn't just the technical content itself — it was the thought put into what shape a change should take for the ecosystem to be able to absorb it, and the fact that this change was rolled out in a way that left React's end users, i.e., the developers who use React, with absolutely nothing to pay for it.

I'll wrap up this post by noting a few points I personally found interesting while going through the RFC document and its related updates.

- Passing `children` as dynamic positional arguments was there to support warning checks in DEV.
    - A question I had: the new proposal chooses to change the data type depending on the shape of children (object or array) — wouldn't it be simpler, from a complexity standpoint, to always keep it as an array and just check its length?
- The DEV-only transformer
    - I found myself thinking, isn't paying a large cost for a DEV-only feature worth less than paying it for PROD features? But given that React's end user is the developer, giving it importance on par with PROD mode is a reasonable call.
- The effort to keep the cost of the change as low as possible while solving the problem
    - Looking at the RFC, concerns about the JSX Transform go back quite a while, but it seems tooling support didn't catch up, which made it hard to move any faster.
    - The RFC's author wanted a more clearly distinguished way to write the `key` prop, something like `@key`... but didn't go with it, since it would have unnecessarily inflated the size of the change. (Probably judged that the benefit wasn't worth the change.)
- "Ideally, the moment an element gets created should be the transpiler's own runtime"
    - Propagating a change through a react update is easier than through a toolchain update, so this settles for the next-best option to handle DEV/PROD mode.
