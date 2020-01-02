---
title: '[SSR] 3. SSR - Data Fetch'
date: 2019-12-07 14:12:97
category: react
---

![image-thumbnail](./images/thumbnail.png)

이 튜토리얼에 대한 전체 코드는 [여기](https://github.com/SoYoung210/react-ssr-code-splitting/pull/16)에서 보실 수 있습니다.

프로젝트를 만들면서 해결한 버그는 [이 곳](https://github.com/soYoung210/react-ssr-code-splitting/issues)에 정리되어 있습니다. `✈️ SSR` 라벨의 이슈를 참고해주세요.

## 다룰 내용

이번 포스트에서 할 일은 다음과 같습니다.

1. Client에서 필요한 비즈니스 로직을 명시합니다.
2. Server에서 1번에 정의된 동작을 수행합니다.
3. 2번의 결과를 client에 전달해줍니다.
4. Client에서는 받아온 데이터를 이용해서 store를 초기화 합니다.

## 1. react-router-config

client에서 수행하던 행동에 대한 정의가 server에게 공유되어야하기 때문에 기존에 route를 정의하는 방식을 변경하겠습니다. 먼저, 아래와 같이 `RouteBranch`인터페이스를 선언합니다.

```ts
export interface RouteBranch {
  path: string;
  exact?: boolean;
  component: React.ComponentType<any>;
  loadaData?: (params: any) => any;
  routes: Array<RouteBranch>;
}
```

route를 구성하는데에 필요한 요소들(path, component 등)을 정의하고 이 route에서 수행해야하는 **작업**을 loadData라는  함수로 명시했습니다.
> 추후 이 함수를 통해 server에서 비즈니스 로직을 수행합니다.

이제 이 프로젝트의 `route`를 모두 명시해줍니다.

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

`/user`route는 SSR로 렌더링 하지 않을것이고, 당연히 server에서 DataFetch할 작업도 없기때문에 loadData를 적어주지 않았습니다.

`/org`route 설정을 살펴보면 **store**를 받아서 action을 dispatch 합니다.
> 이 프로젝트에서 모든 비즈니스 로직은 action dispatch -> middleware -> store로 처리하고 있기 때문에 같은 방식으로 맞춰주었습니다.

이 **store**는 server로부터 전달받게 됩니다.

## 2. server/app.tsx 수정

server에서는 다음과 같은 작업을 수행할 것입니다.

1. store를 만들고
2. route를 검사해서 필요한 loadData작업을 수행한 다음,
3. 그 결과를 client에 넘겨준다.

이 작업들은 `handleRenderer`에서 진행해보겠습니다.

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

handleRenderer에서는 2가지 케이스를 다룹니다.

#### 1. Client에 명시된 비즈니스 로직이 없는 경우

이 경우 rendering만 완료해서 client에 넘겨주면 됩니다. 비즈니스 로직이 없는 경우는, `if (data.every((data) => data === null)` 구문을 통해 검사하게 됩니다.

`loadData`에서 수행할 작업이 없을시에 null을 반환하게 했습니다. 그러므로, `loadData에서` 결과가 모두 null일때는 **수행할 작업이 없는 것으로 판단**하고 `res.send`를 통해 html을 반환합니다.

#### 2. Client에 명시된 비즈니스 로직이 있는경우

```tsx
const handleRender = (req, res) => {
  try {
    const appStore = getStore();

    loadBranchData(req.url)(appStore).then((data) => {
      if (data.every((data) => data === null)) {
        // 1번의 경우
      }
      // 2번
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

이 코드를 몇 가지 단계로 설명해보면 다음과 같습니다.

1. action dispatch후, 실제 데이터가 올 때 까지 기다리도록(store의 변화를 알 수 있도록 **store를 구독합니다.**
2. fetchState를 저장하는 배열을 만들고, store의 finalState로 부터 가져온 loading reducer상태가  `HttpStatusCode.LOADING`가 아닐경우 true를 저장합니다.
3. 2번에서 만든 배열에 **모두 true**값이 채워진 경우 store를 `unsubscribe`해주고 html을 반환합니다.

이 프로젝트에서는 [loading reducer](https://github.com/soYoung210/react-ssr-code-splitting/blob/master/client/src/store/_modules/loading.ts)를 따로 두어서 위와같이 코드를 작성했습니다. 구조에 맞게 fetchState를 검사하는 로직을 추가하면 됩니다.

### loadBranchData

`loadBranchData`라는 함수는 어떤 역할을 하고 있을까요?

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

이 함수는 pathname과 store를 파라미터로 받습니다.

* **pathname**: client에 정의된 routes배열에서 현재 express로 요청된 route와 매칭되는 요소를 찾습니다. 매칭 요소를 찾는 것은 react-router-config에 있는 `matchRoutes`의 도움을 받습니다.
* **store**: client에서 만든, 비즈니스 로직을 처리하는 loadaData는 store를 받도록 되어 있습니다. 서버에서 만든 store를 client에게 넘겨주어 처리되도록 합니다.

필요한 일들을 [Promise.all()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)을 이용해 처리합니다.

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
기존에 client에서 store를 만들때 작성해준 코드를 동일하게 작성해줍니다.
> 🍿(스포): client에서 store를 만드는 함수가 수정됩니다.

## 3. Client에 초기 store값 전달

현재는 server에서 **client에 명시된 작업을 수행하고 결과를 만드는 것**까지만 수행했습니다. 이제 이 결과를 client에 넘겨주어야 합니다.

Redux의 [Server Rendering 문서](https://redux.js.org/recipes/server-rendering)를 참고해서 작성해보겠습니다. server에서 만든 state를 `window`변수에 담아 전달하게 됩니다.

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

` window.__PRELOADED_STATE__`에 server에 의해 생성된 초기 state를 저장합니다.

## 4. Server에서 받아온 데이터를 이용해서 Store초기화 하기

이 값을 이용해서 client에서 store를 만드는 코드를 살펴보겠습니다.

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

> [window is not defined](https://github.com/SoYoung210/react-ssr-code-splitting/issues/7)를 해결하기 위해 `window-or-global`를 사용해, window대신 `root`를 사용했습니다.

root(window)변수를 참조해서 server에서 미리 정의한 state를 가져오고 store를 만들때 같이 넘겨줍니다. 이 과정을 통해, server에서 미리 만든 state로 초기화가 가능해졌습니다.

## 확인

필요한 작업은 모두 끝났습니다.이제 확인해볼까요?
> 이 글에는 full code를 담지 않았으니 [이 PR](https://github.com/SoYoung210/react-ssr-code-splitting/pull/16)과 함께 보시는 것을 추천드립니다.

```bash
npm start
```

터미널에 위 명령을 입력하고 `/org`페이지로 접근해봅시다.
![image](./images/ssr-full-content.png)
기존에는 Header영역과 Loading영역만 내려왔다면, 이제는 Full Contents가 채워진 document가 내려오게 됩니다.
특정 url요청 시 **로더 없이** 바로 컨텐츠가 그려진 html이 내려오게 되는 것입니다.

이 단계까지 수행하고 나면, ‘로더 없이 바로 그려지는 상황이 과연 좋은 UX인가’에 대한 의문이 들 수 있습니다.

그래서, **이 튜토리얼의 마지막 글에서는 UX관점에서의 SSR에 대한 정리를 해보겠습니다.**
