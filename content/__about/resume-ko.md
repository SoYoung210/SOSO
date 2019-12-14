---
title: 'about'
date: 2019-11-25 16:21:13
lang: 'ko'
---

<article class="l-Wrapper">
  <div class="l-Header">
    <h1 class="Title">
      <span class="u-shadow">
        SOYOUNG LEE
      </span>
    </h1>
  </div>

<br/>

웹 프론트엔드 개발자 이소영입니다.  
React를 주로 다루며, 문서화와 구조, 그리고 UX에 관심이 많습니다.

`#TypeScript` `#React` `#RxJS` `#Redux` `#Documentation` `#Architecture`

|            |                              |
| :--------: | ---------------------------- |
| **GitHub** | https://github.com/SoYoung210 |
| **Blog** | https://so-so.dev |
| **E-mail** | ethdud1@gmail.com            |

  </div>

<div class="l-Header">
  <h1 class="Title">
    <span class="u-shadow">
      Work Experiences
    </span>
  </h1>
</div>

<a class="u-link" href="https://rainist.com" target="_blank">Rainist</a>

|              |                                                         |
| -----------: | ------------------------------------------------------- |
|   **period** | 18.12 ~ Current                                         |
| **position** | 웹 프론트엔드 개발자 |
| **projects** | 8주 안정화 프로젝트, CMS, Static Web Generator, Project Generator |

<div class="l-Header">
  <h1 class="Title">
    <span class="u-shadow">
      Tech Experiences
    </span>
  </h1>
</div>

## 8주 안정화 프로젝트

전사적으로 기술 부문의 안정화 프로젝트를 진행했고, Web팀에서 다음과 같은 일을 맡아서 진행했습니다.

* TTI개선(19.08 ~ 19.11)
  * LightHouse기준(Slow 4G)40점에서 87점까지 향상.
  * Round Trip을 고려한 Code Splitting Guide수립.
  * SSR이 필요한 프로젝트 예시와 예시 코드를 통한 React에서의 SSR 가이드 수립.
  > 관련 저장소: https://github.com/SoYoung210/react-ssr-code-splitting

* Web팀용 iac관련 가이드 수립
  * k8s, nginx등 현재 팀의 웹서비스가 어떤 구조로 운영되고 있고, 어떻게 변경되는지 도식화 하여 문서 작성
  * 웹서비스에 사용하고 있던 legacy설정 파일을 수정하고, 불필요하게 사용하고 있던 reverse proxy제거

## CMS

* 19.03~ 19.06
* *TypeScript*, *React*, *Redux*, *redux-observable*
* [기존에 사용하던 구조](https://speakerdeck.com/soyoung210/clean-architecture-in-banksalad)가 수정에 용이하지 않다는 문제를 인식하고, redux를 도입한 [새로운 구조](https://speakerdeck.com/soyoung210/heonjibjulge-saejibdao-riaegteu-peurojegteu-gujojojeong)도입.
  * 불필요한 의존성 주입 구조 개선

* 기획, 디자인, 개발 진행
  * 기획: End User인 cm팀과 협업하여 상담에 편리한 cms기획
  * 디자인: [ant.desing](https://ant.design/)을 활용하여 디자인
  * 개발: 팀내에서 사용해보지 않았던 redux와 redux-middleware를 도입하고 해당 내용을 공유

## Project Generator

웹 프로젝트에 필요한 webpack, babel등의 설정파일을 포함한 프로젝트 전체 구조를 스캐폴딩 할 수 있는 도구.

* cli를 통해 standard, standard - redux등 원하는 구조 선택.
  * 프로젝트 빌드에 소요되는 시간을 5초로 단축
  * 신규 입사자를 위한 구조 설명 도구로 활용

## Static Web Generator(CMS)

이미지와 버튼으로 구성된 HTML을 만들어주는 도구.

* S3 Image Upload
* title, button position등 필요한 정보 입력
* [UI](https://speakerdeck.com/soyoung210/jeolmang-deuribeun-seongjang-hamgge-ilhago-sipeun-gaebaljaga-doegiggaji?slide=44)

<div class="l-Header">
  <h1 class="Title">
    <span class="u-shadow">
      Projects
    </span>
  </h1>
</div>

## soso-tip

- GitHub Repository Link: https://github.com/SoYoung210/soso-tip

개발프로젝트는 아닙니다. 개발과정에서 만났던 이슈를 기록하고, 공유하는 용도의 저장소 입니다.  
같은 실수를 반복하는 경험을 줄일 수 있고, 실수한 내용을 정리하는 과정에서 완벽히 이해할 수 있다고 생각합니다.

<div class="l-Header">
  <h1 class="Title">
    <span class="u-shadow">
      Activities
    </span>
  </h1>
</div>

<h2 class='u-link zero'>Presentation</h2>

### [절망 드리븐 성장: 함께 일하고 싶은 개발자가 되기까지](https://speakerdeck.com/soyoung210/jeolmang-deuribeun-seongjang-hamgge-ilhago-sipeun-gaebaljaga-doegiggaji)

_[2019.12.13]_
'2019 한빛 데브그라운드 주니어' 행사에서 발표한 내용입니다.
웹 공부를 시작할때부터 인턴, 그리고 지금까지 겪었던 절망과 그 절망에서 얻었던 성장을 공유합니다.

### [헌집줄게, 새집다오 - FEConf2019](https://speakerdeck.com/soyoung210/heonjibjulge-saejibdao-riaegteu-peurojegteu-gujojojeong)

_[2019.10.26]_
기존에 사용하던 구조에서 벗어나 새로운 구조를 도입하는 과정에 대한 과정을 소개합니다.

### [Clean Architecture in Banksalad - XXIT Tech Talk](https://speakerdeck.com/soyoung210/clean-architecture-in-banksalad)

_[2019.10.05]_
'Clean Architecture in Banksalad'에 대한 발표입니다.

### [ConSalad - 4th Technical Conference in Rainist](https://speakerdeck.com/soyoung210/susuggeggiro-sugseongdoen-banana)

_[2019.06.15]_
Rainist의 기술 컨퍼런스에서 발표한 내용입니다. 인턴 과정 이후 좋은 협업에 대해 고민한 내용을 공유합니다.

### [인턴상륙작전 - GDG WebTech LightningTalk](https://speakerdeck.com/soyoung210/inteonsangryugjagjeon)

_[2019.02.19]_
학부생에서 어떻게 처음 인턴개발자로 상륙했는지에 대한 내용을 공유합니다.

<h2 class='u-link zero'>Communities</h2>

### [For.D Organizer](https://www.facebook.com/ForDeveloperKorea/)

|             |                                                                                                                                                                                                                                                    |
| ----------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|      period | 17.12 ~ current                                                                                                                                                                                                                                    |
| description | 주니어 개발자 커뮤니티입니다. 학부생에서 주니어 개발자가 되기까지 겪었던 어려움을 다른 분들은 덜 겪었으면 하는 마음에서 커뮤니티를 운영하고 있습니다. 나에게 어려웠던점은 누구에게도 어려울 수 있다는 생각에 경험과 어려움을 많은 사람들이 나누는 문화를 만들고 싶습니다.  |

### [Django Girls Seoul](https://djangogirls.org/seoul/)

|             |                                                                                  |
| ----------: | -------------------------------------------------------------------------------- |
|      period | 18.04. ~ 19.04.                                                                  |
| description | 여성이 개발 분야로 나아가는 것을 돕는 '장고걸스 서울'의 운영진으로 활동하였습니다. |

### [Coding Club Teacher](http://codingclubs.org/)

|             |                                                                                                                                                    |
| ----------: | -------------------------------------------------------------------------------------------------------------------------------------------------- |
|      period | 16.02 ~ 16.09                                                                                                                                      |
| description | 아이들에게 소프트웨어로 무엇이든 만들 수 있다는 철학으로 교육을 펼치는 '코딩클럽'의 청년샘 2기로 활동하였습니다. |
