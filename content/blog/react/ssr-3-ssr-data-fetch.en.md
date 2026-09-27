---
title: '[SSR] 3. SSR - Data Fetch'
date: 2019-12-07 14:12:97
category: react
thumbnail: './images/thumbnail.png'
---

![image-thumbnail](./images/thumbnail.png)

You'll find the full code for this tutorial [here](https://github.com/SoYoung210/react-ssr-code-splitting/pull/16).

Every bug I ran into while building this is logged [here](https://github.com/soYoung210/react-ssr-code-splitting/issues) — look for issues tagged `✈️ SSR`.

## What this post covers

Here's what we're building in this post:

1. Declare the business logic the client needs.
2. Have the server carry out what step 1 defined.
3. Hand the result of step 2 back to the client.
4. Have the client use that data to initialize its store.

## 1. react-router-config

The server now needs to know about the behavior the client used to own, so we're changing how routes get defined. Start by declaring a `RouteBranch` interface like this.

```ts
export interface RouteBranch {
  path: string;
  exact?: boolean;
  component: React.ComponentType<any>;
  loadaData?: (params: any) => any;
  routes: Array<RouteBranch>;
}
```

This defines what makes up a route (path, component, etc.) and captures the **work** that route has to do as a function called loadData.
> The server will call this function to run its business logic later on.

Now let's declare every `route` in the project.

```tsx
const UserView = loadable(
  () => import(/* webpackChunkName: "user" */ '../User'), { ssr: false }
);
const OrgView = loadable(
  () => import(/* webpackChunkName: "org" */'../Org')
);

export const routes: Array<RouteBranch> = [
  {
    path: '/user',
    component: UserView,
  },
  {
    path: '/org',
    component: OrgView,
    loadData: (store: Store) => {
      store.dispatch(
        orgGitHub.fetch({
          // fetch Data
        })
      )
    }
  },
];
```

`/user` won't be SSR-rendered, so naturally there's nothing for the server to fetch, and we skipped loadData for it.

Look at the `/org` route, though, and it takes a **store** and dispatches an action.
> Every piece of business logic in this project flows through action dispatch -> middleware -> store, so we kept it consistent with that.

The server is what hands this **store** in.

## 2. Updating server/app.tsx

Here's what needs to happen on the server:

1. Create a store.
2. Inspect the route and run whatever loadData work it needs.
3. Hand that result to the client.

Let's put all of this inside `handleRenderer`.

```tsx
const handleRender =(req, res) => {
  try {
    const appStore = getStore();

    loadBranchData(req.url)(appStore).then((data) => {
      if (data.every((data) => data === null)) {
        const config = getHtmlConfigs(req, appStore);
        const { html, webExtractor } = config;
        res.send(renderFullPage(webExtractor,html, {}));

        return;
      } 
    });
  } catch(e) {
    // error handling
  }
}
app.get('*', handleRender);
```

handleRenderer has to deal with two situations.

#### 1. When the client has no business logic to run

Here we just finish rendering and ship it to the client. We check for this case with `if (data.every((data) => data === null)`.

`loadData` returns null whenever it has nothing to do. So when every result from `loadData` comes back null, we **treat that as no work at all** and send the html straight back through `res.send`.

#### 2. When the client has business logic to run

```tsx
const handleRender = (req, res) => {
  try {
    const appStore = getStore();

    loadBranchData(req.url)(appStore).then((data) => {
      if (data.every((data) => data === null)) {
        // case 1
      }
      // case 2
      const unsubscribe = appStore.subscribe(() => {
        const config = getHtmlConfigs(req, appStore);
        const finalState = appStore.getState();
        const loadingKeys = Object.keys(finalState.loading);
        const { html, webExtractor } = config;
        const fetchState = new Array(loadingKeys.length).fill(false);

        loadingKeys.forEach((key: string, index: number) => {
          const isFetched = finalState.loading[key] !== HttpStatusCode.LOADING;

          fetchState[index] = isFetched;
        });
  
        const isAllFetched = fetchState.every((state) => state);
        if (isAllFetched) {
          unsubscribe();
          res.send(renderFullPage(webExtractor, html, finalState));

          return;
        }
      });
    });
  } catch(e) {
    // error handling
  }
};
```

Here's what's happening, step by step:

1. Once we dispatch the action, we **subscribe to the store** so we know when it changes, and wait for the actual data to land.
2. We build an array for fetchState, and mark an index true whenever that key's loading-reducer status, pulled from the store's finalState, isn't `HttpStatusCode.LOADING`.
3. Once every slot in that array is **true**, we `unsubscribe` from the store and send the html back.

This project keeps a dedicated [loading reducer](https://github.com/soYoung210/react-ssr-code-splitting/blob/master/client/src/store/_modules/loading.ts), which is why the code looks like this. Swap in whatever logic makes sense for checking fetchState in your own structure.

### loadBranchData

So what is `loadBranchData` actually doing?

```ts
// server/util.ts
import { MatchedRoute, matchRoutes } from 'react-router-config';
import { applyMiddleware, compose, createStore, Store } from "redux";
import root from 'window-or-global';

import { routes } from '@/routes/controller';
import epics from '@/store/epics';
import reducers from '@/store/reducers';

export const loadBranchData = (pathname: string) => (store: Store) => {
  // Get exact MatchedRoute.
  const branch: Array<MatchedRoute<any>> = matchRoutes(routes, pathname);

  const promises = branch.map(({ route }) => (
    route.loadData ? route.loadData(store) : Promise.resolve(null)
  ));

  return Promise.all(promises);
};
```

It takes pathname and store as arguments.

* **pathname**: finds whichever entry in the client's routes array matches the route express just got asked for, using react-router-config's `matchRoutes` to do the matching.
* **store**: the loadData functions defined on the client expect a store as an argument. We pass in the store the server built so that logic can actually run.

All of that work runs through [Promise.all()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise/all).

### getStore

```ts
// server/util.ts
export const getStore = () => {
  const epicMiddleware = createEpicMiddleware();
  const composeEnhancers = (root as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const appStore = createStore(reducers, composeEnhancers(applyMiddleware(epicMiddleware)));
  epicMiddleware.run(epics);

  return appStore;
};
```
This is basically the same code we already wrote for creating the store on the client.
> 🍿(spoiler): the client-side function that builds the store is about to change too.

## 3. Passing the initial store value to the client

So far the server only **runs the work the client declared and produces a result.** Now we actually need to get that result to the client.

Following Redux's [Server Rendering docs](https://redux.js.org/recipes/server-rendering), we'll attach the state the server built to a `window` variable and pass it along that way.

```ts
export const renderFullPage = (
  webExtractor: ChunkExtractor,
  html: string,
  preloadedState: RootStoreState | {},
) => {
  return(`
    <!DOCTYPE html>
      <html lang="ko">
        <head>
          <meta name="viewport" content="width=device-width, user-scalable=no">
          <meta name="google" content="notranslate">
          <title>soso template server</title>
          ${webExtractor.getLinkTags()}
          ${webExtractor.getStyleTags()}
        </head>
        <body>
          <div id="root">${html}</div>
          <script>
            window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g,'\\u003c')}
          </script>
          ${webExtractor.getScriptTags()}
        </body>
      </html>
  `)
}
```

The initial state the server produced now lives on `window.__PRELOADED_STATE__`.

## 4. Initializing the store with data from the server

Here's the client code that builds the store using that value.

```ts
import root from 'window-or-global';

export default (() => {
  const preloadedState = root.__PRELOADED_STATE__;

  delete root.__PRELOADED_STATE__;

  const epicMiddleware = createEpicMiddleware();
  const composeEnhancers = (root as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
    reducers, preloadedState, composeEnhancers(applyMiddleware(epicMiddleware))
  );
  epicMiddleware.run(epics);

  return store;
})();
```

> To work around [window is not defined](https://github.com/SoYoung210/react-ssr-code-splitting/issues/7), we reached for `window-or-global` and used `root` in place of window.

We read the state the server already prepared off the root (window) variable and hand it to the store as it's created. That's what lets us initialize with state the server built ahead of time.

## Checking it works

Everything we need is in place. Let's see it in action.
> This post doesn't include the full code, so I'd read it alongside [this PR](https://github.com/SoYoung210/react-ssr-code-splitting/pull/16).

```bash
npm start
```

Run that in your terminal and open the `/org` page.
![image](./images/ssr-full-content.png)
Before, only the header and a loading state ever came down the wire. Now the whole document arrives already filled with content.
Hit a given url, and you get back html with the content **already drawn in, no loader involved.**

Once you get here, though, a question creeps in: is skipping the loader entirely actually good UX?

So, **that's exactly what the last post in this tutorial digs into: SSR from a UX perspective.**
