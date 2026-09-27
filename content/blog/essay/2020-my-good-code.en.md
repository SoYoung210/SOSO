---
title: 'Good Code As I Saw It in 2020'
date: 2020-01-25 17:01:21
category: essay
thumbnail: './images/thumbnail-good-code.png'
---

![image-thumbnail](./images/thumbnail-good-code.png)

In a [talk](https://speakerdeck.com/soyoung210/jeolmang-deuribeun-seongjang-hamgge-ilhago-sipeun-gaebaljaga-doegiggaji?slide=58) I gave last year, I said, "Having a lot of knowledge doesn't necessarily mean you can write good code." Of course, knowing more can raise the odds that you'll write good code.

But the phrase **"good code"** carries a lot of things worth considering beyond just knowledge.  
This post introduces the good code I've thought through for myself.
As the word "good" makes clear, this is just a subjective opinion. Since it's an opinion that could change as time passes, I'm presenting it as the "2020 version."

## Just Enough Abstraction

Whenever I write a new function, I run into these kinds of thoughts.

- 🤔 Might I end up reusing this function somewhere else?
- 🤓 If I turn it into a util once, won't it stay convenient wherever it's used?
- 😈 Is there a more concise way to express this?

How meaningful is each of these worries, really?

### 🤔 Might I End Up Reusing This Function Somewhere Else?

To cut to the conclusion first: **you shouldn't mistake a one-off util for a general-purpose one.** The more a util deals with basic data, the higher the chance it'll be reused; the more a util was created because a specific component needed it, the higher the chance it's a one-off.

```ts
export const padZero = (num: number, width: number) => {
  const numToString = num.toString()
  const padNumber: number = width > 0 ? width : numToString.length

  return numToString.length >= padNumber
    ? numToString
    : new Array(padNumber - numToString.length + 1).join('0') + num
}
```

Used like `padZero(2, 4)`, this function returns '0002.'
What domain would this kind of functionality get used in?  
It's not easy to predict. Padding numbers is something that can come up a lot, even outside whatever part you're currently working on.

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

The example above is taken from Dan Abramov's [Goodbye, Clean Code](https://overreacted.io/goodbye-clean-code).  
`Directions.top` is a function built for "letting you resize a shape by dragging its edge." Right now there are only four directions, but what happens if more get added later?

Goodbye, Clean Code puts it this way:  
"Let's say the requirements change and several edge cases pop up for each shape and each action. My code would need to grow **an even deeper abstraction**, whereas the original, 'messy' (pre-abstraction) version of the code could absorb the change very easily."

A premature abstraction born from the hope that "maybe this will get used someday" forces the colleague reviewing this feature right now to spend extra time puzzling through and understanding it. Push it further, and in the effort to fit a higher level of abstraction, the very cleanliness that abstraction was supposed to buy you in the first place can vanish entirely.

**Premature abstraction is something to guard against.**

### 🤓 If I Turn It Into a Util Once, Won't It Stay Convenient Wherever It's Used?

This is something I thought a lot while building redux-middleware-related utils. Each middleware handling asynchronous logic differed only in the action's type, while almost everything else looked nearly identical. Writing out all that duplicated code every single time got pretty tedious.

So I built a util named `fetchMiddleware`.

```ts
// fetchMiddleware.ts
const fetchMiddleware = (action, fn?: (...args: any) => any) => {
  // logic that handles the api call and errors using the action payload
}
```

And I announced it to the team: "I've made it so the middleware logic can be used as a single function — just grab it and use it! It's a little complex inside since it handles a bunch of different cases."

The moment this util first gets handed off, everyone might be happy.  
**But what happens if the person responsible for the project changes entirely?** If debugging an error or touching the fundamental structure ever becomes necessary, my colleague will inevitably have to dig into the `fetchMiddleware` I built too.

Needing a long stretch of time just to understand this util means grasping the project as a whole will take that much longer too. From the standpoint that **a product's code has to belong to the whole team,** this code and this project aren't healthy.

"It's a little complex inside, but convenient to use" is just a rationalization for code that's hard to read.

### 😈 Is There a More Concise Way to Express This?

This is a thought worth always keeping in mind, but also one to be wary of.
The thrill of squeezing ten lines of code into one is a trap that's easy to fall into. Put a bit more extremely: if you're judging purely by readability, just listing the data out plainly can sometimes beat solving it with map or forEach.

If you focus solely on shrinking code down in pursuit of extreme conciseness, you'll easily give up on readability. **Being concise doesn't automatically make code good.**
You should aim for a middle ground — code that "even a fool could understand, while still cutting down on the tedious duplication that wears developers out."

## Just Enough Function Composition

Instead of always treating a function's computed result as a plain value, handling it through composition can also be a good way to express things.

As an example to walk through, let's think about a situation where we generate a Slack message Block.

- An Image Message is only needed when a particular API's result is an error (`sendSlackForError`).
- The function that generates the Slack Message is `createSlackMessage`.
  - This function is used for both success and error API results.

The code I first wrote looked like this.

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

Both cases of generating the slack Message are being handled inside a single function. That means the function is doing more than one job, and its responsibilities need to be split apart.

> Worth pointing out here: splitting responsibilities apart isn't premature abstraction, nor is it chasing extreme conciseness. It's **a search for a better pattern.**

Adding an ImageBlock is optional, and in that situation `title` and `message` aren't used. I split out the function that handles the ImageBlock and refactored `createSlackMessage` to handle it internally with a ternary.

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

Splitting out the part that concats the ImageBlock made the `createSlackMessage` function more readable. But a problem still remained.

Even when it doesn't need `imageUrl`, the `createSlackMessage` function still declares it as an optional parameter and handles it with a branch internally. That means the separation of responsibilities still wasn't complete.
I changed it so unnecessary information isn't passed in at all, moving the branching logic for the ImageBlock that `createSlackMessage` used to handle up into a function one level higher.

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

It's a pattern I didn't use well when I wasn't consciously thinking about it. I could have stored `createSlackMessage`'s value in a separate constant and handled it that way, but I felt handling it through composition like this was cleaner.

## Just Enough Data Shape

Maybe the single most important thing in writing a good function is **handling your data shape well.**

Let's assume the following situation.

- It takes an array called `fileList`, and using the `answers` value, substitutes in the values needed from `fileList`'s contents.
- The substitution is carried out through `convertTemplateString`.
- The result of `generateFiles` ultimately gets written out to a file, one by one.

At first, I wrote it so that it returned a single object.

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

On the consuming side, `fileList` had to be handled like this.

```js
const fileList = generateFiles(['FILE1', 'FILE2'], answers)

Object.keys(fileList).forEach(fileName => {
  fs.writeFileSync(fn[fileName](USER_FOLDER_NAME), fileList[fileName], 'utf-8')
})
```

This is code with a lot to keep track of. I used `Object.keys` to iterate over the object, and needed an expression like `fn[fileName](USER..)` just to run the right function out of `fn`.

**You don't have to write it this hard a way.**
If you treat `fileList` as an array instead of an object, you can iterate directly without `Object.keys`.

When I first wrote `generateFiles`, I hadn't thought enough about the data shape, and by focusing only on being able to flexibly accept files, I missed everything else.

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

I changed it so the final data shape ends up as an array of objects with `name` and `body`.

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

Just switching to a data shape that fits the purpose makes the code far easier to read.
You need to write with an eye toward how the value a function returns will ultimately be handled at its point of use.

## Wrapping Up This Post

There's no single right answer for "good code." Every sentence covered in this post is just what I currently think good code looks like. There can easily be other, different answers, and my own answer can change too.

If there's one answer that doesn't change, maybe it's this: code written by someone who's always thinking about what good code even is has a better chance of getting even better going forward.

## Special Thanks to

Thank you to [joeun](http://joeun.dev/), who helped with various refactors, and to [Jbee](https://jbee.io/), who helped throughout this whole post.
