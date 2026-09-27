---
title: 'Introducing TailwindCSS (with twin.macro + emotion)'
date: 2020-05-10 08:00:09
category: web
thumbnail: './images/tailwind/thumbnail.png'
---

![image-thumbnail](./images/tailwind/thumbnail.png)

TailwindCSS is a utility-first CSS framework.

This post introduces the concept of utility-first CSS and how you can use TailwindCSS. If you've been curious about TailwindCSS, or are considering adopting it, I think it's worth a read.

## utility-first CSS

The name "utility-first CSS" might sound unfamiliar, but among widely used libraries, Bootstrap was actually built on this concept.

The way you use it is very similar to [Bootstrap](https://getbootstrap.com/). In Bootstrap, you apply styles by assigning classes like this:

```html
<div class="alert alert-primary" role="alert">
  A simple primary alert—check it out!
</div>
<div class="alert alert-secondary" role="alert">
  A simple secondary alert—check it out!
</div>
<div class="alert alert-success" role="alert">
  A simple success alert—check it out!
</div>
<div class="alert alert-danger" role="alert">
  A simple danger alert—check it out!
</div>
```

<details>
<summary><b>Result:</b></summary>
<ul>
  <img src="/media/web/images/tailwind/bootstrap_example.png" alt='bootstrap example'/>
</ul>
</details>
<br/>

Utility-first CSS works by pre-defining the style each class is responsible for, and then applying whichever classes you need in combination.

Class names are formed like this:

```css
.{property}{side}-{size}
```

### Example

Here's a simple example using **margin** and **padding**:

- `mt-5`: applies the margin-top value according to a defined property, such as 5px
- `pb-3`: applies the padding-bottom value according to a defined property, such as 3px
- `px-2`: applies the x-axis padding values (padding-left, padding-right) according to a defined property, such as 2px

![card_example.png](./images/tailwind/card_example.png)

In the traditional approach, if the box wrapping a card title needed 20px of padding on all four sides, you'd probably use a class named something like `my-card-inner`. That class might also hold a bunch of other styles besides padding, and every time the design changes, you'd need to track down every element using it and update them all at once.

With utility-first CSS, however, you can express this like so:

```html {2}
<div class="card">
    <div class="card-body p-20">
    ...
    </div>
</div>
```

In this case, even if the base value behind `p-20` changes from 20px to 5rem, you only need to update the config value — it's easy to change, and it's immediately clear what style each class is responsible for.

This is what utility-first CSS means: using classes from a purely styling perspective, rather than from the element's functional role.

## TailwindCSS

TailwindCSS, the subject of this post, has the advantage of being **easier to customize and extend** compared to other utility-first CSS options. You can add all sorts of plugins, or build your own, and it's well documented.

### Example

Let's use the `padding` property as an example.

![search_example.png](./images/tailwind/search_example.png)

Searching for the keyword **padding** on the [Tailwind site](https://tailwindcss.com/) brings up the properties below.

![search_result.png](./images/tailwind/search_result.png)

You can use the properties that are set up by default, or customize them in `tailwind.config.js`.

### Using theme.padding

```jsx
// tailwind.config.js
module.exports = {
  theme: {
    padding: {
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '48px',
      '20': '20px',
    }
  }
}
```

### Using theme.spacing

This approach doesn't apply the padding option directly — instead, it applies through the spacing property.

```jsx {17,19}
// tailwind.config.js
module.exports = {
  spacing: {
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '48px',
    8: '8px',
    9: '9px',
    10: '10px',
    12: '12px',
    14: '14px',
    15: '15px',
    16: '16px',
    18: '18px',
  },
  padding: (theme) => theme('spacing'),
  // margin also gets applied through the spacing values
  margin: (theme) => theme('spacing'),
}

```

By using `spacing`, you can apply it to any property that needs a **numeric value**, like margin.

### variants

The `variants` field in tailwind.config.js lets you control responsive behavior and pseudo-classes.

```jsx
// tailwind.config.js
module.exports = {
  variants: {
    appearance: ['responsive'],
    // ...
    borderColor: ['responsive', 'hover', 'focus'],
    // ...
    outline: ['responsive', 'focus'],
    // ...
    zIndex: ['responsive'],
  },
}
```

The keys under variants are the same properties used in tailwind.config.js's `theme`, and the variants listed below are supported by default.

- `'responsive'`
- `'group-hover'`
- `'focus-within'`
- `'first'`
- `'last'`
- `'odd'`
- `'even'`
- `'hover'`
- `'focus'`
- `'active'`
- `'visited'`
- `'disabled'`

If you customize variants yourself, they won't automatically migrate along with the defaults, so you need to list both the default values and whatever additional ones you're defining.

**❌ If you only define the additional properties, you lose access to the default ones.**

```jsx {4}
// tailwind.config.js
module.exports = {
  variants: {
    backgroundColor: ['active'],
  },
}
```

✅ **You need to list every property you want enabled.**

```jsx {4}
// tailwind.config.js
module.exports = {
  variants: {
    backgroundColor: ['responsive', 'hover', 'focus', 'active'],
  },
}
```

### Applying responsive styles

TailwindCSS ships with four breakpoints applied by default based on screen size, and you can easily apply them just by adding a utility class.

```html
<!-- base 16, medium: 32, large: 48 -->
<img class="w-16 md:w-32 lg:w-48" src="...">
```

As shown below, you can make virtually anything — background color and more — responsive based on screen size.

![responsive_tailwind.gif](./images/tailwind/responsive_tailwind.gif)

You can define additional breakpoints by changing the `screens` property in tailwind.config.js.

```jsx {5,8,11}
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'tablet': '640px',
      // => @media (min-width: 640px) { ... }

      'laptop': '1024px',
      // => @media (min-width: 1024px) { ... }

      'desktop': '1280px',
      // => @media (min-width: 1280px) { ... }
    },
  }
}
```

### plugins

TailwindCSS lets you create additional plugins as needed.

```jsx {16}
// tailwind.config.js
const plugin = require('tailwindcss/plugin')

module.exports = {
  plugins: [
    plugin(function({ addUtilities }) {
      const newUtilities = {
        '.skew-10deg': {
          transform: 'skewY(-10deg)',
        },
        '.skew-15deg': {
          transform: 'skewY(-15deg)',
        },
      }

      addUtilities(newUtilities)
    })
  ]
}
```

As shown above, you can add whatever utility class you want, and you can also add variants for classes you've newly added.

```jsx
// tailwind.config.js
const plugin = require('tailwindcss/plugin')

module.exports = {
  plugins: [
    plugin(function({ addUtilities }) {
      const newUtilities = {
        // ...
      }

      addUtilities(newUtilities, {
        variants: ['responsive', 'hover'],
      })
    })
  ]
}
```

If you want to apply base styles to an HTML tag, you can do that in plugins via `addBase`.

```jsx
// tailwind.config.js
const plugin = require('tailwindcss/plugin')

module.exports = {
  plugins: [
    plugin(function({ addBase, config }) {
      addBase({
        'h1': { fontSize: config('theme.fontSize.2xl') },
        'h2': { fontSize: config('theme.fontSize.xl') },
        'h3': { fontSize: config('theme.fontSize.lg') },
      })
    })
  ]
}
```

Base styles only support [Element Selectors](https://www.w3schools.com/cssref/sel_element.asp).

## With CSS-in-JS

TailwindCSS can be used together with CSS-in-JS libraries like [👩‍🎤 emotion](https://emotion.sh/docs/introduction) or [💅 styled-components](https://styled-components.com/). In that case, pairing it with **[twin.macro](https://www.npmjs.com/package/twin.macro)** lets you write noticeably cleaner code.

```jsx {2,7}
import React from 'react'
import tw from 'twin.macro'
import styled from '@emotion/styled/macro'
import { css } from '@emotion/core'

const Input = styled.input([
  tw`p-20`,
  ({ hasDarkHover }) =>
    hasDarkHover
      ? tw`hover:border-black`
      : css`
          &:hover {
            ${tw`border-white`}
          }
        `,
])
export default () => <Input hasDarkHover />
```

> As of May 2020, TailwindCSS has released up through version 1.4.4, while twin.macro currently uses version 1.3.4. twin.macro is currently [working on support](https://github.com/ben-rogerson/twin.macro/issues/45) for TailwindCSS 1.4.0.

With just a few simple settings, you can get it up and running easily.

```jsx {4}
// .babelrc
{
  "plugins": [
    "macros", // babel-plugin-macros
  ],
  "presets": [
  /* Other presets */
    "@emotion/babel-preset-css-prop", // @emotion/babel-preset-css-prop
  ]
}
```

### ⚠️ Things to watch out for

One thing to watch out for: since twin.macro only references properties defined in `tailwind.config.js`, any className you additionally define in `tailwind.config.css` can't be used together with twin.macro.

Also, you still can't use template literals inside a styled-component; apparently this feature is [in the works](https://github.com/ben-rogerson/twin.macro/issues/17).

![tw_macro_issue.png](./images/tailwind/tw_macro_issue.png)

## Wrapping up

After using TailwindCSS on a new project for about two months, I've been mostly satisfied with it so far.

> One thing I found a bit disappointing is that the translate property doesn't support 3D, so I ended up handling that separately with inline styles.

There's definitely a hurdle early on — you end up referring to the official docs a lot to figure out which rules govern which className — but once you get somewhat used to it, I think it's a tool worth pushing through that hurdle for. In particular, when the design guide is consistent, development just means attaching pre-defined classes, and I could clearly feel the speed advantage in that.

Using TailwindCSS also gave me a new perspective: the idea that style can be viewed as something entirely separate from a component's purpose or function.

## Ref

- [https://blog.usejournal.com/utility-first-css-ridiculously-fast-front-end-development-for-almost-every-design-503130d8fefc](https://blog.usejournal.com/utility-first-css-ridiculously-fast-front-end-development-for-almost-every-design-503130d8fefc)
- [https://tailwindcss.com/docs](https://tailwindcss.com/docs)

## Recommend

- [https://dev.to/michi/utility-first-css-you-have-to-try-it-first-3m85](https://dev.to/michi/utility-first-css-you-have-to-try-it-first-3m85)
