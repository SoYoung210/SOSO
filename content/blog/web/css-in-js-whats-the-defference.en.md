---
title: 'CSS-in-JS, What Makes It Different?'
date: 2021-07-31 16:00:09
category: web
thumbnail: './images/css-in-js/thumbnail2.png'
---

![image-thumbnail](./images/css-in-js/thumbnail2.png)

### Table of Contents

- [CSS in JS?](#css-in-js)
- [Critical CSS and CSS-in-JS](#critical-css와-css-in-js)
- [Performance](#performance)
- [Atomic CSS](#atomic-css)
- [Wrapping Up](#마무리)
- [References](#references)

## CSS in JS?

![what-is-css-in-js](./images/css-in-js/what-is-css-in-js.png)

<div align="right">
  <sup><a href="https://css-tricks.com/a-thorough-analysis-of-css-in-js" target="_blank">https://css-tricks.com/a-thorough-analysis-of-css-in-js</a></sup>
</div>

**CSS-in-JS** literally refers to the approach of writing CSS inside JavaScript code. It was introduced in a [talk by Facebook engineer Christopher Chedeau, aka Vjeux](http://blog.vjeux.com/2014/javascript/react-css-in-js-nationjs.html) in 2014, which presented Facebook's case study of solving the difficulties of traditional CSS management. As the concept evolved after this talk, many libraries emerged.

The most important differentiator between libraries is **'how dynamically styles can be written'** — whether JS variables can be used, and if so, what their scope is. Based on this characteristic, CSS-in-JS can be organized into 4 generations + a.

### 1st Generation

CSS wasn't usable from JS files from the very start. Files were created as `*.(module).css` and used in the form of a `css module` via a CSS pre-processor.

```jsx
import styles from './Button.module.css'

const Button = () => {
  return <button className={styles.submit}>Submit</button>;
}
```

The approach above statically analyzes the CSS and extracts it into a separate CSS file. Since there's no 'runtime behavior' — which will be explained later — it has the characteristics of **zero runtime css-in-js**.

### 2nd Generation

Libraries like [Radium](https://formidable.com/open-source/radium/), which let you write CSS using JS variables, emerged. It was a form where components could control their own styles, but because it used inline styles, **not all CSS specs could be used** — for example, pseudo selectors like `:before` and `:nth-child` weren't available.

```jsx
// Radium: https://formidable.com/open-source/radium
const styles = {
  base: {
    background: 'blue',
  },

  block: {
    display: 'block'
  }
};

// Inside render
return (
  <button
    style={[
      styles.base,
      this.props.block && styles.block
    ]}>
    {this.props.children}
  </button>
);
```

### 3rd Generation

To overcome the 'limited CSS syntax' constraint that came from choosing the inline-style approach in the 2nd generation, libraries like [aphrodite](https://github.com/Khan/aphrodite/blob/master/src/inject.js#L35-L39) and [glamor](https://github.com/threepointone/glamor) generate styles a different way. When CSS is written as a JavaScript template, it's injected during the build process by [generating a `<style>` tag](https://github.com/Khan/aphrodite/blob/225f43c5802259a9e042b384a1f4f2e5b48094ea/src/inject.js#L35-L39).

This started to support CSS specs that had been missing, such as pseudo elements and media queries, but **dynamically changing styles were tricky to define.**

### 4th Generation

The 4th generation solved the 3rd generation's limitation — 'dynamic styling controlled by JavaScript code' — by introducing the concept of runtime.

#### Runtime CSS-in-JS

```tsx
// https://github.com/styled-components/styled-components/blob/8165cbe994f6f749236244f6f7017c2f0b9afcfe/packages/styled-components/src/constructors/constructWithOptions.ts#L39-L44
/* Modify/inject new props at runtime */
templateFunction.attrs = <Props = OuterProps>(attrs: Attrs<Props>) =>
  constructWithOptions<Constructor, Props>(componentConstructor, tag, {
    ...options,
    attrs: Array.prototype.concat(options.attrs, attrs).filter(Boolean),
  });
```

The code above is part of [styled-components](https://styled-components.com/). Every time a `prop` changes, it **dynamically generates** styles, making dynamic styling via JavaScript code possible. In other words, instead of generating all styles at build time, it makes use of the runtime.

Generating styles at runtime usually isn't a problem, but because the style computation cost grows, a difference shows up in components with complex styles. (Reference: [necolas/react-native-web#benchmark](https://necolas.github.io/react-native-web/benchmarks/))

### Next Generation

Libraries advocating **zero-runtime** emerged to solve the runtime overhead caused by complex style computation. (Runtime was introduced because build time couldn't provide dynamic styling — and now zero runtime shows up again(!))

#### zero-runtime css-in-js

zero-runtime literally means there's no runtime behavior like the one described earlier. In other words, it doesn't generate styles dynamically.

[Linaria](https://linaria.dev/) is a CSS-in-JS library inspired by styled-components with a similar API, and it operates with zero-runtime. As explained in [linaria - how it works](https://github.com/callstack/linaria/blob/master/docs/HOW_IT_WORKS.md), it extracts the css code used via a babel plugin and webpack loader to generate a **static stylesheet**.

```tsx
import { styled } from '@linaria/react';
import { families, sizes } from './fonts';

const background = 'yellow';

const Title = styled.h1`
  font-family: ${families.serif};
`;

const Container = styled.div`
  font-size: ${sizes.medium}px;
  background-color: ${background};
  color: ${props => props.color};
  width: ${100 / 3}%;
  border: 1px solid red;

  &:hover {
    border-color: blue;
  }
`;
```

Build result:

```css
.Title_t1ugh8t9 {
  font-family: var(--t1ugh8t-0);
}

.Container_c1ugh8t9 {
  font-size: var(--c1ugh8t-0);
  background-color: yellow;
  color: var(--c1ugh8t-2);
  width: 33.333333333333336%;
  border: 1px solid red;
}

.Container_c1ugh8t9:hover {
  border-color: blue;
}
```

It makes possible the dynamic styling based on prop and state that wasn't possible with 1st-generation zero-runtime css-in-js.

The reason this is possible is that linaria internally uses [css variables](https://developer.mozilla.org/ko/docs/Web/CSS/var()) — instead of creating a new style sheet, it only modifies the css variable to apply different styles for different conditions.

(Unfortunately, 'that browser' doesn't support this.)

<video style="width:100%;" poster="/media/web/images/css-in-js/linaria-dynamic-style-poster.png" controls="true" allowfullscreen="true">
  <source src="/media/web/images/css-in-js/linaria-dynamic-style.mp4" type="video/mp4">
</video>


## Critical CSS and CSS-in-JS

For initial render optimization, **efficiently loading only the CSS needed for the current screen first** also needs to be considered. How does each library determine Critical CSS?

Let's look at how this problem is solved by styled-components and [emotion](https://emotion.sh/docs/introduction), representative runtime css-in-js libraries, and by linaria, a zero-runtime css-in-js library.

### styled-components

![styled-components-critical-css-result](./images/css-in-js/styled-components-critical-css-result.png)

When testing according to the [official Next.js example](https://github.com/vercel/next.js/tree/master/examples/with-styled-components), you can confirm that only the css used on the page is inserted into the head as a style tag. ([Demo project](https://stackblitz.com/edit/github-zmyryx?file=pages%2Fabout.js))

Through the [collectStyles](https://github.com/styled-components/styled-components/blob/30dab74acedfd26d227eebccdcd18c92a1b3bd9b/packages/styled-components/src/models/ServerStyleSheet.tsx#L37) API, only the styles currently being used on the page are generated into a separate stylesheet.

<video style="width:100%;" poster="/media/web/images/css-in-js/styled-components-dynamic-style-poster.png" controls="true" allowfullscreen="true">
  <source src="/media/web/images/css-in-js/styled-components-dynamic-style.mp4" type="video/mp4">
</video>

After the initial render, styles that change due to prop or state are dynamically inserted into the style tag. (The DOM tree only changes during a development mode build.)

### emotion

It provides [extractCritical](https://emotion.sh/docs/ssr#extractcritical).

```tsx
import { renderToString } from 'react-dom/server'
import { extractCritical } from '@emotion/server'
import App from './App'

const { html, ids, css } = extractCritical(renderToString(<App />))
```

Similar to styled-components, it extracts the critical css needed for the initial page render, and generates any subsequent dynamic styles at runtime.

### Linaria

linaria, which operates with zero-runtime, extracts critical css at build time using plugins like [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin).

If code splitting isn't used, or if the initial css chunk isn't the css needed for the initial load — in other words, if critical css can't be determined by mini-css-extract-plugin — you can use `collect`, provided by linaria.

```tsx
import { collect } from '@linaria/server';

const { critical, other }  = collect(html, css);
```

The `collect` API provided by the `linaria/server` module takes HTML and CSS strings respectively, and separates the CSS that's actually used in the HTML into `critical`, with the rest as `other`.

Since the extracted Critical CSS is used in the critical rendering path, it's injected at the top of the document, and the rest can be loaded asynchronously via a `<link>` tag without blocking rendering.

For stylesheet optimization in a Gatsby environment that doesn't use an SSR runtime, see Hyeseong Kim's ["How to Optimize Stylesheets in Jamstack"](https://blog.cometkim.kr/posts/css-optimization-in-jamstack/).

## Performance

As summarized above, the way css-in-js operates is broadly divided into runtime / zero-runtime.

Before summarizing the performance of each, note that **runtime doesn't necessarily cause performance degradation** — it can vary depending on the project's scale and situation, so I recommend always **measuring before optimizing**.

### runtime

Assume there's a component with complex styles like the one below.

```tsx
const ButtonView = styled('buton')(props => {
  switch (props.emphasis) {
    case 'underline'
      return underlineButtonStyle(props)
    case 'outline'
      return outlineButtonStyle(props)
    case 'ghost'
      return ghostButtonStyle(props)
    case 'token'
      return tokenButtonStyle(props)
    default
      return defaultButtonStyle(props)
  }
})
```

![emotion-benchmark-result](./images/css-in-js/emotion-benchmark-result.png)

<div align="right">
  <sup><a href="https://itnext.io/how-to-increase-css-in-js-performance-by-175x-f30ddeac6bce" target="_blank">https://itnext.io/how-to-increase-css-in-js-performance-by-175x-f30ddeac6bce</a></sup>
</div>

Analyzing the `emotion` code took 36 seconds.

![emotion-benchmark-result-1](./images/css-in-js/emotion-benchmark-result-1.png)

In emotion, when a Tooltip is rendered on Button hover, a re-render occurs, causing it to **re-parse the css.**

If a component modifies its styles at runtime, css needs to be parsed each time, and rendering is blocked for that duration. And since this time comes from emotion's own operation (runtime), it isn't easy to optimize.

#### How runtime CSS-in-JS injects styles

Effort was needed to minimize the time blocked by css parsing. The browser combines the DOM and CSSOM trees to form a render tree, calculates the layout, and then renders — so **by choosing to modify the CSSOM instead of the DOM tree**, the time spent parsing the DOM tree is reduced. (Reference: [render-tree construction, layout and paint](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-tree-construction))

Both emotion and styled-components choose to modify the CSSOM in production builds, but choose to modify the DOM in development mode. For an easy comparison, let's look at the difference with [stitches.js](https://stitches.dev/), which uses the CSSOM-modifying approach even in development mode.

![stitches-css-inject](./images/css-in-js/stitches-css-inject.png)

In the [demo project using styled-components and stitches.js](https://yrhkm.csb.app/), if you trace where the `.c-bvsTsv` style applied to `StitchesButton` is used, you can see it's represented as an empty tag.

Right below it, you can see the content of the style generated by styled-components directly, whereas the style applied by stitches can't be seen. As mentioned above, the two libraries differ in how they generate the stylesheet.

1. **DOM injection (styled-components):**  
  This approach adds a `<style>` tag to the DOM (somewhere in `<head>` or `<body>`) and adds the style node via [appendChild](https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild). It updates the stylesheet by adding [textContent](https://developer.mozilla.org/ko/docs/Web/API/Node/textContent) or [innerHTML](https://developer.mozilla.org/ko/docs/Web/API/Element/innerHTML).

2. **CSSStyleSheet API (stitches.js)**  
  It inserts directly into the CSSOM using [CSSStylesSheet.insertRule](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/insertRule).  
  With this approach, the `<style>` tag appears empty, and you can only see the result by selecting the rule directly in DevTools.  

  ![cssom-result](./images/css-in-js/cssom-result.png)

**Reference** : [andreipfeiffer/1-using-style-tags](https://github.com/andreipfeiffer/css-in-js/blob/main/README.md#1-using-style-tags)

### zero-runtime

To remove runtime overhead, you can consider zero-runtime css-in-js like linaria or [compiled](https://compiledcssinjs.com/). However, since pivoting the tech stack on an ongoing project can be difficult, you can also improve things by **partially introducing the zero-runtime concept only to the parts that cause a performance bottleneck**.

```tsx
const composedStyle = {
  '--btn-color': theme.derivedColors.button[color],
  ...(style ?? {})
}

const ButtonView = styled.button`
  &[data-color="primary"] {
    color: ${({theme }) => theme.derivedColors.text.primary};
  }

  &[data-emphasis="fill"] {
    background-color: var(--btn-color);
  }
`

<ButtonView
  type="button"
  style={composedStyle}
  data-color={color}
  data-emphasis={emphasis}
  {...props}
/>

```

The existing emotion code was changed to use CSS Variables.

![emotion-to-cssvar](./images/css-in-js/emotion-to-cssvar.png)

You can see that the css parsing time, which used to take 36 seconds, was reduced to around 200ms.

![linaria-sc-performance](./images/css-in-js/linaria-sc-performance.png)

As you can also confirm in the [performance comparison between styled-components and linaria](https://pustelto.com/blog/css-vs-css-in-js-perf/), linaria clearly leads on several metrics, but since the tool's limitations are also clear, choosing it at the production level requires a decision that weighs the trade-offs.

### +) near-zero runtime(stitches.js)

Besides runtime and zero-runtime, libraries advocating near-zero runtime have emerged. Let me introduce [stitches.js](https://stitches.dev/), one of them.

stitches.js is a css-in-js library with an API similar to styled-components, but it advocates **near-zero runtime**. As the word implies, it doesn't have zero runtime at all, but it provides an API designed to minimize interpolation driven by component props.

For example, styled-components allows fully dynamic styling via props, whereas stitches only allows styling via predefined [variants](https://stitches.dev/docs/variants).

```jsx
/* 💅  styled-components */
const Input = styled.input`
  margin: ${props => props.size};
  padding: ${props => props.size};
`;
() => <Input size="100px" />

/* 🤓 stitches */
const Button = styled('button', {

  variants: {
    color: {
      violet: {
        backgroundColor: 'blueviolet',
      },
      gray: {
        backgroundColor: 'gainsboro',
      },
    },
  },
});
// color="#9542f5" not possible
() => <Button color="violet">Button</Button>;
```

This could be seen as a downside, but personally I think it's a reasonable compromise for addressing runtime overhead and the constraints of zero-runtime. Being able to pass a fully dynamic value to a component is, in the same vein, a situation that can't be predefined — which means it becomes an area that can't be optimized in advance.

#### Critical CSS

stitches.js also provides [getCssString](https://stitches.dev/docs/api#getcssstring), which plays a similar role to emotion's extractCritical. It generates the style sheet by [analyzing the root's styleSheet](https://github.com/modulz/stitches/blob/ce8e61e25fb26492e53c39d8bd396e899a32fdbe/packages/core/src/sheet.js#L32-L35).

This post doesn't cover every feature of stitches.js, so if you'd like to know more, I recommend checking the [official docs](https://stitches.dev/) and [this article](https://www.javascript.christmas/2020/15).

## Atomic CSS

Both runtime and zero-runtime css-in-js are options with trade-offs. Since css-in-js isn't necessarily the right answer, other approaches to css optimization can also be considered. As one example, [Facebook reduced its style sheet size by 80% by adopting Atomic CSS](https://engineering.fb.com/2020/05/08/web/facebook-redesign/).

```tsx
const styles = stylex.create({
  emphasis: {
    fontWeight: 'bold',
  },
  text: {
    fontSize: '16px',
    fontWeight: 'normal',
  },
});

function MyComponent(props) {
  return <span className={styles('text', props.isEmphasized && 'emphasis')} />;
}
```

Build result:

```css
.c0 { font-weight: bold; }
.c1 { font-weight: normal; }
.c2 { font-size: 0.9rem; }
```

```jsx
function MyComponent(props) {
  return <span className={(props.isEmphasized ? 'c0 ' : 'c1 ') + 'c2 '} />;
}
```

### tailwindcss

A representative atomic css is [tailwindcss](https://tailwindcss.com/). It's an approach of styling by combining predefined `className`s, and the basic usage is as follows.

```jsx
<p class="text-lg text-black font-semibold">
  large text, black, semibold style
</p>
```

Among the many utility classes tailwindcss provides, unused styles shouldn't be included in the build output. Through the `purge` setting described in the [tailwindcss - optimization for production](https://tailwindcss.com/docs/optimizing-for-production) docs, unused styles can be excluded from the output, but it can't determine Critical CSS.

### tailwind + twin.macro

[twin.macro](https://github.com/ben-rogerson/twin.macro) is a tool that passes styles written in tailwind css over to css-in-js. Since it acts as an intermediary, it's used together with styled-components, emotion, and so on.

```jsx
import "twin.macro"

<div tw="text-center md:text-left" />

// ↓↓↓↓↓ turns into ↓↓↓↓↓

import "styled-components/macro"

<div
  css={{
    textAlign: "center",
    "@media (min-width: 768px)": {
      "textAlign":"left"
    }
  }}
/>
```

Because the styles are dynamically generated at runtime, only the needed styles are loaded initially, but the runtime overhead mentioned above still applies.

- Using atomic css as-is: the size of the CSS loaded initially is large, but no runtime overhead occurs afterward.
- Using it in the twin.macro form: the size of the CSS loaded initially is small, but runtime overhead occurs afterward

Since each approach has clear pros and cons, which one to choose should be decided after measuring.

### stitches.js

stitches.js, introduced above, also optimizes repeated styles by converting them into atomic classes so the same class can be reused.

```tsx
const StitchesDiv = styled("div", {
  // shared styles
  border: "none",
  borderRadius: "9999px",
  padding: "10px 15px",
  fontSize: "13px",
});

const StitchesButton = styled("button", {
  // shared styles
  border: "none",
  borderRadius: "9999px",
  fontSize: "13px",
  padding: "10px 15px",

  // custom styles
  "&:hover": {
    backgroundColor: "lightgray"
  },
  variants: {
    color: {
      violet: {
        backgroundColor: "blueviolet",
      },
      gray: {
        backgroundColor: "gainsboro",
      }
    }
  }
});
```

The styles corresponding to the 'shared area' between `StitchesDiv` and `StitchesButton` are extracted into a separate class and reused.

![stitches-atomic-class](./images/css-in-js/stitches-atomic-class.png)

However, even with the same style, if the internal order changes, the same class won't be reused, so you need to apply style-lint or define things using [stitches - util](https://stitches.dev/docs/utils).

## Wrapping Up

As the CSS ecosystem evolved, new tools that improved on the shortcomings of existing ones emerged, and many tools with entirely new concepts appeared as well.

It would be nice to be able to conclude which tool is the 'silver bullet' that's always the right answer in every situation, but so far my conclusion is that there isn't one. Each tool has its own chosen trade-offs, and it's necessary to set up an appropriate CSS strategy that takes into account the characteristics of the service being built.

If the service you're building only deals with components that don't need rendering optimization, runtime overhead may be at a negligible level, and you might even run into a situation where you have to solve problems separately precisely because runtime doesn't exist. For that reason, things can't simply be divided into 'good' or 'bad' — just as every improvement should be made after measuring, you'll need to choose the right CSS approach by taking the service's characteristics and plans into account.

## References

- [https://necolas.github.io/react-native-web/benchmarks/](https://necolas.github.io/react-native-web/benchmarks/)

- [https://blog.cometkim.kr/posts/css-optimization-in-jamstack/](https://blog.cometkim.kr/posts/css-optimization-in-jamstack/)

- [https://community.frontity.org/t/better-css-in-js-performance-with-zero-runtime/3586/9](https://community.frontity.org/t/better-css-in-js-performance-with-zero-runtime/3586/9)

- [https://pustelto.com/blog/css-vs-css-in-js-perf/](https://pustelto.com/blog/css-vs-css-in-js-perf/)

- [https://itnext.io/how-to-increase-css-in-js-performance-by-175x-f30ddeac6bce](https://itnext.io/how-to-increase-css-in-js-performance-by-175x-f30ddeac6bce)

- [https://css-tricks.com/why-i-love-tailwind/](https://css-tricks.com/why-i-love-tailwind/)

- [https://www.javascript.christmas/2020/15](https://www.javascript.christmas/2020/15)
