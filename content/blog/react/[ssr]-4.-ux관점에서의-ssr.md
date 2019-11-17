---
title: '[SSR] 4. UX관점에서의 SSR'
date: 2099-11-13 23:11:00
category: react
---

![image-thumbnail](./images/thumbnail.png)
SSR을 이용해서 두 가지 상황을 구현해보았습니다. 두 번째 글이 첫 번째보다 조금 어려웠다고 생각되는데요, 과연 어려운만큼 좋은 UX를 구현한것일까요?
제 대답은 ‘그렇지 않다.’ 입니다.

## 사용자 관점

SSR - Data Fetch(링크)의 방법으로 요청했을 때 어떤 일이 벌어지는지 그림으로 살펴봅시다.
![user-ssr-data-fetch](./images/user-ssr-data-fetch.png)
특정 url에 대해 express에 요청이 가고, api fetch후 contents를 그린 html을 클라이언트에게 내려주기 전까지 사용자는 흰 화면만 보게 됩니다. api call이 오래 걸릴 경우 사용자가 흰 화면을 보는 시간은 그만큼 길어지게 됩니다. 이는 좋은 UX라고 보기 어렵습니다.

> 컨텐츠가 담겨진 html자체를 `redis`등을 이용해서 캐싱처리 할 경우 이 속도가 빨라져 실제로 UX에 긍정적인 영향을 끼칠 가능성이 높습니다. 하지만, 이번 튜토리얼에서는 Redis까지 시도해보지 못했고, 따라서 본 문서에서 다루지 않습니다.

이 방식을 조금 바꿔서, server에서는 ap호출을 수행하지 않고 client의 로더 혹은 header영역만 그려서 빠르게 전달해줍니다. 이후 로직 처리는 client에 위임하는 방식으로 변경합시다.(2번째 글 링크)
![user-ssr-no-data-fetch](./images/user-ssr-no-data-fetch.png)

사용자는 빠르게 콘텐츠를 볼 수 있게 되었습니다. 그림에는 큰 글씨의 Loading으로 표현했지만 스켈레톤 view등을 활용하면 조금 더 나은 UX로 나아갈 수 있습니다.

그리고, 이 방법은 App에 배포될 시(앱내 웹뷰) 더 장점을 가지게 됩니다.
![user--no-cache](./images/user-ssr-no-cache.png)

첫 번째 방법으로 할 시에 Client에서 받는 것은 html이므로 App에서 캐싱이 적용되지 않습니다.

> WK Webview 캐싱에 대해 좀더 조사해서 아티클을 걸거나 설명을 추가하기

![user--cache](./images/user--cache.png)
두 번째 방식으로 진행 시 client rendering에 필요한 일부 bundle을 받아오는 작업이 캐싱될 수 있습니다.(WK Webview default설정) 당연히, express에서 bundle을 받는것보다 빠르게 진행될 수 있습니다.

## 단점만 있는 것은 아니다.

하지만, 마냥 단점만 있는것은 아닙니다. 위 사항을 다르게 이야기 해보면, Client에서는 늘 express의 상황에만 의존하게 된다는 것입니다. 한번, **Low tier 디바이스**의 상황을 가정해봅시다.
~Full Contents를 내려받는 방식~
모든 요청과 api call이 express에서 이루어지므로, 유저가 컨텐츠를 받는 속도의 변수는 오직 ‘네트워크 환경’과 express의 스펙입니다.(서버의 CPU등) express의 CPU보다 좋지 않은 CPU를 가진 디바이스에서는 기존의 방식보다 빠르게 컨텐츠가 로드 될 수 있습니다.

~SSR + CSR~
컨텐츠를 내려 받는 속도에서 중요한 요인은 유저가 연결된 네트워크와 디바이스 스펙입니다.
저사양의 디바이스에서는 두 가지 요소 모두 좋지 않으니 컨텐츠 로딩 속도가 매우 느립니다. 이 경우 express에서 모든 컨텐츠를 내려받는것이 좋습니다.

## 이 튜토리얼을 끝마치며

`Next.js`없이 달려온 SSR구현이 끝났습니다.
