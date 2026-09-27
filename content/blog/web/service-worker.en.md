---
title: 'A few things about ServiceWorker'
date: 2020-06-01 08:00:09
category: web
thumbnail: './images/service-worker/thumbnail.png'
---

![image-thumbnail](./images/service-worker/thumbnail.png)

ServiceWorker is a tool that lets web services support things like background sync and push notifications.

This post introduces service workers and takes a simple look at how to apply cache settings on top of CRA.

## What is a Service Worker?

A service worker is a script the browser runs in the background. It operates independently of the web page and only provides functionality that doesn't require the page or user interaction.

The service worker's lifecycle is **completely separate** from the web page's. It acts as a proxy server between the web service, the browser, and the network, and it lets the service keep working even while offline.

Because it exists separately from the web page, it comes with the following constraints:

1. A service worker is effectively nonexistent unless it's requested. There's no `.terminate()` command like the one in [Web Worker](https://developer.mozilla.org/ko/docs/Web/API/Web_Workers_API).
2. It doesn't follow the web page's life cycle. A service worker doesn't automatically deactivate just because the web page closes.
3. Since it exists separately from the web page, it can't access the DOM or window.

Given these constraints, a service worker can be put to use in the following ways:

### 1. Interacting with the cache

![interaction-with-cache](./images/service-worker/interaction-with-cache.png)

It can act as an intermediary for `fetch` events. In this case, the service worker delivers data from its own cache instead of requesting information over HTTP. As long as the cache isn't cleared, the browser can show information even without an internet connection.

### 2. Push notifications

![push-notification](./images/service-worker/push-notification.png)

Since it works even while the browser window is closed, it can be used to implement push notifications.

### 3. Background sync

![background-sync](./images/service-worker/background-sync.png)

If the computer goes offline in the middle of an action like sending a chat message or uploading a photo, that action can be completed once the computer comes back online.

![background-sync-example1](./images/service-worker/background-sync-example1.png)

If you send a '🐱🐱🐱' message while offline, it doesn't fail — instead, it completes once you're connected to the internet again, as shown below.

![background-sync-example2](./images/service-worker/background-sync-example2.png)

## Example: Cache setup (with CRA)

Let's take a simple look at how cache-related settings are applied in a service worker, and then see how this can be applied in a React project built on [CRA](https://create-react-app.dev/).

### Using a service worker

Before you can use a service worker, you first need to **register** it.

```jsx
if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
};
```

Once registration is complete, you can initialize the cache in the `install` event listener. First, create a variable to hold the cache name, and put the files you want to cache into a single array.

```jsx
const cacheName = 'helloCache'
const contentToChache = [
  '/static/main.bundle.js',
  '/static/main.bundle.css',
  '/static/favicon.ico',
];
```

You just need to write the caching setup inside the `install` event handler.

```jsx
self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');

  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log('[Service Worker] Caching all: contentToChache');

      return cache.addAll(contentToCache);
    })
  );
});
```

A service worker isn't installed until the code inside `waitUntil` finishes running. Since installing a service worker can take some time, a callback function is defined so this can be handled asynchronously.

`caches` is an object available within the service worker's code scope for storing data. [Web Storage](https://developer.mozilla.org/ko/docs/Web/API/Web_Storage_API) is synchronous, so this data can't be stored there. Instead, the Cache API is used.

On the next request, if a cached file exists, it's returned instead of making an additional request.

### Using cached files

When an HTTP request occurs in the service, the service worker can detect and handle that request.

```jsx
self.addEventListener('fetch', (e) => {
    console.log('[Service Worker] Fetched resource '+e.request.url);
});
```

The code below serves the cached file if the requested resource is actually cached, and adds it to the cache if it isn't.

```jsx {5,7,16,18}
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((r) => {
      // If a cached resource exists, return it
      return r || (
        // If not, go ahead with fetch
        fetch(e.request)
          .then((response) {
            return caches
              .open(cacheName)
              .then((cache) => {
                console.log(
                  '[Service Worker] Caching new resource: '+e.request.url
                );
                // Store the response in the cache
                cache.put(e.request, response.clone());
                // Return the response
                return response;
              });
          });
      )
    });
  );
}
```

It looks for the cached resource first, and if the resource doesn't exist, it makes an additional request, fetches it, and then stores the response in the cache.

### CRA's service worker setup

Projects created with CRA come with [service worker support](https://github.com/facebook/create-react-app/blob/c87ab79559e98a5dae2cd0b02477c38ff6113e6a/packages/react-scripts/config/webpack.config.js#L694) built in by default, through [Workbox](https://developers.google.com/web/tools/workbox).
> A [PR that adds options to allow for overrides to workbox-webpack-plugin](https://github.com/facebook/create-react-app/pull/5369) is in progress, but hasn't shipped yet, and given that it's a PR from 2018, it doesn't seem likely to be usable any time soon. So if you want to customize Workbox, you can configure it using [@craco/craco](https://www.npmjs.com/package/@craco/craco).

The `register` function checks things like whether the current environment is production, and runs service worker registration through a `load` event listener, as shown below.

```jsx
export function register(config?: Config) {
  if (process.env.NODE_ENV === 'development' && 'serviceWorker' in navigator) {
    const publicUrl = new URL(
      process.env.PUBLIC_URL,
      window.location.href
    );

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // Let's check if a service worker still exists or not.
        checkValidServiceWorker(swUrl, config);

        navigator.serviceWorker.ready.then(() => {
          console.log(
            'This web app is being served cache-first by a service ' +
              'worker. To learn more, visit https://bit.ly/CRA-PWA'
          );
        });
      } else {
        // Is not localhost. Just register service worker
        registerValidSW(swUrl, config);
      }
    });
  }
}
```

The `swUrl` this function references is the path to the `service-worker.js` file generated at build time.
![swUrl-build](./images/service-worker/swUrl-build.png)

A project created through CRA already has basic service worker settings in place.

`registerValidSW` in `src/serviceWorker` determines the service worker's run conditions and then executes it.

```ts {3,11,12,13,14,15}
function registerValidSW(swUrl: string, config?: Config) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // At this point, the updated precached content has been fetched,
              // but the previous service worker will still serve the older
              // content until all client tabs are closed.
              console.log(
                'New content is available and will be used when all ' +
                  'tabs for this page are closed. See https://bit.ly/CRA-PWA.'
              );

              // Execute callback
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              console.log('Content is cached for offline use.');

              // Execute callback
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch(error => {
      console.error('Error during service worker registration:', error);
    });
}
```

When the service worker's state is `installed`, if a service worker already exists on the [navigator object](https://developer.mozilla.org/ko/docs/Web/API/Navigator), it's stated that **the newly cached content will only be served once the current tab is closed and a new tab is opened — that is, once the runtime environment has been fully reset.** The reason is that Workbox doesn't refresh the cache manifest's `revision` value until a new tab is opened.

![precache-build](images/service-worker/precache-build.png)
Workbox composes the precache manifest by combining the `revision` value with `url` information. Since this information isn't refreshed until the tab is reopened, a simple page refresh alone can't show newly deployed content.
> You can find more details in the [Workbox Guide](https://developers.google.com/web/tools/workbox).

So, `index.html` should be excluded from the service worker's cached file list, so that new content can be picked up immediately even right after a deployment.

There's a [PR about custom Workbox configuration on the CRA GitHub repository](https://github.com/facebook/create-react-app/pull/5369), but it still hasn't been merged. You'll need to either change the [Workbox Webpack Plugin](https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin) settings using an option that lets you modify CRA's webpack config, such as [craco](https://www.npmjs.com/package/@craco/craco), or override the service-worker-related file settings using workbox-cli.

## Summary

We've taken a quick look at service workers and a cache example. If you add a Web App Manifest on top of your service worker setup, you can put together a simple [PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps). I think making good use of this can help overcome some of the limitations web apps currently have.

## Ref

- [https://developers.google.com/web/fundamentals/primers/service-workers?hl=ko](https://developers.google.com/web/fundamentals/primers/service-workers?hl=ko)
- [https://medium.com/@kosamari/service-worker-what-are-you-ca0f8df92b65](https://medium.com/@kosamari/service-worker-what-are-you-ca0f8df92b65)
- [https://serviceworke.rs/push-payload_demo.html](https://serviceworke.rs/push-payload_demo.html)
- [https://www.huskyhoochu.com/how-to-migrate-workbox/](https://www.huskyhoochu.com/how-to-migrate-workbox/)
