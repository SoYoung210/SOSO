---
title: 'node modules splitting'
date: 2020-08-30 16:00:09
category: webpack
thumbnail: './images/node-modules-splitting/thumbnail.png'
---

![image-thumbnail](./images/node-modules-splitting/thumbnail.png)

Building a web app usually means reaching for a pile of libraries to get features working fast. How you build those libraries can make or break your initial page load time.

Here's how tweaking `webpack`'s splitChunk option lets you break node modules into several separate bundle files.

> All the code here is up at [this repo](https://github.com/SoYoung210/webpack-node-modules-splitting).

## cacheGroups

The main lever we'll pull is webpack splitChunks' `cacheGroups` option.

**[cacheGroups](https://webpack.js.org/plugins/split-chunks-plugin/#splitchunkscachegroups) is where you define rules for when to spin up a new chunk file.** Each key in the cacheGroups object names one of those rules. The rules I'll walk through here are a lightly modified version of the ones in [Next.js's webpack-config.ts](https://github.com/vercel/next.js/blob/ed0820f763e74d0071625030aed70b3b21184aef/packages/next/build/webpack-config.ts).

## Three Rules: framework, lib, commons

First, turn off cacheGroups' defaults entirely by setting them to false, then define three custom rules.

```js
cacheGroups: {
  default: false,
  vendors: false,
  framework: {},
  lib: {},
  commons: {}
}
```

> The names here don't have to match mine — the [webpack splitChunk docs](https://webpack.js.org/plugins/split-chunks-plugin/#splitchunkscachegroups) just describe the shape as `splitChunks.cacheGroups.{cacheGroup}.priority`.

- framework: A chunk that isolates the project's core frameworks, like react and react-router-dom
- lib: A dedicated chunk for any node module bigger than a set threshold
- commons: A chunk for everything else

Here's the config with all three rules in place.

```js {7, 14}
cacheGroups: {
  default: false,
  vendors: false,
  framework: {
    chunks: 'all',
    name: 'framework',
    test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
    priority: 40,
    enforce: true,
  },
  lib: {
    test(module) {
      return (
        module.size() > 80000 &&
        /node_modules[/\\]/.test(module.identifier())
      );
    },
    name(module) {
      const hash = crypto.createHash('sha1');

      hash.update(module.libIdent({ context: __dirname }));

      return hash.digest('hex').substring(0, 8);
    },
    priority: 30,
    minChunks: 1,
    reuseExistingChunk: true,
  },
  commons: {
    name: 'commons',
    minChunks: 1, // entry points length
    priority: 20,
  }
}
```

And here's the bundle these rules produce, split into framework, commons, and the [hash]-named chunks lib generates.

![after_bundle_output](./images/node-modules-splitting/after_bundle_output.png)

Now, the properties that make each of these rules work.

### Priority

A given node module can match more than one cacheGroup's `test` rule at once.

When that happens, priority breaks the tie: the module goes to whichever rule ranks higher.

### chunks: all

The chunks setting takes one of three values.

**initial, async, all**

```jsx
// a.js
import React from 'react'
import('lodash') // dynamic load

console.log('hello a')

export default a;
```

In `a.js`, lodash is loaded dynamically, while react is imported right away.

```js
// webpack.config.js
splitChunks: {
  cacheGroups: {
    defaultVendors: {
      test: /[\\/]node_modules[\\/]/,
      chunks: 'async'
    },
  }
}
```

This config creates a chunk group called defaultVendors, and sets it up so that **only the files under node_modules that were imported asynchronously land in that group**.

Set chunks to `all` instead, and every file under node_modules gets split into defaultVendors.js, no matter how it was imported.

The whole premise behind splitting node_modules is that browsers can load resources in parallel, so breaking the bundle into smaller pieces cuts down total load time.

### enforce: true?

This forces webpack to always create a chunk for this group, ignoring every other splitChunks setting — minSize, minChunks, maxAsyncRequests, all of it.

### default, vendors, defaultVendors: false?

```jsx
cacheGroups: {
  default: false,
  vendors: false,
 // vendors was renamed to defaultVendors
  defaultVendors: false,
}
```

So what does setting all of these to `false` actually mean?

webpack ships with its own default splitChunk options.

The [SplitChunk options docs](https://github.com/webpack/webpack.js.org/blob/master/src/content/plugins/split-chunks-plugin.md) spell out these defaults.

```jsx
module.exports = {
  //...
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 20000,
      minRemainingSize: 0,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      automaticNameDelimiter: '~',
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
};
```

Setting all of those to false switches off webpack's built-in `SplitChunk` defaults entirely, leaving only your own custom rules in play.

### The modules Object Behind test and name

Set `lib`'s size threshold too low, and CSS modules can end up matching the lib rule too, which then throws a CSS-module-related error.

```text
TypeError: module.libIdent is not a function
    at Object.name [as getName] (/webpack.config.js:169:34)
    at addModuleToChunksInfoMap (/webpack/lib/optimize/SplitChunksPlugin.js:497:31)
    at /webpack/lib/optimize/SplitChunksPlugin.js:630:9
    at SyncBailHook.eval [as call] (eval at create (/node_modules/tapable/lib/HookCodeFactory.js:19:10), <anonymous>:5:16)
    at SyncBailHook.lazyCompileHook (/node_modules/tapable/lib/Hook.js:154:20)
```

Back to the config from before.

```jsx
 lib: {
   test(module) {
     return (
       module.size() > 80000 &&
         /node_modules[/\\]/.test(module.identifier())
      );
    },
   name(module) {
     const hash = crypto.createHash('sha1');
     if (!module.libIdent) {
       throw new Error(
         `Encountered unknown module type: ${module.type}. Please open an issue.`,
        );
      }

     hash.update(module.libIdent({ context: __dirname }));

     return hash.digest('hex').substring(0, 8);
   }
},
```

The CSS module's size happened to satisfy the `test` condition, and the naming logic in `name` is what threw the error.

CSS modules generated by the mini-css-extract plugin simply don't have `libIdent`. We need a check for whether a module's type came from mini-css-extract.

```jsx
const isModuleCSS = (module) => {
  return module.type === 'css/mini-extract';
};

lib: {
  test(module) {
    return (
      module.size() > 80000 &&
      /node_modules[/\\]/.test(module.identifier())
    );
  },
  name(module) {
    const hash = crypto.createHash('sha1');

    if (isModuleCSS(module)) {
      module.updateHash(hash);

      return hash.digest('hex').substring(0, 8);
    } else {
      if (!module.libIdent) {
        throw new Error(
          `Encountered unknown module type: ${module.type}. Please open an issue.`,
        );
      }
    }
    hash.update(module.libIdent({ context: __dirname }));

    return hash.digest('hex').substring(0, 8);
  },
  priority: 30,
  minChunks: 1,
  reuseExistingChunk: true,
}
```

Here's a quick summary of the module object properties in play.

- libIdent: The module's location. Calling module.libIdent() gives you something like this.
  - ex: /${projectPath}/node_modules/${moduleName}/${fileName}js
- type: The module's type. Most node modules are `javascript/auto`; CSS modules are `css/mini-extract`.
- size: The module's size

## Wrap-up

Here's what [bundle analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer) shows, before and after applying `cacheGroups`.

### Before

![before_bundle_output](./images/node-modules-splitting/before_bundle_output.png)

### After

![after_bundle_output](./images/node-modules-splitting/after_bundle_output.png)

Splitting relatively large modules like lottie and lodash into their own chunks, and letting the browser load them in parallel, is what actually speeds up that first page load.

## Reference

- [https://medium.com/@simsimjae/webpack4-splitchunksplugin-option-breakdown-19f5de32425a](https://medium.com/@simsimjae/webpack4-splitchunksplugin-%EC%98%B5%EC%85%98-%ED%8C%8C%ED%97%A4%EC%B9%98%EA%B8%B0-19f5de32425a)
- [https://webpack.js.org/plugins/split-chunks-plugin/#splitchunkscachegroups](https://webpack.js.org/plugins/split-chunks-plugin/#splitchunkscachegroups)
