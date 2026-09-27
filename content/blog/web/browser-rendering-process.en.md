---
title: 'Improving Rendering Performance (1): Understanding the Rendering Process'
date: 2023-02-05 08:00:09
category: web
thumbnail: './images/browser-rendering-performance/thumbnail.png'
---

![image-thumbnail](./images/browser-rendering-performance/thumbnail.png)

## Intro

I recently [tuned up the rendering performance](https://twitter.com/soyoung__ee/status/1613759830703112194) on a side project, and while I was at it, I mapped out how browser rendering actually works: what was really behind the slowdown, and what fixed it.

## Rendering pipeline

You can't improve rendering performance without understanding the rendering process and what's involved in it. Everything below is specific to the Blink engine, drawn from the [RenderingNG](https://developer.chrome.com/articles/renderingng-architecture/) article and the 2020 BlinkOn talk [Life of a Pixel](https://www.youtube.com/watch?v=K2QHdgAKP-s). Browsers that don't run on Blink may work differently.

### 0. Overview

![rendering-main-flow](./images/browser-rendering-performance/메인플로우.png)

Rendering kicks off with HTML parsing, runs through Style, Layout, and Paint to work out the page's composition, builds up layers, and finally the compositor thread and the GPU team up to draw it all on screen.

Here's each stage, in detail.

### 1. Parsing

![parsing](./images/browser-rendering-performance/parsing.png)

First, the main thread turns HTML into the DOM tree, a structure the browser can actually work with. This keeps going until the parser runs into a blocking resource: a `<link>`, or a `<script>` without `async` or `defer`.

CSS blocks both parsing and rendering, so the page doesn't briefly flash [unstyled content](https://ko.wikipedia.org/wiki/FOUC).

A `<script>` tag can also contain code that rewrites the DOM (`document.write()`), which is reason enough for the parser to pause there too.

Pausing parsing has side effects, like pushing back important resources, so browsers soften the blow with a preload scanner that fires off the requests it can predict, in parallel.

### 2. Style

![style](./images/browser-rendering-performance/style.png)

Once the DOM tree is parsed, the browser parses the CSS and works out each node's style in three steps.

#### Step 1. CSS → Style Sheet

![css_to_style_sheet](./images/browser-rendering-performance/css_to_style_sheet.png)

It pulls together the CSS loaded from `<link>` tags, `<style>` tags, and inline styles into a style sheet the browser can process.

#### Step 2. Unit conversion

- width: 50%
- padding: 2em 0
- font-size: 1rem

CSS accepts all kinds of units, px, %, em, rem, and relative ones like rem get resolved down to pixels during this step.

> Why pixels specifically: the last stage of rendering builds bitmap data, and a bitmap is just pixels.

#### Step 3. Style computation

![style_calc](./images/browser-rendering-performance/style_calc.png)

Finally, the browser resolves each element's final style, accounting for things like overrides.

### 3. Layout

![layout](./images/browser-rendering-performance/layout.png)

Layout builds the layout tree. Working from the DOM tree and the style sheet, it figures out which elements go where. Since the layout tree only tracks what actually renders, anything set to `display: none` gets left out entirely.

![layout_cost](./images/browser-rendering-performance/layout_cost.gif)

None of this is trivial. Even a page as plain as the one in the clip above forces the browser to work out exactly where each line should wrap, based on font size, for every paragraph.

### 4. PrePaint

PrePaint gets everything ready to build the layers, and it breaks down into two main jobs.

#### 1. Paint Invalidation

![paint_invalidation](./images/browser-rendering-performance/paint_invalidation.png)

Whenever something changes upstream, in Style or Layout, it gets flagged with what's called a dirty bit, and that invalidates whatever paint record was cached.

#### 2. Property Tree

![property_tree](./images/browser-rendering-performance/property_tree.png)

The Property Tree tracks the properties assigned to each layer. Apply a CSS property like `transform` or `opacity`, and it lands in the property tree, so the compositing stage can apply the right effect quickly later on.

Property Tree data used to live right on the layer itself, so changing one node's property meant walking down through all its descendants to update them too. The current Blink engine keeps these properties separate instead, and each node just points to its own node in the Property Tree.

### 5. Paint

Paint doesn't draw anything to the screen. It produces `Paint Records`, which describe **how** something should eventually be drawn. Each record holds three things:

- Action (e.g. Draw Rect)
- Position (e.g. 0, 0, 300, 300)
- Style (e.g. backgroundColor: red)

### 6. Layerize

![composition_forest](./images/browser-rendering-performance/composition_forest.png)

Layerize takes paint's output and turns it into a `Composited Layer List`. Layout already built a Layout Tree out of Layout Objects, and any Layout Object meeting one of the conditions below gets its own Paint Layer:

- It's the root element
- It uses `position: relative` or `absolute`
- It uses 3D (`translate3d`, `preserve-3d`, etc.) or a perspective transform
- It's a `<video>` or `<canvas>` tag
- It uses a CSS `filter` or an alpha mask

Anything that doesn't qualify just gets folded into the nearest ancestor's Paint Layer instead. (A single Paint Layer can cover more than one Layout Object.)

A Paint Layer gets its own Graphics Layer on top of that if it carries a Compositing Trigger, or holds scrollable content.

**Compositing Trigger examples**

- 3D transforms: `translate3d`, `translateZ`, …
- `<video>`, `<canvas>`, `<iframe>` elements
- `position: fixed`
- `transform` and `opacity` animations built with CSS transitions and animations
- `position: fixed`
- will-change
- filter

A separate Graphics Layer can be pixelated on its own, and since it doesn't have to redo the raster step (more on that later) every frame, the GPU can handle it directly. That's exactly why scrolling and animation stay fast.

![composite_after_paint](./images/browser-rendering-performance/composite_after_paint.png)

Layer creation used to happen before paint, but the [CAP (Composite After Paint) project](https://developer.chrome.com/articles/blinkng/#composite-after-paint-pipelining-paint-and-compositing) flipped that order to run after paint, and there are plans to eventually move the whole thing off the main thread onto a tile worker thread.

**Composite After Paint (CAP)**

Before [RenderingNG](https://developer.chrome.com/articles/renderingng/), the effort to overhaul Blink's rendering, the Composited Layer was built before paint ran. Ordering it that way created a circular dependency in the pipeline every time a style update happened.

![composite_after_flow](./images/browser-rendering-performance/composite_after_flow.jpeg)

Take a case where Paint needs to be invalidated. That invalidation can be triggered by a change further upstream (DOM, Style, Layout), or by a change to the previous Layerization result.

![implicit-compositing](./images/browser-rendering-performance/implicit-compositing.gif)

<div style="opacity: 0.5;padding-right: 15px;text-align: center;margin-top: -0.4rem;font-size: 12px;margin-bottom: 1rem;">
    <a href="https://sergeche.github.io/gpu-article-assets/examples/example1.html" target='_blank'>https://sergeche.github.io/gpu-article-assets/examples/example1.html</a></sup>
</div>

If an element's Stacking Context calls for [implicit compositing](https://www.smashingmagazine.com/2016/12/gpu-animation-doing-it-right/#implicit-compositing), the browser has to create yet another composite layer, and that layer change forces Paint to run all over again.

The CAP project exists specifically to close that loop. You can find the details in [RenderingNG deep-dive: BlinkNG - Composite after paint](https://developer.chrome.com/articles/blinkng/#composite-after-paint-pipelining-paint-and-compositing) and in [the project's design doc](https://docs.google.com/document/d/114ie7KJY3e850ZmGh4YfNq8Vq10jGrunZJpaG6trWsQ/edit#).

### 7. Commit

The Composited Layer List that Layerize produces, along with the Property Tree from PrePaint, gets copied over to the compositor thread. That handoff is called a Commit, and it's the main thread's last job in this whole sequence. After that, the main thread is free to run JavaScript or kick off the pipeline again.

![commit](./images/browser-rendering-performance/commit.png)

The main thread is done, but drawing this one frame isn't over yet. The compositor thread and the GPU still have their own work left before anything actually reaches the screen.

Splitting the work across threads like this is purely about running things in parallel. While the compositor thread pushes through the rest of the pipeline, the main thread is already free to pick up its next rendering pass.

### **Compositor thread**

Separately from the main thread, the compositor thread handles two jobs: **compositing layers** and **processing user input**.

#### 1. Compositing layers

![non_composition_raster](./images/browser-rendering-performance/non_composition_raster.gif)

Actually putting pixels on screen means converting everything the earlier stages figured out (the HTML structure, each element's style, its geometry, its paint properties) into actual pixels. That conversion is called **rasterizing**.

The crudest version just rasterizes whatever's needed, on demand. Scroll the page, and the browser shifts the already-rasterized frame and rasterizes the newly exposed strip. That's actually how Chrome handled it when it first launched. Modern browsers do something smarter, called **compositing**.

![composition](./images/browser-rendering-performance/composition.gif)

Compositing splits the page into separate layers, rasterizes each one on its own, and merges them together on the compositor thread. Scroll, and since the layers are already rasterized, all that's left is compositing the new frame. Animation works the same way: move a layer, composite it, done.

#### 2. User input

A scroll event on a composited layer can be handled entirely on the compositor thread, skipping the main thread altogether, as long as nothing has an event handler attached to it.

![non-fast-scroll-region](./images/browser-rendering-performance/non-fast-scroll-region.png)

Since JavaScript only runs on the main thread, the compositor thread flags any region with an event handler attached as a "non-fast scrollable region" whenever the page gets composited. That flag is how the compositor decides, once an event actually fires, whether it needs to forward it to the main thread at all. Outside that region, the compositor just composites the new frame straight from what the main thread already committed, no round trip required.

```jsx
document.body.addEventListener('touchstart', event => {
  if (event.target === area) {
    event.preventDefault();
  }
});
```

Which means event-delegation code, attaching a handler to some parent element, can quietly wreck scroll performance in places you wouldn't expect. (For more on event phases, Jbee's [Looking at the spec: Document Object Model Event](https://jbee.io/web/about-event-in-the-web/) is worth a read.)

![non-fast-scroll-region-all](./images/browser-rendering-performance/non-fast-scroll-region-all.png)

From the browser's perspective, that marks the entire document, the whole page, as a non-fast scrollable region. Now the compositor has to check in with the main thread on every input event and wait for it to respond, so scrolling can't stay smooth.

```jsx {5}
document.body.addEventListener('touchstart', event => {
  if (event.target === area) {
    event.preventDefault()
  }
}, { passive: true });
```

Setting the `passive` option on the listener heads this off. With it set to **`true`**, the browser ignores [defaultPrevented](https://dom.spec.whatwg.org/#dom-event-defaultprevented) the moment the event fires, so the main thread still gets the event, but the compositor no longer has to wait around for it before compositing the next frame.

### 8. Tiling

![tilling](./images/browser-rendering-performance/tilling.png)

The compositor thread rasterizes every layer it gets handed from the main thread. A layer can be huge, so it gets cut up into tiles first. Each tile carries the PaintRecord generated during drawing, and tiles get rasterized in different orders of priority depending on things like whether they fall inside the viewport.

### 9. Raster

![raster](./images/browser-rendering-performance/raster.png)

Raster is where the draw commands stored in each tile actually get executed. Blink leans on a graphics library called [Skia](https://skia.org/) to produce bitmap images and stash them in GPU memory.

Older Chromium architectures ran this on a raster thread inside the renderer process; these days it happens in the GPU process instead, which is what people mean by **"hardware acceleration."**

![draw](./images/browser-rendering-performance/draw.png)

Once every tile is rasterized, the browser builds a DrawQuad, or "quad" for short, out of it. A quad records where and how to draw its tile, built from the layer and Property Tree data from earlier.

### 10. Activate

![activate](./images/browser-rendering-performance/activate.png)

The compositor thread runs a multi-buffering setup: a pending tree and an active tree that swap places.

Rasterizing happens asynchronously, so if a new commit shows up while the compositor thread is still chewing through a previous one, it needs to keep showing that older commit's content until the new one is actually ready.

The pending tree takes the commit, and once everything it needs is ready, it gets copied over to become the active tree. Splitting the trees this way lets committed changes sit and wait in the pending tree while the active tree is busy doing GPU work.

Finally, the now-active quads get bundled into a Compositor Frame and handed off to the GPU process. The compositor thread's whole job, boiled down, is to take committed layers, tile them, rasterize them, pack them into a Frame, and ship it to the GPU.

### 11. Display

![display](./images/browser-rendering-performance/display.png)

Last step: the viz thread in the GPU process merges however many CompositorFrames there are into one, renders the pixels to the screen, and with that, the pipeline for drawing a single frame wraps up.

## Next

The next post builds on all of this to get into how, and why, you can actually improve rendering performance.

## References

- [https://developer.chrome.com/blog/inside-browser-part3/](https://developer.chrome.com/blog/inside-browser-part3/#paint)
- [https://developer.chrome.com/articles/renderingng/](https://developer.chrome.com/articles/renderingng/)
- [https://developer.chrome.com/articles/renderingng-architecture/](https://developer.chrome.com/articles/renderingng-architecture/)
- [https://developer.chrome.com/articles/blinkng/](https://developer.chrome.com/articles/blinkng/)
- [https://wit.nts-corp.com/2017/08/31/4861](https://wit.nts-corp.com/2017/08/31/4861)
- [https://tv.naver.com/v/4578425](https://tv.naver.com/v/4578425)
- [A frontend developer's guide to Chrome's rendering performance factors (in Korean)](https://medium.com/@cwdoh/%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C-%EA%B0%9C%EB%B0%9C%EC%9E%90%EB%A5%BC-%EC%9C%84%ED%95%9C-%ED%81%AC%EB%A1%AC-%EB%A0%8C%EB%8D%94%EB%A7%81-%EC%84%B1%EB%8A%A5-%EC%9D%B8%EC%9E%90-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0-4c9e4d715638)
- [https://www.youtube.com/watch?v=K2QHdgAKP-s](https://www.youtube.com/watch?v=K2QHdgAKP-s)
- [https://docs.google.com/document/d/114ie7KJY3e850ZmGh4YfNq8Vq10jGrunZJpaG6trWsQ/edit](https://docs.google.com/document/d/114ie7KJY3e850ZmGh4YfNq8Vq10jGrunZJpaG6trWsQ/edit)
- [https://www.youtube.com/watch?v=sUbJPHYKZkU](https://www.youtube.com/watch?v=sUbJPHYKZkU)
- [https://www.chromium.org/developers/design-documents/gpu-accelerated-compositing-in-chrome/](https://www.chromium.org/developers/design-documents/gpu-accelerated-compositing-in-chrome/)
