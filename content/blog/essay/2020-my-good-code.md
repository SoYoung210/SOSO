---
title: 2020년 내가 생각한 좋은코드
date: 2020-01-25 17:01:21
category: essay
---

![image-thumbnail](./images/thumbnail-good-code.png)

[절망 드리븐 성장: 함께 일하고 싶은 개발자가 되기까지](https://speakerdeck.com/soyoung210/jeolmang-deuribeun-seongjang-hamgge-ilhago-sipeun-gaebaljaga-doegiggaji?slide=58)에서 ‘아는 것이 많다고 해서 반드시 좋은 코드를 쓸 수 있는 것은 아니다.’라는 말을 했다. 물론 아는 것이 많아지면 좋은 코드를 작성할 확률이 높아질 수 는 있지만, ‘좋은 코드’라는 단어는 지식 말고도 고려해야 할 점이 많다.

## 적당한 추상화

나는 늘 함수를 새로 작성할때 이런 고민에 부딪힌다.

- 🤔 이 함수, 어디에선가 다시 쓸 수도 있지 않을까?
- 🤓 한번 util로 만들어 두면 쓰는 곳에서는 계속 편하게 쓸 수 있지 않을까?
- 😈 더 간결한 표현은 없을까?

각각의 고민들은 얼마나 유의미할까?

### 🤔 이 함수, 어디에선가 다시 쓸 수도 있지 않을까?

결론부터 말하자면, 많이 사용될 util과 1회성 util을 착각하지 않아야 한다. 기본적인 Data를 다루는 util일수록 재사용할 확률이 높고, Component에서 필요해서 만든 util일수록 1회성으로 사용될 확률이 높다.

```ts
export const padZero = (num: number, width: number) => {
  const numToString = num.toString()
  const padNumber: number = width > 0 ? width : numToString.length

  return numToString.length >= padNumber
    ? numToString
    : new Array(padNumber - numToString.length + 1).join('0') + num
}
```

`padZero(2, 4)`와 같이 사용하면 ’0002’를 return하는 함수이다.
이런 기능은 어떤 Domain에서 사용될까?  
내 결론은 ‘쉽게 추측할 수 없다.’이다. number에 padding을 넣는 작업은 꼭 지금 내가 만들고 있는 View가 아니더라도 많이 일어날 수 있는 일이다.

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

위 예시는 Dan Abramov의 ‘GoodBye Clean Code’에서 가져온 예시다.  
`Directions.top`은 ‘형의 가장자리를 드래그하여 크기를 조절할 수 있게 해주는 기능’을 위해 만들어진 함수이다. 사용하고자 한다면, 다른곳에서도 충분히 재활용 할 수 있도록 추상화되었다.

하지만, 이 함수의 추상화 레벨을 높일때 고민해야 한다. ‘언젠가는 사용되지 않을까’라는 희망으로 부터 비롯된 성급한 추상화는 현재 이 기능을 리뷰할 동료에게 고민과 이해의 시간을 갖게 만든다. **Domain이 드러날 수록 재활용 여지는 낮아진다.**

### 🤓 한번 util로 만들어 두면 쓰는 곳에서는 계속 편하게 쓸 수 있지 않을까?

redux-middleware관련 util을 만들 때 많이 하는 생각이다. `async action`들은 하는 일이 비슷했고, 매번 중복으로 적어주는 일이 꽤나 귀찮아졌다.

`fetchMiddleware`라는 이름의 middleware유틸을 만들었다.

```ts
// fetchMiddleware.ts
const fetchMiddleware = (action, fn?: (...args: any) => any) => {
  // action payload를 통해 api call과 error를 처리하는 로직
}
```

그리고 팀원들에게 전파한다. “Async Action처리를 하나의 함수로 처리했으니 가져다 쓰시기만 하면 돼요! 여러가지 처리를 하느라 내부는 조금 복잡합니다.”
이 util을 처음 전달하는 순간에는 괜찮을 수 있다. **하지만 아예 프로젝트의 담당자가 바뀐다면 어떻게 될까?** 에러 상황에 대한 디버깅이나 근본적인 구조를 건드려야 하는 일이 생긴다면 동료는 필연적으로 내가 만든 `fetchMiddleware`도 읽어보게 될것이다.

긴 시간을 들여야만 이 util이 이해된다면, 프로젝트 전체를 파악하는데에 있어서 그만큼의 시간이 더 소요된다는 뜻이다. **Product는 팀의 코드가 되어야 한다.**라는 관점에서 이 프로젝트는 건강하지 않다.

“내부가 조금 복잡해도 가져다 쓸 때 편하다.” 라는 말은 읽기 어려운 코드에 대한 성급한 합리화이다.

### 😈 더 간결한 표현은 없을까?

이 문장은 늘 생각해야 하면서도, 경계해야 하는 문장이다.
10줄짜리 코드를 한줄로 표현할 때 느끼는 희열은 쉽게 빠질 수 있는 함정이다. 조금 극단적인 예시를 들자면, 가독성만 놓고 봤을 때 map이나 forEach를 통해 해결하는 것보다 그 자료를 그대로 나열하는 것이 더 좋을수도 있다.

> 하지만 나도 대부분의 반복은 forEach나 map을 선호한다.

극강의 간결함을 추구하기 위해 코드를 줄여가는데에만 초점을 맞추다보면 가독성 관점을 쉽게 포기한다. **간결하다고 무조건 좋은 코드가 아니다.**
‘바보도 이해할 수 있으면서 개발자의 피곤한 중복은 줄일 수 있는’ 중도의 코드에 초점을 맞추어야 한다.

## 적당한 함수 합성

슬랙 메세지 Block을 생성하는 상황을 생각해 보자.

- 특정 api의 검사 결과가 false일때만 Image Message가 필요하다.
- 슬랙 Message를 생성하는 함수는 createSlackMessage이고, 보내는 함수는 sendSlackMessage이다.

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

무슨 일을 하는지는 알겠는데, slack Message를 생성하는 두 가지 경우가 하나의 함수에서 처리되고 있다. 역할을 분리하는 것은 성급한 추상화도 아니고 간결한 표현을 추구하는 것도 아닌, **더 나은 패턴에 대한 고민**이었다.

이미지 block을 추가하는 것은 option이고, 이 상황에는 title과 message가 사용되지 않는다. imageBlock을 다루는 함수를 분리하고, `createSlackMessage`내부에서 삼항연산자로 분리하도록 리팩토링 했다.

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

Image Block을 concat하는 부분을 분리하니 `createSlackMessage`자체의 가독성은 좋아졌다. 하지만 아직 문제가 더 남았다.

`createSlackMessage`함수는 `imageUrl`이 필요 없더라도 파라미터를 명시하고 이를 optional로 전달받도록 되어있다. 아직 역할의 분리가 완벽히 이루어지지는 않았다는 뜻이다.
필요없는 정보는 전달하지 않고, Image Block이 필요한 한 단계 상위함수에서 결정되도록 변경하였다.

```ts
const createSlackMessage = (title: string, message: string) => {}
```

## 적당한 자료형

```js
const generateFiles = (fileList, answers) => {
  return deployFileList.reduce((acc, value, index, arr) => {
    acc[value] = _this.convertTemplateString(
      constants[value](USER_FOLDER_NAME),
      answers
    )

    return acc
  }, {})
}
```
