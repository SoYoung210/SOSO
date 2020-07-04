---
title: 'about'
date: 2019-11-25 16:21:13
lang: 'ko'
thumbnail: ''
---

<h1 class='title'>
안녕하세요, 프론트엔드 엔지니어 <br/>
이소영 입니다.
</h1>

저는 이런 것들에 가치를 두고 있습니다.

- 최고의 고객 경험을 만들어 가는 것
- 확장성 있는 구조에 대한 고민
- 안정성 있는 프로젝트를 위한 테스트 작성
- 반복되는 일을 자동화 하여 생산성 높이기
- 기술을 통해 비즈니스 가치에 기여하는 일
- 지식과 경험 공유

|            |                              |
| :--------: | ---------------------------- |
| **GitHub** | <https://github.com/SoYoung210> |
| **Blog** | <https://so-so.dev> |
| **E-mail** | ethdud1@gmail.com            |

<h1>
<span class='highlight'>Work Experiences</span>
</h1>

## Banksalad

|              |                                                         |
| -----------: | ------------------------------------------------------- |
|   **period** | 18.12 ~ Current                                         |
| **position** | 웹 프론트엔드 개발자 |
| **projects** | 8주 안정화 프로젝트, CMS, Static Web Generator, Project Generator |

<h1>
<span class='highlight'>Interested In</span>
</h1>

## About 구조

프로젝트의 안정적인 구조가 비즈니스의 핵심 가치에 기여할 수 있다고 믿습니다. 대출 추천 재개발, MoneyFlow CMS 등 여러 서비스에 거쳐 구조 개선에 참여했습니다.

### 대출 추천 재개발

🗓: [Banksalad] 2020.01~2020.04

💻: *TypeScript*, *React*, *Redux*, *redux-saga, redux-toolkit*

기존 대출 추천 서비스는 모든 State를 하나의 컴포넌트에서 관리하고 있어, 기능 추가와 유지보수가 어려운 프로젝트였습니다. 지속적으로 고도화 되어야 하는 프로젝트라고 생각해, 프로젝트의 재개발을 제안하여 진행했습니다.

- components, domain, features 단위로 구성 된 플랫한 구조
- View와 Data를 분리하고 모든 비즈니스 로직을 redux middleware에서 처리.
- redux, redux-saga 적용 가이드를 공유하여 다른 프로젝트에도 적용

### MoneyFlow CMS

🗓: [Banksalad] 2019.09 ~ 2019.12

💻: *TypeScript*, *React*, *Redux*, *redux-saga*

MoneyFlow팀에서 사용하는 CMS입니다. 팀에서 사용하던 구조에서

- 팀에서 사용하던 [Clean Architecture](https://speakerdeck.com/soyoung210/clean-architecture-in-banksalad) 하고 상태관리 라이브러리를 도입한 첫 번째 프로젝트

> [발표자료](https://speakerdeck.com/soyoung210/heonjibjulge-saejibdao-riaegteu-peurojegteu-gujojojeong)

- 기존 구조는 Repository, Service 등 의존성 주입 구조였는데 이 구조에서는 변경사항이 있을 때 프로젝트를 빠르게 파악하기 어렵다고 판단하여 이 부분을 제거하였습니다.

## About 테스트

### 단위테스트

*Project*: 대출 추천 재개발, JS-Banksalad, web-scaffolding, etc.

🗓: [Banksalad] ~ 현재

💻: Storybook, testing-library

- 대출 추천 재개발 프로젝트에서 프론트엔드의 비즈니스 로직등을 redux-saga로 분리하며 각 흐름에 대해 테스트 코드를 작성했습니다.
- 모든 웹팀이 비즈니스 로직 흐름에 대한 테스트 코드를 작성할 수 있도록 테스트 코드 작성 가이드를 제공하였습니다.
- 이 외에 공통적으로 사용하는 util function등에 대해 '성공, 에러 반환, 극단 값, 이상한 값'등으로 나누어 테스트를 작성할 수 있도록 작성 가이드를 문서화 하였습니다.

### UI Test

*Project*: 대출 추천 재개발, JS-Banksalad, web-scaffolding, etc.

🗓: [Banksalad] ~ 현재

💻: Storybook, testing-library

복잡한 사용자의 조건, 상황을 다루는 서비스에서 Storybook을 도입하여 문서화와 UI Test를 작성하였습니다.

- 페이지 단위로 스토리를 구성함으로서 사용자 조건에 따라 보여져야 하는 조건 정리
- 디바이스별로 화면이 깨지지 않는 지, 극한 값이 들어왔을 때 이 값이 잘 처리 되는지 검증

## About Performance & Infra

뱅크샐러드 8주 안정화 프로젝트에서 전사적으로 기술 부문의 안정화 프로젝트를 진행했고, Web팀에서 다음과 같은 일을 진행했습니다.

### Android / iOS 앱 내 웹뷰 [TTI](https://web.dev/interactive/) 개선

🗓: [Banksalad] 2019.08 ~ 2019.11

💻: SSR, Code Splitting, Chrome LightHouse

- LightHouse기준(Slow 4G)40점에서 87점까지 향상.
- Round Trip을 고려한 Code Splitting Guide 수립.
- SSR이 필요한 프로젝트 예시와 예시 코드를 통한 React에서의 SSR 가이드 수립.

*> 관련 저장소: <*<https://github.com/SoYoung210/react-ssr-code-splitting>*>*

### 웹 기반 서비스 [IaC](https://en.wikipedia.org/wiki/Infrastructure_as_code) 관련 가이드 수립

🗓: [Banksalad] 2019.08 ~ 2019.11

💻: Kubernetes, Nginx, GitHub Actions

- Kubernetes, Nginx 등 뱅크샐러드의 웹 기반 서비스들이 어떤 구조로 운영되고 있고, 어떻게 변경/개선 되는지 도식화 하여 문서 작성
- 웹 서비스에 사용하고 있던 legacy 설정 파일을 수정하고, 불필요하게 사용하고 있던 reverse proxy 세팅 제거

## About 자동화, 사내 라이브러리

웹팀이 효율적으로 일할 수 있도록 자동화와 사내 라이브러리 구축에 기여했습니다. ~~BPL(Banksalad Product Language)과 웹팀에서 공통으로 사용하는 util function들과 custom hooks를 관리하기 위한 JS-Banksalad를 관리중 입니다.~~

### BPL + UI 전면 개편

🗓: [Banksalad] 2020.03 ~ 2020.06

💻: emotion, tailiwndcss, rollup, recharts

- 디자인, AND, iOS팀과 함께 디자인 시스템 설계 및 구현
- 번들 사이즈 최적화를 통해 사이즈 30% 감소
- 디자인 시스템 구축 후 투자 추천 서비스에 적용하여 2.0 UI로 개편

### JS-Banksalad

공통적으로 사용하는 Util Function을 제공하는 라이브러리.

🗓: [Banksalad] 2020.06 ~ 현재

💻: lerna, rollup, TypeScript

- mono repo기반으로 여러가지 패키지 관리 ([설정](https://so-so.dev/pattern/mono-repo-config/))

### 프로젝트 스캐폴딩(web-baedal)

웹 프로젝트에 필요한 webpack, babel등의 설정파일을 포함한 프로젝트 전체 구조를 스캐폴딩 할 수 있는 도구.

🗓: [Banksalad] 2019.12

- cli를 통해 standard, standard-redux등 원하는 구조 선택.
- 프로젝트 셋팅에 소요되는 시간을 5초로 단축

### 브릿지 페이지 제작 도구

🗓: [Banksalad] 2019.08 ~ 2019.11

💻: S3 API

개발자 없이 마케팅 팀에서 빠르게 정적 페이지를 생성할 수 있도록 하는 도구입니다. 배너 이미지와 버튼으로 구성 된 HTML을 만들어주는 도구를 제작했습니다.

- S3 Image Upload
- title, button position등에 대한 커스텀 제공
- [Demo Image](https://speakerdeck.com/soyoung210/jeolmang-deuribeun-seongjang-hamgge-ilhago-sipeun-gaebaljaga-doegiggaji?slide=44)

<h1>
<span class='highlight'>Communities</span>
</h1>

## Presentations

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

## Activity

### [FEConf Organizer](https://2019.feconf.kr/)

|                 |                                                                                       |
| --------------: | ------------------------------------------------------------------------------------- |
|      **period** | 18.06. ~ current.                                                                     |
| **description** | 페이스북 그룹인 '프론트엔드 개발 그룹'의 운영진이며 FEConf라는 컨퍼런스의 오거나이저. |

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
