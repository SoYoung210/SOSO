---
title: Deploy 2023
date: 2023-12-31 11:59:59
category: essay
thumbnail: './images/2023_retro/thumbnail.png'
---

![thumbnail](./images/2023_retro/thumbnail.png)

It's December, retrospective season. This was a year that broadened my horizons, both personally and professionally.

I wrote this retrospective around the experiences that stuck with me most.

## A New Team, A New Design System

This March, I joined Toss's PC Design Platform Team. You might think, "Does Toss even have PC products?" but across the Toss community (affiliates), there are actually quite a few PC products, from customer-facing products to internal admin tools.

When I joined, the PC design system (tds-pc) had been built quickly out of necessity and hadn't been developed further since. There was a wide gap between the system and product needs, and a system built quickly like that seemed to struggle with continued expansion. After going back and forth between incremental improvement and a full rebuild, I concluded that unless we rebuilt from the most foundational layer up, we couldn't solve the problem at its root, so I proposed a rebuild.

A rebuild isn't a cure-all. It's actually easier to reach for than incremental improvement, and it's an expensive undertaking. I was scared to make this proposal without having built up any trust capital yet, but I figured that raising the discussion would lead us to a better answer, so I proposed the rebuild anyway.

![tds-desktop document](./images/2023_retro/tds-desktop-doc.png)

I gathered up the pain points I found while understanding the existing system, along with things I believed—from experience—were better decisions, and organized them into the principles and technical decisions the system would need. No code lasts forever, but given how much we were paying for this rebuild, I wanted it to be a system that would last, one with a clear purpose. I wanted the reasoning behind our decisions and our goals to remain even after the people involved changed.

> A design system is the raw material for many services

That's something from last year's retrospective, but this time it expanded from "service" to "company." And there was already an existing system that had supported the products for quite a long time.

Even though we called it a rebuild, I thought a complete overhaul would cost more than it was worth, so I limited Breaking Changes to mainly the core parts of the design system. My thinking was that if the total cost of adopting the new system was too high, no one would be willing to take on the change.

One of the key elements of a rebuild is time. The strong power of legacy code is "behavior that's guaranteed by having been used for a long time already." No matter how carefully you study the spec, implement it identically, and write tests, it can never be as stable as legacy code that's been battle-tested across a variety of environments. So you need to quickly find early adopters and prepare and support them so they can try out the new system quickly.

I eliminated as much inefficiency as I could ahead of time. I set up rules like criteria for ambiguity in the spec and standards for Breaking Changes, and I always wrote things down in documents so that anything requiring discussion wouldn't have to be dug up from memory.

Rebuilt code is inevitably unstable. Unless you paste in the exact same code, there's always a risk of latent bugs. The goal of "improving UX and DX, and rebuilding in an extensible form" can only be achieved with at least a safety net of test code. There were plenty of choices I deferred in order to use time efficiently, but writing tests was never one of them.

The rebuild is still ongoing, and there have been difficult moments along the way, but it hasn't felt hard. I think that's thanks to the team, who bought into the direction and have been running alongside me. (Honestly, maybe the most important thing in a design system isn't the code or the design, but team building.) We're still in the process of producing results, but this is a project I'm even more excited to see next year.

### Not Deciding

Running this project required a lot of deliberation and decisions, and whenever the cost of deliberating was high but delaying the decision didn't raise the cost, I delayed it.

A high cost of deliberation means I was confused — if I kept deliberating I could eventually reach an answer, but there was no guarantee it would be the right one, and given the nature of a library, rolling back is hard, so I felt a wrong decision would only end up increasing costs.

Investing deliberation costs only in important problems, and not in less important ones, saved a lot of time.

### Expanding My Role

Whereas before I focused on "code" within the scope of development, this year I spent a lot of time thinking about the areas below, beyond just code.

- Whether what's currently happening is actually a "problem," and if it is, whether it needs to be solved now or can be deferred
- Goals and philosophy
- Root causes
- UI/UX for components and their use cases
- Cultivating the library ecosystem
- Giving good feedback, working as a team

I felt a vague anxiety about spending less time thinking about code, but I came to believe that code is just a small means to an end, and that defining problems and voicing opinions matter more.

I sometimes wondered, "Is it okay for me to spend time on this instead of development," but since I didn't think what the team expected of me was "just a developer who codes well," I spent the time and invested the deliberation cost anyway.

Since I can't decide alone what role I'm expected to play, I honestly shared my thoughts and asked for feedback. (I heard back that people appreciated me thinking so broadly.) Next year too, I expect I'll keep thinking about how the team can do well and take whatever action is needed.

## [craft](https://craft.so-so.dev/)

![craft.so-so.dev thumbnail](./images/2023_retro/craft-thumbnail.jpg)

> I build the things I want to try, and post them here.

That's the description of this project I wrote in last year's retrospective. It's a kind of playground for finding slick UI/UX and building it out. Working under the title UX Engineer, when I think about what matters most in this job, it comes down to two big things.

1. The ability to design modules that deliver the same user experience at low cost
2. Visual Engineering

This project is for practicing #2. Based on published content, I made 9 pieces this year. Taking things apart and running them to build these let me figure out why I find certain things "polished," and what kind of effort goes into creating that polish.

Just like with the blog, I sometimes feel like revamping the craft platform itself rather than the content, but for now I plan to focus on building up the content I've been meaning to make.

### Design

![craft-design.png](./images/2023_retro/craft-design.png)

None of the content in craft was made completely from scratch, but most of it went through some amount of tweaking. The process of layering on this and that in search of the "right" answer for that tweaking was hard. I could tell something was off, but it wasn't easy to get a feel for how to make it better.

It took quite a lot of time to reach a point I considered good enough, through looking at more references, taking screenshots, analyzing, and sketching things out. I don't have formal expertise, but I've been writing up notes as I go through this inefficient process... I'm not sure when I'll be able to publish it, though.

## 3D and Blender

As part of the Visual Engineering domain, I wanted to study 3D. Along the way, it seemed like having an understanding of 3D models would let me do a lot more, so I've been learning a tool called [blender](https://www.blender.org/).

![blender-donut.jpeg](./images/2023_retro/blender-donut.jpeg)

This is the first model I made, following a [tutorial video](https://www.youtube.com/watch?v=nIoXOplUvAw). At work, I've started a small club where we work for an hour over lunch on Tuesdays, Wednesdays, and Thursdays and share our results; looking back at the records, I made this donut on June 22nd.

<video controls style="width: 100%;" src="/media/essay/images/2023_retro/blender-room-720.mov" type="video/quicktime" poster="/media/essay/images/2023_retro/blender-room-720.png">
   Sorry, your browser doesn't support embedded videos,
</video>

After the donut, I started building a workshop scene in July. Now all that's left is putting it on the web... but the process of getting it onto the web has turned out to be less smooth than I expected.

At first, I'd search YouTube for the same object and learn by copying along exactly, but once I got somewhat comfortable, I became able to figure out on my own how to make certain objects. Working with Blender reminded me once again of things like, "Nothing beats consistency. The fastest way to learn is by applying it in practice."

The hardest part of doing craft was that when designing something, I could tell it was off but had a hard time getting a feel for how to improve it, whereas with Blender, having a real-world object as a clear target gave me a stronger sense of accomplishment.

My original goal was to get the workshop project onto the web before the year was out, so I modeled hard, but it turned out that the moment the modeling was done was really just the beginning. Maybe I can finish it up in the first half of next year.

## Scuba Diving

This August, I tried scuba diving and did about 40 dives. In fact, I've already planned out my diving schedule all the way through next year's Chuseok.

For someone whose job, programming, was also my hobby, and who spent even my free time doing something on a laptop, ending up this deeply into a hobby is a pretty encouraging development.

People around me often ask, "Why do you like diving so much?" Everyone's reasons are probably different, but for me,

- The feeling of jumping into a whole new world the moment I enter the water
- Seeing other living creatures
- Being fully focused on my own movement and breathing.

those are roughly the three big reasons. Wanting to get better at it, I ended up buying personal gear piece by piece, and before I knew it, I had a full set of basic equipment.

## 2024 Goals

This was a year that broadened me, both as a developer and as a person. Aiming for consistency even if it's slow, next year I want to focus on filling in the areas I've expanded into.

- Next year's goals
  - Being a teammate who sees the forest
  - Strengthening my abilities in new areas (3D, design)

This year marks five full years since I became a developer. Seeing that this retrospective holds more than the first one I wrote makes me feel like I'm filling each year with new experiences. I hope that next year, too, I can keep having lots of experiences, making decisions, and filling in new stories.
