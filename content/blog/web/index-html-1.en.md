---
title: 'A Closer Look at index.html - Part 1'
date: 2020-02-13 16:00:09
category: web
thumbnail: './images/thumbnail.png'
---

![image-thumbnail](./images/thumbnail.png)

When you build with a library or framework like React, Vue, or Angular, the index.html in your build output gets generated automatically, so you may never actually open it.

But knowing exactly what goes into that final HTML pays off once you're chasing a performance win or hunting down a bug.

## Parts

- Part 1: link and script tags
- Part 2: meta tags (Open Graph), lang, and more

## TL;DR

- link tag
  - preload: a resource the current screen needs
  - prefetch: not❌ needed right now, a resource a later page will need
  - preconnect: for when you're pulling multiple resources from the same domain
- script tag
  - async: for scripts that don't touch the DOM
  - defer: for scripts that do touch the DOM
  - Don't expect much of a speed boost from either one on an SPA's bundle.js

## link - preload / prefetch / preconnect

The `link` tag describes the relationship between a page and an outside resource. You'll see it most with css, but it also loads site icons, sitemaps, and scripts.

Beyond the basics, you can add a `media` attribute — set one, and the css only loads once that condition holds.

```html
<link href="print.css" rel="stylesheet" media="print">
<link href="mobile.css" rel="stylesheet" media="screen and (max-width: 600px)">
```

Depending on the option you pick, a resource can jump ahead of others and load early, or the browser can open a connection before it's even needed.

### preload

`<link rel="preload">` tells the browser: I need this resource right now, so fetch it **as fast as possible.**

![rendering](./images/first.png)

Fonts are the classic use case.

```html
<link rel="preload" as="font" crossorigin="crossorigin" type="font/woff2" href="myfont.woff2">
```

Request a font without preload and text rendering can end up delayed, since the font request doesn't fire until after the DOM and CSSOM trees exist.
Here's the order a browser paints a page in:

1. The browser requests the HTML file.
2. It starts parsing the HTML response and building the DOM.
3. It finds CSS, JS, and other resources along the way and fires off requests for them.
4. Once all the CSS has arrived, it builds the CSSOM and merges it with the DOM tree into a render tree.
    - Only now does the render tree know which fonts it actually needs, so the font request goes out.
5. It runs layout and paints the content to the screen.

For content that has to show up the instant the render tree is ready, this sequence can make the font visibly show up late.

> Every browser implements this a little differently. See [Web Font Optimization](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/webfont-optimization#%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80_%EB%8F%99%EC%9E%91) for the details.

That's exactly why essential resources deserve **a priority boost** via preload. Preload a font and the request goes out without waiting for the CSSOM to finish building.

Leave a resource you preloaded unused for more than 3 seconds, and Chrome DevTools calls you out with a warning like this.

![warning](./images/second.png)

### preconnect

`<link rel="preconnect">` opens a connection to the server ahead of time, before any HTTP request actually needs it.

When you're requesting a resource from a different domain, you can't count on that server responding quickly. And when a secure connection is required, just setting up the connection — DNS lookup, redirects, the TCP handshake — can take longer than actually receiving the data.

`preconnect` is how you tell the browser to **get that connection out of the way early.** Here's how you use it.

```html
<link rel="preconnect" href="https://example.com">
```

Under the hood, here's what actually happens:

1. Parse the URL from the href attribute, check whether it's valid (erroring out if not), and figure out whether it's HTTP or HTTPS

2. If it's valid, treat that URL as the origin

3. Assign the cors state to the target element's crossOrigin attribute

4. Attempt the connection if crossOrigin is anonymous, or if credentials aren't set to false

5. Run DNS+TCP for http (or DNS+TCP+TLS for https), then leave the connection open — the user agent itself decides how many connections to keep around

![preconnect](./images/third.png)

Using preconnect cuts out a round trip entirely, and that alone saves a meaningful chunk of time.

![preconnect-vs](./images/fourth.png)

You can request Google's CSS and font from the same domain at once, which ends up eliminating 3 round trips.

### prefetch

`<link rel="prefetch">` waits until every high-priority resource has been requested, then fetches whatever's left over during idle time and drops it into the browser cache.
> Which makes it a poor fit for anything the first page needs right away.

`prefetch` comes in three flavors.

- Link Prefetching
- DNS Prefetching
- Prerendering

**1. Link Prefetching**

![prefetch](./images/fifth.png)

As just described, `prefetching` fetches a resource and stashes the result in the browser cache.

> "This technique has the potential to speed up many interactive sites, but won't work everywhere. For some sites, it's just too difficult to guess what the user might do next. For others, the data might get stale if it's fetched too soon. It's also important to be careful not to prefetch files too soon, or you can slow down the page the user is already looking at. - Google Developers"

In other words: think carefully about which resources are actually worth prefetching. Use it carelessly and you'll slow down the very page the user is looking at.

Worth checking [browser support](https://caniuse.com/#search=prefetch) before you reach for it, too.

**2. DNS Prefetching**

This just runs a [DNS lookup]([https://developer.mozilla.org/en-US/docs/Glossary/DNS](https://developer.mozilla.org/en-US/docs/Glossary/DNS)) in the background.

By the time you actually need the resource, the DNS lookup is already done, so it loads faster.

Here's how you use it.

```html
<!-- Prefetch DNS for external assets -->
<link rel="dns-prefetch" href="//fonts.googleapis.com">
<link rel="dns-prefetch" href="//www.google-analytics.com">
<link rel="dns-prefetch" href="//cdn.domain.com">
```

**3. Prerendering**

`prerendering` shares prefetch's basic idea: fetch something ahead of time in case it turns out to be needed.

The difference is that `prerendering` **actually renders the entire page in the background.**

![font](./images/sixth.png)

Prerender a resource nobody ends up needing, and you've just wasted bandwidth.

**Note. crossorigin**

Request an external resource without a `crossorigin` attribute, and the browser discards what it already loaded and applies a freshly fetched copy with different attributes instead. This is required for cross-domain requests, and it takes one of these values.

- anonymous: no credentials get sent along with the cors request.
- user-credentials: the cross-origin request goes through once credentials like cookies or an auth token check out.

## script - async / defer

When the parser hits a script tag while parsing HTML, everything stops. css is placed in the `head` since it's usually essential to rendering, but stalling the render just to load JavaScript that handles 'behavior' isn't a great experience for users.

That's why most script tags end up declared right before `</body>`. But there's more than one way to handle this — you can also reach for [async](https://www.w3schools.com/tags/att_script_async.asp) or [defer](https://www.w3schools.com/tags/att_script_defer.asp).

### The usual approach

![without-defer-async-head](./images/without-defer-async-head.png)
![without-defer-async-body](./images/without-defer-async-body.png)

As the images above show, a script tag blocks HTML parsing.

So put a script tag in the head, and users end up staring at a blank screen longer. Moving it to the very bottom of the body avoids that.

> This is the fallback for browsers that don't support async or defer.

### async

![with-async](./images/with-async.png)

The async attribute does nothing unless the script actually sits in the `head`.
> Behaves exactly as if you hadn't added it at all.

The script is requested asynchronously, and the moment the fetch completes, HTML parsing pauses while the script runs. Parsing resumes once it's done.

### defer

![with-defer](./images/with-defer.png)

Like async, the script downloads asynchronously, but it only runs after HTML parsing finishes. Since it never blocks parsing, the screen can render sooner.

So how do these two attributes play out in a Single Page Application (SPA)?

### SPA

An SPA doing client-side rendering draws its screen by parsing JS. Say we have two JS files:

- external.js: an external module
- app.js: a file under `src` that actually draws the screen

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <title>SPA - script</title>
</head>
<body>
  <div id="wrap"></div>
  <script src="external.js"></script>
  <script src="app.js"></script>
</body>
</html>
```

#### async

`external.js` gets requested, then `app.js` right behind it. The instant `external.js` finishes loading, it runs immediately and pauses HTML parsing. If `app.js` also finishes loading while parsing is still underway, the same thing happens: parsing pauses and the script runs.

With two or more scripts in flight like this, async gives you no guarantee about order, so it's best kept for scripts that have nothing to do with the DOM.

#### defer

defer fetches both scripts asynchronously too. The difference is that while `defer` requests `vendor.js` and `app.js` asynchronously, it still guarantees the order they run in.

#### When should you actually use them

Both `defer` and `async` cut down script request time. But an SPA's HTML parsing was never taking long to begin with, so don't expect either one to deliver a dramatic performance win.

> That's because, in the example above, the screen only appears once app.js has run, and an SPA's HTML is a barebones structure to begin with.

If anything, requesting a DOM-manipulating script through `async` — where execution order isn't guaranteed — is a good way to introduce bugs. Save `async` for scripts with no dependencies, like an analytics script such as GA.

## Reference

- [https://developer.mozilla.org/ko/docs/Web/HTML/Element/link]()

- [https://medium.com/@pakss328/resource-hint-8fb4e56ee042](https://medium.com/@pakss328/resource-hint-8fb4e56ee042)

- [https://www.keycdn.com/blog/resource-hints](https://www.keycdn.com/blog/resource-hints)

- [https://www.smashingmagazine.com/2019/04/optimization-performance-resource-hints/](https://www.smashingmagazine.com/2019/04/optimization-performance-resource-hints/)

- [https://www.smashingmagazine.com/2016/02/preload-what-is-it-good-for/](https://www.smashingmagazine.com/2016/02/preload-what-is-it-good-for/)

- [https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/webfont-optimization#optimizing_loading_and_rendering](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/webfont-optimization#optimizing_loading_and_rendering)

- [https://blog.asamaru.net/2017/05/04/script-async-defer/](https://blog.asamaru.net/2017/05/04/script-async-defer/)

- [https://flaviocopes.com/javascript-async-defer/](https://flaviocopes.com/javascript-async-defer/)

- [https://medium.com/@DivyaGupta26/when-to-async-when-to-defer-while-using-javascript-frameworks-28a7cf101ca4](https://medium.com/@DivyaGupta26/when-to-async-when-to-defer-while-using-javascript-frameworks-28a7cf101ca4)
