---
title: 'There Is No Silver Bullet for Growth'
date: 2020-04-13 08:00:09
category: essay
thumbnail: './images/growth/thumbnail.png'
---

![image-thumbnail](./images/growth/thumbnail.png)

<div style="opacity: 0.5; padding-right: 15px; text-align:right">
    <sup>Image by: <a href="https://dribbble.com/shots/7093773-Landing-page-exploration">https://dribble.com</a></sup>
</div>

Even before I joined my first company, I wanted to find a place where I could grow alongside the people around me. As a developer, my goal has always been to keep growing without stopping. I thought about this a lot last year and even shared it in a [talk](https://speakerdeck.com/soyoung210/jeolmang-deuribeun-seongjang-hamgge-ilhago-sipeun-gaebaljaga-doegiggaji). Looking back on it now, I don't think growth has a ['silver bullet'](https://en.wikipedia.org/wiki/Silver_bullet) at all. It comes, every single time, from a lot of deliberate thought. Here's the short version.

## Definition

By dictionary definition, "growth" just means getting bigger over time. So what does that mean for a developer? Building a new feature start to finish without ever getting stuck? Knowing your CS fundamentals well enough to answer any question on the spot? Everyone's definition is a little different. What matters, I think, is having your own take on what **"my stage of growth"** even looks like.

Here's how I've defined it for myself.

<div style="padding: 10px 0; font-weight: bold; font-size: 18px;
    word-break: keep-all;">
"Having more perspectives of my own"
</div>

It's fine if I can't pull off a new feature well right away. You can Google the knowledge and the technique, or just ask the coworker next to you and have an answer in ten minutes. That's exactly why I don't think "do I know this or not" is a good enough yardstick for growth.

> To be fair, knowledge and know-how that build up through experience are absolutely a form of growth. What I mean is that, from a junior developer's perspective, not knowing something doesn't make you a junior who isn't growing.

### My Perspective

What does "my perspective" even mean for a developer? I'd say it's being able to confidently say what you personally think is right, for whatever situation a project throws at you.

It's thinking hard about things like what good folder structure looks like, what a project needs to stay maintainable, or when something actually deserves to be called `common` or `util`, and coming out the other side with an opinion of your own.

## Just Doing Projects Won't Make You Grow

One of the best chances to build up "your own perspective" is starting a new project. But racking up a lot of projects doesn't guarantee you'll grow from them.

What matters is how much you actually wrestled with while doing it. Here's what I wrestled with on a recent project.

### What Does It Take for Someone Else to Understand a Project Easily?

This project had a fairly tricky domain. Half the terms were new to me, and there was a lot of conditional logic that had to be handled carefully. I decided the most important thing was making it easy for someone else to pick up, so I leaned toward whatever read more clearly, even if it meant a bit of duplication.

Here are a few things I wrestled with.

#### What the Top-Level Directory Means

The top-level folders are the first thing anyone sees when they open a project, so I avoided any folder that felt even slightly meaningless. Splitting folders up in a meaningful way matters, but not overdoing it matters just as much.

#### Rules That Hold the Whole Project Together

For a new person to grasp things quickly, the whole project needs rules that are simple and won't break. Even for a single component, I spent a lot of time deciding where it should live, and whether to build it through composition or through props.
Beyond that, I thought hard about keeping folder and file naming consistent, and about how to separate domain-aware code from domain-agnostic code in a way that stays maintainable and reads easily for someone else.

#### What Actually Counts as "Common"?

I spent a lot of time stuck on exactly this question. The project only covered a single service, and with the domain already carved up, figuring out what should even count as a shared element took real thought.

I kept getting caught up in the idea that "component reusability matters" and asking myself, every time, "how do I make this reusable?" But the answer I eventually landed on was: there just aren't that many cases in this project where components actually get reused. So instead of chasing good code for its own sake, I aimed for a structure that was easy to read, even at the cost of some duplication.

In the end, I only treated things like the Alert and Dimmed wrappers, plus whatever decides Text Style, as common components.

#### How to Stay Flexible When Things Change

I just said readable code matters more than avoiding duplication, but duplication can hurt a project's clarity too. For instance, if you can't reuse an existing List component when a slightly redesigned spec comes in, I don't consider that a well-built component.

So I cut down the number of props and handled most of it through composition with children instead. Taking one big object or a pile of props can make the parent component shorter and easier to read, but it can also make that component hard to reuse.

I didn't apply this thinking everywhere. I paid especially close attention to components like List and Card, the ones from the example above, since I expected their design to change often.

I'd like to write up the specifics of this project structure as its own post someday. It was fun getting to wrestle with these questions on a new project. Early on, I think I spent more than twice as much time scribbling on my iPad as I did actually writing code. What matters, I think, isn't so much **what you do as how you go about doing it.**

## Not Letting Things Slide

There's an enormous amount to study in development. You need CS fundamentals across the board, and if you decide "I'm going to learn JavaScript," just getting a real handle on that one language could take six months or more on its own. But I don't think whether you know all of it is really what matters. (Same goes for algorithms.)

What I think actually matters is **knowing why, when, and how a piece of knowledge gets used.** My motivation to study was never "I might need this someday" but filling in exactly the gap that was stopping me from solving the problem in front of me.

Say an outage happens, and the cause turns out to be something I didn't understand. From that moment on, that knowledge becomes something I absolutely need. It'd be nice to already know it and respond fast, but reading a book or a blog post once doesn't actually make the knowledge stick, so it might slip away anyway.

It doesn't have to be an outage, either. Whenever you hit a bug during development that's brutal to fix, it's worth asking afterward whether all those wasted hours came down to some gap in your knowledge.

I think just refusing to let that slide, in moments like these, can teach you a lot on its own.

## Aim Big, Stay Humble

Something our CTO once told me stuck with me.

**"That's exactly why you have to do it all."**

What I ultimately want to be is a developer who "does it all." More specifically, I want to study every part of what it takes to build a web service, for starters.

Until recently, I tried to draw a clean line between what a web front-end developer should own and what belongs to some other team. But now my goal is to become a "web service developer," someone who controls as many of the pieces a service needs, directly, as possible. I want to be the kind of developer who owns the whole path: the screens I build, the user experience, the interactions, and how all of it actually reaches the user.

This is one of the things I'm most grateful for at my current company. I manage web service deployment directly through [IaC](https://en.wikipedia.org/wiki/Infrastructure_as_code), and if anything makes me curious or uneasy, I can ask anyone in that area for a code review. Getting to take direct responsibility for so much beyond just the screen, as a front-end developer, has taught me a lot and kept me motivated. If you ever get the chance, even outside an IaC setup, I'd strongly recommend digging into how the service you built actually gets deployed and run.

And through all of that, stay humble. As the saying goes, "the world is wide and full of monsters." There's still a huge amount I haven't studied. I talked about wanting "all-around growth," but even inside front-end alone, what I don't know outweighs what I do. That's exactly why I don't think you should ever brush off a coworker's question, or anyone else's, as beneath you.

Even something I know, or think I know, might have been a total blank to me not long ago, and I could easily have it wrong. There's no such thing as a dumb question. If anything, answering one gives you a chance to sort your own understanding out again. I try not to wave that chance away or take it lightly.

## Wrapping Up

I know I've rambled through a lot here, but that's because "growth" has always felt like a heavy, difficult word to me. Not everything has a right answer, and this post is just where my thinking landed for now.

I used to want to be "a developer who writes good code." Now I have a new goal too: being the good teammate sitting next to you. I'll probably write again once I've wrestled hard enough with a new idea to reach some kind of conclusion.
