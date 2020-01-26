---
title: 2020년 내가 생각한 좋은코드
date: 2020-01-25 17:01:21
category: essay
---

![image-thumbnail](./images/thumbnail-good-code.png)

작년 [발표](https://speakerdeck.com/soyoung210/jeolmang-deuribeun-seongjang-hamgge-ilhago-sipeun-gaebaljaga-doegiggaji?slide=58)에서 '아는 것이 많다고 해서 반드시 좋은 코드를 쓸 수 있는 것은 아니다.'라고 했다. 물론 아는 것이 많아지면 좋은 코드를 작성할 확률이 높아질 수 는 있지만, '좋은 코드'라는 단어는 지식 말고도 고려해야 할 점이 많은 단어이다.

## 적당한 추상화

함수를 새로 작성할때 이런 고민에 부딪힌다.

- 🤔 이 함수, 어디에선가 다시 쓸 수도 있지 않을까?
- 🤓 한번 util로 만들어 두면 쓰는 곳에서는 계속 편하게 쓸 수 있지 않을까?
- 😈 더 간결한 표현은 없을까?

각각의 고민들은 얼마나 유의미할까?

### 🤔 이 함수, 어디에선가 다시 쓸 수도 있지 않을까?

결론부터 말하자면, **범용적 util과 일회성 util을 착각하지 않아야 한다.** 기본적인 Data를 다루는 util일수록 재사용할 확률이 높고, Component에서 필요해서 만든 util일수록 일회성으로 사용될 확률이 높다.

```ts
export const padZero = (num: number, width: number) => {
  const numToString = num.toString()
  const padNumber: number = width > 0 ? width : numToString.length

  return numToString.length >= padNumber
    ? numToString
    : new Array(padNumber - numToString.length + 1).join('0') + num
}
```

`padZero(2, 4)`와 같이 사용하면 '0002'를 return하는 함수이다.
이런 기능은 어떤 Domain에서 사용될까?  
결론은 '쉽게 추측할 수 없다.'이다. 숫자에 padding을 넣는 작업은 꼭 지금 만들고 있는 View가 아니더라도 많이 일어날 수 있는 일이다.

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
// 출처: https://overreacted.io/goodbye-clean-code
```

위 예시는 Dan Abramov의 [GoodBye Clean Code](https://overreacted.io/goodbye-clean-code)에서 가져온 예시이다.  
`Directions.top`은 '도형의 가장자리를 드래그하여 크기를 조절할 수 있게 해주는 기능'을 위해 만들어진 함수이다. 지금은 네 가지 방향밖에 없지만 혹시 더 늘어날 수 있지 않을까?

하지만, 이 함수의 추상화 레벨을 높일때 고민해야 한다. '언젠가는 사용되지 않을까'라는 희망으로 부터 비롯된 성급한 추상화는 현재 이 기능을 리뷰할 동료에게 고민과 이해의 시간을 갖게 만든다. **Domain이 드러날 수록 재활용 여지는 낮아진다.**

### 🤓 한번 util로 만들어 두면 쓰는 곳에서는 계속 편하게 쓸 수 있지 않을까?

redux-middleware관련 util을 만들 때 많이 했던 생각이다. 비동기 로직을 처리하는 각각의 middleware들은 action의 type만 다를 뿐 다른 로직은 거의 비슷했다. 매번 모든 코드를 중복으로 적어주는 일이 꽤나 귀찮아졌다.

그래서 `fetchMiddleware`라는 이름의 middleware유틸을 만들었다.

```ts
// fetchMiddleware.ts
const fetchMiddleware = (action, fn?: (...args: any) => any) => {
  // action payload를 통해 api call과 error를 처리하는 로직
}
```

그리고 팀원들에게 전파한다. "middleware로직을 하나의 함수로 처리했으니 가져다 쓰시기만 하면 됩니다! 여러가지 처리를 하느라 내부는 조금 복잡합니다."
이 util을 처음 전달하는 순간에는 괜찮을 수 있다. **하지만 아예 프로젝트의 담당자가 바뀐다면 어떻게 될까?** 에러 상황에 대한 디버깅이나 근본적인 구조를 건드려야 하는 일이 생긴다면 동료는 필연적으로 내가 만든 `fetchMiddleware`도 살펴보게 될것이다.

긴 시간을 들여야만 이 util이 이해된다는 것은 프로젝트 전체를 파악하는데에 있어서 그만큼의 시간이 더 소요된다는 뜻이다. **Product는 팀의 코드가 되어야 한다.**라는 관점에서 이 코드와 프로젝트는 건강하지 못하다.

"내부가 조금 복잡해도 가져다 쓸 때 편하다." 라는 말은 읽기 어려운 코드에 대한 합리화이다.

### 😈 더 간결한 표현은 없을까?

이 문장은 늘 생각해야 하면서도, 경계해야 하는 문장이다.
열줄짜리 코드를 한줄로 표현할 때 느끼는 희열은 쉽게 빠질 수 있는 함정이다. 조금 극단적으로 표현 해보자면 가독성만 놓고 봤을 때 map이나 forEach를 통해 해결하는 것보다 그 자료를 그대로 나열하는 것이 더 좋을수도 있다는 뜻이다.

극강의 간결함을 추구하기 위해 코드를 줄여가는데에만 초점을 맞추다보면 가독성 관점을 쉽게 포기한다. **간결하다고 무조건 좋은 코드가 아니다.**
'바보도 이해할 수 있으면서 개발자의 피곤한 중복은 줄일 수 있는' 중도의 코드에 초점을 맞추어야 한다.

## 적당한 함수 합성

함수의 연산 결과를 항상 값으로만 다루던 고정관념을 깨본 경험도 좋은 코드에 대해 좀더 많은 고민을 할 수 있게된 계기라고 생각한다.

코드 설명에 대한 예시로 슬랙 메세지 Block을 생성하는 상황을 생각해 보자.

- 특정 api의 검사 결과가 false일때만 Image Message가 필요하다.
- 슬랙 Message를 생성하는 함수는 `createSlackMessage`이고, 보내는 함수는 `sendSlackMessage`이다.

맨 처음 작성했던 코드는 이런식이었다.

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

slack Message를 생성하는 두 가지 경우가 하나의 함수에서 처리되고 있다. 함수가 한 가지 이상의 일을 하고 있다는 뜻이고, 역할이 분리될 필요가있다.

여기서 짚고 넘어갈 점은, 역할을 분리하는 것은 성급한 추상화도 아니고 극강의 간결한 표현을 추구하는 것도 아니다. **더 나은 패턴에 대한 고민**이다.

ImageBlock을 추가하는 것은 optional이고, 이 상황에는 title과 message가 사용되지 않는다. ImageBlock을 다루는 함수를 분리하고, `createSlackMessage`내부에서 삼항연산자로 분리하도록 리팩토링 했다.

```ts
const createSlackMessage = (
  title: string,
  message: string,
  imageUrl?: Image,
) => {
  const defaultMessage = {...}

  return imageUrl? addImageBlock(defaultMessage, imageUrl): defaultMessage
}
```

ImageBlock을 concat하는 부분을 분리하니 `createSlackMessage`함수의 가독성은 좋아졌다. 하지만 아직 문제가 남았다.

`createSlackMessage`함수는 `imageUrl`이 필요 없더라도 파라미터를 optional로 명시하고 내부에서 분기문으로 다뤄지고 있다. 아직 역할의 분리가 완벽히 이루어지지는 않았다는 뜻이다.
필요없는 정보는 아예 전달하지 않고, `createSlackMessage`에서 다루던 ImageBlock에 대한 분기문을 한 단계 상위함수에서 처리하도록 했다.

```ts
const createSlackMessage = (title: string, message: string) => {}
```

## 적당한 자료형

좋은 함수를 작성하는 데에서 어쩌면 가장 중요한 것은, **자료형을 잘 다루는 것이다.**

다음 상황을 가정해보자.

- fileList라는 이름의 배열을 받고, answers값을 통해 fileList의 내용에서 필요한 값을 치환한다.
- 치환은 `convertTemplateString`을 통해 수행된다.
- `generateFiles`의 결과값은 최종적으로 각각 File Write된다.

제일 처음에는 하나의 object가 return되도록 작성하였다.

```js
const generateFiles = (fileList, answers) => {
  return fileList.reduce((acc, value, index, arr) => {
    acc[value] = _this.convertTemplateString(
      constants[value](USER_FOLDER_NAME),
      answers
    )

    return acc
  }, {})
}

// generateFiles Result
const fileList = {
  file1: 'file Body1',
  file2: 'file Body2',
}
```

`fileList`를 다루는 쪽에서는 다음과 같이 작성되어야 한다.

```js
const fileList = generateFiles(['FILE1', 'FILE2'], answers)

Object.keys(fileList).forEach(fileName => {
  fs.writeFileSync(
    constants[fileName](USER_FOLDER_NAME),
    fileList[fileName],
    'utf-8'
  )
})
```

파악해야 하는 점이 많은 코드다. object를 순회하기 위해 `Object.keys`를 이용했고, object인 `constants`에서 알맞은 함수를 실행시키기 위해 `constants[fileName](USER..)`와 같은 표현이 필요하다.

**이렇게 어렵게 작성하지 않아도 된다.**.
fileList를 object가 아닌 배열로 다룰 경우 `Object.keys`없이 바로 순회가 가능하다.

`generateFiles`를 처음 작성할때 자료형에 대한 고민이 부족했고, file을 유동적으로 받을 수 있는데에만 집중해서 다른 부분을 놓쳤다.

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

최종 자료형이 `name`과 `body`를 가진 배열로 완성되도록 변경하였다.

```js
const fileList = [
  { name: 'file1', body: 'FILE1' },
  { name: 'file2', body: 'FILE2' },
]

// constants 로직도 joinPath를 사용하는 것으로 변경
fileList.forEach(file => {
  fs.writeFileSync(joinPath(projectName, file.name), file.body, 'utf-8')
})
```

목적에 맞는 자료형으로 변경하는것 만으로도 코드가 훨씬 읽기 쉬워진다.
함수가 return하는 값을 최종적으로 사용되는 곳에서 어떻게 다루어질 것인가를 생각하며 작성해야 한다.

## 이 글을 마치며

'좋은 코드'에는 정답이 없다. 이 글에서 다룬 모든 문장은 2020년 1월의 내가 생각한 좋은 코드일 뿐이다. 충분히 다른 답이 있을 수 있고, 나의 답 또한 변할 수 있다.

변하지 않는 답이 있다면, 좋은 코드란 무엇일지 항상 고민하는 사람이 작성한 사람의 코드가 앞으로 더 좋아질 가능성이 높다는 것 정도가 아닐까?

## Special Thanks to

여러가지 리팩토링에 도움을 주신 [joeun](http://joeun.dev/)님과 이 글 전반에 도움을 주신 [Jbee](https://jbee.io/)님께 감사드립니다.
