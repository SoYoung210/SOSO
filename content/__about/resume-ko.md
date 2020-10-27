---
title: 'about'
date: 2020-07-23 16:21:13
lang: 'ko'
thumbnail: ''
---

<h1 class='title'>
안녕하세요, 이소영 입니다.
</h1>

**저는 이런 것들에 가치를 두고 있습니다.**

- 사용자 경험
- 좋은 설계와 코드
- 테스트와 안정성
- 자동화와 생산성
- 비즈니스 임팩트
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
| **projects** | BPL(Design System), 카드 추천 서비스, 대출 추천 서비스, 투자 추천 서비스 2.0 |

<h1>
<span class='highlight'>Interested In</span>
</h1>

## About 구조

프로젝트의 안정적인 구조가 비즈니스의 핵심 가치에 기여할 수 있다고 믿습니다. 안정적 구조 기반에서 비즈니스 요구사항을 빠르게 수용하며 임팩트를 낼 수 있다고 생각하기 때문입니다.

### 카드 추천 서비스 개발

🗓: [Banksalad] 2020.08~2020.09

💻: *TypeScript*, *React*, *swr*

- api fetch library로 [swr](https://github.com/vercel/swr)사용
- 비즈니스 로직 핸들링을 custom hooks에서 수행

### 대출 추천 재개발

🗓: [Banksalad] 2020.01~2020.04

💻: *TypeScript*, *React*, *Redux*, *redux-saga, redux-toolkit*

기존 프로젝트는 레거시화 되어 있어 비즈니스 로직을 파악하기 어려웠고 노후된 설정등으로 인해 개발단계에서 많은 에러가 발생하는 프로젝트였습니다. 빠르게 임팩트를 추구하기 어렵다고 판단해 재개발을 제안하여 진행했습니다.

- View와 Data를 분리하고 모든 비즈니스 로직을 redux middleware에서 처리.
- redux, redux-saga 적용 및 가이드 공유

### MoneyFlow Back office

🗓: [Banksalad] 2019.09 ~ 2019.12

💻: *TypeScript*, *React*, *Redux*, *redux-observable*

MoneyFlow팀에서 사용하는 Back office.

- [기존 프로젝트 구조](https://speakerdeck.com/soyoung210/clean-architecture-in-banksalad)의 문제점을 제기하고 새로운 구조를 도입한 프로젝트.

- 상태관리 라이브러리 도입([발표자료](https://speakerdeck.com/soyoung210/heonjibjulge-saejibdao-riaegteu-peurojegteu-gujojojeong))

## About 테스트

테스트 코드는 다른 개발자가 빠르게 프로젝트를 파악할 수 있도록 돕고, 새로운 기능추가와 리팩토링의 발판이 되어준다고 생각합니다.

🗓: [Banksalad] ~ 현재

💻: Jest, testing-library, Storybook, msw

- 대출 추천 서비스 재개발 프로젝트에서 비즈니스 로직을 redux-saga로 분리하고 테스트 코드 작성.
- 테스트 코드 작성 가이드를 제공.
- 기존 테스트 커버리지 10%에서 70%로 상승
- Storybook을 통한 UI 검증 프로세스 간소화
- [msw](https://github.com/mswjs/msw)와 [testing-library](https://testing-library.com/)를 사용하여 Integration Test진행.

## About Platform Engineering

Engineering Foundation에서 Platform업무를 수행했습니다.

### 정적파일(JS, CSS)업로드 구조 변경

🗓: [Banksalad] 2020.07

💻: Terraform, Docker, Kubernetes, GitHub Actions

- 웹 서비스 무중단 배포를 지원하기 위해 정적파일을 S3에서 관리하도록 수정

### Webview [TTI](https://web.dev/interactive/) 개선

🗓: [Banksalad] 2019.08 ~ 2019.11

💻: SSR, Code Splitting, Chrome LightHouse

- LightHouse기준(Slow 4G)40점에서 87점까지 향상.
  - TTI 2.5초에서 0.2초로 상승
- SSR 가이드 공유
  - [관련 저장소](https://github.com/SoYoung210/react-ssr-code-splitting)

### 웹 서비스 [IaC](https://en.wikipedia.org/wiki/Infrastructure_as_code) 작업

🗓: [Banksalad] 2019.08 ~ 2019.11

💻: Kubernetes, Nginx, GitHub Actions

- 배포 시 필요한 Kubernetes template파일 작성
- Kubernetes, Nginx 등 뱅크샐러드의 웹 서비스 구조를 도식화 하여 문서 작성
- GitHub Actions활용한 CI/CD구성

## About 자동화, 사내 라이브러리

자동화와 사내 라이브러리에 기여했습니다.

### BPL

🗓: [Banksalad] 2020.03 ~ 2020.06

💻: emotion, tailwindcss, rollup, recharts

디자인, AND, iOS팀과 함께 BPL(Banksalad Product Language)디자인 시스템 설계 및 구현

- CI/CD 구성
- 0.0.28버전에서 0.0.29 버전 업데이트에서 번들 사이즈 최적화를 통해 사이즈 30% 감소

### JS-Banksalad

🗓: [Banksalad] 2020.06 ~ 현재

💻: lerna, rollup, TypeScript

- 각 프로젝트에서 중복으로 만들어 사용하고 있던 공통 함수들을 하나의 라이브러리로 제공
- mono repo기반으로 여러가지 패키지 관리 ([설정](https://so-so.dev/pattern/mono-repo-config/))

### 프로젝트 스캐폴딩(web-baedal)

🗓: [Banksalad] 2019.12

webpack, babel등의 설정파일을 포함한 프로젝트 전체 구조를 스캐폴딩 할 수 있는 도구입니다.

- cli를 통해 원하는 구조 선택.
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

<h1>
<span class='highlight'>Last Updated</span>
</h1>

2020.10.27  

<div align="center" class="final">

_감사합니다._
</div>
