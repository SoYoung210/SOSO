---
title: 'Rollup.js Configuration'
date: 2021-01-17 16:00:09
category: tool
thumbnail: './images/rollupjs-config/thumbnail.png'
---

![image-thumbnail](./images/rollupjs-config/thumbnail.png)

While setting up the dev environment for a design system, I ended up digging deep into [rollup.js](https://rollupjs.org/) and how to configure it for a library. This isn't a step-by-step setup tutorial, so it won't cover everything you might need.

If you just want to see the finished setup, it's all at [@soyoung/design-system-config](https://github.com/SoYoung210/design-system-config).

## Table Of Contents

- [Rollup](https://so-so.dev/tool/rollup/rollupjs-config/#rollupjs)
  - [Config](https://so-so.dev/tool/rollup/rollupjs-config/#config)
  - [preserveModules](https://so-so.dev/tool/rollup/rollupjs-config/#preservemodules)
  - [babel](https://so-so.dev/tool/rollup/rollupjs-config/#babel)
- [Tree Shaking Result](https://so-so.dev/tool/rollup/rollupjs-config/#tree-shaking-result)
- [Why not Webpack?](https://so-so.dev/tool/rollup/rollupjs-config/#why-not-webpack)
- [Why not babel cli?](https://so-so.dev/tool/rollup/rollupjs-config/#why-not-babel-cli)
- [package.json](https://so-so.dev/tool/rollup/rollupjs-config/#packagejson)
- [TypeScript](https://so-so.dev/tool/rollup/rollupjs-config/#typescript)
  - [tsc](https://so-so.dev/tool/rollup/rollupjs-config/#tsc)
  - [rollup-plugin-typescript2](https://so-so.dev/tool/rollup/rollupjs-config/#rollup-plugin-typescript2)

## Rollup.js

Rollup.js is a bundler, same category as [webpack](https://webpack.js.org/) or [parcel](https://parceljs.org/): it takes a pile of large, interconnected modules (files) and turns them into a library or an application.

### Config

rollup.js supports a long list of plugins and options. Here's a `rollup.config.js` that outputs both `es` (ES module) and `cjs` (Common JS) formats:

```jsx
// rollup.config.js
const inputSrc = [
  ['./src/index.ts', 'es'],
  ['./src/index.ts', 'cjs'],
];

export default inputSrc
  .map(([input, format]) => {
    return {
      input,
      output: {
        dir: 'dist',
        format,
      },
      plugins: [],
    };
  });
```

Now add the **plugins you actually need**.

```jsx
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';

export default inputSrc
  .map(([input, format]) => {
    return {
      input,
      output: {
        dir: `dist2/${format}`,
        format,
        exports: 'auto',
      },
      external: [/@babel\/runtime/],
      // explained later
      preserveModules: format === 'cjs',
      plugins: [
        babel({
          babelHelpers: 'runtime',
          exclude: 'node_modules/**',
          extensions,
        }),
        nodeResolve({
          extensions,
        }),
        // https://velog.io/@peterkimzz/rollup-%ED%94%8C%EB%9F%AC%EA%B7%B8%EC%9D%B8
        // Helps rollup interpret CommonJS modules by converting them to ES6.
        commonjs({
          extensions: [...extensions, '.js'],
        }),
        peerDepsExternal(),
        postcss({
          plugins: [],
        }),
        terser(),
      ],
    };
  });
```

- [@rollup/plugin-babel](https://www.npmjs.com/package/@rollup/plugin-babel): lets rollup run your code through babel.
- [@rollup/plugin-node-resolve](https://www.npmjs.com/package/@rollup/plugin-node-resolve): resolves third-party modules (the dependencies in package.json) from inside your library, and also lets you import files with extensions other than js, like ts and tsx. It supports Tree Shaking for external modules too.
- [@rollup/plugin-commonjs](https://www.npmjs.com/package/@rollup/plugin-commonjs): converts CommonJS modules to ES6 so they can actually make it into your bundle output. Drop the `commonjs` plugin from the example project and build, and you'll hit an error like this:

  ![cjs-error](./images/rollupjs-config/cjs-error.png)

- [rollup-plugin-peer-deps-external](https://www.npmjs.com/package/rollup-plugin-peer-deps-external): keeps any `peerDependency` listed in package.json out of your library's bundle output.

  ```jsx
  // module reference in the bundle without peer-deps-external
  import { someThing } from '../../../node_modules/some'

  // with peer-deps-external added, it stays as below and is resolved from node_modules wherever it's used
  import { someThing } from 'some'
  ```

- [rollup-plugin-terser](https://www.npmjs.com/package/rollup-plugin-terser): minifies the bundle output.

### preserveModules

Set rollup.js's `preserveModules` option to `true`, and your bundle output keeps the same folder structure as your source.

- With the default, `false`, everything gets bundled into a single file

According to the docs, **this setting has no effect on Tree Shaking support.** The real difference shows up in `cjs` or `amd` formats: if you only use one piece of the library, you no longer end up importing all of it.

> ⚠️ The docs state outright that '**`preserveModule: true`** also supports tree shaking.'  
> That said, setting `preserveModules: true` at least contains the blast radius, so a tree-shake failure in one file doesn't take down the rest. I'd still recommend testing it against a real bundle. (Related issue: [webpack - tree shaking not working es module library](https://github.com/webpack/webpack/issues/9337))

```jsx
// Before
const module = require('@soyoung210/design-system-config')

render(module.Card);

// After
const Card = require('@soyoung210/design-system-config/dist/cjs/react/card/card3D');
render(Card);
```

cjs has no tree shaking of its own, so if a single file holds everything, your app's bundle can balloon.

> 📝 This option exists in the first place to support tree shaking in apps built with "Ember.js". ([related PR](https://github.com/rollup/rollup/pull/1878))

### babel

Here's how babel is configured in rollup.config.js.

```jsx
babel({
  babelHelpers: 'runtime',
  exclude: 'node_modules/**',
  extensions,
}),
```

[@rollup/plugin-babel](https://www.npmjs.com/package/@rollup/plugin-babel)'s `babelHelpers` option takes one of four values.

- **runtime:** the docs recommend this one specifically 'when building a library'. It has to be paired with [@babel/plugin-transform-runtime](https://www.npmjs.com/package/@babel/plugin-transform-runtime), and @babel/runtime needs to be listed as a dependency of your library.  
For more on @babel/plugin-transform-runtime, see the [official docs](https://babeljs.io/docs/en/babel-plugin-transform-runtime) and ["you don't know polyfill - babel/plugin-transform-runtime"](https://so-so.dev/web/you-dont-know-polyfill/#babelplugin-transform-runtime).
  > ⚠️ If you use this option, you also need to add `external: [/@babel\/runtime/]`.
- **bundled:** bakes babel's helper functions right into the bundle output. Mostly used when building an application.
- **external:** the docs warn you to use this carefully. Instead of auto-generating the internal helper functions, it lets you configure them yourself. For the details, see [this post](https://brunoscopelliti.com/a-simple-babel-optimization-i-recently-learned/).
- **inline:** not recommended. The helper function ends up duplicated across every file that needs it.

Of these four, `runtime` and `bundled` are worth walking through in detail.

The [example code](https://github.com/SoYoung210/design-system-config) used for these build tests has two components: `Button1`, built with just react and css, and `Card`, which uses `react-spring`.

#### babelHelpers: bundled

```jsx
export default [
	// ...
  plugins: [
    babel({
      babelHelpers: 'bundled', // default value
      exclude: 'node_modules/**',
      extensions,
    })
  ]
]
```

With this setting, babel's helper functions end up baked into the bundle output. Here's what that looks like.

```jsx
function _objectWithoutPropertiesLoose(source, excluded) {
  /* omitted */
}

const Button1 = (_ref) => {
  let {
    children
  } = _ref,
      props = _objectWithoutPropertiesLoose(_ref, ["children"]);
```

You can see `_objectWithoutPropertiesLoose` sitting right there in the file.

#### babelHelpers: bundled + external: [/@babel\/runtime/]

```jsx
export default [
  // ...
  external: [/@babel\/runtime/],
  plugins: [
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      extensions,
    })
  ]
```

What happens if you combine the two?

```jsx
import _extends$1 from '@babel/runtime/helpers/esm/extends';
import _objectWithoutPropertiesLoose$1 from '@babel/runtime/helpers/esm/objectWithoutPropertiesLoose';

function _extends() {
  /* omitted */
}

function _objectWithoutPropertiesLoose(source, excluded) {
  /* omitted */
}
```

`_objectWithoutPropertiesLoose$1` now points at the `@babel/runtime` module, while a separate `_objectWithoutPropertiesLoose` got generated locally.

`node_modules/react-spring` is what's referencing `_objectWithoutPropertiesLoose$1`. So the `@babel/runtime` reference coming from an external module (react-spring, in this example project) stayed external.

Meanwhile, the `@babel/runtime` code `Button1` needed got generated right inside the bundle.

#### babelHelpers: runtime + external: [/@babel\/runtime/]

```jsx
export default [
	// ...
  external: [/@babel\/runtime/],
  plugins: [
    babel({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
      extensions,
    })
  ]
]
```

**Every single reference** to `@babel/runtime` becomes **external**. Your babel config needs `@babel/transform-runtime` in it for this to work.

```jsx
import _objectWithoutPropertiesLoose from '@babel/runtime/helpers/objectWithoutPropertiesLoose';

const Button1 = (_ref) => {
  let {
    children
  } = _ref,
      props = _objectWithoutPropertiesLoose(_ref, ["children"]);
```

`_objectWithoutPropertiesLoose` no longer gets its implementation generated locally; it just points at the external module instead.

#### babelHelpers: runtime

```jsx
export default [
	// ...
  // external: [/@babel\/runtime/],
  plugins: [
    babel({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
      extensions,
    })
  ]
]
```

Skip the `external: [/@babel\/runtime/]` setting the docs tell you to add, and you'll get the exact same result as `babelHelpers: 'bundled'`.

```jsx
function _objectWithoutPropertiesLoose(source, excluded) {
  /* omitted */

  return target;
}

const Button1 = (_ref) => {
  let {
    children
  } = _ref,
      props = _objectWithoutPropertiesLoose(_ref, ["children"]);
```

So if you're using the `runtime` option, setting `external` isn't optional.

## Tree Shaking Result

Tree Shaking is one of the things that really matters for a library. If a user only touches a fraction of your code but the whole thing lands in their bundle anyway, bloating it for no reason, that's a hard sell no matter how well the library is built otherwise.

When everything bundles into one file, a Bundle Analyzer alone won't tell you much. Checking the application's final bundle output directly is a better way to confirm whether Tree Shaking actually kicked in.

So I installed `@soyoung210/design-system-config` and checked the result myself.

### With the Card component included

![include_card.png](./images/rollupjs-config/include_card.png)

The `onMouseMove` logic and everything else that makes up the `Card` component (function) ended up in the final bundle.

### With the Card component left out

![no_card.png](./images/rollupjs-config/no_card.png)

`Card`'s own code disappeared as expected, but the `react-spring` code it depends on stuck around. That might just be a [react-spring issue](https://github.com/pmndrs/react-spring/issues/1158), but it's also a textbook case of what I mentioned under [preserveModules](https://so-so.dev/tool/rollup/rollupjs-config/#preservemodules): one file's tree-shake failure dragging the whole bundle down with it.

If you want to go deeper on Tree Shaking, [this post](https://medium.com/@craigmiller160/how-to-fully-optimize-webpack-4-tree-shaking-405e1c76038) is worth a read.

## Why not Webpack?

webpack is a JavaScript bundler too, and does basically the same job, so you could reach for it here as well. But there are a few reasons I'd pick rollup over webpack specifically for bundling a library.

**webpack can't bundle into ESM format.**

Tree Shaking requires the bundled output to be in ESM format, but Webpack simply can't produce that. Rollup can.
🔔  Webpack5 [has ESM support on its roadmap, but as of 2021.01.10 it's still experimental](https://webpack.js.org/configuration/output/#outputmodule).

Bundling the exact same output, Rollup.js comes out to 22KB versus Webpack's 29KB — webpack's file size is just bigger.
For more on this, see [Migrating from Webpack to Rollup](https://medium.com/naver-fe-platform/webpack%EC%97%90%EC%84%9C-rollup%EC%A0%84%ED%99%98%EA%B8%B0-137dc45cbc38).

## Why not babel cli?

You could also skip bundling entirely and just run everything through [babel](https://babeljs.io/) as a transpiler. Plenty of open source projects do exactly this, including [chakra-ui](https://github.com/chakra-ui/chakra-ui/blob/develop/packages/switch/package.json) and [react-query](https://react-query.tanstack.com/) (esm).

- Upside: no bundler config to maintain, and react-query specifically sticks with this no-bundling setup for [reasons of its own](https://github.com/tannerlinsley/react-query/pull/994).
- Downside: babel isn't a bundler, so it can't do anything beyond transpiling, and it falls short in the situations below.

### Situation 1: using an internal dependency

```jsx
// babel cli
import { animated, useSpring } from 'react-spring';

export function Card() {
  return /*#__PURE__*/React.createElement(animated.div, { ... })
}

// rollup
import { useSpring, animated as extendedAnimated } from '../../../node_modules/react-spring/web.js';
```

If you want `react-spring` treated as an internal dependency of your library, babel alone can't get you there. It doesn't touch the `import { .. } from 'react-spring'` syntax at all, so every external dependency you use has to be declared as `peerDependencies` instead.

### Situation 2: custom style sheet

Say a component imports its own style sheet. A bundler knows how to parse and transform that style file. babel doesn't.

```jsx
// babel cli
import './styles.css';
import React from 'react';

// rollup
import React from 'react';
import './styles.css.js';

// how rollup handles the style sheet, styles.css.js
import styleInject from '../../../node_modules/style-inject/dist/style-inject.es.js';

var css_248z = ".card {\n  width: 45ch;}\n";
styleInject(css_248z);

export default css_248z;
```

## package.json

If your bundler outputs multiple formats — `cjs` (or `umd`), `esm`, whatever — you need to wire `package.json` up to point at the right one.

- [module](https://github.com/rollup/rollup/wiki/pkg.module): the `module` field points at the ES6 module's entry point.
- main: the file you get back when you run `require('foo')` after installing the package.

Declare both, and bundlers like rollup or webpack will read the `module` field, while environments that can't handle ES6, Jest being the obvious one, fall back to whatever `main` points at.

## TypeScript

TypeScript code needs one extra step beyond converting to JS: you also have to generate type definition files.

You can handle the JS conversion with `@rollup/plugin-babel`, the one already configured above, or with `rollup-plugin-typescript2`. Generating type definitions is simplest through `tsc`, so that's where I'll start.

> 💡 rollup's own officially supported TypeScript plugin is [@rollup/plugin-typescirpt](https://www.npmjs.com/package/@rollup/plugin-typescript). This post covers rollup-plugin-typescript2 instead, for a reason I'll get to below.

### tsc

Start with a `tsconfig` like this. (It doesn't have to match exactly.)

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "lib": ["dom", "esnext"],
    "strict": true,
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "Node",
    "suppressImplicitAnyIndexErrors": true,
    "noImplicitAny": true,
    "strictFunctionTypes": true,
    "strictNullChecks": true,
    "strictPropertyInitialization": true,
    "jsx": "react",
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}
```

Then tweak `package.json` a bit so type definitions get generated as part of `build`.

```json
"scripts": {
  "build:rollup": "rimraf ./dist2 && rollup -c ./scripts/rollup/rollup.config.js && npm run build:types2",
  "build:types2": "tsc --emitDeclarationOnly --declaration --declarationDir dist2/types"
},
```

### [rollup-plugin-typescript2](https://www.npmjs.com/package/rollup-plugin-typescript2)

When you're pairing Rollup with TypeScript, you've basically got two options: `rollup-plugin-typescript2`, or `@babel/preset-typescript` (alongside @rollup/plugin-babel).

The real difference between them comes down to **how each one actually resolves TypeScript**.

- rollup-plugin-typescript2: wraps `tsc` fully, so you get everything tsc gives you.
- @babel/preset-env: transpiles TypeScript to JavaScript, but it doesn't type-check at all. (see - [@babel/plugin-transform-typescript official docs](https://babeljs.io/docs/en/babel-plugin-transform-typescript))

Either one works fine. The project in this post uses babel purely as a transpiler and leans on `tsc` only for generating the type definition file, so it only needed `@rollup/plugin-babel`.

> 📝: rollup-plugin-typescript2 started as a fork of rollup's official TypeScript tool, `@rollup/plugin-typescript`, built specifically to surface TypeScript compile errors. You get all of TypeScript's power, but there's a known [issue with build speed being very slow](https://github.com/ezolenko/rollup-plugin-typescript2/issues/148).

> ⚠️  During Tree Shaking, a `/*#__PURE__ */` annotation tells the bundler a piece of code has no side effects and can be dropped. [babel has supported pure annotations since v7](https://babeljs.io/blog/2018/08/27/7.0.0#pure-annotation-support), but TypeScript still doesn't. It's worth checking whether pure annotations actually made it into your bundle output.

## Wrapping Up

That's everything I dug into and worked out while putting together this Rollup.js config file. I hope it helps if Rollup.js was still new to you, and if anything here is missing or needs fixing, I'd really appreciate a comment pointing it out.
