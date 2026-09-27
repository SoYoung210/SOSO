---
title: 'Good Code As I Saw It in 2020'
date: 2020-01-25 17:01:21
category: essay
thumbnail: './images/thumbnail-good-code.png'
---

![image-thumbnail](./images/thumbnail-good-code.png)

In a [talk](https://speakerdeck.com/soyoung210/jeolmang-deuribeun-seongjang-hamgge-ilhago-sipeun-gaebaljaga-doegiggaji?slide=58) I gave last year, I said knowing a lot doesn't automatically mean you write good code. And sure, knowing more probably does raise your odds.

But there's a lot more to **"good code"** than knowledge.  
In this post I want to share what good code means to me.
"Good" is subjective, of course, and my take will probably change over time, so think of this as the "2020 version."

## Just Enough Abstraction

Every time I sit down to write a new function, the same doubts creep in.

- 🤔 Might I need this function again somewhere else?
- 🤓 If I turn it into a util now, won't it just be there whenever I need it?
- 😈 Isn't there a more concise way to write this?

How much does each of these actually matter?

### 🤔 Might I Need This Function Again Somewhere Else?

Short answer: don't confuse a one-off util with a general-purpose one. A util that works on basic data is more likely to get reused; a util you built because one specific component needed it is more likely a one-off.

```ts
export const padZero = (num: number, width: number) => {
  const numToString = num.toString()
  const padNumber: number = width > 0 ? width : numToString.length

  return numToString.length >= padNumber
    ? numToString
    : new Array(padNumber - numToString.length + 1).join('0') + num
}
```

Call it like `padZero(2, 4)` and it returns '0002'.
Where would something like this actually get used?  
Hard to say in advance. Padding a number is the kind of thing that comes up all over a codebase, not just in whatever you're working on right now.

```js
let Directions = {
  top(...) {
    // 5 unique lines of math
  },
  left(...) {
    // 5 unique lines of math
  },
  bottom(...) {
    // 5 unique lines of math
  },
  right(...) {
    // 5 unique lines of math
  },
};
```

This example is from Dan Abramov's [Goodbye, Clean Code](https://overreacted.io/goodbye-clean-code).  
`Directions.top` exists to let you resize a shape by dragging its edge. Right now there are only four directions — what happens once more get added?

Here's what Goodbye, Clean Code says about that:  
"Let's say the requirements change, and each shape, each action, now needs several exceptions handled. My code would need to reach for **an even deeper abstraction**, while the old 'messy' pre-abstraction version could absorb the change without much trouble."

A premature abstraction built on the hope that "maybe I'll need this someday" just makes whoever reviews it stop and puzzle over something that didn't need puzzling over. Push it far enough, and the very cleanliness that abstraction was supposed to buy you can disappear entirely.

**Watch out for premature abstraction.**

### 🤓 If I Turn It Into a Util Now, Won't It Just Be There Whenever I Need It?

This is the trap I kept falling into with redux-middleware utils. Every middleware handling async logic looked almost identical — only the action type ever changed. Writing out the same boilerplate every single time got old fast.

So I built a util called `fetchMiddleware`.

```ts
// fetchMiddleware.ts
const fetchMiddleware = (action, fn?: (...args: any) => any) => {
  // logic that handles the api call and errors using the action payload
}
```

Then I told the team: "Just grab this — the whole middleware logic is now one function. It's a bit tangled inside since it handles a bunch of different cases, but you don't need to worry about that part."

Everyone's happy the moment I hand it over.  
**But what happens once someone else ends up owning the project?** The moment they need to debug an error or touch the underlying structure, they'll inevitably end up reading through the `fetchMiddleware` I wrote too.

If a util takes that long to understand, understanding the whole project takes that much longer too. **A product's code is supposed to belong to the whole team** — and by that measure, this code, and this project, weren't in good shape.

"A bit messy inside, but easy to use" is just an excuse for code nobody can read.

### 😈 Isn't There a More Concise Way to Write This?

This is a question worth asking constantly, and also one worth being suspicious of.
The thrill of squeezing ten lines into one is an easy trap to fall into. Put a bit bluntly: if readability is all you're judging by, just laying the data out plainly can beat solving it cleverly with `map` or `forEach`.

Chase extreme brevity hard enough, and readability is the first thing you give up. **Concise doesn't automatically mean good.**
Aim for the middle ground instead — code simple enough that anyone can follow, while still cutting the repetitive boilerplate that wears developers down.

## Just Enough Function Composition

A function's result doesn't always have to be handled as a plain value — composing functions together can be a better way to express the same thing.

Take generating a Slack message block as an example.

- An Image Message is only needed when a particular API call comes back as an error (`sendSlackForError`).
- `createSlackMessage` is the function that builds the Slack message.
  - It's used for both the success and the error case.

Here's what I wrote first.

```ts
const createSlackMessage = (
  title: string,
  message: string,
  imageUrl?: Image,
) => {
  const defaultMessage = {...}
  if (!imageUrl) return defaultMessage

  return {
    ...defaultMessage,
    blocks: defaultMessage.blocks.concat({...})
  }
}
```

One function is handling both cases of building the Slack message. That means it's doing more than one job, and its responsibilities need to be split apart.

> Worth noting here: splitting up responsibilities isn't premature abstraction, and it isn't chasing extreme brevity either. It's **a search for a better pattern.**

Adding an ImageBlock is optional, and in that case `title` and `message` go unused. So I pulled the ImageBlock logic into its own function and refactored `createSlackMessage` to call it through a ternary.

```ts {8}
const createSlackMessage = (
  title: string,
  message: string,
  imageUrl?: Image,
) => {
  const defaultMessage = {...}

  return imageUrl? addImageBlock(defaultMessage, imageUrl): defaultMessage
}
```

Splitting off the ImageBlock concat made `createSlackMessage` more readable. But one problem was still left.

Even when `imageUrl` isn't needed, `createSlackMessage` still declares it as an optional parameter and branches on it internally — meaning the split wasn't actually complete. So I stopped passing unnecessary data in at all, and moved the ImageBlock branching that used to live inside `createSlackMessage` up one level, into the caller.

```ts
export const sendSlackForError = async () =>
  // ...arg
  {
    // some variable

    return await sendSlackMessage(
      TARGET_URL,
      addImageBlock(createSlackMessage(ERROR_TITLE, 'message'), imageUrl)
    )
  }
```

It's a pattern I never reached for before I started paying attention to it. I could have stashed `createSlackMessage`'s result in a separate constant instead, but composing the calls this way felt cleaner.

## Just Enough Data Shape

Maybe the single most important thing in writing a good function is **picking the right data shape.**

Say we have the following situation.

- It takes an array called `fileList`, and using `answers`, fills in the values needed inside each entry.
- `convertTemplateString` does the substitution.
- Each result from `generateFiles` ultimately gets written to its own file.

My first version returned a single object.

```js
const generateFiles = (fileList, answers) => {
  return fileList.reduce((acc, value, index, arr) => {
    acc[value] = _this.convertTemplateString(
      fn[value](USER_FOLDER_NAME),
      answers
    )

    return acc
  }, {})
}

// generateFiles Result
const fileListResult = {
  FILE1: 'file Body1',
  FILE2: 'file Body2',
}

// fn
const fn = {
  FILE1: USER_FOLDER_NAME => {
    /* some logic */
  },
  FILE2: USER_FOLDER_NAME => {
    /* some logic */
  },
}
```

On the consuming side, you'd have to write it like this.

```js
const fileList = generateFiles(['FILE1', 'FILE2'], answers)

Object.keys(fileList).forEach(fileName => {
  fs.writeFileSync(fn[fileName](USER_FOLDER_NAME), fileList[fileName], 'utf-8')
})
```

That's a lot to keep track of. `Object.keys` just to walk the object, then `fn[fileName](USER..)` just to call the right function out of `fn`.

**None of that is necessary.**
Treat `fileList` as an array instead of an object, and you can iterate it directly, no `Object.keys` required.

When I first wrote `generateFiles`, I hadn't thought enough about the data's shape — I was so focused on accepting files flexibly that I missed everything else.

```js
const generateFiles = (fileList, answers) =>
  fileList.map(fileName => ({
    name: fileName,
    body: convertTemplateString(
      joinPath(answers[QUESTION_CATEGORY.PROJECT_NAME], fileName),
      answers
    ),
  }))
```

So I changed it to return an array of objects, each with a `name` and a `body`.

```js
const fileListResult = [
  { name: 'file1', body: 'FILE1' },
  { name: 'file2', body: 'FILE2' },
]

// changed the fn logic to use joinPath too
fileList.forEach(file => {
  fs.writeFileSync(joinPath(projectName, file.name), file.body, 'utf-8')
})
```

Just picking the right data shape for the job makes the code far easier to read.
Write with an eye toward how the value a function returns will actually be used at the other end.

## Wrapping Up This Post

There's no single right answer for "good code." Everything in this post is just what good code looks like to me right now. Plenty of other answers are just as valid, and mine will keep changing too.

If there's one thing that doesn't change, maybe it's this: code written by someone who never stops asking what good code even is has a better shot at getting better over time.

## Special Thanks to

Thanks to [joeun](http://joeun.dev/) for helping with several refactors, and to [Jbee](https://jbee.io/) for helping shape this whole post.
