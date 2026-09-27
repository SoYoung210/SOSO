---
title: 'What I Learned in 150 Days -1'
date: 2019-05-24 00:07:63
category: essay
thumbnail: './images/what-i-learn-150/first_title.png'
---

I took my first step into frontend on July 17, 2018, starting with an online React course, and started as an intern on December 26, 2018. This is a record of the 150 days since.

These days I'm working as part of the Web team, and I want to look back on that stretch and push one step further as a frontend developer.

## Part 1 - Communication & Thinking

1. Collaboration takes skill.
2. A developer builds the product.
3. Documentation isn't optional.
4. My code is the team's code.
5. You always need a different angle. (feat. arguing perspective vs. perspective.)

## Part 2 - Tech

1. Clean Architecture
2. TypeScript
3. RxJS

This is split across two parts, and Part 1 here covers `Communication & Thinking`. 😀

## Communication & Thinking

![image-first-title](./images/what-i-learn-150/first_title.png)

Working at a company for the first time, literally everything felt new.  
Landing in a tech org of 30-plus people and a 5-person Web team gave me a lot to chew on around **collaboration**, something I'd only ever thought was important in the abstract.

<div>
<img src="/media/essay/images/what-i-learn-150/my-github.png" />
</div>

### 🍌 Collaboration takes skill.

Building a single product takes effort from a lot of directions.  
From the actual coding — view, API, infra — all the way to deployment, plenty of hands touch it along the way.

The single most important thing I took from all this: **"my colleagues' time and my own time are both valuable."**  
![image-time](./images/what-i-learn-150/05.jpg)

Working five days a week, eight hours a day, there's no shortage of things competing for that time:

1. Planning meetings with everyone on the same project
2. Actually building things
3. Code review
4. Team meetings, one per discipline

Doing all of that well, I decided, takes actual skill.

#### `Skill 1. Come with a prepared question`

Building things means asking a lot of questions along the way.

> 🍌 : Oh, so-and-so touched this part before. I should just ask them.  
> 🍌 : This deploy needs to go out a certain way, and something's not lining up…  
> 🍌 : This API response… I'm not following it.

I know what I already tried and why it didn't work, but my colleague has none of that context.  
Blurting out a question with no explanation of the problem, or what I'm actually trying to solve, leaves them with nothing to work from.  
**Vague questions get vague answers, every time.**

So before asking anything, I try to hold myself to a few rules:

<div style="background-color: #f6ffed; padding-top: 10px; padding-bottom: 10px">

1. Lead with the point.  
   👉 What I'm building right now, and the end result I'm aiming for.

2. What has to be factored in along the way.  
   👉 External libraries, dependencies, and the like.

3. I tried approach A to fix it, and ran into error A-1.

4. Based on that, I'm guessing approach B might be the fix, and here's why: B-1.

5. Does this direction make sense, or should I be looking at something else entirely?

</div>

Ask it this way, and suddenly the whole situation is legible.

😎 **What my colleague says back**

1. Oh nice, I've hit something similar and went the same route.  
   Watch out for issue XYZ along the way though — let me send you a link or repo worth checking.

2. Hmm, `B-1` doesn't quite hold up as reasoning. I think approach C is the better call here.

Only after drawing a clean line between what I know and what I don't does the "don't know" part actually become fast to learn.

#### `Skill 2. Meetings that don't waste time`

Same logic as the `limited time` from Skill 1: meetings need skill too.
I've split this into two cases — running a meeting, and sitting in on one.

#### When you're running the meeting.

What matters most is knowing exactly what you want nailed down by the end of it.  
Come in with an agenda: what's up for discussion, and what decisions you're actually hoping to walk out with.

For a new piece of work, I asked a colleague with relevant experience for time, and showed up with the question list below.

![image-question](./images/what-i-learn-150/question.png)

The meeting ran as them answering my list one by one, and by the end it had done exactly what I needed: cleared out the gray areas that were slowing my work down.

> Without that list, we'd have burned time just fishing for questions: "hmm... what else might you not know?"

#### When you're just attending.

A meeting exists for a reason. **Because my colleague's time is worth something,** I try, as an attendee, to work out my own thoughts on the agenda before I ever sit down.

Start thinking only once the meeting's already underway, and you're unlikely to think it through properly — which is a good way to end up walking back your own opinion mid-conversation.

#### `Skill 3. Soft language.`

I already thought this mattered before joining, but it's mattered even more since. Most of our conversation happens over Slack, and code review over GitHub. People come from wildly different backgrounds, and in any conversation, over text especially, what I mean can land completely differently from what I intended. None of that should ever be allowed to slide into something personal.

1. Whenever I put an opinion out there, I start from: "this is just what I think, and I could be wrong."  
   In code review, or anywhere else I'm voicing an opinion, of course I could be wrong, and a better idea might already exist. It should also just be assumed that a colleague has a perfectly good reason for seeing it differently.

> 🍌: I'd guess it works like ~~, but what do you think, 😎?  
> 🍌: Oh wait, I thought it worked like ~~. Curious why you wrote it this way, 😎! If I've got it backwards, I'd appreciate you setting me straight.

2. That said, still be clear.  
   Rambling is hard to follow whether it's written or spoken, and it wears out whoever's on the other end. I make a point of emphasizing what actually deserves emphasis, and always keeping a clear TOC (Table of Contents) for whatever I'm explaining.

> `Example) Writing something out`  
> **Point 1**  
> An explanation of that point, phrased so it actually reads well  
> **Point 2**  
> An explanation of that point, phrased so it actually reads well

> `Example) Talking it through`  
> So first, I want to walk through **part 1, part 2, and part 3.** ~

If I had to name the single most important part of collaboration, it's mutual respect.

### 🍌 A developer builds the product.

A developer isn't just someone who writes code. That's a small part of a bigger job: helping build the product.

Whether I'm the one writing the code or not, if it's something our team ships, I need an opinion on it and I need to think about it from the user's side.  
Customers use this thing. The product is how I actually meet them.

Before a single line of code gets written, this is the question worth sitting with:

**What impact will this product actually have on the people using it?**

I need to actively speak up about what might be inconvenient, and actually understand where the thing I'm building is headed.  
Because how strange would it be to build something and not understand parts of it myself?

### Documentation isn't optional.

This is something I pay close attention to on the job.

![image-0](./images/what-i-learn-150/00.png)

I feel responsible for making sure a problem I ran into doesn't just repeat itself for someone else.  
The code I write at work belongs to the team now, and a colleague shouldn't have to hit the same wall I already did.

> 🍌 : (Shouldn't flailing around on any given problem only have to happen once?)

We're not all on the same project, so sharing what happened and how it got fixed goes a long way toward solving this.

What it takes to understand this project, what problems came up in it, where its dependencies sit: writing all of that down is, I think, non-negotiable once code belongs to **the team** and not just to me.

### 🍌 My code is the team's code.

I'm the one typing it, sure, but zoom out even slightly and it's code the Web team owns.  
We're developers, which makes collaborating through the code itself just as important as collaborating in conversation.

#### Consistency

Variable names, structure, how components are written — all of it needs to stay consistent.  
The goal is that anyone can glance at a small slice of the project and immediately know its rules, which only works if the whole project actually follows them.

1. redux naming  
   Using a PREFIX, the requestAAABBB convention, where error handling lives
2. view structure  
   Splitting container from presentation.
3. Folder tree  
   api, entity…
4. lint
5. sorted stylesheets

#### Readability

For my code to actually earn its place as the team's code, it has to be **consistent and easy to read**, full stop.

This came up constantly during code review.
![image-1](./images/what-i-learn-150/01.png)

![image-2](./images/what-i-learn-150/02.png)

On top of that:

1. Declare `const`s at the top of the function.
2. Use the `condition && <div />` pattern to cut down on what a reader has to parse.
3. Push condition checks into their own functions (a long condition is hard to follow inline).

```js
if(conditionCheckFn) {
    // actual logic
}

const conditionCheckFn => (
    condition1 || condition2 || condition3
)
```

4. Names that actually mean something

![image-3](./images/what-i-learn-150/03.png)

![image-4](./images/what-i-learn-150/04.png)

> This wasn't actually a self-review — two teammates and I reviewed it together in person, and I was just the one typing the comments. haha

### You always need a different angle.

The various perspectives I've picked up at work — architecture choices, coding style — aren't actually correct answers.  
Or, to put it more precisely, I think **there's never a single correct answer.**

#### Perspective vs. perspective

How you structure folders, or which code style you pick, matters a lot more than it seems like it should.

These are the things you end up hashing out most, either during setup before a project starts or in code review.
And the thing that actually makes that conversation work is **arguing perspective versus perspective.**

That's not the same as being stubborn. Here's what I mean:

> 🍌 : I think this button should probably move into a util? Feels reusable.  
> 😎 : Hmm… treating every single component through this "is it shared or not" lens every time gets complicated… (rest omitted)

Talk it through this way, and you find the holes in your own thinking, plus an entirely different way to look at the same problem.

Enough of these conversations, and my perspective sometimes becomes the team's, and the team's sometimes becomes mine.  
**I walked away from every single problem with an opinion I could actually call my own, and maybe that's just what growth looks like.**

### 🍌 Wrapping up

150 days, and I thought about a lot, learned a lot. I want to keep growing by never letting up on asking myself questions and working out my own answers.

![image-6](./images/what-i-learn-150/06.jpeg)

> (...)

## Reference

[On how junior developers grow](https://speakerdeck.com/jaeyeophan/junieo-gaebaljayi-seongjange-daehaeseo)

[The kind of developer people want to work with](https://speakerdeck.com/jaeyeophan/gdg-campus-2018-meetup-balpyojaryo-hamgge-ilhago-sipeun-gaebalja)

## See also

[Operation Intern Landing](https://speakerdeck.com/soyoung210/inteonsangryugjagjeon)
