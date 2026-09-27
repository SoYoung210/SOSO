---
title: '[SSR] 0. Introduction'
date: 2019-11-17 16:00:09
category: react
thumbnail: './images/thumbnail.png'
---

![image-thumbnail](./images/thumbnail.png)

This tutorial introduces the process of applying Server Side Rendering, and Code Splitting, to React.

> All the code is up on [GitHub](https://github.com/soYoung210/react-ssr-code-splitting) — **check out the branch for each step to see the code!**

If you're introducing SSR to React, [Next.js](https://nextjs.org/) can also be a good choice. But this post covers the process of adding Code Splitting and SSR to plain React, without a framework.

This series was written based on the following versions.

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

- Choosing a library
- Setting up the template HTML
- Config setup
- Writing the view code
- A few thoughts

### [2. SSR - Basic](https://so-so.dev/react/ssr-2-ssr---basic/)

- Organizing the structure
- Rendering on the server
- Checking the result

### [3. SSR - Data Fetch](https://so-so.dev/react/ssr-3-ssr-data-fetch/)

- Switching to react-router-config
- Updating server/app.tsx
- Passing the initial store value to the client
- Initializing the store using data received from the server

### [4. SSR from a UX Perspective](https://so-so.dev/react/ssr-4-ux-ssr/)

- The user's perspective
- It's not all downsides
- Wrapping up this tutorial
