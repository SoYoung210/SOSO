---
title: 'about'
date: 2022-07-16 16:21:13
lang: 'ko'
thumbnail: ''
---

<h1 class='title'>
안녕하세요, 이소영 입니다.
</h1>

<div align="right"><sub><i>Last updated: 2022.07.17</i></sub></div>

**저는 이런 것들에 가치를 두고 있습니다.**

- 사용자 경험
- 좋은 설계와 코드
- 테스트와 안정성
- 자동화와 생산성
- 지식과 경험 공유

|            |                              |
| :--------: | ---------------------------- |
| **GitHub** | <https://github.com/SoYoung210> |
| **Blog** | <https://so-so.dev> |
| **E-mail** | ethdud1@gmail.com            |


<h2>
<span class='highlight'>Work Experiences</span>
</h2>

<h3 class='no-border' style='margin-top: 1em;'><a target='_blank' href='https://flex.team/'>flex</a></h3>

|              |                                                         |
| -----------: | ------------------------------------------------------- |
|   **period** | 21.02 ~ current                                         |
| **position** | Design Platform |
| **projects** | Design System, flex2.0개편, Core HR관련 서비스  |

#### Design Platform (22.03 ~ current)

*radix-ui*, *stitches.js*

- flex Design System 3.0(linear)개발, 형태 종속적이지 않은 디자인 시스템 구성 [Select 구성 글](https://so-so.dev/react/make-select/)
- Compound Component API를 통해 DX향상
- 사용처에서 특별히 고려하지 않아도 접근성 지원이 가능한 형태 구성
- 디자인과 개발자의 생산성을 높일 수 있는 도구 개발
  - figma를 single source로 사용하는 icon, illust, color 생성 cli

#### flex2.0 개편 (21.07 ~ 22.01)

- 2.0 프로젝트 환경 설정
  - react-query를 wrapping하여 remote함수에서 queryKey를 자동으로 생성하는 형태로 제공
  - [stitches.js](https://stitches.dev/) 도입
  - Design System 2.0(antd) Setup 및 이후 유지보수 / Framer 인터페이스 작업 참여
- 유저 프로필, 구성원 추가/초대 영역 작업
  - 복잡한 CRUD 및 권한 처리를 단순하게 처리할 수 있도록 설계

#### Core HR (21.02 ~ 22.02)

- 대량변경 table editor
- 회사별 온보딩 정보 템플릿을 관리하는 형태로 개편하여 구성원이 정보를 선택입력 할 수 있는 형태로 유저 온보딩 개편

<h3 class='no-border'><a href='https://www.banksalad.com/' target='_blank'>Banksalad</a></h3>

|              |                                                         |
| -----------: | ------------------------------------------------------- |
|   **period** | 18.12 ~ 21.02                                         |
| **position** | Engineering Foundation |
| **projects** | Design System, 카드/대출/투자 추천 서비스 2.0 개편 |

#### 카드 추천 서비스 개발 (20.08 ~ 20.09)

*TypeScript*, *React*, *swr*

- api fetch library로 [swr](https://github.com/vercel/swr)사용
- 비즈니스 로직 핸들링을 custom hooks에서 수행

#### Design System (20.03 ~ 20.06)

*emotion, tailwindcss, rollup, recharts*

디자인, AND, iOS팀과 함께 BPL(Banksalad Product Language)디자인 시스템 설계 및 구현

- CI/CD 구성
- 0.0.28버전에서 0.0.29 버전 업데이트에서 번들 사이즈 최적화를 통해 사이즈 30% 감소

#### 공통 패키지 운영 (20.03 ~ 20.12)

*lerna, rollup, TypeScript*

- 각 프로젝트에서 중복으로 만들어 사용하고 있던 공통 함수들을 monorepo 멀티 패키지 구조로 변경 ([설정](https://so-so.dev/pattern/mono-repo-config/))
- 프로젝트 스캐폴딩 cli, 유틸 함수 등을 추가

#### 대출 추천 재개발 (20.01 ~ 20.04)

*TypeScript*, *React*, *Redux*, *redux-saga, redux-toolkit*

기존 프로젝트는 레거시화 되어 있어 비즈니스 로직을 파악하기 어려웠고 노후된 설정등으로 인해 개발단계에서 많은 에러가 발생하는 프로젝트였습니다. 빠르게 임팩트를 추구하기 어렵다고 판단해 재개발을 제안하여 진행했습니다.

- View와 Data를 분리하고 모든 비즈니스 로직을 redux middleware에서 처리.
- redux, redux-saga 적용 및 가이드 공유
- [msw](https://github.com/mswjs/msw)와 [testing-library](https://testing-library.com/)를 사용하여 Integration Test진행. 팀 내 테스트 코드 작성 가이드 작성
- 기존 테스트 커버리지 10%에서 70%로 상승

#### Webview [TTI](https://web.dev/interactive/) 개선 (19.08 ~ 19.11)

*SSR, Code Splitting, Chrome LightHouse*

- LightHouse기준(Slow 4G)40점에서 87점까지 향상.
  - TTI 2.5초에서 0.2초로 상승
- SSR 가이드 공유
  - [관련 저장소](https://github.com/SoYoung210/react-ssr-code-splitting)

<h2>
<span class='highlight'>Communities</span>
</h2>

#### Presentations

- [절망 드리븐 성장: 함께 일하고 싶은 개발자가 되기까지](https://speakerdeck.com/soyoung210/jeolmang-deuribeun-seongjang-hamgge-ilhago-sipeun-gaebaljaga-doegiggaji) (19.12.13)
- [헌집줄게, 새집다오 - FEConf2019](https://speakerdeck.com/soyoung210/heonjibjulge-saejibdao-riaegteu-peurojegteu-gujojojeong) (19.10.26)
- [Clean Architecture in Banksalad - XXIT Tech Talk](https://speakerdeck.com/soyoung210/clean-architecture-in-banksalad) (19.10.05)
- [ConSalad - 4th Technical Conference in Rainist](https://speakerdeck.com/soyoung210/susuggeggiro-sugseongdoen-banana) (19.06.15)
- [인턴상륙작전 - GDG WebTech LightningTalk](https://speakerdeck.com/soyoung210/inteonsangryugjagjeon) (19.02.19)

#### Activity

- [FEConf Organizer](https://feconf.kr/) (20.03 ~ current)
- [커넥트재단 부스트캠프 리뷰어](https://boostcamp.connect.or.kr/) (20.08 ~ 20.10)

<div align="center" class="final">

_감사합니다._
</div>
