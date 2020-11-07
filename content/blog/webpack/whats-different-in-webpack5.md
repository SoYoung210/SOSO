---
title: 'Webpack5, 무엇이 달라졌을까?'
date: 2020-11-07 00:00:09
category: react
thumbnail: './images/whats-diff-in-webpack5/thumbnail.png'
---

![image-thumbnail](./images/whats-diff-in-webpack5/thumbnail.png)

이 글은 [webpack5 Release 글](https://webpack.js.org/blog/2020-10-10-webpack-5-release/)을 정리한 글이며, 원글의 몇 가지 내용은 포함되지 않았습니다. 모든 변경사항을 알고 싶으신 분은 원글의 내용을 참고해주세요.

## 보충 할것 목록
- Real Content Hash

## Breaking Changes의 의미

webpack 아키텍처를 업데이트 하고 향후 추가될 기능을 위한 기반을 준비하기 위한 리팩토링입니다. 기능 면에서의 Breaking Changes도 있지만, 내부적으로 준비를 하기 위한 업데이트였다고 생각되었습니다.

## General Direction

- 영구 캐싱으로 빌드 성능 개선
- 더 나은 알고리즘과 default설정으로 long term캐싱 개선
- Tree shaking과 webpack build시 기본적으로 생성되는 default code에 대한 개선으로 번들 사이즈 개선
- 웹 플랫폼과의 호환성 향상
- 내부 구조 정리

## Node.js 자동 Polyfill 제거

webpack4버전 이하에서는 브라우저 호환성을 위해 Node.js 모듈에 대한 polyfill을 자동으로 제공했지만 대부분의 polyfill이 불필요하게 적용되어 bundle size를 증가시키기 때문에 이를 제거하였습니다.

Package maintainer에게 package.json에 browser필드를 추가하여 브라우저 호환성을 명시할 것을 당부하고 있습니다.

> 실제 사례: crypto를 사용하는(혹은 사용하는 dependency중에서 사용하는 패키지가 있는 경우) 이 변경사항을 대응하지 않으면 프로젝트 빌드가 정상적으로 수행되지 않습니다.

제외된 package목록은 [webpack5 - Do not polyfill node bindings by default PR](https://github.com/webpack/webpack/pull/8460/commits/a68426e9255edcce7822480b78416837617ab065) 에서 확인하실 수 있습니다.

Ref: [https://medium.com/@sanchit3b/how-to-polyfill-node-core-modules-in-webpack-5-905c1f5504a0](https://medium.com/@sanchit3b/how-to-polyfill-node-core-modules-in-webpack-5-905c1f5504a0)

## Long Term Caching

webpack production mode에서 자동으로 활성화 되는 기능 중 하나입니다. 아래 설정들로 빌드 속도를 향상시켰습니.

### Chunk and module IDs

**long term** 캐싱을 위해 새로운 알고리즘 추가.

`chunkIds: "deterministic", moduleIds: "deterministic"`

3~4글자 정도의 ID를 모듈 및 청크에 할당, bundle size와 long term caching간의 trade-off

moduleIds/chunkIds/mangleExports: false는 기본 동작을 비활성화 하고 플러그인을 통해 커스텀한 알고리즘을 지정할 수 있습니다.

webpack4에서는 `modulesIds / chunkIds: false`옵션 설정 시 커스텀 플러그인이 없어도 빌드 오류가 없었지만 webpack5에서는 필수로 필요합니다.

webpack5에서는 가장 기본값을 사용하는 것이 권장됩니다. `chunkIds: "size"` 를 적용할 경우 더 작은 번들이 생성되지만 캐싱에 비효율적일 수 있습니다.

### Real Content Hash

파일 내용과 관련없이 자체적으로 hash를 생성했던것과 달리, webpack5에서는 `[contenthash]`를 사용할 때 파일 내용의 실제 해시를 사용합니다. content hash방식은 주석이나 변수명만 변경되었을 때에 긍정적인 효과를 줄 수 있습니다.

## Development Support

### Named Chunk IDs

webpack mode에 따라 bundle된 JS파일의 이름을 해시값으로 할지, readable하게 유지할지 자동으로 결정하며, id는 file path로 결정됩니다.

더이상 디버깅을 위해 **import (/ * webpackChunkName : "name"* / "module") 구문을 사용할 필요가 없습니다.**

> production 환경에서도 유의미한 이름으로 보고싶다면 여전히 사용해야 하는 옵션입니다. production에서 `chunkIds: named`를 사용할 수는 있지만 민감한 정보를 노출시키지 않는 것이 권장됩니다.

### Module Federation

여러 webpack build를 서로 공유할 수 있는 기능이며 다른 webpack build결과물을  component혹은 라이브러리처럼 사용할 수 있습니다.

```js{14,15,18,20}
// Header컴포넌트를 공유하는 App1의 webpack.config.js

const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  entry: "./src/index",
  output: {
    publicPath: "http://localhost:3001/",
  },
  /* ... 생략 */
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

Module Federation의 옵션은 다음과 같습니다.

- `name`: filename이 설정되지 않은 경우 파일 이름은 이 설정값으로 사용됩니다.
- `library`: build output을 'app 변수'에 할당합니다.
- `filename`: entry file이름
- `exposes`: 다른 앱에서 사용될 때 쓰이는 이름과 대상 파일
- `shared`: 공유할 module이름(위 예시에서 react와 react-dom을 중복호출하지 않습니다.)

```jsx{16}
// Header컴포넌트를 사용하는 App2의 webpack.config.js

const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  entry: "./src/index",
  output: {
    publicPath: "http://localhost:3002/",
  },
  /* ...생략 */,
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

`remotes`설정을 통해 `App1`에 접근할 수 있습니다.

App2의 HTML파일에 `App1`에서 Expose된 `remoteEntry.js`파일을 가져오는 스크립트를 추가합니다.

```html{4}
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

이제 App2에서 app1의 Header컴포넌트를 사용할 수 있습니다.

```jsx{3}
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

지금까지는 컴포넌트들을 각 Application에서 공유하여 사용하고 싶다면 별도 npm package로 제작한 후 각 서비스에서 이 package를 install해서 사용하는 방식으로 사용했습니다. 각 서비스에서 패키지를 항상 최신 버전으로 유지해주어야만 공통된 UI를 적용할 수 있는 반면, Module Federation방식으로는 **별도 install없이 계속 최신 상태를 유지할 수 있습니다.**

위 코드에 대한 자세한 내용과 예시는 아래 Reference를 참고해 주세요.

- [https://github.com/nsebhastian/module-federation-react/tree/starter](https://github.com/nsebhastian/module-federation-react/tree/starter)
- [https://blog.bitsrc.io/revolutionizing-micro-frontends-with-webpack-5-module-federation-and-bit-99ff81ceb0](https://blog.bitsrc.io/revolutionizing-micro-frontends-with-webpack-5-module-federation-and-bit-99ff81ceb0)

## New Web Platform Features

### Asset modules

이미지나 아이콘 asset module에 대한 syntax를 기본적으로 지원합니다. build후에 별도 파일로 생성하거나 DataURI로 변환하게 되는데, 이 때 여러 포맷으로 사용할 수 있습니다.

- [예전 방식] `import url from "./image.png"` 로 사용하고 `module.rules` 에서  `type: "asset"` 를 사용합니다.
- [새로운 방식] `new URL("./image.png", import.meta.url)`

### Native Worker support

`new URL` 과 `new Worker / new SharedWorker / navigator.serviceWorker.register` 를 함께 사용하면 webpack은 자동으로 web worker에 대한 새로운 entry point를 생성합니다.

## New Node.js Ecosystem Features

### Resolving

package.json에서의 `exports` 와 `imports` field를 사용할수 있으며, Yarn PnP도 지원됩니다.

## Optimization

### Nested tree-shaking

중첩된 속성에 대한 내용까지 파악하여 tree-shaking을 지원합니다.

```jsx{2,3,11}
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

위와 같은 코드에서, `b`는 최종적으로 사용하지 않는 변수이므로 번들링 과정에서 제거 됩니다.

### Inner-module tree-shaking

```jsx{1,7}
import { something } from './something';

function usingSomething() {
  return something;
}

export function test() {
  return usingSomething();
}
```

`something` 모듈은  `test` 함수가 불려야 사용된다고 볼 수 있습니다. webpack5에서는 export된 `test` 함수가 사용되는지 여부를 판단하여 사용되지 않았을 경우 `something` 모듈까지 제거합니다.

아래 symbol들을 지원합니다.

- 함수, 클래스
- export default 혹은 변수 정의
  - 함수, 클래스
  - 시퀀스 표현(??)
  - /*#**PURE***/ expressions
  - 지역변수
  - import binding

(성욱님한테 물어봐야지)

Using `eval()` will bail-out this optimization for a module, because evaled code could reference any symbol in scope.

This optimization is also known as Deep Scope Analysis.

### CommonJs Tree Shaking

몇 가지 CommonJs에 대한 Tree Shaking을 지원합니다.

- `exports|this|module.exports.xxx = ...`
- `exports|this|module.exports = require("...")` (reexport)
- `exports|this|module.exports.xxx = require("...").xxx` (reexport)
- `Object.defineProperty(exports|this|module.exports, "xxx", ...)`
- `require("abc").xxx`
- `require("abc").xxx()`
- importing from ESM
- `require()` a ESM
- `Object.defineProperty(exports|this|module.exports, "__esModule", { value: true|!0 })`
- `exports|this|module.exports.__esModule = true|!0`

### Side-Effect analysis

package.json의 `sideEffects` 는 module에 side effect가 없다는 것을 나타내는 flag입니다. webpack5는 소스 코드 정적 분석에 따라 자동으로 모듈에 side effect가 없다고 판단할 수 있습니다.

### General Tree Shaking improvements

`export *` 에 대해 더 많은 정보가 제공되도록 개선되었습니다. webpack이 `export *` 를 해석할 때 충돌하는 export(export default)가 있다고 확신하면 경고를 내보냅니다.

`import()` 는 `/* webpackExports: ["abc", "default"] */` 라는 주석을 통해 수동으로 tree shaking 할 수 있습니다.

### Development Production Similarity

webpack5에서는 development, production mode 모두 sideEffects최적화를 진행합니다. webpack4에서 package.json의 잘못된 `sideEffects` 플래그로 인해 production mode에서만 오류가 발생하는 경우가 있었습니다.

development mode에서 이 문제를 찾을 수 있다면 더 빠르고 쉽게 해결할 수 있을 것입니다.

### Improved target option

webpack4에서 `target` 은 `web` 과 `node` (및 기타 몇 가지)에서 대략적으로 선택할 수 있었습니다. webpack5에서는 더 많은 옵션을 제공합니다.

target옵션은 번들러로 생성된 코드에 대해 더 많은 영향을 줍니다.

- 청크 로딩 방법
- 청크 형식
- WebAssembly(wasm) 로딩 방법
- worker에서 chunk와 wasm로딩 방법
- 전역 객체 사용
- publicPath가 자동으로 결정되어야 하는 경우
- 생성된 코드에서 사용하는 ECMAScript기능 / 구문
- 일부 Node.js 동작(global, __filename, __dirname)

위 목록에 대한 결정을 하는데에 `web`과 `node` 라는 선택지는 충분하지 않습니다. 따라서 `node10.13` 과 같이 최소버전을 명시할 수 있습니다.

target에 `"browserlist"` 를 사용할 수도 있습니다. 이 속성은 프로젝트에서 이미 사용하고 있는 `broswerlist` 속성이 있는 경우에도 webpack.config.js에서 적용한 값으로 사용됩니다.

## Performance

### persistent caching

기본적으로 다음과 같은 구성을 통해 활성화 할 수 있습니다.

```jsx
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

캐시는 npm을 사용하는 경우 `node_modules/.cache/webpack` 에, yarn을 사용하는 경우 `.yarn/.cache/webpack` 에 저장됩니다. 모든 플러그인이 캐싱을 올바르게 처리한다면 수동으로 삭제할 필요는 없습니다.

기본적으로 타임 스탬프는 개발 모드의 스냅 샷 및 프로덕션 모드의 파일 해시에 사용됩니다. 파일 해시를 사용하면 CI에서도 영구 캐싱을 사용할 수 있습니다.

## experiments

webpack5에서는 실험 기능을 분리하고, 설정에 따라 활성화 할 수 있는 옵션을 제공합니다.

실험으로 제공되는 기능에 대한 추가는 webpack minor release로 제공됩니다. 

- 구버전 WebAssembly 지원 (`experiments.syncWebAssembly`)
- 새로운 WebAssembly [updated spec](https://github.com/WebAssembly/esm-integration) (`experiments.asyncWebAssembly`)
- [Top Level Await](https://github.com/tc39/proposal-top-level-await) Stage 3 proposal (`experiments.topLevelAwait`)
- bundle을 module로 제공 (`experiments.outputModule`)

## Node.js

webpack에서 지원하는 Node.js 최소버전이 6에서 10.3.0으로 변경되었습니다.

## Config Change

- `cache: Object` 제거: memory-cache 설정 옵션이 제거되었습니다.
- `cache.type` 추가:  `"memory"` 와 `"filesystem"` 중 선택할 수 있습니다.
- `cache.type = "filesystem"` 관련 설정 추가:
    - `cache.cacheDirectory`
    - `cache.name`
    - `cache.version`
    - `cache.store`
    - `cache.hashAlgorithm`
    - `cache.idleTimeout`
    - `cache.idleTimeoutForInitialStore`
    - `cache.buildDependencies`
- `resolve.cache` 추가
- `resolve.concord` 제거
- `resolve.alias` 의 값은 배열 혹은  `false` 로 설정할 수 있습니다.
- `resolve.fallback` 추가:
- Node.js 자동 polyfil제거
    - `node.Buffer` 제거
    - `node.console` 제거
    - `node.process` 제거
    - `node.*` (Node.js native module) 제거
    - **MIGRATION**: `resolve.alias` 와 `ProvidePlugin` 을 사용할 수 있습니다. 에러 발생 시 설정 옵션에 대한 hint가 제공됩니다. (Refer to [node-libs-browser](https://github.com/webpack/node-libs-browser) for polyfills & mocks used in v4)
- `output.filename` 을 함수로 사용할 수 있습니다.
- `devtool`
    - 옵션: `false | eval | [inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map`
- `optimization.chunkIds: "deterministic"` 추가
- `optimization.moduleIds: "deterministic"` 추가
- `optimization.moduleIds: "hashed"` deprecated
- `optimization.moduleIds: "total-size"` 제거
- 모듈 및 chunk id에 대한 속성 제거
    - `optimization.hashedModuleIds` 제거
    - `optimization.namedChunks` 제거 (`NamedChunksPlugin` 도)
    - `optimization.namedModules` 제거 (`NamedModulesPlugin` 도)
    - `optimization.occurrenceOrder` 제거
    - **MIGRATION**:  `chunkIds` 와 `moduleIds` 사용
- `optimization.splitChunks` `test` 더 이상 청크 이름과 일치하지 않습니다.
    - **MIGRATION**: test 함수를 사용하세요. `(module, { chunkGraph }) => chunkGraph.getModuleChunks(module).some(chunk => chunk.name === "name")`
- `optimization.splitChunks` `minRemainingSize` 추가
- `optimization.splitChunks` `filename` 함수로 사용할 수 있습니다.
- `optimization.splitChunks` 타입에 따라 object로 사용할 수 있습니다.
    - `minSize`
    - `minRemainingSize`
    - `maxSize`
    - `maxAsyncSize`
    - `maxInitialSize`
- `optimization.splitChunks` `maxAsyncSize` 와 `maxInitialSize` 가 `maxSiz` 에 추가
- `optimization.splitChunks` `name: true` 제거: 자동으로 이름을 결정하는 속성이 제거되었습니다.
    - **MIGRATION**: 기본설정을 사용하세요. `chunkIds: "named"`
- `optimization.splitChunks.cacheGroups[].idHint` 추가
- `optimization.splitChunks` `automaticNamePrefix` 제거
    - **MIGRATION**:  `idHint` 를 사용하세요.
- `optimization.mangleExports` 추가
- `optimization.noEmitOnErrors` 이 `optimization.emitOnErrors` 로 변경되었습니다.
- `optimization.realContentHash` 추가
- `module.rule` 에서 `query` 와 `loaders` 삭제
- `module.rules` `options` 에 string으로 넘기는 옵션 삭제
    - **MIGRATION**: object로 넘겨야하며, loaders옵션은 삭제되었습니다.
- `module.rules` `mimetype` 추가
- `module.rules` `descriptionData` 추가
- `SourceMapDevToolPlugin` `lineToLine` 삭제
- `[hash]` 전체 컴파일에 사용되는 hash는 지원중단
    - **MIGRATION**: `[fullhash]` 사용
- `[modulehash]` 지원 중단
    - **MIGRATION**: `[hash]` 사용
- `[moduleid]` 지원 중단
    - **MIGRATION**: `[id]` 사용
- `[filebase]` 삭제
    - **MIGRATION**: `[base]` 사용
- file-based템플릿을 위한 새로운 옵션 추가 (i. e. SourceMapDevToolPlugin)
    - `[name]`
    - `[base]`
    - `[path]`
    - `[ext]`
- `experiments` 추가 (실험 단계 기능들 사용가능)
- `watchOptions.followSymlinks` 추가
- `watchOptions.ignored` 에 정규표현식 기능 추가

### **Changes to the Defaults**

- `target` 정보는 borwserlist config에 대한 정보가 있다면  `"browserslist"` 를 기본값으로 사용합니다.
- `module.unsafeCache` 의 기본값은 `node_modules`
- `optimization.moduleIds` 의 기본값은 production mode에서는 `deterministic` 이고, 아닐 경우 `size`
- `optimization.chunkIds` 의 기본값은 production mode에서 `deterministic` 이고, 아닐 경우 `total-size`
- `optimization.nodeEnv` 의 기본값은 `node` mode일 경우 `false`
- `optimization.splitChunks.minSize` 기본값은 production mode에서 `20k`
- `optimization.splitChunks.enforceSizeThreshold` 기본값은 production mode에서 `50k`
- `optimization.splitChunks` `minRemainingSize` 기본값은 `minSize`
    - webpack설정에 따라 분할되어야 하는 부분이 작을 경우 청크가 덜 분할됩니다.
- `optimization.splitChunks` `maxAsyncRequests` and `maxInitialRequests` defaults was been increased to 30
- `optimization.splitChunks.cacheGroups.vendors` 삭제 →  `optimization.splitChunks.cacheGroups.defaultVendors` 로 변경.
- `optimization.splitChunks.cacheGroups.defaultVendors.reuseExistingChunk` 기본값 `true`
- `optimization.minimizer` 타겟은 terser option에서 `compress.passes: 2` 를 기본 값으로 씁니다.

## 후기

운영중인 프로젝트에서 webpack5로 올려봤을 때 build콘솔에 여러가지 warning이 발생했다. Build와 Runtime에서 에러는 없었지만 약간의 찝찝함이 있다.(?)

[wepack-cli에서 대응중인 warning](https://github.com/webpack/webpack-cli/issues/1918)도 있는것 같고, 각종 plugin에서 아직 webpack5대응이 완벽하게 되어 있지 않은것 같다.

CRA를 사용하고 있지 않다면, 역시 Major Update에 대한 반영을 프로젝트에 완전히 가져갈 수 있는 시기는 조금 늦춰서 봐도 좋을것 같다.

2020.11.07 Update: webpack-cli에서 대응중이던 Warning은 [4.2.0 Release](https://github.com/webpack/webpack-cli/releases/tag/webpack-cli%404.2.0)에서 Fix되었습니다.

## Reference

- [https://blog.bitsrc.io/revolutionizing-micro-frontends-with-webpack-5-module-federation-and-bit-99ff81ceb0](https://blog.bitsrc.io/revolutionizing-micro-frontends-with-webpack-5-module-federation-and-bit-99ff81ceb0)
- [https://webpack.js.org/blog/2020-10-10-webpack-5-release](https://webpack.js.org/blog/2020-10-10-webpack-5-release)
- [https://medium.com/@sanchit3b/how-to-polyfill-node-core-modules-in-webpack-5-905c1f5504a0](https://medium.com/@sanchit3b/how-to-polyfill-node-core-modules-in-webpack-5-905c1f5504a0)
