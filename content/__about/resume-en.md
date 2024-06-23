---
title: 'about'
date: 2022-07-16 16:21:13
lang: 'ko'
---

<h1 class='title'>
안녕하세요, 이소영 입니다.
</h1>

<div class='personal-links'>
<a href='https://craft.so-so.dev' target='_blank'>https://craft.so-so.dev</a> / <a href='https://github.com/SoYoung210' target='_blank'>https://github.com/SoYoung210</a> / <a href='mailto:ethdud1@gmail.com' target='_blank'>ethdud1@gmail.com</a>
</div>

I'm a UX Engineer who loves design systems, good web services, and beautiful things.

I'm always thinking about how to make the most impact with the same resources, but I also believe that sometimes inefficient choices are necessary. I believe in investing in design, systems, testing, and automation that are flexible to change, and I try to make sure that these elements go hand in hand with product improvement.

I love to share my experience and knowledge. I believe that knowledge becomes mine when I can share it, and I want to contribute to the virtuous cycle of sharing.

<h2>
<span>Work Experience</span>
</h2>

<h3 class='no-border' style='margin-top: 1em;'>
  <a target='_blank' href='https://toss.im/'>toss</a>
  <div class='period'>(2023.03 ~ )</div>
</h3>

|              |                                                         |
| -----------: | ------------------------------------------------------- |
| **position** | PC Design Platform Team |
| **projects** | Design System  |

#### Design System

**tds-desktop architect design and development**

Built a new PC design system used by various Toss affiliates. Set goals, direction, and contributed to UX and DX improvements for the design system.

- Define the level of abstraction of product components and define the responsibilities of the design system
  - Categorize the components that make up the product into four layers (combination of domain components / domain components / product system / design system) and define the responsibilities of each layer.
  - Based on this, divide the responsibilities and non-responsibilities of the design system and organize the foundation for decision-making.
- Establish a design direction
  - Designing APIs within the unfamiliarity budget, establishing a design system design direction that ensures consistency, and disseminating it within the team
- Introduce testing for stability and confidence
- Organize codeshift and ecosystem for migration to new system
- Participate in suggestions and design for better UX

<h3 class='no-border' style='margin-top: 1em;'>
  <a target='_blank' href='https://flex.team/'>flex</a>
  <div class='period'>(2021.02 ~ 2022.11)</div>
</h3>

|              |                                                         |
| -----------: | ------------------------------------------------------- |
| **position** | Design Platform, Core Squad |
| **projects** | Design System, flex2.0개편, Core HR관련 서비스  |

#### Design Platform

**flex Design System 3.0(linear) architect design and development**

Build a new design system based on lessons learned from Design System2.0, which helped designers and developers collaborate and contributed to the flexibility, aesthetics, and accessibility of our products.

- Design systems to ensure consistency of behavior while reducing the constraints of representation (https://so-so.dev/react/design-system-decision-record/)
  - Define abstract components to efficiently support different component usages
  - Compose headless components to ensure consistency of behavior
- Separate packages for systems that focus on scalability (linear) and systems that focus on productivity (linear-extension)
  - Use modules in linear to provide UI patterns that are frequently used in the product as modules in linear-extension
- Organize tests based on component scenarios

**planning and developing tools to make designers and developers more productive**

- Created a script to synchronize design resources managed in Figma with code, reducing communication costs for resource changes.
- Created the [Lorem ipsum Figma plugin](https://www.figma.com/community/plugin/1097438299470908389/Lorem-ipsum-universal) to help designers be more productive by eliminating the need to worry about Korean content.
- [Skeleton Code generator Figma Plugin](https://www.figma.com/community/plugin/1072079296344464088/figeleton) to help developers be more productive by generating skeleton component code
#### flex2.0 개편

We revamped the product to ensure it could be used by customers of all sizes and HR policies. I contributed to the groundwork and prioritization, and together we created a roadmap of tasks to ensure that the big changes were implemented quickly and reliably.

- 2.0 Project design and base package creation
  - Developed a hook package that automatically generates queryKey based on API request information so that developers do not have to determine the queryKey, which must be unique when using [react-query](https://tanstack.com/query/v4).
  - Introduced libraries that were not used in flex1.0, such as stitches.js and react-hook-form, and disseminated user guides within the team
  - Development of antd-based Design System 2.0 and subsequent maintenance
  - Improved Framer code component organization so that one implementation can be used in design and development phases
- User profile, add/invite members
  - Design and development of complex forms with a combination of Uncontrolled and Controlled
  - Designed to simplify the handling of permissions
- Project Performance TF
  - Improved package bundle settings in TF to improve the speed of the product, improving the total bundle size from 2.52MB to 1.84MB

#### Core HR

- Developed a common modularization of Editable Table using [ag-grid](https://www.ag-grid.com/) to conveniently modify a large amount of information, and developed a [mass change of HR/contract information](https://userguide.flex.team/de413145-ae7a-4643-a7dd-a41e0d61870d#3927052f-651a-457e-926e-71925c9a9bbe) feature based on this.
- To solve the problem of not being able to customize the member onboarding process by company, we improved the onboarding function in a form that allows you to manage member invitation templates.

<h3 class='no-border'>
  <a href='https://www.banksalad.com/' target='_blank'>banksalad</a>
  <div class='period'>(2018.12 ~ 2021.02)</div>
</h3>

|              |                                                         |
| -----------: | ------------------------------------------------------- |
| **position** | Engineering Foundation |
| **projects** | Design System, 카드/대출/투자 추천 서비스 2.0 개편 |

#### Design System

Designed and implemented the [Banksalad Product Language (BPL)](https://blog.banksalad.com/tech/banksalad-product-language-design/) to increase design consistency and productivity. Shared lessons learned from initially organizing the design system in blog posts and internal presentations.

- Developed components for the first version of 2.0 and organized documentation, storybooks, etc.
- Reduced bundle size by 30% with [improved rollup settings](https://so-so.dev/tool/rollup/rollupjs-config/)

#### Common Package Operations

- Change common functions that were being duplicated and used by each project to a monorepo multi-package structure ([related settings](https://so-so.dev/pattern/mono-repo-config/))
- Added project scaffolding CLI, utility functions, etc.

#### Redeveloping the loan recommendation service

- Decoupling View and Data and handling all business logic in redux middleware.
  - Apply redux, redux-saga, and share guides.
- Run integration tests using [msw](https://github.com/mswjs/msw) and [testing-library](https://testing-library.com/). Created a guide for writing test code within the team.
  - Increased test coverage from 10% to 70%.

#### Enhance Webview TTI

- LightHouse baseline (Slow 4G) improved from 40 to 87.
  - TTI from 2.5 seconds to 1.5 seconds
- Share SSR Guide
  - [Related repository](https://github.com/SoYoung210/react-ssr-code-splitting)

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
