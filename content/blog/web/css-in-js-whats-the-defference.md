---
title: 'CSS-in-JS, 무엇이 다른가요?'
date: 2021-07-31 16:00:09
category: web
thumbnail: './images/css-in-js/thumbnail2.png'
---

![image-thumbnail](./images/css-in-js/thumbnail2.png)

### Table of Contents

- [CSS in JS?](#css-in-js)
- [Critical CSS와 CSS-in-JS](#critical-css와-css-in-js)
- [Performance](#performance)
- [Atomic CSS](#atomic-css)
- [마무리](#마무리)
- [References](#references)

## CSS in JS?

![what-is-css-in-js](./images/css-in-js/what-is-css-in-js.png)

<div align="right">
  <sup><a href="https://css-tricks.com/a-thorough-analysis-of-css-in-js" target="_blank">https://css-tricks.com/a-thorough-analysis-of-css-in-js</a></sup>
</div>

**CSS-in-JS**는 단어 그대로 JavaScript코드에서 CSS를 작성하는 방식을 말합니다. 2014년 Facebook 개발자인 [Christopher Chedeau aka Vjeux 의 발표](http://blog.vjeux.com/2014/javascript/react-css-in-js-nationjs.html)에서 소개되었으며, 기존 CSS관리의 어려움을 해결한 Facebook의 사례를 소개하고 있고 이 발표 이후 개념이 발전하면서 많은 라이브러리가 등장했습니다.

라이브러리 간에 가장 중요한 차별화 요소는 **'스타일을 얼마나 동적으로  작성할 수 있는가'** - JS변수를 사용할 수 있는지, 사용할 수 있다면 그 범위는 어디인지 - 입니다. 이 특징을 중심으로 CSS-in-JS를 4세대 + a로 정리할 수 있습니다.

### 1st Generation

처음부터 CSS를 JS파일에서 사용할 수 있었던 것은 아닙니다. `*.(module).css` 으로 파일을 생성하고 CSS pre-processor를 사용하여 `css module` 형태로 사용하였습니다.

```jsx
import styles from './Button.module.css'

const Button = () => {
  return <button className={styles.submit}>제출</button>;
}
```

위와 같은 방식은 CSS를 정적으로 분석하여 별도의 CSS파일로 추출하는 방식입니다. 이후에 설명할 'runtime에서의 동작'이 없기 때문에 **zero runtime css-in-js** 의 특징을 갖습니다.

### 2nd Generation

JS변수를 활용하여 CSS를 작성할 수 있는 [Radium](https://formidable.com/open-source/radium/)과 같은 라이브러리가 등장합니다. 컴포넌트에서 스타일을 제어할 수 있는 형태였지만, inline style을 사용하므로 `:before` , `:nth-child` 등의 pseudo selector를 사용할 수 없는 등 **CSS의 모든 spec을 사용할 수 없습니다.**

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

2세대에서 inline-style방식을 선택하며 마주한 '사용할 수 있는 css syntax 제한'에 대한 한계를 극복하기 위해 [aphrodite](https://github.com/Khan/aphrodite/blob/master/src/inject.js#L35-L39), [glamor](https://github.com/threepointone/glamor)등의 라이브러리에서는 다른 방식으로 스타일을 생성합니다. JavaScript 템플릿으로 CSS를 작성하면 빌드 과정에서 [`<style>` 태그를 생성하여](https://github.com/Khan/aphrodite/blob/225f43c5802259a9e042b384a1f4f2e5b48094ea/src/inject.js#L35-L39) 주입합니다.

pseudo element, media query 등 부족했던 CSS Spec을 지원하기 시작했으나, **동적으로 변경되는 스타일은 정의하기 까다로웠습니다.**

### 4th Generation

4세대에서는 3세대의 한계인 'JavaScript 코드로 제어하는 동적인 스타일링'을 runtime 개념을 도입하여 해결했습니다.

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

위 코드는 [styled-components](https://styled-components.com/)의 일부 코드입니다. `prop`가 변할 때마다 스타일을 **동적으로 생성**하여 JavaScript 코드로 동적인 스타일링이 가능합니다. 즉, build time에서 모든 스타일을 생성하는 것이 아닌, runtime을 활용한 것입니다.

runtime에 스타일을 생성하는 방식은 대부분 문제가 없지만, 스타일 계산 비용이 커지기 때문에 스타일이 복잡한 컴포넌트에서는 차이가 발생합니다. (참고: [necolas/react-native-web#benchmark](https://necolas.github.io/react-native-web/benchmarks/))

### Next Generation

복잡한 스타일 계산에서 발생하는 Runtime overhead를 해결하기 위해 **zero-runtime**을 주장하는 라이브러리들이 등장합니다. (빌드 타임에서 동적인 스타일링을 줄 수 없는 한계로 런타임(runtime)을 도입했는데, 다시 zero runtime이 등장합니다(!))

#### zero-runtime css-in-js

zero-runtime이란 말 그대로 앞서 설명한 runtime에서의 동작이 없다는 것을 뜻합니다. 즉 동적으로 스타일을 생성하지 않습니다.

[Linaria](https://linaria.dev/)는 styled-components에서 영감을 받아 유사한 API를 가진 CSS-in-JS라이브러이고, zero-runtime으로 동작합니다. [linaria - how it works](https://github.com/callstack/linaria/blob/master/docs/HOW_IT_WORKS.md)에서 설명하는대로 babel plugin과 webpack loader를 통해 사용된 css코드를 추출해 **정적인 스타일시트**를 생성합니다.

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

빌드 결과:

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

1세대 zero-runtime css-in-js에서는 할 수 없었던 prop, state에 따른 동적인 스타일링이 가능합니다.

이것이 가능한 이유는, linaria가 내부적으로 [css variable](https://developer.mozilla.org/ko/docs/Web/CSS/var())을 사용하고 있기 때문인데, 스타일 시트(Style Sheet)를 새로 만들지 않고 css variable만 수정하여 달라지는 조건에 대해 스타일을 다르게 줄 수 있는 것입니다.

(아쉽게도 '그 브라우저'는 지원하지 않네요.)

<video style="width:100%;" poster="/media/web/images/css-in-js/linaria-dynamic-style-poster.png" controls="true" allowfullscreen="true">
  <source src="/media/web/images/css-in-js/linaria-dynamic-style.mp4" type="video/mp4">
</video>


## Critical CSS와 CSS-in-JS

초기 렌더링 최적화를 위해 **현재 화면에서 필요한 CSS만 효율적으로 먼저 로딩하는 방법**도 고려되어야 합니다. 각 라이브러리에서는 어떻게 Critical CSS를 판단하고 있을까요?

대표적인 runtime css-in-js인 styled-components와 [emotion](https://emotion.sh/docs/introduction), zero-runtime css-in-js인 linaria에서 이 문제를 어떻게 해결하고 있는지 정리해봅니다.

### styled-components

![styled-components-critical-css-result](./images/css-in-js/styled-components-critical-css-result.png)

[Next.js 공식 예제](https://github.com/vercel/next.js/tree/master/examples/with-styled-components)에 따라 테스트할 경우, 페이지에서 사용하는 css만 head에 style tag로 삽입된 것을 확인할 수 있습니다. ([Demo 프로젝트](https://stackblitz.com/edit/github-zmyryx?file=pages%2Fabout.js))

[collectStyles](https://github.com/styled-components/styled-components/blob/30dab74acedfd26d227eebccdcd18c92a1b3bd9b/packages/styled-components/src/models/ServerStyleSheet.tsx#L37) api를 통해 현재 페이지에서 사용되고 있는 스타일만 별도의 스타일 시트로 생성합니다.

<video style="width:100%;" poster="/media/web/images/css-in-js/styled-components-dynamic-style-poster.png" controls="true" allowfullscreen="true">
  <source src="/media/web/images/css-in-js/styled-components-dynamic-style.mp4" type="video/mp4">
</video>

최초 렌더링 이후 prop이나 state에 의해 변경되는 스타일은 style tag에 동적으로 삽입됩니다. (development mode빌드일 때만 DOM Tree변경)

### emotion

[extractCritical](https://emotion.sh/docs/ssr#extractcritical) 을 제공합니다.

```tsx
import { renderToString } from 'react-dom/server'
import { extractCritical } from '@emotion/server'
import App from './App'

const { html, ids, css } = extractCritical(renderToString(<App />))
```

styled-components와 비슷한 방식으로, 초기 페이지 렌더링에 필요한  critical css를 추출하고 이후 동적인 스타일은 runtime에 생성되는 방식입니다.

### Linaria

zero-runtime으로 동작하는 linaria는 빌드 시 [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)과 같은 플러그인을 사용하여 critical css를 추출합니다.

code splitting을 사용하지 않거나 initial css chunk가 초기로드에 필요한 css가 아닐경우 즉, mini-css-extract-plugin에 의해 critical css를 판단할 수 없는 경우 linaria에서 제공하는 collect를 사용할 수 있습니다.

```tsx
import { collect } from '@linaria/server';

const { critical, other }  = collect(html, css);
```

`linaria/server` 모듈에서 제공하는 `collect` API는 HTML과 CSS 문자열을 각각 받아 CSS 중 실제로 HTML에서 사용된 것을 `critical`, 나머지를 `other`로 구분합니다.

추출된 Critical CSS는 주요 렌더링 경로에서 사용하므로 문서 상단에 주입하고, 나머지는 `<link>` 태그로 로드하여 렌더링을 막지 않고 비동기로 로드할 수 있습니다.

SSR 런타임을 사용하지 않는 Gatsby환경에서의 스타일 시트 최적화는 김혜성 님의 ["Jamstack에서 스타일시트를 최적화하는 법"](https://blog.cometkim.kr/posts/css-optimization-in-jamstack/)을 참고하세요.

## Performance

위에서 정리한 대로, css-in-js의 동작 방식은 크게 runtime / zero-runtime으로 나누어집니다.

각각의 Performance에 대해 정리하기에 앞서, **runtime이 반드시 성능 저하를 초래하는 것은 아니며** 프로젝트 규모와 상황에 따라 달라질 수 있기 때문에 반드시 **측정 후 개선**하는 것을 추천합니다.

### runtime

아래와 같이 복잡한 스타일을 가진 컴포넌트가 있다고 가정합니다.

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

`emotion` 코드 분석에 36초가 소요됐습니다.

![emotion-benchmark-result-1](./images/css-in-js/emotion-benchmark-result-1.png)

emotion은 Button hover 시 Tooltip을 렌더링하는 상황에서 리렌더링이 발생하여 **css를 다시 parsing합니다.**

컴포넌트에서 runtime에 스타일을 수정한다면 그때마다 css를 parsing하는 시간이 필요하고, 이 시간만큼 렌더링이 blocking 됩니다. 그리고 이 시간은 emotion의 동작(runtime)이기 때문에 최적화하기 쉽지 않습니다.

#### runtime css-in-js의 style inject방식

css parsing으로 인해 blocking되는 시간을 최대한 줄이는 노력이 필요했습니다. 브라우저는 DOM및 CSSOM트리를 결합하여 렌더링 트리를 형성하고 레이아웃을 계산한 뒤 렌더링하게 되는데, **DOM트리는 수정하지 않고 CSSOM을 수정하는 방식을 선택하여** DOM트리 parsing에 드는 시간을 줄입니다. (참고: [render-tree construction, layout and paint](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-tree-construction))

emotion, styled-components 모두 production build에서는 CSSOM수정 방식을 선택했지만 development mode에서는 DOM수정 방식을 선택하고 있습니다. 편한 비교를 위해 development mode에서도 CSSOM수정 방식을 사용하는 [stitches.js](https://stitches.dev/)와 차이를 살펴봅니다.

![stitches-css-inject](./images/css-in-js/stitches-css-inject.png)

[styled-components, stitches.js를 사용한 데모 프로젝트](https://yrhkm.csb.app/)에서 `StitchesButton` 에 적용된 `.c-bvsTsv` 스타일이 적용된 곳을 따라가면 빈 tag로 표현되는 것을 볼 수 있습니다.

바로 밑에 styled-components에 의해 생성된 style의 내용은 바로 볼 수 있는 반면, stitches에 적용된 스타일만 볼 수 없습니다. 위에서 언급했듯, 두 라이브러리는 스타일 시트를 생성하는 방식에 차이가 있습니다.

1. **DOM injection (styled-components:)**  
  이 방식은 DOM(`<head>`또는 `<body>`어딘가)에 `<style>`tag를 추가하고  [appendChild](https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild) 를 style node를 추가하는 방식입니다. [textContent](https://developer.mozilla.org/ko/docs/Web/API/Node/textContent) , [innerHTML](https://developer.mozilla.org/ko/docs/Web/API/Element/innerHTML) 을 추가하여 스타일 시트를 업데이트합니다.

2. **CSSStyleSheet API (stitches.js)**  
  [CSSStylesSheet.insertRule](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/insertRule) 을 사용하여 CSSOM에 직접 삽입합니다.  
  이 접근 방식을 사용하면 `<style>`태그에서는 빈 내용이 보이게 되고, DevTools에서 직접 선택하여 rule을 확인해야만 결과를 볼 수 있습니다.  

  ![cssom-result](./images/css-in-js/cssom-result.png)

**Reference** : [andreipfeiffer/1-using-style-tags](https://github.com/andreipfeiffer/css-in-js/blob/main/README.md#1-using-style-tags)

### zero-runtime

runtime overhead를 제거하기 위해 linaria나 [compiled](https://compiledcssinjs.com/) 등의 zero-runtime css-in-js를 고려할 수 있습니다. 하지만, 진행중인 프로젝트에서 기술스택을 pivot하기는 어려울 수 있으니 성능상 **병목을 일으키는 부분에 부분적으로 zero-runtime개념을 도입하여** 개선할 수도 있습니다.

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

기존 emotion코드를 CSS Variable을 사용하도록 변경했습니다.

![emotion-to-cssvar](./images/css-in-js/emotion-to-cssvar.png)

기존 36초 소요되는 css parsing시간이 200ms 정도로 단축된 것을 확인할  수 있습니다.

![linaria-sc-performance](./images/css-in-js/linaria-sc-performance.png)

[styled-components와 linaria의 퍼포먼스 비교](https://pustelto.com/blog/css-vs-css-in-js-perf/)에서도 확인할 수 있듯, 분명하게 linaria가 여러 가지 지표에서 앞서지만, 도구의 한계가 명확하기 때문에 이를 Production level에서 선택할지에 대해서는 trade-off를 고려한 선택이 필요합니다.

### +) near-zero runtime(stitches.js)

runtime과 zero-runtime외에 near-zero runtime을 표방하는 라이브러리들이 등장합니다. 그중 하나인 [stitches.js](https://stitches.dev/)에 대해 소개합니다.

stitches.js는 styled-components와 유사한 api를 가진 css-in-js라이브러리이지만 **near-zero runtime**을 표방하고 있습니다. 단어 그대로 runtime을 아예 가지지 않는 것은 아니지만, component prop에 의한 interpolation을 최소화하는 방향의 API를 제공합니다.

예를 들어, styled-components에서는 prop에 의한 완전한 동적 스타일링이 가능하지만, stitches는 사전에 정의한 [variants](https://stitches.dev/docs/variants)에 의한 스타일링만 가능합니다.

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
// color="#9542f5" 불가능
() => <Button color="violet">Button</Button>;
```

이를 단점으로 볼 수도 있지만, 개인적으로 runtime overhead와 zero-runtime의 제약을 해결하기 위한 적절한 타협점으로 생각됐습니다. 컴포넌트에 완전히 동적인 값을 넘길 수 있다는 것은 곧 미리 정의할 수 없는 상황이라는 것과 같은 맥락이므로 사전에 최적화할 수 없는 영역이 되기 때문입니다.

#### Critical CSS

stitches.js도 emotion의 extractCritical과 유사한 역할을 하는 [getCssString](https://stitches.dev/docs/api#getcssstring)을 제공합니다. [root의 styleSheet를 분석하여](https://github.com/modulz/stitches/blob/ce8e61e25fb26492e53c39d8bd396e899a32fdbe/packages/core/src/sheet.js#L32-L35) style sheet를 생성합니다.

이 글에서는 stitches.js의 모든 특징에 대해 다루지 않으니, 더 알고 싶으신 분은 [공식문서](https://stitches.dev/)와 [이 글](https://www.javascript.christmas/2020/15)을 참고하시는 것을 추천합니다.

## Atomic CSS

runtime, zero-runtime css-in-js모두 trade-off가 있는 선택지입니다. css-in-js가 반드시 정답은 아니므로, css최적화를 위해 다른 방법도 생각해볼 수 있습니다. 그중 한 사례로, [Facebook에서는 Atomic CSS 도입으로 style sheet사이즈를 80% 줄인 사례](https://engineering.fb.com/2020/05/08/web/facebook-redesign/)가 있습니다.

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

빌드 결과:

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

대표적인 atomic css로는 [tailwindcss](https://tailwindcss.com/)가 있습니다. 미리 정의된 `className`을 조합하여 스타일링 하는 방식으로, 기본적인 사용법은 다음과 같습니다.

```jsx
<p class="text-lg text-black font-semibold">
  large text, black, semibold style
</p>
```

tailwindcss에서 제공하는 많은 utility class중 사용하지 않는 스타일은 빌드 결과에 포함되지 않아야 합니다. [tailwindcss - optimization for production](https://tailwindcss.com/docs/optimizing-for-production) 문서에서 설명하는 `purge` 설정을 통해 사용하지 않는 스타일은 결과물에서 제외할 수 있지만, Critical CSS에 대해 판단을 할 수 없습니다.

### tailwind + twin.macro

[twin.macro](https://github.com/ben-rogerson/twin.macro)는 tailwind css로 작성한 스타일을 css-in-js로 전달해주는 도구입니다. 중간 매개체 역할이므로, styled-components, emotion 등과 함께 사용하는 형태입니다.

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

runtime에 스타일이 동적으로 생성되기 때문에 최초에는 필요한 스타일만 로드하게 되지만, 위에서 언급했던 runtime overhead는 동일합니다.

- atomic css를 그대로 사용: 최초에 로드하는 CSS의 크기는 크지만, 이후 runtime overhead가 발생하지 않는다.
- twin.macro형태로 사용: 최초에 로드하는 CSS크기는 작지만, 이후 runtime overhead발생

각 방식은 명확한 장단점을 가지고 있기 때문에, 어떤 방식을 선택할지는 측정 후 결정해야 합니다.

### stitches.js

위에서 소개했던 stitches.js역시 반복되는 스타일에 대해 atomics class로 변환하여 같은 class를 사용할 수 있도록 최적화해줍니다.

```tsx
const StitchesDiv = styled("div", {
  // 공통영역
  border: "none",
  borderRadius: "9999px",
  padding: "10px 15px",
  fontSize: "13px",
});

const StitchesButton = styled("button", {
  // 공통영역
  border: "none",
  borderRadius: "9999px",
  fontSize: "13px",
  padding: "10px 15px",

  // 커스텀 영역
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

`StitchesDiv`와 `StitchesButton`의 '공통영역'에 해당하는 스타일은 별도의 class로 추출되어 재사용 됩니다.

![stitches-atomic-class](./images/css-in-js/stitches-atomic-class.png)

하지만 같은 style이더라도 내부 순서가 변경되면 같은 class를 사용하지 않으므로 style-lint를 적용하거나 [stitches - util](https://stitches.dev/docs/utils)로 정의해 활용하는 방향이 필요합니다.

## 마무리

CSS생태계가 발전하면서 기존 도구들의 단점을 개선한 새로운 도구가 등장하기도 하고, 아예 새로운 개념을 가진 도구들도 많이 등장했습니다.

모든 상황에 항상 정답인 '은총알'은 어떤 도구일지 결론을 내릴 수 있다면 좋겠지만 지금까지의 결론은 '없다'라고 생각합니다. 각 도구는 저마다 선택한 trade-off가 있고, 만들고 있는 서비스의 특성을 고려하여 적절한 CSS전략을 세우는 것이 필요합니다.

만들고 있는 서비스에서 rendering 최적화가 필요하지 않은 정도의 컴포넌트들만 다룬다면 runtime overhead는 무시할만한 수준일 수 있고, 오히려 runtime이 존재하지 않음으로써 이를 따로 해결해주어야 하는 상황을 만날 수 있습니다. 그렇기 때문에, 무조건 '좋다 나쁘다'로 나눌 수 없으며 모든 개선이 측정 후 이루어져야 하듯, 서비스의 특성과 계획을 고려하여 알맞은 CSS사용방법을 선택해야 할 것입니다.

## References

- [https://necolas.github.io/react-native-web/benchmarks/](https://necolas.github.io/react-native-web/benchmarks/)

- [https://blog.cometkim.kr/posts/css-optimization-in-jamstack/](https://blog.cometkim.kr/posts/css-optimization-in-jamstack/)

- [https://community.frontity.org/t/better-css-in-js-performance-with-zero-runtime/3586/9](https://community.frontity.org/t/better-css-in-js-performance-with-zero-runtime/3586/9)

- [https://pustelto.com/blog/css-vs-css-in-js-perf/](https://pustelto.com/blog/css-vs-css-in-js-perf/)

- [https://itnext.io/how-to-increase-css-in-js-performance-by-175x-f30ddeac6bce](https://itnext.io/how-to-increase-css-in-js-performance-by-175x-f30ddeac6bce)

- [https://css-tricks.com/why-i-love-tailwind/](https://css-tricks.com/why-i-love-tailwind/)

- [https://www.javascript.christmas/2020/15](https://www.javascript.christmas/2020/15)
