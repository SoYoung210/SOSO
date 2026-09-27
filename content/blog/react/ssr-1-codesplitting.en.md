---
title: '[SSR] 1. CodeSplitting'
date: 2019-11-17 18:00:46
category: react
thumbnail: './images/thumbnail.png'
---

![image-thumbnail](./images/thumbnail.png)
> ⚠️ This post continues from the [master branch](https://github.com/soYoung210/react-ssr-code-splitting). I won't be explaining what's in the master branch separately. If you have any questions, feel free to leave a comment!

React [supports](https://reactjs.org/docs/code-splitting.html) code splitting out of the box.

![image](./images/react-lazy.png)
 **But** since the built-in lazy apparently doesn't support SSR, let's boldly give up on it and look for another tool.

## 📝 Choosing a library

There are a few libraries out there for SSR that we could choose from.

### 1. [react-loadable](https://github.com/jamiebuilds/react-loadable)

This used to be a widely used library. If you search for SSR-related articles, you'll find more of them built around react-loadable than around the library I'll introduce as #2.  
But, maybe because of [this issue](https://velog.io/@velopert/nomore-react-loadable), it has since disappeared from React's official docs, and the repo isn't accepting issues and isn't being actively maintained either.
![issue](./images/react-loadable-issue.png)

### 2. [@loadable/components](https://github.com/smooth-code/loadable-components)

This is the library that ended up taking react-loadable's place once it dropped out of React's official docs.
Its [official documentation](https://www.smooth-code.com/open-source/loadable-components/docs/getting-started/) is really well put together.
> This is the library used in this tutorial.

### 3. [react-universal component](https://github.com/faceyspacey/react-universal-component)

This is another library that's widely used for React SSR. It supports a wide range of features, but I didn't choose it for this tutorial.

## 🕸 Setting up the template html

In a real project, you might use a template html engine like pug or ejs instead of plain html. In that case, how should you apply Code Splitting?

Doing Code Splitting means the bundle gets split up — so how do you actually write down which bundle.js a given page needs?  

### HtmlWebpackPlugin
[HtmlWebpackPlugin](https://webpack.js.org/plugins/html-webpack-plugin/) is a plugin that automatically generates an html file containing your bundled js files. Depending on the configuration, it can generate a brand-new html file, or use an existing html file as a template and generate a new one with content added on top of it.
This project uses `server/views/index.pug` as the base template.
```js {3,6}
// 🌏 webpack.config.js
new HtmlWebpackPlugin({
  template: pathResolve(__dirname,'../server/views/index.pug'),
  filename: './index.pug'
}),
new HtmlWebpackPugPlugin()
```
There are lots of options, but for now I've only specified which template to use and what name the output file should get.

I also added [html-webpack-pug-plugin](https://www.npmjs.com/package/html-webpack-pug-plugin), which automatically converts things into `pug` syntax.

![bundle](./images/bundle-result.png)
As part of the client build output, `index.pug` gets generated inside the static folder. When a request comes in for a split route, the matching bundle gets added into the pug file as a script tag.

### ♻️ Config setup


First, let's install the dependencies the project needs, and set up the webpack and babel configuration first.

#### 1. Let's install `@loadable/component`. 
```bash
npm i @loadable/component

// if typescript,
npm i -D @types/loadable__component
```

#### 2. Setting up the dynamic import loader
To use dynamic import syntax, which isn't standard yet, let's install [@babel/plugin-syntax-dynamic-import](https://www.npmjs.com/package/@babel/plugin-syntax-dynamic-import) and update `.babelrc` as well.
```bash
npm install --save-dev @babel/plugin-syntax-dynamic-import
```
```js {6}
{
  "presets": [
    //🍱 presets
  ],
  "plugins": [
    "@babel/plugin-syntax-dynamic-import",
    //🥟 other plugins
  ]
}
```

#### 3. Setting up chunk names
It'd be nice if the bundle JS chunks produced by Code Splitting had names that are easy for us to recognize, so let's add a bit more to the webpack config.
```js {7}
// 🌏 webpack.config.js
module.exports = (env, options) => {
  const config = {
    entry: [startFileName],
    output: {
      filename: '[name].bundle.js',
      chunkFilename: '[name].bundle.js',
      //other settings
    },
	}
}
```

### View 
Now that the basic setup is done, let's actually go through Code Splitting.

#### 1. Change the component that will be split by CodeSplitting to `export default`. 
```tsx
// As-is
export const OrgComponent = () => {
	// ..
}

// To-be
export default () => {
 // ..
}
```

#### 2. Change how the component is imported to `loadable`. 
```tsx
// As-is
import { OrgComponent } from './Org';

// To-be
const OrgComponent = loadable(() => import(/* webpackChunkName: "org"*/ './Org'))
```

The code splitting work is done. You can check the result through `bundle Analyzer` and the chrome inspector.
![analyze](./images/analyze.png)

Looking at the bundle Analyzer, you can see that `org.bundle.js` has been generated on the right side.

 
![bundle-web](./images/org-network.png)
If you visit the `/org` page that has code splitting applied, you can see that it's set up to request `org.bundle.js`.

### 🤔 A few thoughts
Is Code Splitting always a good thing? Actually, it might not be.
What does the client's total bundle size look like in this project?
![bundle-terminal](./images/bundle-result.png)
Given that this is a localhost environment, it doesn't look all that big.

I went with the approach above to do Route Based Code Splitting. Here's what happens in the browser when each page is requested:
![org_to_user_split](./images/org_to_user_split.gif)
You can see that moving from route `/org` to `/user` triggers an additional request for `user.bundle.js`. Naturally, that's because the code has been split, and as a result, visiting the user page requests exactly the bundle js it needs.
![org_to_user_no_split](./images/org_to_user_no_split.gif)
On the other hand, without splitting applied, you can see that changing routes doesn't load any additional js.
> The flicker is caused by JS parsing. 


If you overlook this and just split everything with Code Splitting for its own sake, it can actually make the UX worse. The initial page load might get faster, but every subsequent route change now has to load additional js. 

If you split an extremely small component, the cost of the network request (DNS resolve, SSL handshake, download time, etc.) can outweigh whatever benefit Code Splitting was supposed to bring. 

As an extreme case, let's compare loading a page that contains nothing but the text `Hello I'm TEST`, with and without Code Splitting applied.

#### With Code Splitting applied
![test1](./images/test1.gif)
Measured under Slow 3G. Since the bundle needed to render `/Test` wasn't fetched on the first page load, it had to additionally request `test.bundle.js`, and you can see that this takes a very long time.

#### Without Code Splitting applied
![test2](./images/test2.gif)
Even with Slow 3G applied, you can see the `/Test` page render quickly. Since the bundle needed to render the Test page was already fetched during the first page load, the page can be shown without any additional network request. 

#### Wrap-up
There's no silver bullet. Deciding what to split requires looking at a bundle analyzer like WebpackBundleAnalyzer and splitting things "appropriately."

You can check out the full code for this tutorial [here](https://github.com/SoYoung210/react-ssr-code-splitting/pull/1).

## References 
[The story of react-loadable — which I found pretty interesting(?) — disappearing from the React manual](https://velog.io/@velopert/nomore-react-loadable)
https://itnext.io/tips-tricks-for-smaller-bundles-in-react-apps-58d1b20c9c0
