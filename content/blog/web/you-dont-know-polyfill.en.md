---
title: 'You don''t know polyfill'
date: 2020-11-11 08:00:09
category: web
thumbnail: './images/you-dont-know-polyfill/thumbnail.png'
---

![image-thumbnail](./images/you-dont-know-polyfill/thumbnail.png)

Babel is a tool that transforms ES6+ code into ES5. Reading just that sentence might make you think Babel is the same thing as a polyfill, but Babel doesn't mean polyfill. That's because it doesn't support ES6 methods or constructors that don't exist in ES5.

For example, `Promise`, `Object.assign`, `Array.from`, and the like aren't transformed, because there's no ES5 syntax to substitute for them.

```jsx {2,7,13,18}
// Yes! I can Do!
// Before
const helloBabel = () => {
  return 'world';
}

// After
var helloBabel = function helloBabel() {
  return 'world';
}

// No I can't
// Before
const helloPromise = new Promise(resolve => {
  return resolve('world')
})

// After
const helloPromise = new Promise(resolve => {
  return resolve('world')
})
```

The `Promise` syntax hasn't changed. This code throws an error in browsers that don't support ES6.

Filling in the gaps that Babel can't transform is exactly what a polyfill does. This post introduces [babel](https://github.com/babel/babel) and [polyfill.io](https://polyfill.io/).

## babel

Before babel@7.4.0, `@babel/polyfill` was commonly used, but due to the issues introduced below, it's now consolidated into `@babel/preset-env`.

> ⚠️  @babel/polyfill was deprecated in babel@7.4.0.

### @babel/polyfill

@babel/polyfill is a package that has the generator polyfill [regenerator runtime](https://www.npmjs.com/package/regenerator-runtime) and the ES5/6/7 polyfill [core-js](https://www.npmjs.com/package/core-js) as dependencies.

```jsx
// core-js@2.6.
// Cover all standardized ES6 APIs.
import "core-js/es6";

// Standard now
import "core-js/fn/array/includes";
import "core-js/fn/array/flat-map";
/* omitted */

// Ensure that we polyfill ES6 compat for anything web-related, if it exists.
import "core-js/web";

import "regenerator-runtime/runtime";
```

[@babel/polyfill's code](https://github.com/babel/babel/blob/master/packages/babel-polyfill/src/noConflict.js) is very simple. It only imports the polyfill modules `core-js` and `regenerator-runtime`.

Since `core-js` checks whether a feature already exists before adding a polyfill globally, it runs without polyfills on modern browsers, which makes it faster than using `@babel/plugin-transform-runtime(corejs: false)`.

> `@babel/plugin-transform-runtime` can also apply `corejs: 2 | 3 | false`. This is covered in more detail [below](https://so-so.dev/web/you-dont-know-polyfill#babel-plugin-transform-runtime).

```jsx {6,9}
// https://github.com/zloirock/core-js/blob/v2/modules/_export.js

var $export = function (type, name, source) {
  /* omitted */
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    /* omitted */
  }
}
```

Taking a quick look at the core-js@2.6.5 code that `@babel/polyfill` used to use, you can see it directly modifies the global object.

```jsx
// https://github.com/zloirock/core-js/blob/v2/modules/es7.array.includes.js
$export($export.P, 'Array', {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});
```

Because it modifies the global object directly, newly added prototype methods like `Array.prototype.includes` also work without issue, and you don't need to worry about which prototype methods a library uses.

However, `@babel/polyfill` has two major problems.

#### Problem 1

```js
import "core-js/es6"
/* ...omitted */
import "regenerator-runtime/runtime";
```

Because @babel/polyfill imports modules like this, unused polyfills also get included in the bundle, increasing its size. The moment you import @babel/polyfill, many modules under [core-js es6/index.js](https://github.com/zloirock/core-js/blob/v2/es6/index.js) all get bundled in.

#### Problem 2

@babel/polyfill should only be imported once. If two or more @babel/polyfills are imported, the following error occurs.

```text
:rotating_light: Uncaught Error : only one instance of babel-polyfill is allowed
```

Internally, it keeps a global variable called `global._babelPolyfill` and throws an error if two or more polyfills are loaded.

```js
if (global._babelPolyfill && typeof console !== "undefined" && console.warn) {
  console.warn(
    "@babel/polyfill is loaded more than once on this page. This is probably not desirable/intended " +
      /* ... */
  );
}
```

For `core-js`'s ES6/7 polyfills, which are a dependency of @babel/polyfill, calling it twice causes an internal error and the polyfill doesn't get applied correctly.
So you need to make sure @babel/polyfill isn't called twice.

### @babel/plugin-transform-runtime

`@babel/plugin-transform-runtime` replaces the behavior of parts that need a polyfill with internal helper functions during the transpile process. ([related code](https://github.com/babel/babel/blob/6.x/packages/babel-plugin-transform-runtime/src/index.js#L4-L16))

It has `core-js` as a [peerDependency](https://nodejs.org/es/blog/npm/peer-dependencies/), and applies polyfills by replacing them with internal helper functions—without modifying the global object—according to the [alias list](https://github.com/babel/babel/blob/master/packages/babel-plugin-transform-runtime/src/runtime-corejs3-definitions.js).

```jsx
new Promise(resolve => resolve(1))
```

After going through the transpile process, the code above turns into this. It creates an internal object rather than directly modifying the `Promise` global object.

```jsx {3}
var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

new _promise2.default(function (resolve) {
  return resolve(1);
});
```

Babel generates several helper functions to convert ES6+ syntax into ES5, and @babel/plugin-transform-runtime changes these helper functions during transpilation so that they reference another module instead.

```js
class Circle {}
```

Without `@babel/plugin-transform-runtime`, it gets transformed like this.

```js {1,6}
function _classCallCheck(instance, Constructor) {
  //...
}

var Circle = function Circle() {
  _classCallCheck(this, Circle);
};
```

Every piece of code that includes a `class` ends up regenerating the `_classCallCheck` function over and over.

Using `@babel/plugin-transform-runtime` changes this so that, instead of generating a helper function every time, it references `@babel/runtime` or `corejs` instead.

```js {1,9}
var _classCallCheck2 = require("@babel/runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var Person = function Person() {
  (0, _classCallCheck3.default)(this, Person);
};
```

Which module gets referenced depends on the [`corejs` option value](https://babeljs.io/docs/en/babel-plugin-transform-runtime#corejs); with the default value `false`, it references `@babel/runtime`. ([code](https://github.com/babel/babel/blob/main/packages/babel-plugin-transform-runtime/src/index.js#L165-L169))

```js
const moduleName = injectCoreJS3 // corejs === 3 ?
  ? "@babel/runtime-corejs3"
  : injectCoreJS2 // corejs === 2 ?
  ? "@babel/runtime-corejs2"
  : "@babel/runtime";

this.addDefaultImport(
  `${modulePath}/${helpersDir}/${name}`,
  name,
  blockHoist,
);
// `${modulePath}/${helpersDir}/${name}` example:
// @babel/runtime/helpers/esm/${toArray}.js
```

There's one thing to watch out for when using this approach.

For example, in a project that uses `axios` as a dependency, you need to make sure `node_modules/axios` is also included in the transpile scope. axios is a library that uses Promise internally, and since **babel-plugin-transform-runtime doesn't create the Promise global object, an error** occurs.

Unlike @babel/polyfill, it only applies polyfills where needed, which is an advantage in terms of bundle size, but it requires developers to pay attention to a lot of details.

> You can try out the code above at [SoYoung210/test-polyfill-babel-transform-runtime](https://github.com/SoYoung210/test-polyfill/tree/babel-transform-runtime).

### @babel/preset-env

It has [core-js-compat](https://www.npmjs.com/package/core-js-compat) as a dependency, and based on the target value set in `babelrc`, it uses [core-js-compat/data](https://github.com/zloirock/core-js/blob/master/packages/core-js-compat/src/data.js) to load only the polyfills that are needed. It works by checking which JS syntax isn't supported by the specified target and adding the corresponding `@babel/plugin-*`. ([Code](https://github.com/babel/babel/blob/eea156b2cb/packages/babel-preset-env/src/index.js#L303-L326))

#### useBuiltIns

The `useBuiltIns` option configures how polyfills get added. The default is `false`, so if you don't set this value, no polyfills are added.

#### useBuiltIns: entry

```jsx
// index.js
import 'core-js';
```

It changes the `core-js` and `regenerator-runtime` modules imported at the entry point of the transpile according to the `target` specified in babelrc.

```js {1,14}
// modern browser
module.exports = {
  "presets": [
    [
      "@babel/preset-env", {
        "targets": ">= 0.25%, not dead",
        "useBuiltIns": "entry",
        "corejs":3
      }
    ]
  ]
}

// include IE10
module.exports = {
  "presets": [
    [
      "@babel/preset-env", {
        "targets": ">= 0.25%, not dead, ie >= 10",
        "useBuiltIns": "entry",
        "corejs":3
      }
    ]
  ]
}

```

The `ie >=10` setting adds the `es/object.set-prototype-of` polyfill.

```diff
// modern browser
require("core-js/modules/es.array-buffer.is-view");

// include IE10
+ require("core-js/modules/es.object.set-prototype-of");
```

If the target is a very old browser, excessive polyfills get added, which can waste resources by making even modern browsers load a large bundle file.

> At [test-polyfill/babel-preset-env](https://github.com/SoYoung210/test-polyfill/tree/babel-preset-env), you can directly compare the difference between a bundle whose target includes IE ≥ 10 and one that doesn't.

#### useBuiltIns: usage

This setting only imports the polyfills actually used in the code.

Running `npm run build:modern:usage` in [test-polyfill/babel-preset-env](https://github.com/SoYoung210/test-polyfill/blob/babel-preset-env/index.js) gives the following result.

```jsx
// Input
new Set([1,2,3])

var a = new Promise();

// Output
require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

require("core-js/modules/es.set");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.iterator");
```

Because the `usage` option only treats the code you actually use as a polyfill target, an error can occur if there's un-polyfilled code somewhere in a `node_modules` dependency you're using.

Also, in code like the following, babel can't determine whether `fooArrayOrObject` is a string or an array, so it imports both polyfills.

```jsx
// Before
import { fooArrayOrObject } from './test';
console.log(fooArrayOrObject.includes());

// After
require("core-js/modules/es.array.includes");

require("core-js/modules/es.string.includes");

var _test = require("./test");

console.log(_test.fooArrayOrObject.includes());
```

## polyfill.io

The [polyfill.io](http://polyfill.io) service checks the requesting browser's [User-Agent](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent) and adds only the polyfills it needs. You can check the supported browsers on the [polyfill.io page](https://polyfill.io/v3/supported-browsers/); IE 10 and below aren't supported.

The User-Agent is checked via [polyfill-useragent-normaliser](https://github.com/Financial-Times/polyfill-useragent-normaliser/blob/master/lib/normalise-user-agent.vcl), and all the necessary polyfills are generated through the [getPolyfillString function](https://github.com/Financial-Times/polyfill-library/blob/e9cfb03a55ae343e1d6fb2e4f06176eee691298b/lib/index.js#L235).

> Running `npm run test-node` in [polyfill-library](https://github.com/Financial-Times/polyfill-library), you can see that the following script is generated.
![test-node-result.png](./images/you-dont-know-polyfill/test-node-result.png)

### Usage

If you use the default settings, just add the following script tag to your html file.

```html
<head>
<script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>
</head>
```

polyfill-library works by modifying the global object.

```jsx {2,15}
// https://github.com/Financial-Times/polyfill-library/blob/master/polyfills/Array/isArray/polyfill.js
CreateMethodProperty(Array, 'isArray', function isArray(arg) {
  return IsArray(arg);
});

// https://github.com/Financial-Times/polyfill-library/blob/master/polyfills/_ESAbstract/CreateMethodProperty/polyfill.js
function CreateMethodProperty(O, P, V) { // eslint-disable-line no-unused-vars
var newDesc = {
  value: V,
  writable: true,
  enumerable: false,
  configurable: true
  };

Object.defineProperty(O, P, newDesc);
}
```

### Options

```text
https://polyfill.io/v3/polyfill.min.js?features=default
```

If you use the default value like this, it automatically adds the required list of polyfills by referring to the internally defined [aliases.json](https://github.com/Financial-Times/polyfill-library/blob/e9cfb03a55ae343e1d6fb2e4f06176eee691298b/lib/sources.js#L51).
> I couldn't find any documentation summarizing which polyfills are defined under the default option, so I referred to the polyfills/_dist/aliases.json file generated by running `npm run test-polyfills` in polyfill-library.

```js
"default":
[
"Array.from","Array.isArray","Array.of","Array.prototype.every",
"Array.prototype.fill","Array.prototype.filter","Array.prototype.forEach",
....
]
```

If you only want to use certain features, specify them with the **feature** parameter; if there are polyfills you want to exclude, specify them with **excludes**.

```md {2,3}
https://cdn.polyfill.io/v3/polyfill.min.js
?features=fetch,IntersectionObserver
&excludes=Document
```

If you want polyfills to always load regardless of the User Agent value, enable the `flags=always` option. When requesting with flags=always, the option that checks whether the polyfill you want is already implemented in the browser is `flags=always, gated`.

```md {3}
https://cdn.polyfill.io/v2/polyfill.min.js
?features=fetch,IntersectionObserver&
flags=always,gated
```

You can find information about all the options in the [API Reference](https://polyfill.io/v3/api/), and using the [url-builder](https://polyfill.io/v3/url-builder/), which automatically generates query parameters based on the options, makes things more convenient.

### Security

Since options are specified as query parameters, this raises concerns about vulnerability to [XSS attacks](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting). polyfill.io prevents such attacks by escaping option values. It escapes the script characters `<` to `&lt` and `>` to `&gt`, so that even if there's something like a script tag in the code, it isn't interpreted as HTML.

> More details are covered in [this post](https://snyk.io/vuln/npm:polyfill-service:20160126).

polyfill-service added XSS attack prevention through [this commit](https://github.com/financial-times/polyfill-service/commit/aadd8d08b50f7f9c02b431d06f6ee2158902c53c), and it's been in place since polyfill-service version 3.1.2.

### Setting Up Your Own polyfill.io Server

There's no guarantee that the polyfill.io server is always stable, so using polyfill.io directly in production can be a bit of a risk. You can reduce this risk by running [polyfill-library](https://github.com/Financial-Times/polyfill-library) as a self-hosted server.

You can easily set up your own [polyfill-service](https://github.com/financial-times/polyfill-service) using Docker.

```docker
FROM node:12.18.0-alpine

RUN apk add --no-cache --update bash
RUN apk add --no-cache --update --virtual build git python make gcc g++

WORKDIR /polyfill

# Specify the correct version
ARG POLYFILL_TAG='v4.8.1'
ARG NODE_ENV='production'
RUN \
  git clone https://github.com/Financial-Times/polyfill-service . && \
  git checkout ${POLYFILL_TAG} && \
  rm -rf .git && \
  yarn install && \
  sed -i.bak -e 's,^node,exec node,' start_server.sh && \
  mv start_server.sh /bin/ && \
  chmod a+x /bin/start_server.sh && \
  apk del build
ENV PORT 8801

EXPOSE ${PORT}

CMD ["/bin/start_server.sh", "server/index.js"]
```

## If You're a Library Author

After summarizing how polyfills are handled, I started wondering what the best way to apply polyfill settings is when developing a library.

In a [GitHub Issue](https://github.com/w3ctag/polyfills/issues/6) discussing whether the responsibility for polyfills lies with the library or at the application level, webpack maintainer sokra said the following.

![sokra-comment](./images/you-dont-know-polyfill/sokra_comment.png)

<div style="opacity: 0.5" align='center'>
<sup>
<a target='_blank' rel='noopner noreferrer' href='https://github.com/w3ctag/polyfills/issues/6#issuecomment-272647475'>
https://github.com/w3ctag/polyfills/issues/6#issuecomment-272647475
</a>
</sup>
</div>
<br/>

Whether a polyfill is needed can be easily controlled at the application level, but not at the library level.

Because of this, many people spoke favorably of shifting the responsibility for polyfills to the application and instead **providing hints about where polyfills are needed**.

## Wrap-up

babel is the easiest and most reliable way to add polyfills, but it unnecessarily increases bundle size on modern browsers that don't need them.

If "bundle size"—one of the things you need to worry about in an [SPA](https://developer.mozilla.org/en-US/docs/Glossary/SPA)—is a concern, polyfill.io, which loads only the polyfills you need based on User-Agent, can also be an option.

That said, if you choose polyfill.io, you'll need to consider the added cost of server management and do enough testing to make sure you don't run into the [inaccurate polyfill](https://github.com/babel/website/issues/1366#issuecomment-326543755) issue mentioned by core-js maintainer "zloirock."

## References

- [https://programmingsummaries.tistory.com/](https://programmingsummaries.tistory.com/)
- [https://github.com/babel/babel/blob/master/packages/babel-polyfill/package.json](https://github.com/babel/babel/blob/master/packages/babel-polyfill/package.json)
- [https://github.com/zloirock/core-js](https://github.com/zloirock/core-js)
- [https://3perf.com/blog/polyfills/](https://3perf.com/blog/polyfills/)
- [https://babeljs.io/docs/en/babel-plugin-transform-runtime](https://babeljs.io/docs/en/babel-plugin-transform-runtime)
- [https://github.com/Financial-Times/polyfill-library](https://github.com/Financial-Times/polyfill-library)
- [https://slides.com/odyss/deck-8](https://slides.com/odyss/deck-8)
- [https://www.youtube.com/watch?v=8GcVBTBI4Ew&list=PLZl3coZhX98oeg76bUDTagfySnBJin3FE&index=12](https://www.youtube.com/watch?v=8GcVBTBI4Ew&list=PLZl3coZhX98oeg76bUDTagfySnBJin3FE&index=12)
- [https://snyk.io/vuln/npm:polyfill-service:20160126](https://snyk.io/vuln/npm:polyfill-service:20160126)
- [https://github.com/3YOURMIND/js-polyfill-docker](https://github.com/3YOURMIND/js-polyfill-docker)
