---
title: 'Starting From the Official Docs'
date: 2019-03-04 00:07:08
category: etc
thumbnail: './images/image-0.png'
---

![image-thumbnail](./images/image-0.png)

**Note: this isn't about blaming anyone for not reading the official docs — it's about how much more the official docs actually hold than you'd expect. (This is what So Young thinks about official documentation.)**

## Why ?

Saying "let's actually read the official docs carefully" might sound like something out of a textbook.

> A bit of googling and Stack Overflow will kindly hand you a solution anyway...!  
> But whether the official docs happen to be well organized or not, they all share one thing in common: they're the **fastest way to grasp what features are actually provided**.

- Figuring out which features I actually need
- Learning how to implement that feature in real code

## Let's Read!

Among the libraries I've used so far, some I benefited a lot from thanks to their official docs, and some barely helped me at all.

### React

![image-react](./images/image-1.png)

[React – A JavaScript library for building user interfaces](https://reactjs.org/)  
First off, React's official docs are genuinely easy to read.  
They introduce the basic concepts and cover everything from beginner tutorials to advanced usage.

![image-react2](./images/image-3.png)

[State and Lifecycle – React](https://reactjs.org/docs/state-and-lifecycle.html)  
When I first learned React, I was really confused about lifecycle, state, and props, but looking back, I think the point where I finally started to feel like I understood them was right after reading the official docs. 🤔

Actually, even when you search using the Korean keyword `리액트` (React), there are plenty of well-translated docs in Korean — but in the end, those are pieces reinterpreted and edited by their authors.  
Wouldn't you rather hear directly from the people who built React about what they wanted to emphasize, and what mistakes they anticipated users might run into?  
**If so, it's the official docs.**

From the creators' point of view, a lot has been considered:

- How best to bundle and explain component LifeCycle and State together
- Why you shouldn't mutate state
- What approach **the creators themselves recommend**
- What tutorials to provide so people can pick up the basics

The docs at reactjs.org are the result of all of this being thought through.

> Conclusion: I think React's official docs are a genuinely well-organized set of official docs.

### Ant Design

![image-antd](./images/image-2.png)

https://ant.design/  
Ant Design's docs are **genuinely thoughtful.**

> Honestly, the examples you find by googling can't even keep up with the cases in the official docs.  
> The quantity and quality are on another level. 🤔

For example, say you're using the `Table` component (the Table view Ant Design provides) — it gives you actual example code!! for every design you could think of.

You just find an example whose design is close to what you're trying to build, and make a few small customizations.  
And that whole problem is solved just by looking at the official docs.

### nodegit

![image-nodegit](./images/image-4.png)

[API Docs](https://www.nodegit.org/api/)
The previous two cases are genuinely well-organized docs, and from where I stood, the docs that felt a bit unfriendly were `nodegit`'s.

> In the end, there was a problem I couldn't resolve no matter what I tried, so I raised an issue on that repo and went with a different library instead.

#### What was good

This is probably true of every set of official docs, but ultimately the point of looking at them is to figure out what features are provided.  
The first time I looked at the API Docs, I noticed they even specified whether an API was `async` or `sync` — in that sense, you could call these docs pretty thoughtful.

#### What fell short

There's no mention of usage.

For instance, when you look at the checkout-branch API in [CloneOptions](https://www.nodegit.org/api/clone_options/#checkoutBranch), it doesn't provide any actual usage code, so it felt abstract.  
You have to infer how to use it just from the parameters it takes, and if you get that wrong in the process, there's a high chance of introducing a bug.

And when a bug does show up, resolving it also ends up taking a long time.

## 🚕 Wrapping up

Writing this, I can't quite shake the feeling that it ended up sounding a bit like "here's which official docs I like," but the core point I wanted to make was that **your basic understanding of a library you're using should start from its official docs**.

Even if you end up solving the problem some other way, your research should happen after you've internalized the basics the official docs provide.

> I think that if you only ask questions about the parts you genuinely couldn't resolve with the basic information available, both the number of questions you need to ask and the time it takes will drop dramatically.
