---
title: '[SSR] 4. SSR from a UX Perspective'
date: 2019-12-13 22:12:74
category: react
thumbnail: './images/thumbnail.png'
---

![image-thumbnail](./images/thumbnail.png)

We implemented two different situations using SSR. I think the second post was a bit harder than the first — but did that extra difficulty actually buy us better UX?

My answer is `no.`

## From the user's perspective

### Fetching data on the server

Let's look at a diagram of what happens when you make a request using the approach from [3. SSR - Data Fetch](https://so-so.dev/react/ssr-3-ssr-data-fetch/).

![user-ssr-data-fetch](./images/user-ssr-data-fetch.png)
The user's request goes to express, and until it fetches the api and sends the client an html with the content already drawn, **the user just sees a blank screen.**

If the api call takes a long time, the time the user spends staring at a blank screen grows right along with it. That's hard to call good UX.

> Caching the html that already has the content baked in would speed this up and is likely to have a real, positive effect on UX.
> But this tutorial won't get into that.

### Delivering quickly from the server

Let's switch to the approach from [2. SSR - Basic](https://so-so.dev/react/ssr-2-ssr---basic/).
On the server, instead of making the api call, we just render the client's `Loader` or `header` area and deliver it quickly. The rest of the logic gets handed off to the client.

![user-ssr-no-data-fetch](./images/user-ssr-no-data-fetch.png)

Now the user gets to see content quickly. In the diagram I represented this with a big `Loading` label, but using something like a skeleton UI would push the UX even further.

### Fetching data on the server - WebView

And this approach has an even bigger advantage in a webview context.

![user—no-cache](./images/user-ssr-no-cache.png)

When you implement this by handling the api request on the server, what the client receives is the finished html, so caching doesn't apply.

### Delivering quickly from the server - WebView

![user—cache](./images/user--cache.png)

With the second approach, some of the bundle needed for client rendering can end up cached. Naturally, that can proceed faster than receiving the bundle from express.

## It's not all downsides

That said, it's not all downsides either. Put another way, the client ends up **always depending on however express is doing.** Let's imagine a `low-tier device` scenario for a moment.

**_Downloading the full contents_**

Since every request and api call happens on express, the only variables affecting how fast the user gets content are the `network environment` and express's specs (server CPU, etc).
On a device with a weaker CPU than express's, content can end up loading faster than the previous approach.

**_SSR + CSR_**

The factors that matter for content-download speed here are the user's network environment and their device specs.
On a low-spec device, both of those factors are working against you, so content loading ends up very slow. In this case, it's better to have express deliver all of the content.

## Wrapping up this tutorial

That wraps up the SSR tutorial.
Along the way to implementing SSR without a framework, I ran into a lot of bugs and rough patches, and I hope this has been helpful to anyone out there running into the same struggles.

You can find the code used in this tutorial [here](https://github.com/SoYoung210/react-ssr-code-splitting).
I'd appreciate any feedback, whether in the comments or as a GitHub issue. 🙂
