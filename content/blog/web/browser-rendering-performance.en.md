---
title: 'Improving Rendering Performance (2) — Using Composited Animations'
date: 2023-02-08 08:00:09
category: web
thumbnail: './images/browser-rendering-performance/thumbnail2.png'
---

![image-thumbnail](./images/browser-rendering-performance/thumbnail2.png)

This time I want to revisit rendering, but through the lens of performance. So how should you actually approach optimizing it?

> **Web performance optimization isn't about building the single fastest rendering pass.**

The rendering process itself happens entirely inside the browser, so there's no improving that process directly.
So "improving" performance really means something else: shrinking the bottlenecks that show up along the way, not rewriting the pipeline itself.

This post skips DOM-tree parsing entirely and focuses on optimizations around style calculation instead.

![enhance_result](./images/browser-rendering-performance/enhance_result.png)

Here's the before-and-after from the [personal-project fix](https://github.com/SoYoung210/Uing/pull/9) that got me writing this post. The before measurements show rendering firing over and over, chewing through CPU; after the fix, it doesn't.

Visually the two versions look identical, but the gap in rendering performance is huge.

![main_rendering_flow](./images/browser-rendering-performance/메인플로우.png)

One of the biggest factors deciding performance is whether the main thread gets tied up. Before the fix, a Repaint was hogging the main thread; after it, [only compositing happens, so rendering runs on the compositor thread and the GPU instead, leaving the main thread free](https://so-so.dev/web/browser-rendering-process/#1-%EB%A0%88%EC%9D%B4%EC%96%B4-%ED%95%A9%EC%84%B1).

Which CSS property you touch decides where in the pipeline work has to restart, and the cost drops in this order: Reflow → Repaint → Composite. (Though not always. Overdo layers and the overhead of compositing them can create its own bottleneck.)

## Animation

### Reflow

Say you resize an element with JavaScript. What actually happens?

![reflow](./images/browser-rendering-performance/reflow.png)

A size change is a style change, which forces layout to recalculate and everything after it to run again. Re-running style and everything past layout is what's called **reflow**.

### Repaint

![repaint](./images/browser-rendering-performance/repaint.png)

Change `background-color`, though, and style still has to recalculate, but since this property doesn't touch the element's position, layout gets skipped and execution starts back up at Paint. Re-running from Paint onward is what's called **repaint**.

Both reflow and repaint tie up the main thread, so if either one takes too long, it can start affecting how the user's interactions get handled too.

### Composition only

![composite_only](./images/browser-rendering-performance/composite_only.png)

As covered in the [previous post](https://so-so.dev/web/browser-rendering-process/#%ED%95%A9%EC%84%B1-%EC%8A%A4%EB%A0%88%EB%93%9C), compositing is the process of turning information about how a page should look into pixels (rasterizing), then building a Compositor Frame out of that. Animations built on `transform` or `opacity` render off layers that have already been committed, with zero main-thread involvement, which is exactly why they're fast.

## Performance Improvement

Using what we just covered, I compared animation performance across different CSS properties. (Chrome made the difference hard to see, so I ran these tests in Safari instead, since it's Webkit-based.)

### Using a Property That Triggers Repaint

```jsx
const backgroundAnimation = keyframes({
  '0%': { backgroundPosition: '0% 50%' },
  '50%': { backgroundPosition: '80% 100%' },
  '100%': { backgroundPosition: '0% 50%' },
});

const Main = styled('main', {
  // ...
  '&::before': {
    position: 'absolute',
    animation: `${backgroundAnimation} infinite 20s linear`,
  }
})
```

![repaint_layer_timeline](./images/browser-rendering-performance/repaint_layer_timeline.png)

The `background-position` animation on the `main` element keeps triggering repaint on the top-level `#document` layer, and CPU usage stays high.

### Using a Property That Only Triggers Composition

```jsx
const backgroundAnimation = keyframes({
  '0%': { transform: 'translateX(-50%) rotate(0deg)' },
  '50%': { transform: 'translateX(-50%) rotate(270deg)' },
  '100%': { transform: 'translateX(-50%) rotate(0deg)' },
});

const Main = styled('main', {
  // same as before
})
```

![composite_layer_timeline](./images/browser-rendering-performance/composite_layer_timeline.png)

The animated layer gets split off on its own, and only compositing happens, no repaint at all. Since the main thread never gets touched, the animation runs far smoother than before.

### Splitting Off Just the Layer (Forced Hardware Acceleration)

What if you leave the repaint-triggering `background-position` animation exactly as it is, but force the layer to split off anyway?

![layer_promotion_result](./images/browser-rendering-performance/layer_promotion_result.png)

```jsx
const backgroundAnimation = keyframes({
  '0%': { backgroundPosition: '0% 50%' },
  '50%': { backgroundPosition: '80% 100%' },
  '100%': { backgroundPosition: '0% 50%' },
});

const Main = styled('main', {
  // ...
  '&::before': {
    position: 'absolute',
    transform: 'translateZ(0)',
    animation: `${backgroundAnimation} infinite 20s linear`,
  }
})
```

Meeting the conditions for a Graphics Layer splits the animated `main` element into its own layer, so it can rasterize independently. ([more on this — the browser rendering process#Layerize](https://so-so.dev/web/browser-rendering-process/#6-layerize))

Repaint keeps firing just as often as before, but CPU usage drops noticeably compared to before the split. That's because the paint invalidation region we talked about earlier shrinks, from the whole top-level `#document` down to just the `main::before` element. Splitting the background repaint onto its own layer doesn't stop repaint from happening, it just makes it cheaper. (Still, there's more overhead here than an animation that only uses compositing.)

## The Cost of Splitting Off a Layer

![layer_memory](./images/browser-rendering-performance/layer_memory.png)

Split four on-screen boxes into four separate layers, for example, and you need an extra 78,400 bytes of memory.

Once your data outgrows the available memory, anything that's fallen out has to get reloaded before it can be used again, and that transfer overhead can eat right through whatever performance gain splitting the layer was supposed to buy you.

The full details are in [CSS GPU Animation: Doing It Right#memory-consumption](https://www.smashingmagazine.com/2016/12/gpu-animation-doing-it-right/#memory-consumption).

## Closing

Improving rendering performance mostly means removing or dodging whatever hurts it, and pushing as close as you can to the ceiling the browser can actually give you. Sometimes, building out a complex animation, you just can't avoid `reflow` or `repaint` entirely. But a small reflow or repaint might also be the easiest way to get the result you want, without doing much damage to performance at all.

**Every performance improvement needs to be driven by measurement.** Rendering is no exception. You'll get the best results by diagnosing each trade-off as you hit it, not by guessing upfront.

## References

- [https://web.dev/stick-to-compositor-only-properties-and-manage-layer-count/](https://web.dev/stick-to-compositor-only-properties-and-manage-layer-count/)
- [https://cabulous.medium.com/how-does-browser-work-in-2019-part-5-optimization-in-the-interaction-stage-66b53b8ec0ad](https://cabulous.medium.com/how-does-browser-work-in-2019-part-5-optimization-in-the-interaction-stage-66b53b8ec0ad)
- [https://web.dev/simplify-paint-complexity-and-reduce-paint-areas/](https://web.dev/simplify-paint-complexity-and-reduce-paint-areas/)
- [https://www.smashingmagazine.com/2016/12/gpu-animation-doing-it-right](https://www.smashingmagazine.com/2016/12/gpu-animation-doing-it-right)
