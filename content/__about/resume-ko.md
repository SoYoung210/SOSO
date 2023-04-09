---
title: 'about'
date: 2022-07-16 16:21:13
lang: 'ko'
---

<h1 class='title'>
안녕하세요, 이소영 입니다.
</h1>

<div class='personal-links'>
<a href='https://so-so.dev' target='_blank'>https://so-so.dev</a> / <a href='https://github.com/SoYoung210' target='_blank'>https://github.com/SoYoung210</a> / <a href='mailto:ethdud1@gmail.com' target='_blank'>ethdud1@gmail.com</a>
</div>

사람들의 생활을 편리하게 만들어주는 웹 서비스, Design System 그리고 글쓰기를 좋아하는 개발자입니다.

언제나 같은 자원으로 최대한의 임팩트를 만들 방법을 고민하지만, 때로는 비효율적인 선택도 필요하다고 믿습니다. 변경에 유연하게 대응할 수 있는 설계, 시스템, 테스트, 자동화에 대한 투자가 중요하다고 믿고 이 요소들이 제품 개선과 함께 갈 수 있도록 노력합니다.

경험과 지식 공유를 좋아합니다. 지식은 나눌 수 있을 때 내 것이 된다고 생각하고 공유의 선순환에 기여하고 싶습니다.

<h2>
<span>Work Experience</span>
</h2>

<h3 class='no-border' style='margin-top: 1em;'>
  <a target='_blank' href='https://flex.team/'>플렉스</a>
  <div class='period'>(2021.02 ~ 2022.11)</div>
</h3>

|              |                                                         |
| -----------: | ------------------------------------------------------- |
| **position** | Design Platform, Core Squad |
| **projects** | Design System, flex2.0개편, Core HR관련 서비스  |

#### Design Platform

**flex Design System 3.0(linear) 설계 및 개발**

Design System2.0의 Lesson Learn을 바탕으로 새로운 디자인 시스템을 구축했습니다. 새로운 디자인 시스템은 디자이너와 개발자의 협업을 돕고, 제품의 유연함, 심미성, 접근성에 기여했습니다.

- 표현의 제약을 줄이면서 동작의 일관성을 보장하는 [디자인 시스템 설계](https://so-so.dev/react/design-system-decision-record/)
  - 다양한 컴포넌트 용례를 효율적으로 지원하기 위한 추상 컴포넌트 정의
  - 동작의 일관성을 보장하는 Headless 컴포넌트 구성
- 확장성에 집중하는 시스템(linear)과 생산성에 집중하는 시스템(linear-extension)을 구분 지어 별도 패키지로 운영
  - linear의 모듈을 사용하여 제품에서 자주 사용되는 UI Pattern들을 linear-extension의 모듈로 제공
- 컴포넌트 시나리오 기반의 테스트 구성

**디자이너와 개발자의 생산성을 높일 수 있는 도구 기획 및 개발**

- Figma에서 관리되는 디자인 리소스를 코드와 동기화하는 스크립트를 제작하여 리소스 변경에 필요한 커뮤니케이션 비용을 줄임.
- [Lorem ipsum Figma plugin](https://www.figma.com/community/plugin/1097438299470908389/Lorem-ipsum-universal)을 제작하여 한글 콘텐츠에 대한 고민을 제거함으로써 디자이너의 생산성 향상에 기여
- [Skeleton Code generator Figma Plugin](https://www.figma.com/community/plugin/1072079296344464088/figeleton)을 제작하여 스켈레톤 컴포넌트 코드를 생성해줌으로써 개발자의 생산성 향상에 기여

#### flex2.0 개편

다양한 인사정책, 규모를 가진 고객사에서도 사용할 수 있는 제품으로 도약하기 위한 개편을 진행했습니다. 큰 변화를 빠르고 안정적으로 적용하기 위해 기반작업과 우선순위 판단에 기여하고, 작업의 로드맵을 함께 만들었습니다.

- 2.0 프로젝트 설계 및 기반 패키지 제작
  - [react-query](https://tanstack.com/query/v4)를 사용할 때 고유함이 보장되어야 하는 queryKey를 개발자가 직접 판단하지 않아도 되도록 api 요청정보 기반으로 자동생성 해주는 hook package 개발
  - stitches.js, react-hook-form등 flex1.0에서 사용하지 않던 라이브러리 도입, 팀 내 사용 가이드 전파
  - antd기반의 Design System2.0 개발 및 이후 유지보수
  - Framer 코드 컴포넌트 구성을 통해 디자인과 개발 단계에서 하나의 구현체를 사용할 수 있도록 개선
- 유저 프로필, 구성원 추가/초대
  - 복잡한 Form을 Uncontrolled, Controlled의 조합으로 설계 및 개발
  - 권한을 단순하게 처리할 수 있도록 설계
- 프로젝트 성능 TF
  - 제품의 속도를 개선하기 위한 TF에서 패키지 bundle설정 개선으로 총 번들 사이즈 2.52MB에서 1.84MB로 개선

#### Core HR

- 많은 정보를 편리하게 수정할 수 있도록 [ag-grid](https://www.ag-grid.com/)를 활용하여 Editable Table을 공통 모듈화 하고, 이를 바탕으로 [인사/계약 정보 대량변경](https://userguide.flex.team/de413145-ae7a-4643-a7dd-a41e0d61870d#3927052f-651a-457e-926e-71925c9a9bbe) 기능 개발
- 회사별 구성원 온보딩 과정의 커스텀이 불가능한 문제를 해결하기 위해 구성원 초대 템플릿을 관리할 수 있는 형태로 온보딩 기능 개선

<h3 class='no-border'>
  <a href='https://www.banksalad.com/' target='_blank'>뱅크샐러드</a>
  <div class='period'>(2018.12 ~ 2021.02)</div>
</h3>

|              |                                                         |
| -----------: | ------------------------------------------------------- |
| **position** | Engineering Foundation |
| **projects** | Design System, 카드/대출/투자 추천 서비스 2.0 개편 |

#### Design System

디자인 일관성과 생산성을 높이기 위한 [BPL(Banksalad Product Language)](https://blog.banksalad.com/tech/banksalad-product-language-design/)을 설계 및 구현했습니다. 디자인 시스템을 처음 구성하면서 얻게 된 배움을 블로그 글과 사내발표로 공유했습니다.

- 2.0 첫 버전의 컴포넌트 개발 및 문서와 Storybook등 환경 구성
- [rollup 설정 개선](https://so-so.dev/tool/rollup/rollupjs-config/)으로 번들 사이즈 30% 감소

#### 공통 패키지 운영

- 각 프로젝트에서 중복으로 만들어 사용하고 있던 공통 함수들을 monorepo 멀티 패키지 구조로 변경 ([관련 설정](https://so-so.dev/pattern/mono-repo-config/))
- 프로젝트 스캐폴딩 cli, 유틸 함수 등을 추가

#### 대출 추천 재개발

- View와 Data를 분리하고 모든 비즈니스 로직을 redux middleware에서 처리.
  - redux, redux-saga 적용 및 가이드 공유
- [msw](https://github.com/mswjs/msw)와 [testing-library](https://testing-library.com/)를 사용하여 Integration Test진행. 팀 내 테스트 코드 작성 가이드 작성
  - 테스트 커버리지 10%에서 70%로 상승

#### Webview TTI 개선

- LightHouse기준(Slow 4G)40점에서 87점으로 향상.
  - TTI 2.5초에서 1.5초로 상승
- SSR 가이드 공유
  - [관련 저장소](https://github.com/SoYoung210/react-ssr-code-splitting)

<h2>
<span>Communities</span>
</h2>

#### Presentations

- [디자인 시스템, 형태를 넘어서](https://speakerdeck.com/soyoung210/dijain-siseutem-hyeongtaereul-neomeoseo) @FEConf2022 (22.10.08)
- [절망 드리븐 성장: 함께 일하고 싶은 개발자가 되기까지](https://speakerdeck.com/soyoung210/jeolmang-deuribeun-seongjang-hamgge-ilhago-sipeun-gaebaljaga-doegiggaji) @한빛데브그라운드 (19.12.13)
- [헌집줄게, 새집다오](https://speakerdeck.com/soyoung210/heonjibjulge-saejibdao-riaegteu-peurojegteu-gujojojeong) @FEConf2019 (19.10.26)
- [Clean Architecture in Banksalad](https://speakerdeck.com/soyoung210/clean-architecture-in-banksalad) @XXIT Tech Talk (19.10.05)
- [인턴상륙작전](https://speakerdeck.com/soyoung210/inteonsangryugjagjeon) @GDG Lightning Talk (19.02.19)

#### Activities

- [FEConf Organizer](https://feconf.kr/) (20.03 ~ current)
- [커넥트재단 부스트캠프 리뷰어](https://boostcamp.connect.or.kr/) (20.08 ~ 20.10)
