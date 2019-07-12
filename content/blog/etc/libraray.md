---
title: 라이브러리 코드 살펴보기
date: 2019-03-13 00:07:32
category: etc
---

라이브러리를 쓸 때, 내부 구현부를 들여다 볼일이 사실 많지는 않지만, 그렇다고 해서 **없는것은 아니다.**
이때 가장 빠른 방법은 `node_modules` 에 구현된 부분을 확인하는 것이다.

> 직접 열어보기 >>>>> 10번의 research 😎

맞닥뜨렸던 이슈를 해결하는 과정을 따라가보며 `node_modules` 를 보는게 어떻게 효율적인지 살펴보자.

## 느낌적인 느낌.

https://ant.design/components/list/ 의 `datasource` 부분에는 어떤 자료형이 들어갈까?

```tsx
const data = ['Racing car sprays burning fuel into crowd.']

ReactDOM.render(
  <List dataSource={data} renderItem={item => <List.Item>{item}</List.Item>} />
)
```

배열이긴 배열이다.
하지만 아쉽게도 docs 에는 정확한 자료형에 대한 명시가 되어 있지 않다.

> 🤔 배열이 되면 immutable List도 되지 않겠어..? (막연)

위와 같은 생각으로 List에 우선 immutable List 를 넣어본다.
사실 놀랍게도, 잘 들어간다.

List 이후에 Table 컴포넌트도 사용했는데, 결론부터 말하자면 **이 경우에는 immutable List 를 할당할 수 없었다.**

이 내용 역시 docs에 적혀있지 않았고, 그냥 대충 빨간줄이 나니까..? 식의 찜찜한 추론으로 우선 `.toArray()` 라고 적었다.

사실, 구현부를 살펴본다면 clear하게 해결할 수 있는 부분이다.

### List vs Tabel

List 의 구현부를 살펴보자.

```tsx
// List의 index.d.ts
export interface ListProps {
  bordered?: boolean
  className?: string
  children?: React.ReactNode
  dataSource: any
}
```

Table의 구현부 이다.

```tsx
// Table.d.ts
static propTypes: {
    dataSource: PropTypes.Requireable<any[]>;
    columns: PropTypes.Requireable<any[]>;
}
```

명백히 다르다. 비슷하게 생긴 컴포넌트의 prop 으로 넘겨주는 타입이 다르게 선언되어 있다.

이 외에도 공식문서를 보는 것보다, `d.ts` 를 통해 파악할 수 있는 부분이 많았다.

> 🙅‍ enum이면 좋았을 부분이 string으로 처리되어 있다던가.. 하는 소소한 부분부터, 각 컴포넌트에 명시된 옵션함수들이 한 파일에 정의되어 있으니 컴포넌트가 어떤식으로 동작하는지에 대한 대략적 흐름을 파악할 수 있었다.

## Tree Shaking

https://github.com/Rainist/cms-money-transfer/issues/27
import 해오는 FormComponentProps 의 크기가 너무 커서 `이거 혹시 tree shaking 안되는거 아닌가..` 하는 불안감이 들었다.

> 624.3 KB, (gzipped: 190.6)

ant design 문서에는 그럭저럭 된다고 적혀있었는데 import 경로가 달라서 썩 신뢰가 가진 않았다.

\*_그래서 열어보기로 했다._

```json
...
  "sideEffects": [
    "dist/*",
    "es/**/style/*",
    "lib/**/style/*",
    "*.less"
  ]
...

```

http://huns.me/development/2265 을 읽어보면, sideEffect에 명시되어 있는 파일들에 한해 트리쉐이킹이 적용된다고 적혀있다.

`antd/lib/form/Form`
이 경로는 해당사항이 없어, 트리쉐이킹 미적용이라고 추측하는 근거가 되었다.

## 결론

라이브러리 코드를 보는것이 왜 중요할까?

1. 의문점이 드는 부분에 대해 가장 빨리, 정확히 확인해볼 수 있다.

   > 바로 코드를 까보면서, 내가 추론한 문제에 대해 어느정도 타당한 가설을 세울 수 있다.

2. 문제가 있어 해당 라이브러리 코드를 보다보면, **추후 문제가 될 수 있는 부분** 까지도 시간을 절약하며 파악할 수 있다.

결국, 잘 정리된 블로그 글보다, 공식문서보다, 가장 적확한 것은 나의 로컬에 설치된 **이 라이브러리의 소스코드 이다.**
정답지를 통해 라이브러리 구현의 흐름도 익힐 수 있고 문제 원인에 대한 실마리도 찾을 수 있다.
