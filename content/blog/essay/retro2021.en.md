---
title: 'Deploy 2021'
date: 2021-12-31 23:59:59
category: essay
thumbnail: './images/2021_retro/thumbnail.jpg'
---

![thumbnail](./images/2021_retro/thumbnail.jpg)

## What I wrote last year

This year didn't go where I expected. Looking back, I ended up on a pretty different path than [the one I mapped out in last year's retrospective](https://so-so.dev/essay/retro2020/#2021%EB%85%84%EC%9D%98-%EB%82%98%EB%8A%94-%EC%96%B4%EB%96%A4-%EC%82%AC%EB%9E%8C%EC%9D%B4-%EB%90%98%EA%B3%A0-%EC%8B%B6%EC%9D%80%EA%B0%80).

Studying infrastructure was one of last year's big goals. Then I switched companies this year, everything got chaotic, and "infra" didn't even cross my mind again until I sat down to write this. That alone tells me how far down my priority list it had sunk.

Sure, the systems at my new company are completely different. But if I'd actually had a solid handle on the fundamentals underneath any system, I could've explored anyway. I didn't, so I stayed on the sidelines.

Bottom line: I had fewer reasons to touch infra directly than I used to, other priorities took over, and last year's hope quietly fizzled out.

## What I wrote this year

I started my career on December 26, 2018, so I just passed the three-year mark. The last two retrospectives felt like sketching on a blank page: everything I built and learned made me proud. This year I don't think I filled in nearly as much of the canvas.

For a long time, I cared more about becoming a "good engineer" than a "good teammate." Hard skills, not soft skills, were where I wanted to put my energy.

That flipped this year. I worked hard at becoming a good teammate instead — someone the PMs, designers, and engineers around me would want to keep working with. To me that meant staying focused on impact, getting sharper at estimating timelines, and building a shared vocabulary that lets people from different backgrounds actually understand each other. Most of my year went into figuring out how to build that. (Still the goal. Still what I believe.)

Not that engineering fell off entirely, just further down the list. Working on a product whose requirements never stopped shifting, I'd catch myself asking, over and over: which patterns make it easy to absorb a new requirement? When modifying something built with pattern A feels painful, what's actually causing the friction? Is there a cleaner way to do this?

Every time I worked through which layers to split apart and how to abstract them, the outcome either backed up what I'd believed before, or proved me wrong.

I think growth starts with grappling with something, and this year gave me plenty to grapple with — enough that I came out sturdier than last year.

## Switching jobs

I changed jobs this February.

The first stretch was rough. I felt unmoored in the new environment and scrambled hard to catch up. Looking back, I didn't need to push that hard. I just wanted, badly, to prove myself trustworthy fast.

That unfamiliarity made for a hard few months, but it also opened up new directions for me and pushed me to grow. Working through hard problems at a company building a brand-new product, here's what stuck:

- A design has to be flexible and solid at once (flashy on the surface, simple underneath), and I felt just how much that matters.
- Which module should depend on which, and how wide a module's dependencies should reasonably run, whether that module is an entire service or a single package: I never stopped asking (and still shouldn't).
- I'm still working out what belongs shared versus owned separately, and when to pull something out into an abstraction, testing different approaches along the way.
- Solving problems the whole chapter shared, or just watching them get solved, taught me a lot technically.
    - [A common way of declaring remote resources, the react-query improvements that followed, and hooking up an OpenAPI Generator (https://openapi-generator.tech/)](https://twitter.com/heejongahn/status/1426420910563631105)
    - how we tackled i18n
    - and more

The product keeps growing fast, which of course means the problems keep piling up too. I'm looking forward to tackling whatever's in front of me now, and whatever's still coming.

## Thinking about 'efficiency'

Early in my career I noticed a weakness in myself: I'm slow.

- I sink a lot of time into what makes code "good." Trying to account for every scenario means design and implementation both drag on.
- I always want to solve things properly. Sure, that's true of anyone, but the second I spot the seed of a problem or inefficiency, I want to pull it out immediately.

Speed matters a lot at a startup, that much I was sure of, so I drew up a bunch of action items suited to how I actually work and tried them out.

The most important premise running through all of this was **"being clear about which problems need solving well right now, and which ones don't."**

Take building a component. You can't realistically cover every use case from day one, and designing around cases that don't exist yet just wastes time. Building in reasonable flexibility and room to grow is table stakes, sure — but that's different from spinning your wheels imagining hypotheticals.

The big-picture architecture is worth getting right immediately. The finer rules living inside that structure, though, can wait and improve gradually.

Process and automation work the same way. A half-baked process will draw feedback from the team soon enough, and folding that feedback in usually gets you most of the way to something that works for everyone. It'd be nice to nail it on the first try, but a silver bullet rarely shows up that fast, and you might not have the time or people to chase one yet anyway.

Then there are problems you really do need to nail up front. Whatever shortcut you take now shouldn't calcify into technical debt that blocks you the moment you're finally ready to fix it properly. And the more broadly something is shared, rather than boxed inside one application, the more this seems to hold true.

So that's the process: sort out what actually matters right now, decide how much to bet on the problem in front of me, keep a fallback ready in case my approach flops. Little by little, that's how I'm learning to work more **'efficiently.'**

![kimcoding](./images/2021_retro/kimcoding.jpg)

<div style="opacity: 0.5; padding: 0 20px" align="left">
  <sup>Shoutout to <a href="https://blog.naver.com/jukrang" target="_blank">KimCoding</a></sup>
</div>

All this thinking about efficiency really just comes from wanting to do better work. There will be times my own ambition should win out. But that's not a universal rule, so I need to keep moving while staying tuned in to what my team and the org actually need.

## Wrapping up

![commit_log](./images/2021_retro/commit_log.jpg)

<div style="opacity: 0.5; padding: 0 8px" align="left">
  <sup>Looking back at my 2021 commits [(top): work account / (bottom): personal account]</sup>
</div>

If I ask myself how much I grew this year, the honest answer is: not a ton.

Answering "what is growth?" has actually gotten harder, not easier. [In a post about growth](https://so-so.dev/essay/no-silver-bullet/#%EC%A0%95%EC%9D%98), I defined it as widening the range of things you hold a perspective on. But my range has widened since last year, and I still feel like growth was thin this year — so that definition clearly isn't the whole story.

My definition has shifted. Growth, to me now, is naming the areas where I actually have expertise, figuring out what's missing to round that out, and then going and getting it. (I might come back next year and decide even this isn't enough.)

I spent this year asking myself, "what kind of developer do I want to be?" I used to see one straight road with no forks in it. Now I can make out a few different paths. Before picking a direction, though, I think I need more time just understanding what kind of person I am. That could still change, but somewhere around the middle of the year, I found myself wanting to build for Players — everyone with a hand in pushing a product forward.

## The story I want to write next year

Less a list of goals, more a list of what's caught my interest.

- **Tooling:** If I had to name the biggest shift in the JS ecosystem this year, it'd be bundlers like [swc](https://swc.rs/) and [esbuild](https://esbuild.github.io/). The raw material behind tools is drifting away from JS and toward [Rust](https://www.rust-lang.org/)/[Go](https://go.dev/). Friends have told me Go is a bit rough, so if I actually try this, I'll probably end up building some kind of productivity tool in Rust.
- **Drawing:** I want to get my hands dirty with visual stuff — 3D, SVG, that world. Courses usually don't click for me, but I'm eyeing [threejs-journey](https://threejs-journey.com/) anyway.
- **Open source:** I've got a few things I want to build and actually stick with long-term: a resource-automation tool on top of the [Figma API](https://www.figma.com/developers/api), a Blog Management System, lending a hand on my spouse's open source, and more.

More than anything, I just want next year's me to be a bit sturdier than this year's. 🌈
