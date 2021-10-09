---
title: immutable.wedding 개발후기
date: 2021-10-09 17:01:21
category: essay
thumbnail: './images/immutable-wedding-epilogue/thumbnail.jpg'
---

![image-thumbnail](./images/immutable-wedding-epilogue/thumbnail.jpg)

2021년 10월 23일 결혼을 앞두고 개인적으로 사용할 모바일 청첩장과 함께 [immutable.wedding](http://immutable.wedding)이라는 모바일 청첩장 템플릿을 만들었습니다. COVID-19상황이 악화되면서 결혼식은 취소했지만, 청첩장 개발 후기를 적으며 아쉬운 마음을 달래봅니다.

- [🔗 GitHub Repository](https://github.com/soyoung210/immutable.wedding)
- [🐝 나의 immutable.wedding](https://immutable-wedding-git-js-weddinglog-soso02.vercel.app/)

## 진행방식

마감 기한이 명확했던 프로젝트인 만큼, task관리가 중요하다고 생각했습니다. 프로젝트 참여인원이 두명이었기 때문에 너무 무거운 tool은 지양했습니다.

![slack_task](./images/immutable-wedding-epilogue/slack_task.jpg)

같이 사용하는 슬랙에서 해야할 일들을 메세지로 올리고 완료 시 ✅ 이모지를 다는, 아주 간단한 방식으로 이슈를 관리했습니다.

### 역할분담

디자인 및 일정 관리, 필요한 리소스 모으기, 필요할 때 개발 Help등.. PO는 함께하는 동료가 맡아주었고, 저는 거의 개발에만 집중했습니다. 단기 프로젝트였지만 주중에 낼 수 있는 시간이 둘 다 많지 않았기 때문에 명확하게 역할을 구분해서 서로의 영역에 집중하는 방식으로 진행했습니다.

### 고려한 것, 고려하지 않은 것

![figma_design_board](./images/immutable-wedding-epilogue/figma_design_board.png)

디자인 Board에서 알 수 있듯... 전체 컨셉은 인스타그램입니다. 바닥부터 디자인을 해봤는데..

![figma_design_board_old](./images/immutable-wedding-epilogue/figma_design_borad_old.png)

백지에서 그리려니 정말 어려웠습니다.

한정된 기간 내에서 바닥부터 디자인을 잡기는 어렵다는 판단하에, 디자인 템플릿을 사용하기로 했고 **"우리의 이야기를 잘 보여줄 수 있는 컨셉"**의 디자인을 고민하다가 인스타그램 디자인을 차용하게 되었습니다.

그래도 사이드 프로젝트인 만큼 평소에 도전해보고 싶었던 영역에 대한 도전도 있었습니다. 수용 가능한 이질감 범위 내의 새로운 기술들도 사용해보고, 애니메이션에 대한 여러 가지 도전을 해봤습니다. (더 자세한 이야기는 '기술' 편에서..)

## 구현 이야기

예전부터 눈여겨보고 있던 [framer-motion](https://www.framer.com/motion/), [stitches.js](https://stitches.dev/) 와 약간의 svg사용, 그리고 여러 오픈소스 디자인 시스템의 내부 구현을 살펴보며 가능한 많은 기능들을 직접 구현하면서 '수용가능한 이질감 범위'내에서의 도전을 했습니다.

처음엔 [tailwindcss](https://tailwindcss.com/)와 [twin.macro](https://github.com/ben-rogerson/twin.macro) 를 사용했었는데, 프로젝트에서 이미 사용해본 조합이었기 때문에 [중간에 stitches.js로 migration](https://github.com/SoYoung210/immutable.wedding/pull/10)했습니다. (참고: [tailwind + twin.macro 블로그 글](https://so-so.dev/web/tailwindcss-w-twin-macro-emotion/))

### 시도해 본 것들

하단 Toast를 띄우는 데에 사용되는 [useNotificationState](https://github.com/SoYoung210/immutable.wedding/blob/456d9ab020/src/components/notification/useNotificationState.ts)는 [Matine](https://mantine.dev/)의 내부 패턴들을 살펴보며 직접 구현했습니다. 잘 만들어진 오픈소스를 그냥 사용하는 것도 좋은 선택이었겠지만, 내부 구현과 인터페이스를 살펴보며 어떤 코드로 동작하는지 많이 이해할 수 있었고 일부 코드를 변형하면서 좋은 api를 만들어 두기 위해 고민했습니다.

이 밖에도,  [Image](https://github.com/SoYoung210/immutable.wedding/blob/456d9ab020/src/components/image/index.tsx) 나 [ListItem](https://github.com/SoYoung210/immutable.wedding/blob/456d9ab020/src/components/list/ListItem.tsx)컴포넌트등에서 의도적으로 그동안 잘 사용하지 않았던 prop design을 사용해봤습니다. 대체로 다 편리하다는 감상이었지만, 프로젝트의 특성상 다양한 요구사항을 수용하며 발전되는 형태가 아니었기 때문에 확실한 판단은 어려울 것 같네요. 😅

### 애니메이션들

![heart_animation](./images/immutable-wedding-epilogue/heart_animation.gif)

1초도 안되는 짧은 애니메이션이지만, 이 애니메이션에 대략 하루 정도의 시간을 사용했던 것 같습니다. css부터 애니메이션 sequence, 스파클의 적용 범위, 타이밍 등의 요소를 고민하느라 이 프로젝트에서 두 번째로 손이 많이갔던 부분이었습니다. 전체적으로 stitches.js를 사용했지만, 이 부분은 디테일한 애니메이션 잡기가 어려워 [sass](https://sass-lang.com/documentation)를 사용했습니다. 

[🔗 LikeIcon Component](https://github.com/SoYoung210/immutable.wedding/blob/456d9ab020/src/pages/feeds/components/feed/icon/LikeIcon.tsx)


![check_animation](./images/immutable-wedding-epilogue/check_animation.gif)

원이 그려지고 체크 표시가 되는 애니메이션에는 대략 2~3일이 걸렸는데, 인스타그램 디자인 템플릿에서 제공된 아이콘이 원하는 애니메이션에 적합한 형태가 아니었기 때문에 직접 제작까지 하면서 생각보다 많은 시간이 소요됐습니다.

![check_icon_figma](./images/immutable-wedding-epilogue/check_icon_figma.png)

raw한 svg에서 애니메이션을 구성해 본 경험이 많이 없어서 헤맨 부분이기도 한데, 이 애니메이션을 구현하면서 간단히 svg구성 요소와 동작 방식에 대해 mdn문서와 책을 살펴보며 공부했던 계기(?)가 되기도 했습니다.


![pagination_animation](./images/immutable-wedding-epilogue/pagination_animation.gif)
<video style="width:100%;" poster="" controls="true" allowfullscreen="true">
  <source src="./images/immutable-wedding-epilogue/paginate_animation_video.mp4" type="video/mp4">
</video>

페이지 전환 애니메이션에 가장 많은 시간이 소요됐습니다. (그러나 아직도 존재하는 버그..)

framer-motion api와 예제들을 많이 찾아보면서 컨텐츠를 넘기는 느낌을 비슷하게 구현했는데, 모바일에서 스크롤 이동이나 포지션 컨트롤이 어려워서 완성도 있게 구현하지는 못했습니다. 언젠가 이 모바일 청첩장을 다시 사용하게 된다면 제일 먼저 손볼 부분이 될 것 같습니다. (PR도 환영.. 🙌)

[🔗 highlight page](https://github.com/SoYoung210/immutable.wedding/blob/main/pages/highlights/%5Bid%5D.tsx)

### 그 밖의 이야기

'사이드 프로젝트'인 만큼 일부러 낯선 영역을 만들고 언제는 모래주머니를 스스로 차면서 회사 업무에서는 쉽게 시도해보지 못했던 부분들에 대해 도전할 수 있었습니다.

한정된 시간 내에서 진행하다 보니 세부적인 ux나 큰 맥락의 부분은 아쉬운 점들이 있지만, 모든 프로젝트가 그렇듯 조금씩 보완하며 더 좋은 모습이 될 수 있을거라 생각합니다. (COVID-19사태가 끝나는 시점에 다시 열어볼 것 같네요🥲)

이 프로젝트의 데모는 [여기](https://immutable-wedding-git-js-weddinglog-soso02.vercel.app/)서 확인하실 수 있습니다.

## 맺으며

디자인과 컨텐츠 기획, 개발에도 기여해준 동료에게 고마움을 전하며 글을 마무리합니다.

이 프로젝트의 또 다른 주인공이자 영원한 동료, 그리고 가장 친한 친구인 [Jbee](https://jbee.io/)님께 고마움과 사랑을 전합니다.
