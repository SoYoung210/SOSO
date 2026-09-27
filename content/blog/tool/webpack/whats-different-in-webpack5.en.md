---
title: 'Webpack 5, What''s Different?'
date: 2020-11-07 00:00:09
category: webpack
thumbnail: './images/whats-diff-in-webpack5/thumbnail.png'
---

![image-thumbnail](./images/whats-diff-in-webpack5/thumbnail.png)

This post is a summary of the [webpack5 release post](https://webpack.js.org/blog/2020-10-10-webpack-5-release/), and some content from the original isn't included. If you want to know every change, please refer to the original post. The migration guide from v4 to v5 is summarized in [this post](https://webpack.js.org/migrate/5/).

## What Breaking Changes Means

This is a refactor to update webpack's internal architecture and lay the groundwork for features to be added down the road. There are Breaking Changes on the feature side too, but it felt more like an update to prepare internally.

## General Direction

- Improved build performance through persistent caching
- Improved long-term caching with better algorithms and default settings
- Improved bundle size through better tree shaking and improvements to the default code generated during webpack builds
- Improved compatibility with the web platform
- Cleaned-up internal structure

## ⚠️ Removal of Automatic Node.js Polyfills

In webpack4 and earlier, polyfills for Node.js modules were provided automatically for browser compatibility, but since most of those polyfills were applied unnecessarily and increased bundle size, they've been removed.

Package maintainers are being asked to add a browser field to package.json to specify browser compatibility.

> Real-world case: if you use crypto (or have a dependency that uses it) and don't address this change, your project build won't complete successfully.

You can check the list of excluded packages in the [webpack5 - Do not polyfill node bindings by default PR](https://github.com/webpack/webpack/pull/8460/commits/a68426e9255edcce7822480b78416837617ab065).

Ref: [https://medium.com/@sanchit3b/how-to-polyfill-node-core-modules-in-webpack-5-905c1f5504a0](https://medium.com/@sanchit3b/how-to-polyfill-node-core-modules-in-webpack-5-905c1f5504a0)

## 🚀 Long Term Caching

This is one of the features automatically enabled in webpack production mode. The following settings improve build speed.

### Chunk and module IDs

A new algorithm was added for **long term** caching.

`chunkIds: "deterministic", moduleIds: "deterministic"`

Assigns IDs of about 3-4 characters to modules and chunks — a trade-off between bundle size and long term caching.

moduleIds/chunkIds/mangleExports: false disables the default behavior and lets you specify a custom algorithm via a plugin.

In webpack4, setting the `modulesIds / chunkIds: false` option didn't cause a build error even without a custom plugin, but in webpack5 it's required.

In webpack5, it's recommended to stick with the defaults. Applying `chunkIds: "size"` produces smaller bundles, but it can be less efficient for caching.

### Real Content Hash

Unlike before, when a hash was generated on its own regardless of file content, webpack5 uses the actual hash of the file content when you use `[contenthash]`. This content hash approach can have a positive effect when only comments or variable names have changed.

## ✨ Development Support

### Named Chunk IDs

Depending on the webpack mode, it automatically decides whether to name bundled JS files with a hash value or keep them readable, and the id is determined by the file path.

**You no longer need to use the `import(/* webpackChunkName: "name" */ "module")` syntax for debugging.**

> This is still an option you need to use if you want meaningful names in production too. You can use `chunkIds: named` in production, but it's recommended not to expose sensitive information.

### Module Federation

This is a feature that lets multiple webpack builds share with one another, letting you use the output of another webpack build like a component or a library.

```js {14,15,18,20}
// App1's webpack.config.js, which shares the Header component

const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  entry: "./src/index",
  output: {
    publicPath: "http://localhost:3001/",
  },
  /* ...omitted */
  plugins: [
    new ModuleFederationPlugin({
      name: "app1",
      library: { type: "var", name: "app1" },
      filename: "remoteEntry.js",
      exposes: {
        // expose each component
        "./Header": "./src/components/Header",
      },
      shared: ["react", "react-dom"],
    }),
  ],
}
```

Module Federation's options are as follows.

- `name`: If filename isn't set, the file name uses this configured value.
- `library`: Assigns the build output to an 'app variable.'
- `filename`: The entry file's name
- `exposes`: The name and target file used when consumed from another app
- `shared`: The names of modules to share (in the example above, react and react-dom aren't called redundantly)

```jsx {16}
// App2's webpack.config.js, which uses the Header component

const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  entry: "./src/index",
  output: {
    publicPath: "http://localhost:3002/",
  },
  /* ...omitted */,
  plugins: [
    new ModuleFederationPlugin({
      name: "app2",
      library: { type: "var", name: "app2" },
      remotes: {
        app1: "app1",
      },
      shared: ["react", "react-dom"],
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
}
```

You can access `App1` through the `remotes` setting.

Add a script to App2's HTML file that fetches the `remoteEntry.js` file exposed from `App1`.

```html {4}
// App2 index.html
<html>
  <head>
    <script src="http://localhost:3001/remoteEntry.js"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

Now App2 can use app1's Header component.

```jsx {3}
import React from 'react';

const Header = React.lazy(() => import('app1/Header'));

export default () => (
  <div style={{margin: '20px'}}>
    <React.Suspense fallback='Loading header'>
      <Header>Hello this is App 2</Header>
    </React.Suspense>
  </div>
);
```

Until now, if you wanted to share components across applications, you'd package them as a separate npm package and then install that package in each service. Whereas each service has to keep the package updated to the latest version to apply a common UI, with the Module Federation approach, **you can stay up to date without any separate install.**

For more details and examples about the code above, please refer to the Reference section below.

- [https://github.com/nsebhastian/module-federation-react/tree/starter](https://github.com/nsebhastian/module-federation-react/tree/starter)
- [https://blog.bitsrc.io/revolutionizing-micro-frontends-with-webpack-5-module-federation-and-bit-99ff81ceb0](https://blog.bitsrc.io/revolutionizing-micro-frontends-with-webpack-5-module-federation-and-bit-99ff81ceb0)

## ✨ New Web Platform Features

### Asset modules

It natively supports syntax for image or icon asset modules. After the build, they're either generated as separate files or converted to a DataURI, and you can use several formats for this.

- [Old way] Use `import url from "./image.png"` and set `type: "asset"` in `module.rules`.
- [New way] `new URL("./image.png", import.meta.url)`

### Native Worker support

If you use `new URL` together with `new Worker / new SharedWorker / navigator.serviceWorker.register`, webpack automatically creates a new entry point for the web worker.

## ✨ New Node.js Ecosystem Features

### Resolving

You can use the `exports` and `imports` fields in package.json, and [Yarn PnP](https://classic.yarnpkg.com/en/docs/pnp/) is also supported.

## 🚀 Optimization

### Nested tree-shaking

Supports tree-shaking by tracking information down into nested properties.

```jsx {2,3,11}
// inner.js
export const a = 1;
export const b = 2;

// module.js
export * as inner from './inner';
// or import * as inner from './inner'; export { inner };

// user.js
import * as module from './module';
console.log(module.inner.a);
```

In code like the above, `b` ends up being an unused variable, so it's removed during bundling.

### Inner-module tree-shaking

```jsx {1,7}
import { something } from './something';

function usingSomething() {
  return something;
}

export function test() {
  return usingSomething();
}
```

You could say the `something` module is only used once the `test` function is called. webpack5 determines whether the exported `test` function is used, and if it isn't, it removes the `something` module as well.

It supports the following symbols.

- Functions, classes
- Variables used with export default or the expressions below
  - Functions, classes
  - [Sequence expressions](https://krasimirtsonev.com/blog/article/meet-sequence-expression)
  - /*#**PURE***/ expressions
  - Local variables
  - import binding

### CommonJs Tree Shaking

It supports Tree Shaking for a few CommonJS patterns.

- exports|this|module.exports.xxx = ...
- exports|this|module.exports = require("...") (reexport)
- exports|this|module.exports.xxx = require("...").xxx (reexport)
- Object.defineProperty(exports|this|module.exports, "xxx", ...)
- require("abc").xxx
- require("abc").xxx()
- ESM import
- Importing ESM in the form of `require()`
- Object.defineProperty(exports|this|module.exports, "__esModule", { value: true|!0 })
- exports|this|module.exports.__esModule = true|!0

### Side-Effect analysis

The `sideEffects` field in package.json is a flag indicating that a module has no side effects. webpack5 can automatically determine, based on static analysis of the source code, that a module has no side effects.

### General Tree Shaking improvements

It's been improved to provide more information about `export *`. When webpack resolves `export *` and is confident there's a conflicting export (export default), it emits a warning.

`import()` can be tree-shaken manually via a comment like `/* webpackExports: ["abc", "default"] */`.

### Development Production Similarity

In webpack5, sideEffects optimization runs in both development and production mode. In webpack4, an incorrect `sideEffects` flag in package.json could sometimes cause errors only in production mode.

If you can catch this problem in development mode, it'll be faster and easier to fix.

### Improved target option

In webpack4, `target` could only be set to `web` and `node` (plus a few others). webpack5 offers more options.

The target option affects the bundled code in the following ways.

- How chunks are loaded
- Chunk format
- How WebAssembly (wasm) is loaded
- How chunks and wasm are loaded in a worker
- Use of the global object
- Cases where publicPath needs to be determined automatically
- ECMAScript features / syntax used in the generated code
- Some Node.js behaviors (global, __filename, __dirname)

The two options `web` and `node` weren't enough to determine all of the above, so in webpack5 you can specify a minimum version, like `node10.13`.

You can also use `"browserlist"` as the target. Even if a project already has a `broswerlist` property set elsewhere, the value applied in webpack.config.js is what's used.

## ✨ Performance

### persistent caching

You can enable it with a configuration like the following.

```js
module.exports = {
  cache: {
    // 1. Set cache type to filesystem
    type: 'filesystem',

    buildDependencies: {
      // 2. Add your config as buildDependency to get cache invalidation on config change
      config: [__filename]

      // 3. If you have other things the build depends on you can add them here
      // Note that webpack, loaders and all modules referenced from your config are automatically added
    }
  }
};
```

If you use npm, the cache is stored at `node_modules/.cache/webpack`; if you use yarn, it's stored at `.yarn/.cache/webpack`. As long as every plugin handles caching correctly, you shouldn't need to delete it manually.

By default, timestamps are used for snapshots in development mode and file hashes in production mode. Using file hashes lets you use persistent caching in CI as well.

## 🧪 experiments

webpack5 separates out experimental features and provides options you can enable via configuration.

Additions to features offered as experiments ship in webpack minor releases.

- Support for the old version of WebAssembly (`experiments.syncWebAssembly`)
- The new WebAssembly [updated spec](https://github.com/WebAssembly/esm-integration) (`experiments.asyncWebAssembly`)
- [Top Level Await](https://github.com/tc39/proposal-top-level-await) Stage 3 proposal (`experiments.topLevelAwait`)
- Ships the bundle as a module (`experiments.outputModule`)

## ⚠️ Node.js

The minimum Node.js version supported by webpack has changed from 6 to 10.3.0.

## Config Change

Here are a few Configuration Changes worth knowing about.

### resolve.fallback

Since the default Node.js polyfills have been removed, you may need to add a polyfill option like the following.

```js
module.exports = () => {
  module: {
    resolve: {
      fallback: {
        crypto: require.resolve('crypto-browserify')
      }
    }
  }
}
```

### output.filename

`output.filename`, the option that sets the file name of the bundled output, can now be set as a string or a **function**.

```js
module.exports = () => {
  //...
  output: {
    // the way of using name and contenthash
    filename: '[name].[contenthash].bundle.js',
    // the way of using a function
    filename: (pathData, assetInfo) => {
      return pathData.chunk.name === 'main' ? '[name].js': '[name]/[name].js';
    }
  }
}
```

### optimization

As configuration options for chunks were added, a few settings have been deprecated.

```js
module.exports = () => {
  optimization: {
    hashedModuleIds,
    namedChunks,
    occurrenceOrder,
  }
}
```

In splitChunk, `vendors` has been renamed to `defaultVendors`.

```js
module.exports = () => {
  optimization: {
    splitChunks: {
      // 🙅🏻‍♀️
      vendors: false,
      // 🙆🏻‍♀️
      defaultVendors: false,
    }
  }
}
```

## Afterthoughts

When I upgraded a project in production to webpack5, several warnings showed up in the build console.

There seem to be [warnings webpack-cli is already working on](https://github.com/webpack/webpack-cli/issues/1918), and it looks like various plugins haven't fully caught up with webpack5 support yet.

If you're not using CRA, it might be worth waiting a bit before fully bringing this Major Update into your project.

2020.11.07 Update: The warning webpack-cli was working on has been fixed in the [4.2.0 Release](https://github.com/webpack/webpack-cli/releases/tag/webpack-cli%404.2.0).

## Reference

- [https://blog.bitsrc.io/revolutionizing-micro-frontends-with-webpack-5-module-federation-and-bit-99ff81ceb0](https://blog.bitsrc.io/revolutionizing-micro-frontends-with-webpack-5-module-federation-and-bit-99ff81ceb0)
- [https://webpack.js.org/blog/2020-10-10-webpack-5-release](https://webpack.js.org/blog/2020-10-10-webpack-5-release)
- [https://medium.com/@sanchit3b/how-to-polyfill-node-core-modules-in-webpack-5-905c1f5504a0](https://medium.com/@sanchit3b/how-to-polyfill-node-core-modules-in-webpack-5-905c1f5504a0)
