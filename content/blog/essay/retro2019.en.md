---
title: Deploy 2019
date: 2019-12-30 17:12:76
category: essay
thumbnail: './images/carbon.png'
---

![image-0](./images/carbon.png)

It's really the end of the year, and like every year, everyone's retrospective posts are starting to show up.
Right around when I mentioned I was about to write mine, someone said this to me:
**"Whenever I write one, I just end up picking myself apart, and next year's plan feels like such a burden that I've basically stopped bothering."**

I get it. But that's not really why I write mine. Mine are about looking back and keeping a record, not about self-criticism.
So how was 2019 for me?

- A good outcome from an internship that felt like both an adventure and a gamble.
- 1.5 main projects.
- Infrastructure and documentation.
- 5 talks, 1 article, and some blogging.
- Running the For.D community.
- You don't have to push yourself this hard. Actually, you shouldn't.

For the first time in my life, I picked a profession, and I just spent my first year walking that path.

Through the internship, "survival" was inevitably the only thing that mattered. Once that pressure eased off, the things that actually mattered started coming into focus.

## What I planned last year

![image-2018](./images/2019_retro_2.png)

Of the modest wishes I laid out in [last year's retrospective](https://so-so.dev/essay/retro2018/), I got to almost all of them, minus a couple.

> I never touched Python or GraphQL, but I'll pick them up whenever I actually need them.

I stood on a stage as a speaker, something that used to feel completely out of reach, and I got to contribute to production through code reviews and real development work.
It was my first full year as a developer.

A year went by with plenty to regret, plenty of moments I felt sorry for myself over, and plenty I'm proud of too.

## A good outcome from an internship that felt like both an adventure and a gamble

### 2018.12.26 ~ 2019.03.26

![image-1](./images/slide_0.jpg)

Three months of internship that felt like three years. I'd burned the bridge back to school to take this path, so I wanted a good outcome badly. Even if it didn't work out, I wanted to be able to tell myself "there's no way I could have tried any harder than this" — so, exaggerating only slightly, I planned and studied around the clock, weekends included.

Looking back now, that kind of overdrive is honestly a little (okay, a lot) sad to think about.

I worked on two projects during that stretch, and the second one was rough.

There were plenty of things worth raising with my teammates from a few different angles, and I just stayed quiet about them instead.

Even now, replaying it in my head, I don't think that version of me could have chosen any differently. It's not that I want to undo any of it. Looking back with some distance, though, here's how I'd put it:

<div align="center" style="padding: 15px 0 15px 0; font-weight: bold; font-size: 19px;
    word-break: keep-all;">
"There can be a better way to do anything. And I need to find that way."
</div>

Back then, in the middle of my very first project, staying silent cost me more than I expected.

> This line is from [Simple Software](https://so-so.dev/essay/simple-software/), and it's still my favorite line out of anything I've read.

Two things came out of it.

- Feedback on my code: it read rushed.
  - I was stuck on this idea that I had to "write it fast."
- I started asking myself what it actually means to do good work.
  - I still don't have a clean answer.

Thanks to the teammates who've stuck with me from that internship all the way to now.

## 1.5 main projects

### 2019.03 ~ 2019.09

Counting the internship, I worked on 1.5 projects this year (one of them is still pending).

The project right after the internship was the first time I got to work through a real [structural overhaul](https://speakerdeck.com/soyoung210/heonjibjulge-saejibdao-riaegteu-peurojegteu-gujojojeong), and it was also **the project where I collaborated the most with designers and PMs.**

The product itself was, once again, pretty complex, and some of the code I threw at that complexity got waved through with a "well, there's no other way." Looking back, obviously, there's plenty I'd do differently now.

> There's always another way. 😅

Working through a complex service alongside people in other roles made it obvious that documentation, if only for the sake of having a record, wasn't optional. I bumped documentation up from "if I have spare time" to "make the time" (?), and now that the project's been shelved, I'm honestly relieved I did.

> Past me is basically a stranger to me at this point (...)

I wanted to bring every idea our designer dreamed up to life exactly as imagined, and it stung when my own skills fell short. I still wish, in particular, that I'd been a bit better at SVG. Both of us kept the conversation focused on how to make the UX better, but having to bring up "technical limitations" in the middle of that never felt great.

We ran our own design QA and worked through the tricky spots together, hunting for answers, and that was honestly some of the most enjoyable time all year. Design QA really is the more the merrier: sitting down with the designer, watching screens with animation already layered in, and adjusting things on the spot let us stay flexible in the moment, and it kept the whole project pointed in the right direction, almost like a lighthouse.

## 5 talks, 1 article, and some blogging

### 2019.02 ~ 2019.12

![image](./images/2019_presentation.png)

Five talks, one magazine article, and a tiny bit of blogging (...) this year.

I already wrote up a separate retrospective on the talks themselves [in this post](https://so-so.dev/essay/2019%EC%9D%98-%EB%B0%9C%ED%91%9C%EB%93%A4-%ED%9A%8C%EA%B3%A0/). This year's talks mostly circled the word "growth"; next year I want to lean harder into technical content instead.

As for why the blog went quiet, I think it came down to this idea that a post "has to be perfect." I'm not a smooth writer, and the thought of "write a draft, then keep tweaking it... and tweaking it..." was enough to make me avoid the whole thing.

Next year I want to drop that mindset and just fill the blog with whatever topics come up, without the pressure.

Right now I'm thinking about writing up some k8s translations along with the trial-and-error that came with them, plus notes on web project structure and useful tools for production work.

I also contributed to "Microsoftware Issue 387: Learning Curve." I'd known about the magazine for ages but never had the nerve to pitch them anything, and while I was still hesitating, the editor-in-chief emailed me first.

<div align="center" style="padding: 15px 0 15px 0; font-weight: bold; font-size: 19px;
    word-break: keep-all;">
Editor-in-chief: "Hey, any interest in writing something for us?"
</div>

> Heavily dramatized. 😅 (In reality, he asked very gently.)

I wrote up about 10 pages covering everything from the moment I decided to become a developer through the end of my internship.

![image-2](./images/2019_retro_3.png)

Thank you again to editor-in-chief Byungseung Cho, who had to deal with my rough writing more than once.
Getting to polish my own story together with a professional editor was a meaningful opportunity in its own right, and if you're hesitating to pitch something the way I once was, out of that same unfounded fear, I really do recommend just going for it.

## Infrastructure and documentation

### 2019.10 ~ ongoing

![image-2](./images/2019_retro_1.png)

I went in knowing absolutely nothing about how web services get deployed or how CI/CD works, so I studied the topic from scratch for the first time and wrote up what I learned to share.

Until now, honestly, I'd filed this under "not my job." But I think the initial deploy setup for a web service I've built, and even directly keeping an eye on the production environment, ends up on the web developer's plate too, one way or another. Or, without dressing it up: what I really wanted was just enough understanding to collaborate.

> I had zero idea how any of it actually ran, or what I was even supposed to ask the DevOps team for when it came to deploy setup.

This was the first time I studied something outside frontend, and my goal now is "being able to talk with the DevOps team without friction." 😁

## Running the For.D community

### 2019.04 ~ ???

![image-4](./images/2019_retro_4.png)

I've been part of the organizing team for [For.D](https://www.facebook.com/ForDeveloperKorea/), a community for junior developers.
I got into it because I'd received so much from this field and wanted to give some back, and it turned out to be **really hard.**

Putting on an event that actually helps the people who show up, with nothing missing, eats a huge amount of the organizers' time, and none of that time comes with any kind of compensation. That was the hard part for me, and the part that gave me the most to think about.

After three events, doing For.D work on top of my day job started to weigh on me, and since everyone else on the team has their own job too, I've been treating this as an open-ended break rather than anything more definite.

> I still haven't landed on any real conclusion about it.

My biggest regret from this year, though, is that I don't think I shared that weight wisely with the rest of the organizing team. Mostly, I think I just left them carrying it.

## You don't have to try so hard. <br/> No, you shouldn't try so hard

![image-5](./images/2019_retro_5.png)

To be clear, I'm not saying you should coast and collect a paycheck for nothing.

Ever since the internship, anxiety had turned working late into a habit. Even after I left the office, all I did was company work(!), and whenever I estimated a schedule, I'd quietly pad in an `over run` estimate and hand that over as the plan.

A runaway train with no brakes eventually derails. My stamina was visibly draining, and because I never stopped to take stock, I never had time to actually think about where my career was headed.

**That was a seriously dangerous place to be in.**

I couldn't even estimate how much work I could realistically do in how much time. And it hit me that I hadn't been thinking about this as a career for the long haul.
So I stopped working late, no exceptions. I started thinking hard about what kinds of experience I actually needed to grow as a developer, and while I still sometimes code for work after hours, I started carving out time that's just mine too: my blog, side projects, and so on.

I'm trying to take the long view as a developer now. I want to keep walking this path, and I've come to think of it as a marathon, not a sprint. 🏃‍♀️

## What about 2020?

Just like last year, I'll wrap this up with a modest list of plans.

### Finish the side project

I'm aiming to finish, by April, the side project I just started at the tail end of this year.
I've made every excuse in the book and haven't even merged a first PR yet, but for the first half of next year, any time outside work and exercise is going toward this project and nothing else.

### Back to exercise, again

Before I started working, I kept up a workout routine for over 10 months straight, then took a full year off once I joined the company, and my stamina has taken a real hit.
This time I want to pick up tennis or squash and actually stick with it.

## Wrapping Up

<div align="center" style="padding: 15px 0 15px 0; font-weight: bold; font-size: 19px;
    word-break: keep-all;">
I ran into so much this year, did my best through all of it, and next year, let's grow past who I was this year.
</div>

I wrote basically this same line in last year's retrospective, and it still holds this year. The difference is that last year it was loaded with impatience; this year I want to set aside the need to "hurry up" and think hard about `direction` instead as I move forward.

Finally, everything in this retrospective was only possible because of every single person I got to meet this year. They're the reason I learned and grew at all.

Thank you, and I'm looking forward to 2020 with all of you.
