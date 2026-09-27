---
title: '[SSR] 2. SSR - Basic'
date: 2019-11-25 00:05:07
category: react
thumbnail: './images/thumbnail.png'
---

![image-thumbnail](./images/thumbnail.png)

The full code for this tutorial is available [here](https://github.com/SoYoung210/react-ssr-code-splitting/pull/12).

Bugs I ran into while building this project are tracked [here](https://github.com/soYoung210/react-ssr-code-splitting/issues). Check the issues labeled `✈️ SSR`.

This post doesn't go into detail about the differences between CSR and SSR or their underlying fundamentals.

> If you'd like to learn more about that, check out the [references](https://so-so.dev/react/ssr-2-ssr---basic/#참고글) below.

## Before we start

We're going to render the red-boxed area below, the `header area of the /org page`, on the server side.

![ssr-area](./images/ssr-area.png)

The basic idea is that `express`, which we're already using, interprets our React code and draws the content, then delivers it to the client.

So what do we need in order for the server to be able to interpret React code?

- library: react, react-router-dom, etc.
- webpack loader(html, css, etc.)

There's more machinery involved, but conceptually these two things are the most important.

## Organizing the structure

First, since both the server and the client need common libraries, let's consolidate what used to be managed as two separate modules into one.

Move the contents of both the client's and server's package.json into the root package.json.

Then update the `scripts` section of this package.json.

```json
"scripts": {
    "start": "npm run build:server && npm run build:client && node ./static/server.bundle.js",
    "build:server": "webpack --config ./webpack.server.js",
    "build:client": "webpack --config ./webpack.client.js"
  },
```

The `start` command builds the server and client with their respective webpack configs, and then starts the node server.

Let's create a webpack file for each of the server and client.

### webpack.server.js

Let's build `/webpack.server.js` based on the contents of the `server/webpack.config.js` we created in the [first tutorial](https://so-so.dev/react/ssr-1-codesplitting/).

```js {2,9,22,35}
const pathResolve = require('path').resolve
const babelConfig = require('./babelrc.server')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  target: 'node',
  name: 'server',
  node: false,
  entry: pathResolve(__dirname, 'server/app.tsx'),
  output: {
    filename: 'server.bundle.js',
    path: pathResolve(__dirname, 'static'),
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js)?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: babelConfig,
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      '@': pathResolve('client/src'),
    },
    modules: ['node_modules'],
    extensions: ['.ts', '.tsx', '.js'],
  },
  externals: [nodeExternals()],
}
```

The highlighted parts are what changed compared to before. Since the location changed, the contents of entry changed, and we also split `babelrc` out so it can be used separately from the client.

### babelrc.server.js

Let's create `/babelrc.server.js`, which holds the settings needed for SSR.

```js {3}
module.exports = {
  presets: ['@babel/typescript', '@babel/react'],
  plugins: ['@loadable/babel-plugin'],
}
```

Since the server also needs to read React code, we need to add `@babel/react` to the presets.
We also need to read code-split content, so we add `@loadable/babel-plugin` as well.

### webpack.client.js

This is the part that changes the most compared to before.

```js {28,29,59}
const webpack = require('webpack')
const LoadablePlugin = require('@loadable/webpack-plugin')
const pathResolve = require('path').resolve
const nodeExternals = require('webpack-node-externals')
const IS_PRODUCTION = process.env.NODE_ENV === 'production'

const getMode = () => (IS_PRODUCTION ? 'production' : 'development')

const getOutputConfig = name => ({
  filename: '[name].bundle.js',
  chunkFilename: '[name].bundle.js',
  path: pathResolve(__dirname, `static/${name}`),
  publicPath: `/${name}/`,
  libraryTarget: name === 'web' ? 'var' : 'commonjs2',
})

const getResolveConfig = () => ({
  alias: {
    '@': pathResolve('client/src'),
  },
  modules: ['node_modules'],
  extensions: ['.ts', '.tsx', '.js', '.json', '.less'],
})

const clientRenderConfig = {
  entry: [hotMiddlewareScript, './client/src/index.tsx'],
  target: 'web',
  name: 'web',
  mode: getMode(),
  output: getOutputConfig('web'),
  module: {
    rules: moduleRules,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'initial',
        },
      },
    },
  },
  plugins: [
    new LoadablePlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].css',
    }),
  ],
  resolve: getResolveConfig(),
}

const nodeRenderConfig = {
  target: 'node',
  name: 'node',
  entry: [pathResolve('./client/src/routes/index.tsx')],
  output: getOutputConfig('node'),
  mode: getMode(),
  externals: ['@loadable/component', nodeExternals()],
  module: {
    rules: moduleRules,
  },
  plugins: [
    new LoadablePlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].css',
    }),
  ],
  resolve: getResolveConfig(),
}

module.exports = [clientRenderConfig, nodeRenderConfig]
```

We could remove more duplication, but for now I've written it out explicitly like this.
The most notable change is that the webpack config has switched to a multi-compiler approach.

A multi-compiler approach means providing a way to use different kinds of compilers depending on the situation.

We changed things so that a single task, rendering, now happens on both the client (browser) and the server.
Let's briefly go over each setting.

**target**: We're using 'web' and 'node'. As you can see in the [webpack official docs - target](https://webpack.js.org/configuration/target/), the default option is web, meaning it's mainly meant for use in the browser.
But since we need an option for rendering in a node environment, we've also specified this value as 'node'.

**name**: This option gives a name to the compiled file. It lets `@loadable` and the webpack-hot-middleware (WHM) we'll set up soon distinguish which format a given file is in, by separating web and node.

**getEntryPoint**: In SSR, the entry file also changes. As will be introduced shortly, the role of `client/src/index.tsx` gets taken over by `server/app.tsx`.

**output**: To separate the files needed for SSR from the files needed for CSR, we split the folder based on the injected `target`.
libraryTarget is set to `commonjs2` when `target: node`, because Node.js adopted the commonjs approach for its module system. For web, we set the default option, `var`.

**plugins**: Since SSR runs in a node environment, we add `webpack-node-externals`, but since we still need to read the code-split files, we also add `@loadable-component`.

## Updating server/app.ts to server/app.tsx

```tsx {8,10,13,17,20}
import React from 'react'
import { ChunkExtractor } from '@loadable/server'
// import other library

app.get('*', (req, res) => {
  const nodeStats = path.resolve(__dirname, './node/loadable-stats.json')
  const webStats = path.resolve(__dirname, './web/loadable-stats.json')
  const nodeExtractor = new ChunkExtractor({ statsFile: nodeStats })
  const { default: EntryRoute } = nodeExtractor.requireEntrypoint()
  const webExtractor = new ChunkExtractor({ statsFile: webStats })

  const tsx = webExtractor.collectChunks(
    <StaticRouter location={req.url}>
      <EntryRoute />
    </StaticRouter>
  )
  const html = renderToString(tsx)

  res.set('content-type', 'text/html')
  res.send(renderFullPage(webExtractor, html))
})
```

**ChunkExtractor**: This is an SSR-oriented API provided by [@loadable/server](https://www.smooth-code.com/open-source/loadable-components/docs/api-loadable-server/). It collects information about split components via `collectChunk`, and passes along information about the files to load via getLinkTag, getStyleTag, and getScriptTag.

**StaticRouter**: This is the router used on the server in place of BrowserRouter. It's responsible for passing the route information for the URL the user requested to the client-side files.

**renderToString**: This is the SSR-oriented library provided by [react-dom](https://reactjs.org/docs/react-dom-server.html#rendertostring). This method is very closely tied to `hydrate`, which we'll use on the client soon. We'll go into more detail on that below.

> 🍿 (spoiler): once the markup rendered on the server via renderToString is delivered to the client, the client doesn't re-render it — it just wires up event handlers.
> `hydrate`: to fill in. You can think of it as the work of filling in the server's output.

**renderFullPage**: This is a function we wrote ourselves to split the code. It defines what template the server should use to deliver the content.

```tsx
export const renderFullPage = (webExtractor, html) => `
    <!DOCTYPE html>
      <html lang="ko">
        <head>
          <meta name="viewport" content="width=device-width, user-scalable=no">
          <meta name="google" content="notranslate">
          <title>soso template server</title>
          ${webExtractor.getLinkTags()}
          ${webExtractor.getStyleTags()}
        </head>
        <body>
          <div id="root">${html}</div>
          ${webExtractor.getScriptTags()}
        </body>
      </html>
`
```

The hardest part is done. There's a lot of code I skipped over along the way. I'd recommend following along with the code in the [link](https://github.com/SoYoung210/react-ssr-code-splitting/pull/12) above.

## Updating client/src/index.tsx

Unlike before, the HTML that comes down now already has its content rendered on the server. Let's look at the As-is and To-be to see what that looks like.

### As-is (CSR)

```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <!-- meta tags -->
    <title>soso template</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
<script type="text/javascript" src="/vendors.bundle.js"></script>
<script type="text/javascript" src="/main.bundle.js"></script>
```

An empty div comes down, and rendering happens by parsing `bundle.js` and adding content underneath that div.

### To-be (SSR)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- meta tags -->
    <title>soso template server</title>
    <link
      data-chunk="main"
      rel="preload"
      as="script"
      href="/web/vendors.bundle.js"
    />
    <!-- more link tags -->
  </head>
  <body>
    <div id="root">
      <h1>Org: Facebook Page</h1>
      <div>Loading</div>
    </div>
    <script id="__LOADABLE_REQUIRED_CHUNKS__" type="application/json">
      ["org"]
    </script>
    <script async data-chunk="main" src="/web/vendors.bundle.js"></script>
    <!-- more script tags -->
  </body>
</html>
```

The div area that used to be empty is now **filled in.**
Part of the content comes down already filled in from the server.

But an area that's already been rendered doesn't need to be redrawn on the client, right?
**That's why we need hydrate.** Let's change the contents of `client/src/index.tsx`.

```tsx
import { loadableReady } from '@loadable/component'
import { hydrate } from 'react-dom'
import EntryRoute from './routes'

loadableReady(() => {
  const root = document.getElementById('root')
  hydrate(
    <BrowserRouter>
      <EntryRoute />
    </BrowserRouter>,
    root
  )
})
```

The old `ReactDOM.rendering` is gone, and `hydrate` has taken its place.

As mentioned earlier, **it plays the role of filling in an area that's already been rendered.** It inserts only the string needed for the first render into the html, and once the bundle js needed on the client arrives, it wires up events on the html tags.

### Check the result

The first application of SSR + Code Splitting is now complete.
Run `npm start` and visit the `/org` page, and you should see a result like this.
![image](./images/ssr-first.png)
This post doesn't include the full code needed for it to actually work, so follow along by checking the [PR](https://github.com/SoYoung210/react-ssr-code-splitting/pull/12) linked above!

In the next chapter, we'll go beyond rendering on the server and add data fetching to deliver the full content.

## References

#### [react-router/StaticRouter](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/StaticRouter.md)

#### [Rendering on the Web](https://shlrur.github.io/develog/2019/02/14/rendering-on-the-web/)

#### [Setting up a React + Typescript + SSR + Code-splitting environment](https://medium.com/@minoo/react-typescript-ssr-code-splitting-%ED%99%98%EA%B2%BD%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0-d8cec9567871)
