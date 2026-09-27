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

Even before joining my first company, I wanted to find "a company where I could grow together with the people around me," and my goal, as a developer, is to "grow without stopping." Last year I thought a lot about this topic and shared it in a [talk](https://speakerdeck.com/soyoung210/jeolmang-deuribeun-seongjang-hamgge-ilhago-sipeun-gaebaljaga-doegiggaji). Thinking it over again now, I believe there's no ['silver bullet'](https://en.wikipedia.org/wiki/Silver_bullet) for growth — it comes about, every time, through a lot of deliberation. I want to summarize that briefly here.

## Definition

The word "growth," by dictionary definition, means scale gradually getting bigger. So what is growth for a developer? Being able to build a new feature in one pass, without ever getting stuck? Having CS fundamentals solid enough to answer any question without hesitation? Everyone's definition differs a bit. What matters, I think, is having your own perspective on **what "stage of growth I think I'm at"** even means.

I've defined this standard for myself like this.

<div style="padding: 10px 0; font-weight: bold; font-size: 18px;
    word-break: keep-all;">
"Having more perspectives of my own"
</div>

It's fine if I can't build a new feature well. Knowledge and technique can come from a Google search, or a question to the coworker sitting next to me can produce an answer in ten minutes. That's exactly why I don't think "do I know it or not" is a sufficient measuring stick for growth.

> Of course, knowledge and know-how accumulated through experience can also be called growth. But from a junior developer's perspective, I'm saying that "not knowing something" doesn't make that person a junior who isn't growing.

### My Perspective

What does "my perspective" mean for a developer? I think it means being able to confidently state "what I think is good" about the various situations you run into while working on a project.

It's about thinking through things like what good folder structuring looks like, what elements a project needs to be easy to maintain, and in what situations elements defined under names like `common` or `util` should actually be used — and forming your own perspective on them.

## Just Doing Projects Doesn't Make You Grow

One of the situations where you can build up a lot of "your own perspective" is when starting a new project. But doing a lot of projects doesn't necessarily mean you'll grow.

What matters is how much you deliberated while working on that project. On a recent new project, I wrestled with the following questions.

### What Does It Take for Someone Else to Easily Understand a Project?

I worked on a project with a fairly difficult domain. There were a lot of terms I was hearing for the first time, and a lot of conditional logic that had to be handled in complicated ways. I decided the most important thing in this project was "making it easy for someone else to understand." Even if it meant a bit of duplication, I tried to go with whatever was easier to read.

Below are a few of the things I wrestled with.

#### What the Top-Level Directory Means

The very first depth of folders is the starting point for understanding a project, so I avoided any folder structuring that felt even slightly meaningless. Just as important as splitting folders meaningfully is not overdoing it.

#### Rules That Run Through the Whole Project

For a new person to grasp a project easily, the project as a whole needs "rules that are easy and won't break." Even for a single component, I thought a lot about where it should live, and whether to implement it through composition or through props.
Beyond that, I also wrestled with how to define consistent rules for folder and file names, and how to separate the areas that know about the domain from the ones that don't, in a way that stays maintainable and easy for someone else to read.

#### What Does "Common" Even Mean

I spent a lot of time wrestling with this exact question. This project only managed a single service, and with the domain already separated out, I thought a lot about what would actually count as a shared, common element.

Caught up in the idea that "component reusability matters," I kept asking myself every time, "what would it take to make this component reusable?" — but in the end, the conclusion I reached was that "there really aren't that many cases where components get reused in this project." Rather than chasing good code for its own sake, I aimed for a structure and code that were easy to read, even at the cost of a little duplication.

As a result, I only treated things like the Alert and Dimmed wrappers, and elements that decide Text Style, as common components.

#### How to Respond Flexibly to Change

In the previous section I said readable code matters more than avoiding duplication, but duplicated elements can also hurt a project's understandability. For example, if you can't reuse an existing component when handling a new spec with a slightly changed design from the existing List, I don't think of that as a good component.

So I reduced the number of props and handled most things through composition with children instead. Taking a large object or passing along a lot of props can make the code in the parent component shorter and easier to read, but that component can end up hard to reuse.

I didn't apply this thinking to every single element. As in the example above, I paid especially close attention to this for components like List and Card, since I felt those were areas where the design could get revised frequently.

I'd like to cover the specifics of the project structure in a separate post if I get the chance. It was fun to get to wrestle with these questions on a new project. Early on, I think I spent more than twice as much time writing things down on my iPad as I did actually coding. What matters, I think, is **not so much what you do, but how you go about doing it.**

## Not Letting It Slide

There's really a huge amount to study in development. You need to study all sorts of CS knowledge, and if you say "I'm going to study JavaScript!" it might take more than six months just to understand this one language. But I don't think whether you know this kind of knowledge is what matters. (Same goes for algorithms, of course.)

What I think matters is **knowing why, when, and how a piece of knowledge is used.** Not "because it seems like I'll need it," but studying to fill in the knowledge I was missing to solve the situation in front of me — that's what became my motivation to study.

For example, if an outage happens and the cause turns out to be in an area I didn't know, that knowledge instantly becomes "knowledge I absolutely need." It would be better if I already knew it beforehand and could respond quickly, but reading a book or a blog post once doesn't automatically make it my own knowledge, so it might not come to mind easily.

Not just outages — if you run into a bug during development that was hard to solve, it's worth looking back at least once and asking whether the long hours you spent flailing came down to some gap in your knowledge.

I think just refusing to let it slide at moments like this can, by itself, teach you a lot.

## Big Goals, Humble Attitude

There's something my current company's CTO once told me.

**"That's exactly why you have to do it all."**

Ultimately, I want to become "a developer who does it all." More precisely, I want to study every part related to a web service, for a start.

Until recently, I tried to draw a clear line between what a web front-end developer should handle and what should be requested from another team. But now, with the goal of becoming a "web service developer," I want to directly control as many of the elements a service needs as I can. I want to be a developer who can control the whole picture — how the screens I build, the user experience, and the interactions ultimately reach the user.

This is one of the things I'm most grateful for at the company I work at now. I get to manage things related to web service deployment directly through [IaC](https://en.wikipedia.org/wiki/Infrastructure_as_code), and if there's anything I'm curious or unsure about, I can ask anyone in that field for a code review. The experience of being able, as a front-end developer, to take direct responsibility for so much beyond just the screen, has been a huge source of learning and motivation. If you ever get the chance, I'd recommend looking into how the service you built actually gets deployed and operated, even if it isn't through IaC.

And, always stay humble. As the saying goes, "the world is wide and there are many monsters" — there are still plenty of fields I haven't studied yet. I said I want to pursue "all-around growth," but even within the front-end field, there's far more I don't know than I do. That's why I don't think you should ever take a coworker's or fellow developer's question lightly.

Even a field I know (or think I know) may have been something I didn't know until very recently, and I might even have it wrong. There's no such thing as a stupid question — if anything, the time you spend answering one gives you another chance to organize your own understanding. I try not to ignore that opportunity or brush it off lightly.

## Summary

I feel like I've rambled on about a lot of different things, but that's because the word "growth" has always felt heavy and difficult to me. Just as not everything has a right answer, this post is only a conclusion drawn from what I've been thinking about at this particular point in time.

If I once wanted to become "a developer who writes good code," I now have a new goal too: becoming "the good coworker sitting next to you." I imagine I'll write a new post once I've wrestled hard with a new keyword and reached some kind of conclusion.
