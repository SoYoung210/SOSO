---
title: 'about'
date: 2019-11-25 16:21:13
lang: 'ko'
thumbnail: './resume_thumbnail.png'
---

<h1 class='title'>
안녕하세요, 프론트엔드 엔지니어 <br/>
이소영 입니다.
</h1>

**저는 이런 것들에 가치를 두고 있습니다.**

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

<h2 class='no-border'>Banksalad </h2>

|              |                                                         |
| -----------: | ------------------------------------------------------- |
|   **period** | 18.12 ~ current                                         |
| **position** | Engineering Foundation 웹 프론트엔드 개발자 |
| **projects** | BPL(Design System), 대출 추천 서비스, 투자 추천 서비스 2.0 |

<h1>
<span class='highlight'>Interested In</span>
</h1>

## About 구조

프로젝트의 안정적인 구조가 비즈니스의 핵심 가치에 기여할 수 있다고 믿습니다. 대출 추천 재개발, MoneyFlow CMS 등 여러 서비스에 거쳐 구조 개선에 참여했습니다.

### 대출 추천 재개발

🗓: [Banksalad] 2020.01~2020.04

💻: *TypeScript*, *React*, *Redux*, *redux-saga, redux-toolkit*

// TODO: 나중에 좀더 읽어보기. 재개발 후 좋아진 점 넣기..

비즈니스적으로 중요한 지표를 담당하는 프로젝트이기 때문에 재개발을 제안하여 진행.

- View와 Data를 분리하고 모든 비즈니스 로직을 redux middleware에서 처리.
- redux, redux-saga 적용 및 가이드 공유

### MoneyFlow CMS

🗓: [Banksalad] 2019.09 ~ 2019.12

💻: *TypeScript*, *React*, *Redux*, *redux-observable*

MoneyFlow팀에서 사용하는 CMS.

// TODO: 문제점 진단 및 공유(주도성)를 한 단어로 정리해서 수정하기

- [기존 프로젝트 구조](https://speakerdeck.com/soyoung210/clean-architecture-in-banksalad)의 문제점을 제기하고 새로운 구조를 도입한 프로젝트.

- 상태관리 라이브러리 도입([발표자료](https://speakerdeck.com/soyoung210/heonjibjulge-saejibdao-riaegteu-peurojegteu-gujojojeong))

## About 테스트

// TODO: 테스트 인트로 문장 쓰기, 프로젝트 이름 통일

### 단위 테스트

🗓: [Banksalad] ~ 현재

💻: Jest, testing-library

- 대출 추천 서비스 재개발 프로젝트에서 프론트엔드의 비즈니스 로직을 redux-saga로 분리하고 각 로직에 대한 테스트 코드를 작성.
- 모든 웹팀이 비즈니스 로직에 대한 테스트 코드를 작성할 수 있도록 테스트 코드 작성 가이드를 제공.
- 이 외에 공통적으로 사용하는 공통 함수 등에 대해 '성공, 에러 반환, 극단 값, 이상한 값'등으로 나누어 테스트를 작성할 수 있도록 작성 가이드를 문서화.

### UI Test

// TODO: State mocking값에 따라 Story 구성. 문장 다듬기

🗓: [Banksalad] ~ 현재

💻: Storybook, testing-library

복잡한 사용자의 조건, 상황을 다루는 서비스에서 Storybook을 도입하여 문서화와 UI Test를 작성하였습니다.

- Storybook addon을 제작하여 State mocking값에 따라 Story 구성.
- 페이지 단위로 Story를 구성하고 사용자 조건에 따라 보여져야 하는 화면 정리
- [addon-viewport](https://www.npmjs.com/package/@storybook/addon-viewport)를 사용하여 디바이스에 따른 화면 테스트.

## 📌TODO

Pef & Infra가 조금 빈약한 것 같기도 해서 밑에 자동화랑 묶어서 About 플랫폼 엔지니어링(가제)으로 묶는 것은 어떨 지 고려.

## About Performance & Infra

뱅크샐러드 8주 안정화 프로젝트에서 전사적으로 기술 부문의 안정화 프로젝트를 진행했고, Engineering Foundation에서 TTI개선과 IaC 프로젝트를 진행했습니다.

### Webview [TTI](https://web.dev/interactive/) 개선

🗓: [Banksalad] 2019.08 ~ 2019.11

💻: SSR, Code Splitting, Chrome LightHouse

- LightHouse기준(Slow 4G)40점에서 87점까지 향상.
- Round Trip을 고려한 Code Splitting Guide 수립.
- SSR이 필요한 프로젝트 정리 및 React에서의 SSR 가이드 수립.
  - [관련 저장소](https://github.com/SoYoung210/react-ssr-code-splitting)

### 웹 서비스 [IaC](https://en.wikipedia.org/wiki/Infrastructure_as_code) 가이드 수립

🗓: [Banksalad] 2019.08 ~ 2019.11

💻: Kubernetes, Nginx, GitHub Actions

- Kubernetes, Nginx 등 뱅크샐러드의 웹 서비스들이 어떤 구조로 운영되고 있고, 어떻게 변경/개선 되는지 도식화 하여 문서 작성
- GitHub Actions활용한 CI/CD구성

## About 자동화, 사내 라이브러리

웹팀이 효율적으로 일할 수 있도록 자동화와 사내 라이브러리 구축에 기여했습니다.

### BPL

🗓: [Banksalad] 2020.03 ~ 2020.06

💻: emotion, tailwindcss, rollup, recharts

디자인, AND, iOS팀과 함께 BPL(Banksalad Product Language)디자인 시스템 설계 및 구현

// TODO: 번들 사이즈 버전 히스토리 (몇에서 몇인지) 추가

- 번들 사이즈 최적화를 통해 사이즈 30% 감소
- 디자인 시스템 구축 후 투자 추천 서비스에 적용하여 2.0 UI로 개편
  - TODO: 3배..는 고민해보기.

### JS-Banksalad

🗓: [Banksalad] 2020.06 ~ 현재

💻: lerna, rollup, TypeScript

- 프로젝트에서 중복으로 만들어 사용하고 있던 공통 함수들을 하나의 라이브러리로 제공
- mono repo기반으로 여러가지 패키지 관리 ([설정](https://so-so.dev/pattern/mono-repo-config/))

### 프로젝트 스캐폴딩(web-baedal)

🗓: [Banksalad] 2019.12

webpack, babel등의 설정파일을 포함한 프로젝트 전체 구조를 스캐폴딩 할 수 있는 도구입니다.

- cli를 통해 standard, standard-redux 등 원하는 구조 선택.
- 프로젝트 셋팅에 소요되는 시간을 90분에서 5초로 단축

### 브릿지 페이지 제작 도구

🗓: [Banksalad] 2019.08 ~ 2019.11

💻: S3 API

마케팅 팀에서 개발자 없이 빠르게 정적 페이지를 생성할 수 있도록 하는 도구입니다. 배너 이미지와 버튼으로 구성 된 HTML을 만들어 줍니다.

- S3 Image Upload
- title, button position등에 대한 커스텀 제공
- [Demo Image](https://speakerdeck.com/soyoung210/jeolmang-deuribeun-seongjang-hamgge-ilhago-sipeun-gaebaljaga-doegiggaji?slide=44)

<h1>
<span class='highlight'>Communities</span>
</h1>

## Presentations

- [절망 드리븐 성장: 함께 일하고 싶은 개발자가 되기까지](https://speakerdeck.com/soyoung210/jeolmang-deuribeun-seongjang-hamgge-ilhago-sipeun-gaebaljaga-doegiggaji)  
[2019.12.13] '2019 한빛 데브그라운드 주니어' 행사에서 발표한 내용입니다. 웹 공부를 시작할때부터 인턴, 그리고 지금까지 겪었던 절망과 그 절망에서 얻었던 성장을 공유합니다.

- [헌집줄게, 새집다오 - FEConf2019](https://speakerdeck.com/soyoung210/heonjibjulge-saejibdao-riaegteu-peurojegteu-gujojojeong)  
[2019.10.26]
기존에 사용하던 구조에서 벗어나 새로운 구조를 도입하는 과정에 대한 과정을 소개합니다.

- [Clean Architecture in Banksalad - XXIT Tech Talk](https://speakerdeck.com/soyoung210/clean-architecture-in-banksalad)  
[2019.10.05]
'Clean Architecture in Banksalad'에 대한 발표입니다.

- [ConSalad - 4th Technical Conference in Rainist](https://speakerdeck.com/soyoung210/susuggeggiro-sugseongdoen-banana  )  
[2019.06.15]
Rainist의 기술 컨퍼런스에서 발표한 내용입니다. 인턴 과정 이후 좋은 협업에 대해 고민한 내용을 공유합니다.

- [인턴상륙작전 - GDG WebTech LightningTalk](https://speakerdeck.com/soyoung210/inteonsangryugjagjeon)  
[2019.02.19]
학부생에서 어떻게 처음 인턴개발자로 상륙했는지에 대한 내용을 공유합니다.

## Activity

#### [FEConf Organizer](https://2019.feconf.kr/)

|                 |                                                                                       |
| --------------: | ------------------------------------------------------------------------------------- |
|      **period** | 20.03. ~ current.                                                                     |
| **description** | 페이스북 그룹인 '프론트엔드 개발 그룹'의 운영진이며 FEConf라는 컨퍼런스의 오거나이저. |

#### [For.D Organizer](https://www.facebook.com/ForDeveloperKorea/)

|             |                                                                                                                                                                                                                                                    |
| ----------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|      period | 17.12 ~ current                                                                                                                                                                                                                                    |
| description | 주니어 개발자 커뮤니티입니다. 학부생에서 주니어 개발자가 되기까지 겪었던 어려움을 다른 분들은 덜 겪었으면 하는 마음에서 커뮤니티를 운영하고 있습니다. 나에게 어려웠던점은 누구에게도 어려울 수 있다는 생각에 경험과 어려움을 많은 사람들이 나누는 문화를 만들고 싶습니다.  |

#### [Django Girls Seoul](https://djangogirls.org/seoul/)

|             |                                                                                  |
| ----------: | -------------------------------------------------------------------------------- |
|      period | 18.04. ~ 19.04.                                                                  |
| description | 여성이 개발 분야로 나아가는 것을 돕는 '장고걸스 서울'의 운영진으로 활동하였습니다. |

// TODO: 마지막에 뭔가 마무리? Last Updated도 괜찮을 듯.
