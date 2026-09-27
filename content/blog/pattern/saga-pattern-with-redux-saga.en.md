---
title: 'The Saga Pattern and redux-saga'
date: 2020-03-01 17:03:61
category: pattern
thumbnail: './images/thumbnail.png'
---

![image-thumbnail](./images/thumbnail.png)

Have you ever used [redux-saga](https://redux-saga.js.org/) to handle asynchronous work in [redux](https://redux.js.org/)?

> "The mental model is that a saga is like a separate thread in your application that's solely responsible for side effects. redux-saga is a redux middleware, which means this thread can be started, paused and cancelled from the main application with normal redux actions, it has access to the full redux application state and it can dispatch redux actions as well."  
> _Source: [the redux-saga official docs](https://redux-saga.js.org/)_

In other words, redux-saga's mental model is that a saga takes full responsibility for handling effects. You can start, pause, or cancel work through ordinary Redux actions, it can access the store state that Redux manages, and it can dispatch actions of its own.

To fully understand this, you need to understand the [Saga Pattern](https://blog.couchbase.com/saga-pattern-implement-business-transactions-using-microservices-part/).

## Saga

The Saga Pattern started gaining attention alongside the rise of microservices. There are various interpretations of the Saga Pattern — [MSDN](https://docs.microsoft.com/en-us/previous-versions/msp-n-p/jj591569(v=pandp.10)?redirectedfrom=MSDN), for instance, treats Saga as the Process Manager of the [CQRS](https://justhackem.wordpress.com/2016/09/17/what-is-cqrs/) pattern. The core idea behind Saga is to eliminate the need for distributed transactions by defining a [compensating transaction](https://en.wikipedia.org/wiki/Compensating_transaction) for every transaction.

> A compensating transaction is a transaction that runs when an error occurs in another transaction.

Let's assume, for example, that we have a service like the one below.

![sample_service.png](./images/sample_service.png)

It takes an order from the user and processes payment, inventory management, and delivery. Each stage is managed by its own service.

![sample_service_sequence.png](./images/sample_service_sequence.png)

A `Saga` is a sequence of local transactions, where each transaction updates data within its own service. The first transaction is triggered by an external request, and each subsequent transaction starts only after the previous one completes.

There are two representative ways to implement a Saga transaction.

- **Events/Choreography:** There's no manager governing the event flow; each service creates and listens for events, and decides on its own whether to act.
- **Command/Orchestration:** There's a manager that governs the event flow, and this manager centralizes and handles the business logic.

### Events/Choreography

![saga_event](./images/saga_event.png)

In the example above, the event flow looks like this.

1. The Order Service receives a new order and changes its status to *pending*. It then fires the **ORDER\_CREATED\_EVENT** event.
2. When the **ORDER\_CREATED\_EVENT** event fires, the Payment Service charges the customer and fires the **BILLED\_ORDER\_EVENT** event.
3. When the **BILLED\_ORDER\_EVENT** event fires, the Stock Service updates inventory, prepares the ordered items, and then fires the **ORDER\_PREPARED\_EVENT** event.
4. When the **ORDER\_PREPARED\_EVENT** event fires, the Delivery Service ships the product and fires the **ORDER\_DELIVERED\_EVENT** event.
5. Finally, when the **ORDER\_DELIVERED\_EVENT** event fires, the Order Service changes the order's status to *concluded*.

### [Rollback] Events/Choreography

![saga_event_rollback](./images/saga_event_rollback.png)

In the `Events/Choreography` approach, rollback proceeds through the following steps.

1. The Stock Service fires **PRODUCT\_OUT\_OF\_STOCK\_EVENT**.
2. The Order Service and Payment Service each carry out an action:
    - The Payment Service refunds the order that was being processed.
    - The Order Service changes the order's status to 'failed.'

> Note. Every transaction carries an id, so all listeners can immediately recognize which transaction occurred.

### Command/Orchestration

The `Command/Orchestration` approach introduces a separate Orchestrator that manages when each service should act and what it should do. The Saga Orchestrator communicates with each service in a `command/reply` form to hand off the work to be done.

Let's look at this through the example below.

![saga_orchestration](./images/saga_orchestration.png)

1. The Order Service saves the order and asks the Order Saga Orchestrator (hereafter OSO) to create the order transaction.
2. The OSO sends the **Execute Payment** command to the Payment Service, and the Payment Service replies with **Payment Executed**.
3. It sends the **Prepare Order** command to the Stock Service, and the Stock Service replies with **Order Prepared**.
4. Finally, it sends the **Deliver Order** command to the Delivery Service, and the Delivery Service replies with **Order Delivered**.

The OSO **manages every transaction needed to process the order.** If a problem occurs, it sends a command to each service so that they perform a rollback.

The Saga Orchestrator is implemented as a `State Machine` that manages commands and the state that corresponds to each one.

### [Rollback] Command/Orchestration

![saga_orchestration_rollback](./images/saga_orchestration_rollback.png)

1. The Stock Service sends an **Out-Of-Stock** response to the OSO.
2. The OSO recognizes that the transaction has failed and performs a rollback.
     - In this case, since one command (Payment Executed) had already succeeded before the failure, it sends the **Refund Client** command to the Payment Service. It then changes the state's status to 'failed.'

### Wrapping Up Command/Orchestration

The Orchestration Saga has the following advantages.

- Since only the Orchestrator Saga can call other services — a one-directional structure — you can avoid creating dependencies between services.
- Because things are managed in a command/reply form, complexity within each service goes down.
  - In the Event/Choreography pattern, complexity is higher because every service has to identify and subscribe to the events it needs.
- When multiple requests try to change the same value, the Orchestrator can judge and handle the priority of those requests.

However, there are downsides too.

- Too much logic ends up handled inside the Orchestrator. It can grow bloated and become hard to manage.
- Unlike the Event/Choreography model, you have to manage an additional Orchestrator service, which increases infrastructure complexity.

### Command/Orchestration VS Events/Choreography

The `Command/Orchestration` structure works well when services share a lot of events or context, and when Event Routing is complex.

> **Event Routing** refers to which service an event needs to be delivered to, and which event should follow after it.

`Events/Choreography` carries no management burden for an Orchestrator, so it's a good choice when the overall service footprint is small and there isn't much dependency between events.

## redux-saga

How does the `Saga` we've looked at so far connect to redux-saga? redux-saga exists as the **Orchestrator** that manages the flow between the actions that occur and the state being managed.

```js {8,9}
function sagaMiddleware({ getState, dispatch }) {
  // Initialize Saga

  return next => action => {
    if (sagaMonitor && sagaMonitor.actionDispatched) {
      sagaMonitor.actionDispatched(action)
    }
    const result = next(action) // dispatch to the reducer
    channel.put(action) // notify the saga that the action was dispatched

    return result
  }
}
```

Every action that passes through a saga is dispatched to the reducer first, and then the saga is notified that the action was dispatched through a communication channel called a [channel](https://redux-saga.js.org/docs/advanced/Channels.html).

Let's take a closer look through the example below.

> This is code from [redux-saga's Beginner Tutorial](https://redux-saga.js.org/docs/introduction/BeginnerTutorial.html).

```js
import { put, takeEvery, delay } from 'redux-saga/effects'

// Our worker Saga: will perform the async increment task
export function* incrementAsync() {
  yield delay(1000)
  yield put({ type: 'INCREMENT' })
}

// Our watcher Saga: spawn a new incrementAsync task on each INCREMENT_ASYNC
export function* watchIncrementAsync() {
  yield takeEvery('INCREMENT_ASYNC', incrementAsync)
}
```

If we include redux as well, this can be expressed as the flow below.

![redux-saga-flow](./images/redux_saga_flow.png)

The `Saga` listens for the INCREMENT\_ASYNC action and yields the delay and put effects. A saga yields effects, and **what it returns is a JavaScript object.**

The middleware receives this effect and processes it. In the example above, the first `yield delay` suspends execution and waits until one second has passed.

> **Note.** redux-saga's effects are split into blocking effects and non-blocking effects.
A blocking effect waits until it finishes processing, while a non-blocking effect moves on without waiting for it to finish.
A representative blocking effect is call, and a representative non-blocking effect is fork.

### Effect

As mentioned above, **a saga yields effects, and what comes back is a JavaScript object.** The code below is redux-saga's internal effect code.

```js {14,20,24}
// redux-saga/internal/effect.js
const makeEffect = (type, payload) => ({
  [IO]: true,
  combinator: false,
  type,
  payload,
})

export function call(fnDescriptor, ...args) {
  // Validate...

  return makeEffect(effectTypes.CALL, getFnCallDescriptor(fnDescriptor, args))
}

export function fork(fnDescriptor, ...args) {
  // Validate...

  return makeEffect(effectTypes.FORK, getFnCallDescriptor(fnDescriptor, args))
}

export function race(effects) {
  const eff = makeEffect(effectTypes.RACE, effects)
  eff.combinator = true
  return eff
}
```

Much like an [action creator function](https://redux.js.org/basics/actions/#action-creators), redux-saga's effects return an object created as the result of the `makeEffect(...)` function. Once you return an effect object that carries **information about what work should be done** this way, the middleware is the one that actually carries out the logic.

### Cancel

When the same event keeps coming in repeatedly, how can a saga orchestrate those events? redux-saga provides the [takeLatest](https://redux-saga.js.org/docs/api/#takelatestpattern-saga-args) API for this.

```js {9,12,17}
export default function takeLatest(patternOrChannel, worker, ...args) {
  const yTake = { done: false, value: take(patternOrChannel) }
  const yFork = ac => ({ done: false, value: fork(worker, ...args, ac) })
  const yCancel = task => ({ done: false, value: cancel(task) })
 // Set action and task

  return fsmIterator(
  {
    q1() {
      return { nextState: 'q2', effect: yTake, stateUpdater: setAction }
    },
    q2() {
      return task
        ? { nextState: 'q3', effect: yCancel(task) }
        : { nextState: 'q1', effect: yFork(action), stateUpdater: setTask }
    },
    q3() {
      return { nextState: 'q1', effect: yFork(action), stateUpdater: setTask }
    },
  },
  'q1',
  `takeLatest(${safeName(patternOrChannel)}, ${worker.name})`,
  )
}
```

Starting from `q1`, whenever the same event occurs, it cancels (_yCancel_) the previous event and passes a fork to the next state. Just as the Orchestrator Pattern implemented rollback through commands, a saga manages effects through cancellation.

### Test

Because redux-saga manages side effects through effect objects, writing test code is easy. You can write test code almost as if **you were walking through each step one at a time.**

Let's take the code below as an example.

```js
export function* fetchHelloWorld() {
  try {
    const helloText = yield select(helloSelector.text);

    const { data } = yield call(
      getHello,
      helloText,
    );

    yield put(helloWorldActions.success(data));
  } catch(error) {

    yield put(helloWorldActions.fail(error.status));
  }
}
```

Let's treat each place in the code where there's a `yield` as a `Step`, and write test code accordingly.

```js {11}
describe('HelloWorldsaga', () => {
  it('should dispatch success action', async () => {
    // Given
    const testRequest = {};
    const testResult ={
      data: {
        text: 'Mock Text'
      },
    };

    const gen = fetchHelloWorld(); // 0
    // Then
    expect(gen.next().value).toEqual(select(helloSelector.text)); // 1
    expect(gen.next(testRequest).value).toEqual(
      call(getHello, testRequest)
    ); // 2
    expect(gen.next(testResult).value).toEqual(
      put(helloWorldActions.success(testResult.data))
    ); // 3
    expect(gen.next().done).toBeTruthy(); // 4
  });
});
```

- **Step 0.** We defined the `fetchHelloWorld` saga as `gen`.
- **Step 1.** We check whether the `select(helloSelector.text)` effect matches the next step of `gen`.
- **Step 2.** The next yield step is where `call` runs. Since `call` is set up to take `fn` and `args`, we pass the `testRequest` value along with `gen.next(the call step)`, and then compare whether the result actually equals `call(getHello, testRequest)`.
- **Step 3.** This is the part where the result produced by `call` gets dispatched as a success action. Here too, we pass the pre-mocked `testResult` as the argument to `gen.next`.
- **Step 4.** Since there are no more yields left in the `fetchHelloWorld` saga, the value of `next()` at this step is `done`.

> For more detail, please refer to [redux-saga: testing](https://redux-saga.js.org/docs/advanced/Testing.html) and Jbee's post [Testing the Store and Business Logic](https://jbee.io/react/testing-3-react-testing/).

## Summary

In this post, I've walked through the Saga Pattern and redux-saga. A saga only plays the role of issuing commands, while the middleware handles the actual, direct work — a `Command/Orchestration` structure that can be a good choice for managing lots of events or context between services, and complex event routing.

Also, because the middleware's structure is simply to receive a `yield`ed value from the saga and carry out the corresponding action, writing tests is easy, as mentioned in the [Test](https://so-so.dev/pattern/saga-pattern-with-redux-saga/#test) section.

## Reference

- [https://medium.com/@jeanpan/saga-pattern-redux-saga-e694a31576ab](https://medium.com/@jeanpan/saga-pattern-redux-saga-e694a31576ab)

- [https://blog.couchbase.com/saga-pattern-implement-business-transactions-using-microservices-part/](https://blog.couchbase.com/saga-pattern-implement-business-transactions-using-microservices-part/)

- [https://meetup.toast.com/posts/136](https://meetup.toast.com/posts/136)

- [https://medium.com/@ijayakantha/microservices-the-saga-pattern-for-distributed-transactions-c489d0ac0247](https://medium.com/@ijayakantha/microservices-the-saga-pattern-for-distributed-transactions-c489d0ac0247)

- [https://justhackem.wordpress.com/2016/09/17/what-is-cqrs/](https://justhackem.wordpress.com/2016/09/17/what-is-cqrs/)

- [https://docs.microsoft.com/en-us/previous-versions/msp-n-p/jj591569(v=pandp.10)?redirectedfrom=MSDN](https://docs.microsoft.com/en-us/previous-versions/msp-n-p/jj591569(v=pandp.10)?redirectedfrom=MSDN)

- [https://www.youtube.com/watch?v=UxpREAHZ7Ck&index=5&list=PLZl3coZhX98oeg76bUDTagfySnBJin3FE](https://www.youtube.com/watch?v=UxpREAHZ7Ck&index=5&list=PLZl3coZhX98oeg76bUDTagfySnBJin3FE)
