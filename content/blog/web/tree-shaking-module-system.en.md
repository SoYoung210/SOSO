---
title: 'Tree Shaking and Module Systems'
date: 2021-12-12 08:00:09
category: web
thumbnail: './images/tree-shaking-module-system/thumbnail.jpg'
---

![image-thumbnail](./images/tree-shaking-module-system/thumbnail.jpg)

## Introduction

Any application is a mix of code: what the developer writes by hand, external libraries, and everything in between. As it grows more complex, bundle size starts to matter, and that's where Tree Shaking comes in: the process of trimming everything down to **just the code you need**.

Here I'll go over what Tree Shaking actually is, and what has to be true for it to work at all.

## What Is Tree Shaking?

Look at the final bundle, and Tree Shaking is really just the disappearance of code nobody uses.

> It relies on the import and export statements in ES2015 to detect if code modules are exported and imported for use between JavaScript files.
<sup style="top: 0px;">
  <a href="https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking" target="_blank" rel="noreferer">mdn/glossary/tree-shaking</a>
</sup>

MDN puts it this way: Tree Shaking leans on ES2015 (ES6)'s import/export statements to figure out whether one JavaScript file actually references another.

It depends on the module system ES6 introduced, ES Modules (ESM). Of all the module formats out there, `ESM` is the one that makes Tree Shaking possible in the first place.

So how does ESM pull that off, and what sets it apart from the other module systems?

## Modules

Before getting into `ESM` specifics, here's a quick primer on modules and the other module systems out there.

### What Is a Module?

A module is essentially **'a reusable unit of code.'** **Reusable** means it behaves the same no matter where you drop it in; **unit of code** means an application is really just a collection of N modules.

Modules give you a better way to organize variables and functions. You keep them inside a module's own scope, and that same scope lets you share variables across modules when you need to.

## A Look Under the Hood of JavaScript's Module Systems

![module-global-variable-sharing](./images/tree-shaking-module-system/global_share.png)

Before JavaScript had modules, the easiest way for `foo.js` and `bar.js` to share a variable called `foo` was to hoist it into the global scope.

That approach gives you no control over a global variable's state or when it gets assigned, so everything ends up hostage to JS load order, and tracking dependencies between variable references turns into a mess.

Once people started pushing for a real module system, the client side and server side went their separate ways, and that split produced two proposals: [CommonJS](http://www.commonjs.org/) and [AMD (Asynchronous Module Definition)](https://github.com/amdjs/amdjs-api/wiki/AMD).

JavaScript modularization split into the `CommonJS` and `AMD` camps, and if you wanted modules in the browser, you needed a loader library that implemented one or the other.

### CJS (CommonJS)

```jsx
//importing 
const doSomething = require('./doSomething.js'); 

//exporting
module.exports = function doSomething(n) {
  // do something
}
```

Node.js, the server-side JavaScript runtime, went with `CommonJS`. Its two defining traits: **static binding and synchronous imports.**

> **Static binding:** `require` hands you a copy of the value. So even if `module.exports` changes the value later, whoever already did the `require` is stuck with the old one.

> Side note: [ECMAScript module support landed in Node.js 17](https://nodejs.org/api/esm.html#modules-ecmascript-modules).

### AMD (Asynchronous Module Definition)

```jsx
define(['dep1', 'dep2'], function (dep1, dep2) {
  //Define the module value by returning a value.
  return function () {};
});
```

`CommonJS` assumes every file already sits on disk, ready to load the instant you need it. In other words, it assumes a server-side environment where synchronous behavior is fine.

Load modules the CommonJS way in a browser, though, and the main thread can freeze **(blocking)** until every module finishes loading. That's a fatal flaw for CommonJS in that setting.

AMD actually broke off from CommonJS after the two groups couldn't agree on how to handle asynchronous module loading. CommonJS set out to take JavaScript beyond the browser; AMD stayed focused on the browser itself.

As the name 'Asynchronous Module Definition' suggests, AMD standardizes asynchronous modules: modules you can pull down over the network as you need them.

### UMD (Universal Module Definition)

```jsx
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["jquery", "underscore"], factory);
    } else if (typeof exports === "object") {
        module.exports = factory(require("jquery"), require("underscore"));
    } else {
        root.Requester = factory(root.$, root._);
    }
}(this, function ($, _) {
    // this is where I defined my module implementation

    var Requester = { // ... };

    return Requester;
}));
```

AMD and CJS splitting apart meant they no longer played nicely together, so UMD showed up as a pattern to paper over that. In practice, UMD is really just **a shape that defines a different implementation for each module system.**

### ESM

```jsx
import {foo, bar} from './myLib';

export default function() {
  // your Function
};
export const function1() {...};
export const function2() {...};
```

ESM is JavaScript's official module system, baked right into ECMAScript, and every modern browser supports it. (Except 'that browser' ~~IE11~~, of course.)

## What Makes ESM Different

### How It Works

ESM runs through three stages: **construction, instantiation, and evaluation.**

#### 1. Construction

First, it builds a dependency tree to figure out which modules even need loading.

You point to a file as the graph's starting point, then follow every `import` from there to build out that tree.

![module_record](./images/tree-shaking-module-system/module_record.png)

The browser can't actually use the raw files an `import` points to, so each one gets converted into a [Module Record](https://262.ecma-international.org/6.0/#sec-source-text-module-records), a data structure holding its export/import info. That means finding every file, loading it, and parsing it into a module record.

#### 2. Instantiation

Next, module records turn into module instances. This is where memory gets set aside for every value that's going to be imported, so that both `export` and `import` end up pointing at the same spot.

> **Module instance:** 'code' and 'state,' bundled together.

#### 3. Evaluation

This is where the code actually runs and fills that memory with real values.

On its own, 'code' is just a set of instructions, or a 'recipe' for building something. It can't do anything by itself; it needs 'values' to work with.

State is just a variable's actual 'value' at a given moment. (I keep calling it 'state,' though 'memory' is really the more accurate word.) 'Evaluation' is the step that fills that value in.

**Construction, instantiation, and evaluation** can each run on their own, asynchronously.

### Trait 1: Static Structure

```jsx
var foo = 'foo';
var lib = require(`lib/${foo}`);
lib.someFunc(); // property lookup
```

Access `lib` via `lib.someFunc`, and because `lib` is a dynamic value, you're stuck doing a property lookup.

```jsx
import * as lib from 'lib';
lib.someFunc(); // static analysis possible
```

ESM flips that: it knows everything about `lib` statically at import time, so it can optimize access.

Unlike `CommonJS`, an `export` statement can only live at ESM's top level. That's a constraint meant to make ESM easier for compilers to parse, and it's a fair trade, since you rarely need to dynamically define and `export` an API from inside a method call anyway.

```jsx
function foo () {
  export default 'bar' // SyntaxError
}
foo()
```

```js
// SyntaxError
import foo from `lib/${foo}`;
```

### Trait 2: Bindings, Not Values

As I mentioned back in [ESM's evaluation step](#평가), `import` and `export` both point at the exact same memory address.

![esm_binding](./images/tree-shaking-module-system/esm_binding.png)

Change a value where it's `export`ed, and that change shows up wherever it's `import`ed too. The exporting module can change the value; the importing side can't.

![esm_binding_update](./images/tree-shaking-module-system/esm_binding_update.png)

```jsx
// a.js
export let a = 'AAA'
setTimeout(() => a = 'ABC', 500)

// b.js
import 'a.js'
console.log('a', a); // AAA
setTimeout(() => console.log('a', a), 1000); // ABC
```

In the example above, `a` stays `AAA` for half a second, then flips to `ABC` a second in, and anywhere this module gets used sees that same change.

`CommonJS` works with the **value** of whatever module you loaded through `require`. Since the two sides aren't looking at the same memory, changing the value on the exporting side does nothing for whoever already did the `require`.

![cjs_binding](./images/tree-shaking-module-system/cjs_binding.png)

Using a module system means resolving how modules reference each other and assigning memory like this, in other words, building that dependency tree. So what happens when two modules end up in a circular reference?

![circular_reference](./images/tree-shaking-module-system/circular_reference.png)

Let's start with how `CommonJS` handles it.

`main.js` runs, and its first line, `require("./counter.js")`, fires, loading the `counter` module.

The counter module tries to read the `message` variable it got from main, but **since main hasn't finished running yet, message comes back undefined.**

Because `export`/`require` in CJS never share a memory address, counter keeps printing undefined even after main's value gets updated.

ESM works the opposite way. Since `export`/`import` share a memory address, `message` in `counter.js` actually flips from undefined to 'main complete.'

### Recap

That's a lot of ESM traits to take in, but the one that matters most is its **static structure.**

That static structure is exactly what lets tooling map out relationships between modules at build time, and from there, strip out whatever code nobody's using.

Next, let's connect that trait to Tree Shaking itself, and look at how webpack and rollup each approach it.

## Tree Shaking

Generally, Tree Shaking just means stripping out any node, a method or a variable, that isn't connected to the root.

![node_tree](./images/tree-shaking-module-system/node_tree.png)

### Which Modules Support It

Tree Shaking, at its core, only works on module structures you can analyze statically, which means ESM.

```jsx
module.exports[localStorage.getItem(Math.random())] = () => { … };
```

CommonJS can decide which module to load at runtime, as above, so a bundler has no easy way to tell at build time what should or shouldn't make the cut.

The internals differ from bundler to bundler, but one thing holds everywhere: **structures you can statically analyze always get better support.**

### [webpack] ModuleConcatenationPlugin

Looking at how [webpack's ModuleConcatenationPlugin](https://webpack.js.org/plugins/module-concatenation-plugin/) works makes it a lot clearer how CJS and ESM each shape the final bundle.

```jsx
// utils.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

// index.js
import { add } from './utils';
const subtract = (a, b) => a - b;

console.log(add(1, 2));
```

Build the code above with [optimization.minimize](https://webpack.js.org/configuration/optimization/#optimizationminimize) set to `false`, and here's what comes out.

```jsx
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

// CONCATENATED MODULE: ./utils.js**
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;

// CONCATENATED MODULE: ./index.js**
const index_subtract = (a, b) => a - b;**
console.log(add(1, 2));**

/******/ })();
```

Flip `minimize` to true, and unreferenced functions get stripped along with comments and whitespace. That **"result with the unreferenced functions gone"** is what you'd call the Tree Shaken output.

```jsx
const { maxBy } = require('lodash-es');

const fns = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => a / b,
  max: arr => maxBy(arr)
};

Object.keys(fns).forEach(fnName => module.exports[fnName] = fns[fnName]);

// webpack result
...
(() => {

"use strict";
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(288);
const subtract = (a, b) => a - b;
console.log((0,_utils__WEBPACK_IMPORTED_MODULE_0__/* .add */ .IH)(1, 2));

})();
```

Build CJS code, though, and `__webpack_require__` shows up in the bundle. It's there to let modules load dynamically, which means everything defined inside `fns` gets pulled in, no exceptions. (For more on `__webpack_require__` and the rest, see [this post](https://ui.toast.com/weekly-pick/ko_20190418).)

### [Rollup] Reading the AST

#### TL;DR

`rollup` bundles in three moves: map out dependencies into a graph, turn that graph into an AST (Abstract Syntax Tree) and parse it, then produce output that matches whatever options you gave it.

It's not subtracting what's unnecessary so much as adding whatever's judged to belong in the final bundle.

#### Step 1. Parsing

The AST conversion is what reveals the module paths behind every `import`, `export`, and `re-export` statement.

```ts
function createResolveId(preserveSymlinks: boolean) {
	return function(source: string, importer: string) {
		if (importer !== undefined && !isAbsolute(source) && source[0] !== '.') return null;

		return addJsExtensionIfNecessary(
			resolve(importer ? dirname(importer) : resolve(), source),
			preserveSymlinks
		);
	};
}
```

Rollup uses whatever module path comes out of that to create the module instance it works with internally.

```ts
const module: Module = new Module(
  this.graph,
  id,
  moduleSideEffects,
  syntheticNamedExports,
  isEntry
);
```

#### Step 2. Deciding the `included` Value

Depending on the AST syntax, [getNodeConstructor](https://github.com/rollup/rollup/blob/ce3de491b8ff0f61789c1ab61287ca06c9d19382/src/ast/nodes/shared/Node.ts#L216) gets called to handle each construct the right way.

Every one of [rollup's AST modules](https://github.com/rollup/rollup/tree/ca86df280288656c66a948e122c36ccee7e06aca/src/ast) shares an `include` method and a `this.included = true;` line.

That's just flipping [`ExpressionEntity`'s `included` value, false the moment its class gets created since it sits at the top of the hierarchy](https://github.com/rollup/rollup/blob/ce3de491b8ff0f61789c1ab61287ca06c9d19382/src/ast/nodes/shared/Expression.ts#L16), over to `true`.

Every AST module has the same pattern built in: when a code block gets included, set `included` to true, then walk every ES node in that block to decide `included` based on whatever conditions apply.

```ts
// example: ast/nodes/LabelStatement.ts
include(context: InclusionContext, includeChildrenRecursively: IncludeChildren): void {
	this.included = true;
	const brokenFlow = context.brokenFlow;
	this.body.include(context, includeChildrenRecursively);
	if (includeChildrenRecursively || context.includedLabels.has(this.label.name)) {
		this.label.include();
		context.includedLabels.delete(this.label.name);
		context.brokenFlow = brokenFlow;
	}
}
```

#### Step 3. Generating the File

```ts
function render(code: MagicString, options: RenderOptions) {
  if (this.label.included) {
    this.label.render(code, options);
  } else {
    code.remove(
      this.start,
      findFirstOccurrenceOutsideComment(code.original, ':', this.label.end) + 1
    );
  }
  this.body.render(code, options);
}
```

When it's time to generate the bundle file, everything hinges on the `included` value Step 2 settled on.

#### +) @rollup/plugin-commonjs

According to a rollup [issue](https://github.com/rollup/rollup-plugin-commonjs/issues/362), converting to ES6 via [rollup/plugin-commonjs](https://github.com/rollup/plugins/tree/master/packages/commonjs) can make code eligible for Tree Shaking, but whether it actually works depends on how you use `module.exports`.

```jsx
// ✅ Tree Shaking possible
const foo = require('./foo');

module.exports = {
  bar: foo,
}

// ❌ Tree Shaking not possible
const foo = require('./foo');

module.exports = foo
```

## Wrapping Up

[Next.js](https://nextjs.org/blog/next-12#es-modules-support-and-url-imports) and [Node.js](https://nodejs.org/api/esm.html#modules-ecmascript-modules) have both recently added ESM support, and [most modern browsers already support it](https://caniuse.com/es6-module).

I wrote this to work out why ESM support matters so much across the JavaScript ecosystem, and what kind of impact it actually has. Questions and feedback are always welcome!

## Appendix

### 1. Making a Library Tree-Shakable

According to the [webpack docs](https://webpack.js.org/guides/tree-shaking/#mark-the-file-as-side-effect-free), tree shaking comes down to two options.

- **usedExports:** exports a module actually uses
- **sideEffects:** skip a module that isn't used and has no sideEffects

> A module's sideEffects are a specific kind of 'code': code that runs the moment you import it, nothing more required.

```jsx
import 'fooPolyfill';
import 'bar.css'
```

Both modules above clearly have side effects, since importing them affects the app right away. But from a bundler's point of view, `fooPolyfill` and `bar.css` are just declared as imports, never used directly or re-exported, so it would flag them as fair game for Tree Shaking.

But if those two modules actually vanished, the app would break. So to keep things safe by default, bundlers like webpack and rollup assume **every module in a library has side effects.**

The bundler still can't judge sideEffects as well as the developer can. That's exactly why telling it about them yourself is what unlocks effective Tree Shaking. You get to set this property to `true`, `false`, or an array of files (`[foo.js, bar.css]`).

Most bundlers read the `sideEffects` field in `package.json` to decide, and treat it as true (every module has side effects) whenever it isn't set.

> "sideEffects is much more effective since it allows to skip whole modules/files and the complete subtree."
<sup style="top: 0px;">
  <a href="https://webpack.js.org/guides/tree-shaking/#clarifying-tree-shaking-and-sideeffects" target="_blank" rel="noreferer">webpack/tree-shaking#clarifying-tree-shaking-and-sideeffects</a>
</sup>

sideEffects is **effective precisely because** it can skip a whole module, file, or subtree at once. To recap the two levers behind webpack's Tree Shaking:

- **sideEffects:** skip a module that isn't actually used elsewhere
- **usedExports:** remove a module nothing else uses

If `usedExports` were always perfectly accurate, `sideEffects` wouldn't even need to weigh in: the final bundle would come out the same either way. But figuring out exactly which modules an app uses gets complicated fast as the app grows, and it isn't always right.

That's why leaning on `sideEffects` is so much more efficient and effective, and combining both gets you the best Tree Shaking result there is. (See Appendix 2.)

#### Keeping the Module Tree Intact

To actually get the benefit of sideEffects optimization, modules need to keep their tree structure instead of getting flattened into one file.

Bundle everything into a single file, and there's no module left to skip even if sideEffects say you could, so the whole optimization loses its point.

```jsx
// userAccount.js
import { isNil } from "lodash";

export const checkExistance = (variable) => !isNil(variable);

export const userAccount = {
  name: "user account",
};
```

Bundle `userAccount.js`, which pulls in lodash, together with everything else into a single file, and here's what comes out.

```jsx
// userAccount.js
import { isNil } from "lodash";

const checkExistance = (variable) => !isNil(variable);

const userAccount = {
  name: "user account",
};

const getUserAccount = () => {
  return userAccount;
};

// userPhoneNumber.js
const getUserPhoneNumber = () => "***********";
// userName.js
const getUserName = () => "John Doe";

export { checkExistance, getUserName, getUserPhoneNumber, getUserAccount };
```

Even once `checkExistance` gets flagged as unused, the code importing lodash sticks around.

```jsx
/***/ "./node_modules/user-library/dist/index.js":
/*!*************************************************!*\
  !*** ./node_modules/user-library/dist/index.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getUserName": () => (/* binding */ getUserName)
/* harmony export */ });
/* unused harmony exports checkExistance, userAccount, getUserPhoneNumber, getUserAccount */
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ "./node_modules/user-library/node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);

/*
contains the code for checkExistance, userAccount, getUserPhoneNumber, getUserName
**/

/***/ "./node_modules/user-library/node_modules/lodash/lodash.js":
/*!*****************************************************************!*\
  !*** ./node_modules/user-library/node_modules/lodash/lodash.js ***!
  \*****************************************************************/
/***/ (function(module, exports, __webpack_require__) {

/* module decorator */ module = __webpack_require__.nmd(module);
var __WEBPACK_AMD_DEFINE_RESULT__;/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
// ...
```

Look at the bundle output and you'll see `unused harmony exports checkExistance, ...`, meaning the module got flagged as unused, but lodash is CJS, so it never qualifies for Tree Shaking.

Keep the module structure intact, though, and `userAccount.js` (lodash and all) would live in its own file. **Flag that module as unused, and the whole userAccount.js file gets dropped, taking lodash with it.**

You can preserve the module structure in rollup with [the preserveModules: true setting](https://rollupjs.org/guide/en/#outputpreservemodules), and other bundlers offer something similar. See [How To Make Tree Shakable Libraries](https://blog.theodo.com/2021/04/library-tree-shaking/) for more detail.

### 2. Dead Code Elimination vs. Tree Shaking

Back in [Tree Shaking](#tree-shaking) I said the term means stripping out nodes not connected to the root, but Rollup, the project that coined it, actually defines it differently.

![dead-code-elimination-vs-tree-shaking](./images/tree-shaking-module-system/dead-code-elimination-vs-tree-shaking.png)

"Removing nodes not connected to the root" is actually Dead code elimination, but Rollup's Tree Shaking is live code inclusion: building up only the code you actually need.

So from rollup's angle, Tree Shaking is really just 'figuring out which modules are needed.'

Dead code elimination asks what's unnecessary in a live bundle; Tree Shaking flips that around and asks what's actually needed.

You'd expect both to land on the same final JS bundle, but the limits of JavaScript's static analysis mean they don't. You need both: Tree Shake through the bundler, then run dead code elimination through the terser plugin, and you get the smallest bundle possible. Since webpack 5 bundles terser-webpack-plugin by default, the two effectively always run together now anyway.

## References

- [https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/)
- [https://262.ecma-international.org/6.0/#sec-source-text-module-records](https://262.ecma-international.org/6.0/#sec-source-text-module-records)
- [https://exploringjs.com/es6/ch_modules.html#static-module-structure](https://exploringjs.com/es6/ch_modules.html#static-module-structure)
- [https://web.dev/commonjs-larger-bundles/](https://web.dev/commonjs-larger-bundles/)
- [https://blog.theodo.com/2021/04/library-tree-shaking/](https://blog.theodo.com/2021/04/library-tree-shaking/)
- [https://medium.com/@Rich_Harris/tree-shaking-versus-dead-code-elimination-d3765df85c80](https://medium.com/@Rich_Harris/tree-shaking-versus-dead-code-elimination-d3765df85c80)
- [https://www.smashingmagazine.com/2021/05/tree-shaking-reference-guide/](https://www.smashingmagazine.com/2021/05/tree-shaking-reference-guide/)
- [https://programmerall.com/article/7904967526/](https://programmerall.com/article/7904967526/)
