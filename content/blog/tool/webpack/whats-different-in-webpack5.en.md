---
title: 'Webpack 5, What''s Different?'
date: 2020-11-07 00:00:09
category: webpack
thumbnail: './images/whats-diff-in-webpack5/thumbnail.png'
---

![image-thumbnail](./images/whats-diff-in-webpack5/thumbnail.png)

I put this together from the [webpack5 release post](https://webpack.js.org/blog/2020-10-10-webpack-5-release/), skipping a few things from the original. Want the complete list of changes? Go read the source. The v4-to-v5 migration guide lives in [this post](https://webpack.js.org/migrate/5/).

## What Breaking Changes Actually Means

This release is mostly a refactor: updating webpack's internal architecture and laying groundwork for features still to come. There are user-facing Breaking Changes too, but overall it reads more like internal prep work.

## General Direction

- Faster builds through persistent caching
- Better long-term caching, thanks to smarter algorithms and defaults
- Smaller bundles, from improved tree shaking and leaner default output
- Closer alignment with the web platform
- A cleaner internal structure

## ⚠️ No More Automatic Node.js Polyfills

webpack4 and earlier auto-polyfilled Node.js modules for browser compatibility, but most of those polyfills were dead weight nobody needed, inflating bundle size for nothing, so they've been removed.

Package maintainers are now expected to declare browser compatibility explicitly, via a browser field in package.json.

> True story: if your project (or one of its dependencies) uses crypto and you don't account for this change, your build will fail outright.

You can find the full list of excluded packages in the [webpack5 - Do not polyfill node bindings by default PR](https://github.com/webpack/webpack/pull/8460/commits/a68426e9255edcce7822480b78416837617ab065).

Ref: [https://medium.com/@sanchit3b/how-to-polyfill-node-core-modules-in-webpack-5-905c1f5504a0](https://medium.com/@sanchit3b/how-to-polyfill-node-core-modules-in-webpack-5-905c1f5504a0)

## 🚀 Long Term Caching

This kicks in automatically in webpack's production mode. The settings below are what make the build faster.

### Chunk and module IDs

A new algorithm, built for **long term** caching.

`chunkIds: "deterministic", moduleIds: "deterministic"`

It assigns modules and chunks short, 3-4 character IDs — a deliberate trade-off between bundle size and how well caching holds up long term.

Setting moduleIds/chunkIds/mangleExports to false turns off this default behavior, letting you plug in your own algorithm through a plugin instead.

In webpack4, setting `modulesIds / chunkIds: false` worked fine even without a custom plugin. In webpack5, that plugin is now required.

webpack5 recommends just sticking with the defaults. `chunkIds: "size"` does produce a smaller bundle, but it can hurt caching efficiency.

### Real Content Hash

Before, the hash was generated independently of what was actually in the file. In webpack5, `[contenthash]` is a real hash of the file's content, which pays off specifically when the only thing that changed was a comment or a variable name.

## ✨ Development Support

### Named Chunk IDs

Depending on the webpack mode, it automatically decides whether bundled JS files get hashed names or readable ones, deriving the id from the file path.

**You no longer need the `import(/* webpackChunkName: "name" */ "module")` syntax just for debugging.**

> That said, you'll still want it if you need readable names in production too. `chunkIds: named` works there, but be careful not to leak anything sensitive through it.

### Module Federation

This lets separate webpack builds share code with each other, so you can consume another build's output the same way you'd use a component or a library.

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

Here's what each Module Federation option does.

- `name`: Falls back to this value as the filename if none is set.
- `library`: Assigns the build output to an "app" variable.
- `filename`: The entry file's name.
- `exposes`: The name and target file exposed to other apps.
- `shared`: Modules to share (in the example above, react and react-dom never get loaded twice).

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

The `remotes` setting is what gives you access to `App1`.

Add a script tag to App2's HTML that pulls in the `remoteEntry.js` file `App1` exposes.

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

From here, App2 can use app1's Header component directly.

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

Up to now, sharing components across applications meant packaging them up as a separate npm package and installing it in every service that needed it, and each service had to keep bumping that package just to stay in sync on a shared UI. With Module Federation, **you get that same up-to-date UI without installing anything at all.**

See the Reference links below for more detail and examples on the code above.

- [https://github.com/nsebhastian/module-federation-react/tree/starter](https://github.com/nsebhastian/module-federation-react/tree/starter)
- [https://blog.bitsrc.io/revolutionizing-micro-frontends-with-webpack-5-module-federation-and-bit-99ff81ceb0](https://blog.bitsrc.io/revolutionizing-micro-frontends-with-webpack-5-module-federation-and-bit-99ff81ceb0)

## ✨ New Web Platform Features

### Asset modules

Image and icon asset modules are now supported out of the box. After the build they either become their own file or get inlined as a DataURI, and you can express this a couple of ways.

- [Old way] `import url from "./image.png"`, with `type: "asset"` set in `module.rules`.
- [New way] `new URL("./image.png", import.meta.url)`

### Native Worker support

Pair `new URL` with `new Worker`, `new SharedWorker`, or `navigator.serviceWorker.register`, and webpack automatically creates a new entry point for the web worker.

## ✨ New Node.js Ecosystem Features

### Resolving

webpack now understands the `exports` and `imports` fields in package.json, and [Yarn PnP](https://classic.yarnpkg.com/en/docs/pnp/) is supported too.

## 🚀 Optimization

### Nested tree-shaking

Tree-shaking now digs into nested properties too, not just top-level exports.

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

In code like this, `b` never actually gets used, so it's stripped out during bundling.

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

You could say the `something` module only matters once `test` actually gets called. webpack5 checks whether the exported `test` function is used at all, and if it isn't, it drops the `something` module along with it.

It recognizes the following symbols.

- Functions, classes
- Variables used with export default, or with the expressions below
  - Functions, classes
  - [Sequence expressions](https://krasimirtsonev.com/blog/article/meet-sequence-expression)
  - /*#**PURE***/ expressions
  - Local variables
  - import bindings

### CommonJs Tree Shaking

It also handles Tree Shaking for a handful of CommonJS patterns.

- exports|this|module.exports.xxx = ...
- exports|this|module.exports = require("...") (reexport)
- exports|this|module.exports.xxx = require("...").xxx (reexport)
- Object.defineProperty(exports|this|module.exports, "xxx", ...)
- require("abc").xxx
- require("abc").xxx()
- ESM import
- Importing ESM via `require()`
- Object.defineProperty(exports|this|module.exports, "__esModule", { value: true|!0 })
- exports|this|module.exports.__esModule = true|!0

### Side-Effect analysis

The `sideEffects` field in package.json flags a module as having no side effects. webpack5 can now figure that out on its own too, through static analysis of the source.

### General Tree Shaking improvements

webpack now surfaces a lot more detail around `export *`. If it's confident there's a conflicting export (say, an export default) while resolving one, it emits a warning.

You can also tree-shake `import()` manually, with a comment like `/* webpackExports: ["abc", "default"] */`.

### Development Production Similarity

webpack5 runs sideEffects optimization in both development and production mode. In webpack4, a wrong `sideEffects` flag in package.json could quietly break only your production build.

Catching that kind of bug in development, instead of production, makes it much faster and easier to fix.

### Improved target option

In webpack4, `target` gave you a choice between `web`, `node`, and a few others. webpack5 opens that up considerably.

The target option shapes the bundled code in several ways.

- How chunks load
- Chunk format
- How WebAssembly (wasm) loads
- How chunks and wasm load inside a worker
- Use of the global object
- When publicPath needs to be inferred automatically
- Which ECMAScript features and syntax show up in the generated code
- Certain Node.js behaviors (global, __filename, __dirname)

`web` and `node` alone couldn't pin down all of that, so webpack5 lets you specify a minimum version instead, like `node10.13`.

You can also set target to `"browserlist"`. Even if your project already has its own `broswerlist` property set elsewhere, whatever's in webpack.config.js wins.

## ✨ Performance

### persistent caching

Turn it on with a config like this.

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

The cache lands in `node_modules/.cache/webpack` under npm, or `.yarn/.cache/webpack` under yarn. As long as every plugin handles caching correctly, you shouldn't ever need to clear it by hand.

By default, timestamps drive snapshots in development, and file hashes drive production. File hashes are also what makes persistent caching possible in CI.

## 🧪 experiments

webpack5 keeps experimental features walled off, behind config flags you opt into.

New additions to the experimental set ship in webpack minor releases.

- Support for the legacy WebAssembly format (`experiments.syncWebAssembly`)
- The updated WebAssembly [spec](https://github.com/WebAssembly/esm-integration) (`experiments.asyncWebAssembly`)
- The [Top Level Await](https://github.com/tc39/proposal-top-level-await) Stage 3 proposal (`experiments.topLevelAwait`)
- Shipping the bundle as a module (`experiments.outputModule`)

## ⚠️ Node.js

The minimum supported Node.js version jumps from 6 to 10.3.0.

## Config Change

A few config changes worth flagging.

### resolve.fallback

Since the default Node.js polyfills are gone, you may need to add one back manually, like this.

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

`output.filename`, which names your bundled output, now accepts a **function** as well as a plain string.

```js
module.exports = () => {
  //...
  output: {
    // using name + contenthash
    filename: '[name].[contenthash].bundle.js',
    // using a function instead
    filename: (pathData, assetInfo) => {
      return pathData.chunk.name === 'main' ? '[name].js': '[name]/[name].js';
    }
  }
}
```

### optimization

New chunk-related config options came in, and a few older ones got deprecated as a result.

```js
module.exports = () => {
  optimization: {
    hashedModuleIds,
    namedChunks,
    occurrenceOrder,
  }
}
```

In splitChunks, `vendors` was renamed to `defaultVendors`.

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

Upgrading a live project to webpack5, I immediately got a wall of warnings in the build console.

Some of it looks like [warnings webpack-cli is already tracking](https://github.com/webpack/webpack-cli/issues/1918), and plenty of plugins clearly haven't fully caught up to webpack5 yet.

If you're not on CRA, it's probably fine to hold off before pulling this major update fully into your project.

2020.11.07 Update: The warning webpack-cli was tracking has been fixed in the [4.2.0 Release](https://github.com/webpack/webpack-cli/releases/tag/webpack-cli%404.2.0).

## Reference

- [https://blog.bitsrc.io/revolutionizing-micro-frontends-with-webpack-5-module-federation-and-bit-99ff81ceb0](https://blog.bitsrc.io/revolutionizing-micro-frontends-with-webpack-5-module-federation-and-bit-99ff81ceb0)
- [https://webpack.js.org/blog/2020-10-10-webpack-5-release](https://webpack.js.org/blog/2020-10-10-webpack-5-release)
- [https://medium.com/@sanchit3b/how-to-polyfill-node-core-modules-in-webpack-5-905c1f5504a0](https://medium.com/@sanchit3b/how-to-polyfill-node-core-modules-in-webpack-5-905c1f5504a0)
