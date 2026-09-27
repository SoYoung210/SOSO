---
title: 'Turnover.log(''SoYoung'')'
date: 2021-01-27 17:01:21
category: essay
thumbnail: './images/2021_turnover/thumbnail.png'
---

![image-thumbnail](./images/2021_turnover/thumbnail.png)

My job search just wrapped up, so I want to write down everything I prepared and lived through along the way. Partly this is for me, to look back on the last two months. But I'm also hoping it's useful to anyone weighing a move, or already in the middle of one.

## Why change jobs?

Before you do anything else, answer this question.

Your answer tells you how happy you're likely to be on the new team, and it's what carries you through a search that eats up a huge amount of time and energy.

Changing jobs means joining somewhere new, but it also means leaving somewhere behind. If what's really driving you is wanting more from your current team, have that conversation first. Every team has its trade-offs, and it's worth honestly asking yourself whether you're solving a real problem or just running from one. You lose nothing by taking that time before you actually start looking.

After weighing all of that, I decided a move made sense, and I started preparing in earnest in November.

## Which companies to apply to?

What you're looking for in a company depends entirely on why you're leaving. You might spend years on this next team, so it's worth pulling information from every channel you can find.

First, I checked whether a company's vision and culture actually matched the direction I wanted to go. At this stage that meant public sources: the product itself, job descriptions, culture pages. There's no way to know for sure without actually working there, so I figured interviews and coffee chats could handle whatever was still unclear.

What I wanted was **"a team solving problems I actually cared about, with a culture built on autonomy and responsibility."**

## Keeping a record

![turnover_notion](./images/2021_turnover/turnover_notion.png)

How long a search takes varies, but two to three months is typical, and carving out time for it on top of a full-time job is honestly hard. That's exactly why **staying organized and keeping records** matters so much.

I tracked everything in Notion, from interview prep to a timeline for every company, and it ended up being the one thing I could count on from start to finish. Even when it came time to weigh the final offers, going back through my notes on each interview's questions and how it felt let me think it through properly.

Writing up my resume was where this paid off most: listing out the questions it might invite, and drafting answers ahead of time. Even things I knew cold could come out garbled the moment an interviewer actually asked, so I tried to anticipate as many questions as I could and write answers in advance. **Almost every question I'd have asked, if I were the one interviewing, came up in a real interview somewhere.**

## Resume

I leaned heavily on Jbee's [Turnover journal 2: Resume](https://jbee.io/career/2020-turnover-2/) while putting mine together, then condensed my [public resume](https://so-so.dev/about) into something I could post on Wanted's resume platform.

## Technical interviews

![tech_notion](./images/2021_turnover/tech_notion.png)

After the resume screen, some companies move straight to a take-home assignment or a live coding round. Others skip that and go directly to an in-person interview.

Out of everywhere I applied, two ran a live coding test and two ran a take-home assignment. Everyone else skipped straight to the in-person process.

### Take-home assignment

I actually enjoyed the process at both companies that used a take-home assignment, and I grew a bit from it too. The deadlines were seven days and three days, and neither spec was more than the timeline allowed for.

**Doing the assignment, I rethought everything from zero and made sure every piece of code had a reason behind it.** Copy over a function I wrote in the "past" without a second thought, and both the interviewer reading it "now," and I myself, might end up questioning why it's there.

I'd already shipped plenty of projects at work, but this pushed me to rethink things like building extensible components, handling business logic, layering responsibility, and organizing folders. I came out of it a little better for it.

> Maybe it was all that rethinking, but both companies came back with good news.

Once everything was implemented, I put myself through two or three rounds of self-review, and each pass turned up more to refactor, from function names down to the underlying logic.

### Live coding test

One company ran an algorithm test; another had me build a small feature live in [CodeSandbox](https://codesandbox.io/). This probably depends on the person, but both wore me out.

My honest take: unless algorithms are actually core to the product, they're a shaky way to judge how someone performs on the job. I hadn't specifically studied algorithms since my very first job hunt, so the whole live round was rough.

The CodeSandbox spec itself was small, but going live somehow broke things that normally just work (tunnel vision does that), and I made mistakes I never would otherwise. A one-hour clock hanging over the whole thing added a lot of pressure.

The outcome was fine here too, but I wasn't happy with how I performed in the moment. Looking back, I might have done better leaning toward **companies whose process actually lets you show who you are.**

### In-person interview

I started prepping for in-person interviews almost the moment I started the whole search. Some questions were plain knowledge checks; others dug into experience straight off my resume, roughly an even split. So I prepared along those same two tracks.

**Resume-based**

I read my own resume like an interviewer and worked out what I'd ask. Say Project A used redux-saga and Project B used swr; **of course someone's going to want to know why the stack changed.**

From there they'd probably push into the trade-offs between redux-saga and swr, or how each would hold up on a much bigger or much smaller project.

> Even if the decision wasn't yours to make, it's a fine answer to just be honest: here's the reasoning behind it, and here's what turned out great (or disappointing) once the project was underway.

Starting from a keyword on my resume, I kept chasing every follow-up question it could lead to, and kept writing until it actually made sense to me.

I only started this exercise to prep for interviews, but it ended up exposing gaps in my own past technical decisions, and filling those in was worth it whether or not anyone ever actually asked.

**Knowledge-based**

I was apparently too drained after each interview (...) to write these down properly at the time, but the knowledge questions were mostly quick back-and-forth checks. Here are the ones that stuck:

- What do the `async` and `defer` keywords do on a script tag?
- What are the ways DOM events propagate, and what happens when you call a given event method?
- Explain the difference between var, let, and const.
- Explain the iterable and iterator protocols. (Probably came up because my experience section mentioned redux-saga.)
- Explain reflow, repaint, and layout thrashing.

### Reverse Interview

Every single interview ended the same way: "anything you'd like to ask us?" As a new grad I used to agonize over sounding smart. This time around I went in believing an interview isn't just a gate you pass through, so I asked whatever I was actually curious about, or whatever would tell me something real about the culture.

I could never fully read a team from the outside, but these conversations at least showed me, in small ways, where my own priorities lined up with theirs, and where they didn't.

### Culture interview

I got asked, over and over, why I was leaving and why this particular team. For this one I again leaned on Jbee's [Turnover journal 5: Culture Interview](https://jbee.io/career/2020-turnover-5/).

Since I'm on a leave of absence from school, I also got a lot of questions about my plans there. Fair enough. But a few interviewers stated their own opinion (that I should finish school as fast as possible) like it was simply correct, and being nudged to accept someone else's answer as the only right one was disappointing every time.

The culture interview also ended with a chance for me to ask questions, and one answer in particular has stayed with me.

**"If the org starts growing really fast, doesn't alignment start to break down? How do you think about that?"**

I happened to be thinking a lot about org culture around then, so the answer gave me a lot to chew on. I also asked around the product vision, and what kind of team they wanted to build going forward.

## Compensation negotiation

![timeline_notion](./images/2021_turnover/timeline_notion.png)

A number of companies came back with good news, and from there it moved into compensation talks. Unlike interview prep, there wasn't much I could rehearse ahead of time, and this ended up being the hardest part of the whole thing.

Every company opened by asking my **desired salary**. I held off at first since I had no read on their budget, but the negotiation just doesn't move without a number, so eventually I thought it over and gave one.

After spending the whole interview process talking vision and culture, switching to money mid-conversation scrambled my thinking more than I expected. Whatever number I landed on, "is it okay to ask for this much?" wouldn't leave me alone.

Looking back, I spent way more time on this alone than it deserved. Asking for a billion won doesn't obligate anyone to hand it over, and naming a billion won as my number doesn't erase everything I showed them in the interviews and leave just "a billion" behind.

> Granted, in real life, actually asking for a billion won probably would make everything you showed in the interviews vanish behind that number. "A billion won" here is just a stand-in figure. 😉

There's no need to always aim high, and no need to talk yourself down out of second-guessing either. Salary obviously matters a lot in any job search. I'd lay out every scenario you can think of: what you'd want if you moved, whether you'd rather just stay somewhere you're already settled if the gap isn't big enough, and so on. Work through enough of these and the number narrows itself.

I honestly don't know if agonizing longer gets you a better number. So I generally gave myself about a day and then replied. Getting back to the recruiter quickly and moving the conversation along seemed like a better use of time than sitting with the question alone.

### When you're actually negotiating

⚠️ This isn't a trick for squeezing a better number out of an offer. An offer negotiation is really just another work conversation, so this is more about running that conversation efficiently.

- If you feel cornered, or you're not sure how to answer, **just say so and ask for time to think it over.** Changing jobs isn't small, and it's the last thing you should rush. And if a company can't spare you even a day, what does that tell you about how much room they actually have? 🤔
- Most offer letters are supposed to stay confidential, so it's fine to only share what's actually necessary as you go.
- Work out **your reasoning for the number** ahead of time. Maybe it's another offer letter, maybe it's experience the company specifically needs. Handing over your reasoning along with the number tends to make the whole conversation easier.

### Stock options

If you're joining a startup, stock options usually come up too, so it's worth thinking beforehand about how you want cash and equity to split. Leaning more toward stock or more toward cash is a personal call. Neither one is objectively better.

### Other Story

One company rescinded my offer right after I named a number, and it threw me. I never expected stating a desired salary to function as a "final interview," but that's basically what happened, and it stung. I get that a wide enough gap in expectations can do that, but it was still jarring: right after they told me I'd passed, the first thing they said going into negotiations was, "let's keep talking this through together."

I'm including this to say: if something like this happens to you, it's fine to not let it shake you too badly. Speak from your own convictions and you won't have regrets. Everyone's convictions are different, and none of them are wrong.

## Rest plans

![vacation_notion](./images/2021_turnover/vacation_notion.png)

After leaving, I ended up with a real stretch of time off. With COVID ruling out meeting people or traveling, I've been thinking about how to spend a break like this well, one I probably won't get again. There's no such thing as resting "well," really, but I still want to fill it with things that feel worthwhile to me.

I made a list of things I've wanted to try and things I figured I needed, and sketched out a rough daily routine in advance.

![lifecycle_notion](./images/2021_turnover/lifecycle_notion.png)

I've been fixing my flipped sleep schedule, and reading the books people gave me through "Chaek-Santa," a Secret-Santa-style book swap, when I left the company. There's a nagging fear that stepping away from code for too long is a bad idea, so I'm also chipping away at side projects I'd kept putting off, trying not to lose my feel(?) for development.

Looking back on these two months, there was plenty that was hard, but I'll remember it as a stretch that taught me a lot, in more ways than one. I'm grateful to everyone who talked me through it.

The search ended well. Here's hoping the next chapter of my career turns out to be just as good a story.
