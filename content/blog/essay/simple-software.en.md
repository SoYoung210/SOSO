---
title: '[Book Review] Simple Software'
date: 2019-11-19 20:11:22
category: essay
thumbnail: './images/simple_software.jpg'
---

![image-thumbnail](./images/simple_software.jpg)

I was selected as a Gilbut reviewer and received a copy of Simple Software. True to the book's description, not a single line of code appears in it. It's a book steeped in the many thoughts and experiences that come out of the author's own experience. I read it imagining my own past, present, and future, underlining passages without ever opening my laptop.
There were so many parts I loved that I genuinely struggled with how to write this review. In the end, I decided to write down what I liked from each Part and add my own thoughts.

## Chapter 2: The Right Attitude
The 'right way' usually means 'a way that handles every situation that could possibly arise.'
**Not knowing the right way**
Maybe studying a bit more would solve it. But you shouldn't decide there's a limit to what you can do and write code to the standard of 'this is good enough.' My own compromises become context my colleagues can't understand, and that's a step toward compromising collaboration itself.

**It's too hard**
That can happen. I've genuinely felt that way myself at times. But the important thing isn't that it's fine to leave behind code you compromised on because of that — it's that if the schedule is too tight, you need to secure more time and do it the right way. I'm not a superhuman developer, so of course doing things the right way takes effort. Still, compromise isn't acceptable.

## Chapter 4: Software Design in Two Sentences
* Reducing the effort of maintenance matters more than reducing the effort of implementation.
* The effort required for maintenance is proportional to the complexity of the system.

## Chapter 8: Complexity Is a Prison
That's really true. I'm not a solo developer, so naturally I want to be free to actually take time off. I have teammates who work alongside me, and I'm a teammate to other people too. My code isn't mine alone. So it needs to be written so that anyone can easily understand and modify it. I often forget this simple principle.

## Chapter 12: Two Is Too Many
There's a rule to follow when doing design work, called `two is too many.`
```
You first need to know what level of generality to cover.
Design a general-purpose solution that fits the specific purpose.
```
The idea is that when you need to handle similar logic to cover several different formats, **you shouldn't copy anything right away** — instead, you should build a superclass or a utility library.

This rule really resonated with me, because a lot of what happens on the web frontend ultimately comes down to shaping data to fit a view, so there's a lot of logic that overlaps to some degree.
In that situation, when creating a util function to handle things in common, I think you should think as hard as possible about **making that function designed to be usable anywhere, generically.**

### Refactoring
```
When there are many implementations that need to be consolidated into one, start by limiting yourself to consolidating just two implementations at a time.
```
I agree that refactoring shouldn't start out grand. When refactoring, I've had the experience of feeling completely lost about 'where to even start, and how to fix things after figuring out the current state.' I strongly agree with the view that **sustainable refactoring** means adopting the mindset of starting small, from small functions, and doing it 'regularly, even if only a little at a time.'

## Chapter 15: The Root Cause of Bugs
```
A box with millions of buttons on it, none of them labeled with what they do, has no correct way to be used.
```
The book says that the root cause of bugs is 'complexity.' I actually agree with this to some extent (bugs range from simple human error to other unpredictable causes... I think there are many possible causes). But at the very least, it's obvious that lower complexity makes debugging easier.

What feels simple to me is quite possibly simple `because I wrote it`, and I think good code has to keep in mind the situation where a colleague is the one reading it.
> From personal experience, I recently found myself torn between 'code that looks clean vs. code that's easy to read but has a bit of duplication.' Of course, this is probably partly because my own coding skills aren't there yet, but I came to think that I should consciously choose 'code that's easy to read but has a little duplication.'
> I get drawn to 'clean-looking code' more than I'd like to admit.

This chapter closes with two sentences that look simple but are easy to overlook.
1. The simpler the code, the fewer bugs there will be.
2. Always strive to make everything about the program as **simple** as possible.

## Chapter 18-19: Productivity
This was about productivity. Honestly, I found myself even more drawn in because 'measuring developer productivity' feels like a topic anyone would be curious about.

While reading, I could picture the process of introducing new technology or structure within a team, and I liked how realistic and concrete the process of persuading teammates was described.
```
You need to gather allies who will be on your side,
and that has to be built on trust, and you must not demand 'perfection' from the change.
```
Even in an organization made up entirely of good colleagues, in an organization that keeps moving forward, I think change has to be gradual so that people don't grow exhausted accepting it, and so that direction stays sustainable.
> The word 'ally' might come across as a bit strong, but I took it to mean the process of aligning firmly with colleagues who agree with your position.

And another sentence I found interesting in this chapter was: **never carelessly promise that you'll produce a graph showing how much developer productivity improved through a refactoring effort.**
Rather than a 'declaration' about something difficult, the team's culture should be steeped in refactoring through 'continuous suggestion.'
> The book recommends starting with a suggestion like 'we'd need to refactor this to make this feature easier to write,' and proposing refactoring whenever the opportunity arises.

After that, the part about 'how do we measure productivity?' honestly didn't resonate with me much. The suggestions about organizational improvement and direction were good, but I couldn't come away with a concrete how-to for measuring productivity. It's a hard area, and it probably can't be helped since it varies by organization and by each organization's service.

## Chapter 20: How to Handle Code Complexity at a Software Company
The book talks about finding the parts of the code that make you feel emotionally (it emphasized this point a lot) annoyed or afraid, listing those problems out, and then working through them by priority.

I recently gave a [talk](https://speakerdeck.com/soyoung210/heonjibjulge-saejibdao-riaegteu-peurojegteu-gujojojeong) about a structural migration, so this part was even more enjoyable for me.

## Chapter 35: The Power of 'No'
I've always thought that the most important thing in collaboration is collaboration itself, and from that perspective, there was a time I put in real effort to 'phrase things softly.' Looking back now, excessive rhetorical flourish can blur the point, and 'vague disagreement' from the listener's perspective can make it hard for them to judge the value of what's being said.
Because 'collaboration' matters, I strongly agree that even a negative opinion needs to be delivered clearly.

But, as the book also points out, none of this means 'be rude.'
Of course, my colleagues don't only make proposals that are wrong, and even when you have to decline a proposal, you should distinguish the good parts from the not-so-good parts when giving feedback. Even if the whole thing turns out to be bad, thinking about the time your colleague spent wrestling with that problem and expressing gratitude for it is simply basic courtesy in collaboration.

## Chapter 36: Why Programmers Are a Mess
It's a pretty provocative title, but I'd say it's really an article about 'let's keep studying consistently.' The specifics felt somewhat textbook-ish, things I haven't quite internalized yet, but here's the part I want to remember:
```
The belief that there's always more to learn from everyone,
the belief that knowledge and practice are the key to mastering a skill,
the belief that you have to know what you don't know and put in the knowledge and practice to learn it
```

## Overall Review
It's a book worth reading lightly while mulling things over. But as with any book about fundamentals, it requires conscious effort to actually internalize.
There's a lot of content (productivity, complexity, the power of 'no,' etc.) that would be a shame to just skim past.
Overall it was great content, but the part about security that showed up partway through left me thinking 'why is this here...'
