---
title: '[Book Review] Simple Software'
date: 2019-11-19 20:11:22
category: essay
thumbnail: './images/simple_software.jpg'
---

![image-thumbnail](./images/simple_software.jpg)

I got picked as a Gilbut reviewer and received a copy of Simple Software. True to its description, not a single line of code shows up anywhere in it. It's built entirely out of the author's own thinking and experience. I read it with a pen, no laptop in sight, underlining passages while picturing my own past, present, and future.
There was so much I liked that I spent ages just figuring out how to structure this review. In the end, I settled on going Part by Part, noting what stood out and adding my own thoughts.

## Chapter 2: The Right Attitude
The 'right way' usually means a way of handling every situation that could possibly come up.
**Not knowing the right way**
Maybe more studying would fix that. But you can't just decide there's a ceiling on what you can do and write code to a 'good enough' bar. My compromise becomes context a colleague can't see, which quietly compromises the collaboration itself.

**It's just too hard**
Fair. I've been there myself, more than once. But the point isn't that it's okay to leave compromised code behind because of that; if the schedule's too tight, go get more time, and do it right. I'm no superhuman developer, so of course doing it right takes effort. Compromise still isn't on the table.

## Chapter 4: Software Design in Two Sentences
* Cutting maintenance effort matters more than cutting implementation effort.
* Maintenance effort scales directly with system complexity.

## Chapter 8: Complexity Is a Prison
It really is. I'm not a solo developer, so obviously I want to actually be off when I'm on vacation. There's a teammate next to me, and I'm someone else's teammate too. My code doesn't belong to just me. So it has to be written so anyone can pick it up and change it without a fight. I forget this simple rule more often than I'd like.

## Chapter 12: Two Is Too Many
There's a rule I follow when designing something, and it goes by the name `two is too many`.
```
You first need to know what level of generality to cover.
Design a general-purpose solution that fits the specific purpose.
```
The idea: the moment you find yourself handling similar logic to cover multiple formats, **don't copy anything**, build a superclass or a utility library instead.

This one really landed for me, since so much of what happens on the frontend comes down to reshaping data to fit a view, and that means a lot of logic ends up overlapping, just slightly, over and over.
When I build a shared util function for that, I try to think as hard as I can about **designing it to work anywhere, generically**, not just for the one case in front of me.

### Refactoring
```
When there are many implementations that need to be consolidated into one, start by limiting yourself to consolidating just two implementations at a time.
```
I agree that refactoring shouldn't start out as some grand production. I've had that experience of feeling completely lost, not knowing where to even begin, let alone how to actually fix things once I understood the problem. Starting from small functions and committing to doing it 'a little, but regularly' is exactly what the book means by **sustainable refactoring**, and I'm fully on board.

## Chapter 15: Where Bugs Come From
```
A box with millions of buttons on it, none of them labeled with what they do, has no correct way to be used.
```
The book pins bugs on 'complexity.' I agree with that, to a point (bugs come from everywhere, plain human error, all the way to causes nobody could've predicted, so there's more than one culprit). But at the very least, lower complexity obviously makes debugging easier.

Something feels simple to me largely `because I wrote it`, and I think good code has to account for the fact that someone else is going to read it.
> Personally, I recently went back and forth between 'code that looks clean' and 'code that's easy to read but has a bit of duplication.' Sure, some of that's probably just my own skill gap talking, but I ended up deciding I should consciously pick the easy-to-read, slightly-duplicated version.
> Clean-looking code pulls me in more than I'd like to admit.

This chapter closes with two lines that sound obvious but get overlooked all the time.
1. The simpler the code, the fewer bugs it'll have.
2. Always work to make everything about the program **simpler.**

## Chapter 18-19: Productivity
This section was all about productivity. Honestly, 'measuring developer productivity' feels like something everyone secretly wants an answer to, which pulled me in even more.

Reading it, I could picture what it's actually like introducing new tech or a new structure to a team, and I liked how grounded and specific it got about winning teammates over.
```
You need to gather allies who will be on your side, 
and that has to be built on trust, and you must not demand 'perfection' from the change. 
```
Even in a team stacked entirely with good people, an organization that keeps moving needs its changes to stay gradual, or people burn out just trying to keep up, and the whole direction stops being sustainable.
> 'Ally' might sound like a strong word, but I read it as the process of lining up with colleagues who agree with you and reinforcing that shared stance.

Another line from this chapter that stuck with me: **never carelessly promise you'll produce a graph showing how much developer productivity improved thanks to a refactor.**
Instead of a grand 'announcement' about something hard, let refactoring soak into the team's culture through 'ongoing suggestions.'
> The book recommends starting small, something like 'we'd need to refactor this to make the feature easier to write,' and proposing refactoring wherever the opening comes up.

The part after that, on 'how do you measure productivity,' honestly didn't land for me. The thinking on organizational improvement and direction was solid, but I never got an actual how-to for measuring productivity out of it. It's a hard problem, and it probably has to vary by organization and by what each one is actually building, so maybe that's unavoidable.

## Chapter 20: Handling Code Complexity at a Software Company
The idea: find the parts of the code that make you feel, emotionally (the book leans hard on that word), annoyed or scared, list them out, and work through them by priority.

I'd just given a [talk](https://speakerdeck.com/soyoung210/heonjibjulge-saejibdao-riaegteu-peurojegteu-gujojojeong) on restructuring not long before this, which made the whole section land even better for me.

## Chapter 35: The Power of 'No'
I used to think the most important thing about collaboration was collaboration itself, and from that angle, I put a lot of effort into 'saying things softly.' Looking back, too much hedging just muddies the point, and a 'vague no' leaves the other person unable to actually weigh what you meant.
Because 'collaboration' actually matters, I fully agree that even a negative opinion needs to be said clearly.

But, as the book points out, none of that means 'go be rude.'
Obviously my colleagues aren't only making bad proposals, and even when I have to turn one down, I owe it to them to separate what's good from what isn't. Even if the whole thing turns out to be off, the time they spent wrestling with the problem deserves a thank-you. That's just basic manners in collaboration.

## Chapter 36: Why Programmers Are a Mess
The title's pretty inflammatory, but underneath it, this is really just 'keep studying, consistently.' The specifics read a bit like a textbook I haven't lived yet, but here's the part I want to hold onto.
```
The belief that there's always more to learn from everyone,
the belief that knowledge and practice are the key to mastering a skill,
the belief that you have to know what you don't know and put in the knowledge and practice to learn it
```

## Overall
It's an easy read that still gives you plenty to chew on. But like any book about fundamentals, it takes deliberate effort to actually make it stick.
There's too much here (productivity, complexity, the power of 'no,' and more) to just skim past.
Overall it's great, though the bit about security that shows up partway through left me thinking, why is this even here.
