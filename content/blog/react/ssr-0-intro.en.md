---
title: '[SSR] 0. Getting Started'
date: 2019-11-17 16:00:09
category: react
thumbnail: './images/thumbnail.png'
---

![image-thumbnail](./images/thumbnail.png)

In this series, I'll walk through adding server-side rendering and code splitting to a React app.

> You'll find all the code on [GitHub](https://github.com/soYoung210/react-ssr-code-splitting) — **each step has its own branch, so go dig in!**

If you're adding SSR to React, [Next.js](https://nextjs.org/) is a solid option too. But here I'm skipping the framework and building code splitting and SSR into plain React from scratch.

Here are the versions I used for this series:

```json
{
  "typescript": "3.6.2",
  "@loadable/component": "5.10.3",
  "@loadable/server": "5.10.3",
  "react": "16.8.6",
  "react-router-config": "5.1.1",
  "react-router-dom": "5.0.1",
  "redux": "4.0.4",
  "redux-observable": "1.1.0"
}
```

## Table of Contents

### [1. Code Splitting](https://so-so.dev/react/ssr-1-codesplitting/)

- Picking a library
- Setting up the template HTML
- Configuring things
- Writing the view code
- A few closing thoughts

### [2. SSR - Basic](https://so-so.dev/react/ssr-2-ssr---basic/)

- Cleaning up the structure
- Rendering on the server
- Checking the result

### [3. SSR - Data Fetch](https://so-so.dev/react/ssr-3-ssr-data-fetch/)

- Switching to react-router-config
- Updating server/app.tsx
- Passing the initial store state to the client
- Using the server's data to initialize the store

### [4. SSR, from the User's Perspective](https://so-so.dev/react/ssr-4-ux-ssr/)

- The user's side of things
- It's not all downsides
- Wrapping up this series
