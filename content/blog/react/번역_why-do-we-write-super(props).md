---
title: 번역_Why Do We Write super(props)?
date: 2018-12-11 09:07:20
category: react
---

**이 글은 Dan Abramov의 why-do-we-write-super-props를 번역한 글입니다.**

나(Dan Abramov)는 매우 많이 `super(props)` 를 사용했다.

```jsx
class Checkbox extends React.Component {
  constructor(props) {
    super(props)
    this.state = { isOn: true }
  }
  // ...
}
```

물론, [class fields proposal](https://github.com/tc39/proposal-class-fields) 은 위와 같은 방식을 생략가능하게 한다.

> Comment : construtor를 정의하고, super(props) 를 적은 후에 state를 정의하는 행동.

```jsx
class Checkbox extends React.Component {
  state = { isOn: true }
  // ...
}
```

이러한 syntax는 React 0.13이 2015년 class에 대한 지원을 추가할때 [계획](https://reactjs.org/blog/2015/01/27/react-v0.13.0-beta-1.html#es7-property-initializers) 되었다.

`constructor` 를 정의하고, `super(props)` 를 정의하는 것은 `class fields` 가 좋은 제안을 제시하기 전까지의 임사방편으로 여겨졌다.

그러나, 한번 ES2015 기능만 사용하여 이 예제로 돌아가 보자.

```jsx
lass Checkbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOn: true };
  }
  // ...
}
```

**왜 우리는 super 를 호출할까? 호출하지 않을 수는 없을까? 만약 반드시 호출해야만 한다면,(super를) 만약 props를 빼먹으면 어떻게 될까? 다른 argumetns는 없을까?**

알아보자.

---

JS에서 `super` 는 부모 클래스 생성자를 참조한다. (부모 클래스 : React.Component)

중요한 것은, 부모 클래스 생성자를 호출할 때 까지 자식 클래스 생성자에서 `this` 를 사용할 수 없다는 것이다.

```jsx
class Checkbox extends React.Component {
  constructor(props) {
    // 🔴 Can’t use `this` yet
    super(props)
    // ✅ Now it’s okay though
    this.state = { isOn: true }
  }
  // ...
}
```

JS 가 `this` 에 접근하기 전에 부모 클래스 생성자를 호출하도록 강제하는 이유가 있다.

클래스 계층 구조를 생각해 보자.

```jsx
class Person {
  constructor(name) {
    this.name = name
  }
}

class PolitePerson extends Person {
  constructor(name) {
    this.greetColleagues() // 🔴 This is disallowed, read below why
    super(name)
  }
  greetColleagues() {
    alert('Good morning folks!')
  }
}
```

`super` 호출을 하기 전에, `this` 를 사용한다고 상상해 보자.

한달 후에 , `greetColleagues` 에 `person's name` 이 포함되도록 변경하고 싶다고 가정 해보자.

```jsx
greetColleagues() {
    alert('Good morning folks!');
    alert('My name is ' + this.name + ', nice to meet you!');
}
```

다시 `PolitePerson` 클래스 코드를 보자.

`this.greetColleagues()` 는 `super` 가 호출되기 전에 호출 되었다.

`this.name` 이 설정 되기 전에 호출 되었고, 정의되기 전이다.

이 예제에서 보다시피, 이런 상황(코드) 은 미리 생각하기 매우 어려울 수 있다.

이러한 안좋은 상황을 피하기 위해, JavaScript에서는 `this` 를 사용하려면 먼저 `super` 를 호출하도록 강제하고 있다. 부모 클래스가 부모 클래스의 역할을 다 할 수 있도록 해주어야 한다.

> Comment : 부모클래스인 Person 의 역할은 name을 지정하는 것이고, 여기서 말하는 **역할** 이란 **name 을 지정하는 역할**을 말한다.

```js
  constructor(props) {
    super(props);
    // ✅ Okay to use `this` now
    this.state = { isOn: true };
  }
```

여전히 의문이 드는점이 남아있다. 왜 `props` 를 넘겨주어야 하는가 ?

---

React.Component 생성자가 `this.props` 초기화 할 수 있도록 `props` 가 super로 전달되어야 한다고 생각할 수 있다.

```js
// Inside React
class Component {
  constructor(props) {
    this.props = props
    // ...
  }
}
```

이런 생각은 **어느정도 맞다고 할 수 있다.** [what it does.](https://github.com/facebook/react/blob/1d25aa5787d4e19704c049c3cfa985d3b5190e0d/packages/react/src/ReactBaseClasses.js#L22)

> Comment : what it does. 는 리액트 내부 구현 코드.

그러나, 만약 `props` argument 없이 super를 호출하더라도, `render` 나 다른 method에서 `this` 를 호출할 수 있다. (믿기지 않으면 직접 해보세요!)

어떻게 작동하는걸까? React는 생성자를 호출한 직후에 instance에 props를 할당한다.

```js
// Inside React
const instance = new YourComponent(props)
instance.props = props
```

**그래서,** `super()` 에 props를 전달하는 것을 생략해도, 리액트는 알아서 설정해준다.

> Comment : 리액트는 알아서 설정해준다. 는 React would still set them right afterwards. 의역입니다.

그 이유가 있다.

React가 클래스에 대한 지원을 추가할 때, 단순히 ES6 클래스만 추가한 것이 아니다.

목표는, 가능한한 **광범위한 추상화** 를 지원하는 것이었다.

> Comment : 광범위한 추상화가 조금 와닿지 않지만, 이렇게 번역했습니다.  
>  원문 : The goal was to support as wide range of class abstractions as possible.

ClojureScript, CoffeeScript, ES6, Fable, Scala.js, TypeScript 또는 기타 솔루션이 component를 정의하는 데 얼마나 성공적 이었는지 분명하지 않았다.

그래서 React는 ES6클래스가 있더라도 `super()` 호출이 필요한지에 대해 **고의적으로** 알리지 않았었다.

> Comment : 고의적으로 === 일부러.  
> 원문 : So React was intentionally unopinionated about whether calling super() is required

그래서, **super(props) 대신 super() 를 쓸 수 있다는 뜻인가?**

물론, React는 생성자가 호출된 후에 `this.props` 를 할당할 것이다.  
하지만, `this.props` 는 `super` 호출과 `constructor` 함수의 마지막 사이에 여전히 **정의되지 않았다.**

```js
// Inside React
class Component {
  constructor(props) {
    this.props = props
    // ...
  }
}

// Inside your code
class Button extends React.Component {
  constructor(props) {
    super() // 😬 We forgot to pass props
    console.log(props) // ✅ {}
    console.log(this.props) // 😬 undefined
  }
  // ...
}
```

이런 코드는 디버그 하기 어려운 상황을 만들 수 있다. 그래서, 꼭 `props` 를 넘길 필요가 없더라고 넘기는 것이 좋다.

```js
lass Button extends React.Component {
  constructor(props) {
    super(props); // ✅ We passed props
    console.log(props);      // ✅ {}
    console.log(this.props); // ✅ {}
  }
  // ...
}
```

이렇게 하면, 생성자에서도 super(props) 다음에 바로 `this.props` 를 접근 할 수 있다.

---

React 사용자들이 궁금해 할 마지막 요소가 있다.

Context API 를 사용할 때, (레거시 contextTypes 또는 React 16.6에 추가 된 최신 contextType API를 사용하는 경우) context 가 생성자에 대한 두 번째 argument 로 전달된다.

그렇다면, 왜 `super(props, context)` 라고 작성하지 않을까?

이렇게 할 수도 있지만, context가 그다지 자주 사용되지 않기 때문에 반드시 `super(props, context)` 라고 사용할 상황이 많지 않다.

class fields 로 인해 대부분의 버그를 야기시킬 수 있는 상황들은 어쨌든 사라진다.

명시적 생성자가 없으면 모든 arguments가 자동으로 전달된다.

그렇기 때문에, `state = { }` 와 같은 표현식을 썼을 때, this.props 혹은 this.context 에 참조가 허용된다.

React에 새롭게 등장한 Hooks 에는 super나 this조차 필요하지 않다. 이 주제는 추후에 다룬다.

[Edit on GitHub](https://github.com/gaearon/overreacted.io/edit/master/src/pages/why-do-we-write-super-props.md)

## Ref

https://overreacted.io/why-do-we-write-super-props/
