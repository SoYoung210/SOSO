---
title: 'Different Ways to Handle Input'
date: 2021-03-21 16:00:09
category: react
thumbnail: './images/form-handling/thumbnail.png'
---

![image-thumbnail](./images/form-handling/thumbnail.png)

One of the tricky problems in web applications is the Form — receiving and handling user input data. This post introduces several ways to handle forms, along with [react-hook-form](https://react-hook-form.com/), one of the most popular form libraries.

## A Simple Form

A simple example that comes to mind for a Form is a Login Form that takes an Email and Password.

![simple-login](./images/form-handling/simple-login.png)

In this case, you can implement it by defining state and a handler for each input's `value` and passing them down.

```jsx
const EasyLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    console.log('email', email, 'password', password);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        email
        <input
          type="text"
          value={id}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
    </form>
  )
}
```

The `input`s used in the example above are **Controlled** **Components**.

### Controlled Component

In a Controlled Component, form data is managed as the component's state.

![input-state-update](./images/form-handling/input-state-update.png)
<small>https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/</small>

- The initial state is an empty string, `''`.
- Type `a`, and `handleNameChange` picks up `a`; the input re-renders with `a` as its value.
- Type `b`, and `handleNameChange` picks up the value `ab` and stores it as state. The input re-renders with the value `ab`.

Because input value changes are always **pushed**, the data (state) and the UI (input) stay in sync at all times, which is why you can reference the input's value directly.

## As Forms Get More Complex

As the number of forms grows and things get more complex, the amount of code you need grows too, and you end up doing more [state lifting](https://reactjs.org/docs/lifting-state-up.html) to share state. In this case, state ends up concentrated in the parent component, and child components inevitably have to receive handlers and state injected into them, which makes it hard to reuse components on their own.

```jsx
const HardRegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [job, setJob] = useState('');
  const [aboutMe, setAboutMe] = useState('');

  return (
    <>
      <Input name='Email' value={email} onChange={setEmail} />
      <Input name='Password' value={password} onChange={setPassword} />
      <Input name='Home Address' value={address} onChange={setAddress} />
    </>
  )
};
```

Responsibility has become concentrated in `HardRegisterForm`. If logic like validation gets added on top of handling values, this component will only get more verbose. To solve this, you can use React's [useImperativeHandle](https://reactjs.org/docs/hooks-reference.html#useimperativehandle) hook to split up the form and isolate each part so it manages its own state.

```jsx
const BasicInformationFormGroup = (
  _,
  ref: Ref<{ values: BasicInfoFields }>
) => {
  const [name, setName] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useImperativeHandle(
    ref,
    () => ({
      values: {
        name,
        aboutMe,
        phoneNumber,
      },
    }),
    [name, aboutMe, phoneNumber]
  );

  return (
    <>
      <Input name="Name" value={name} onChange={setName} />
      <Input name="About Me" value={aboutMe} onChange={setAboutMe} />
      <Input name="Phone Number" value={phoneNumber} onChange={setPhoneNumber} />
    </>
  );
};
```

We split up the form and, through `useImperativeHandle`, exposed **only each input's value** to the outside. The parent component can access the values through the `ref` it passed to `BasicInformationFormGroup`. By isolating information this way, we can properly distribute responsibility across each component.

Beyond that, when you need to handle logic based on a computed value inside a nested component, this also lets you **handle the related logic cohesively.** For example, consider a case where you need a bank's full information based on the selected bank name.

```tsx
const 은행Form = () => {
  const bankList = useBankList();
  const [selectedBankName, setSelectedBankName] = useState('');
  const selectedBank = useMemo(() => {
    return bankList.data.find(({ name }) => name === selectedBankName);
  }, [bankList, selectedBankName]);

  const { handleBankAccountValidation } = useBankAccountValidation();

  return (
    <>
      <Select>
        {bankList.map(bank => (
          <Option key={bank.id} onChange={onchange(bank)}>
            {bank.name}
          </Option>
        ))}
      </Select>
      <계좌번호>
        <button onClick={handleBankAccountValidation} />
      </계좌번호>
    </>
  );
};
```

`은행Form` (BankForm) is managing two pieces of information: **bank selection** and **account number input.** As the code grows longer, it gets harder to grasp the context around each piece of information.

```tsx
const 은행Form = () => {
  const selectedBankRef = useRef(null);
  const { handleBankAccountValidation } = useBankAccountValidation();

  return (
    <>
      <은행_선택 ref={selectedBankRef} />
      <계좌번호>
        <button
          onClick={() => {
            handleBankAccountValidation(selectedBankRef.current.selectedBank);
          }}
        />
      </계좌번호>
    </>
  );
};

const 은행_선택 = (_, ref: Ref) => {
  const bankList = useBankList();
  const [selectedBankName, setSelectedBankName] = useState('');
  const selectedBank = useMemo(() => {
    return bankList.data.find(({ name }) => name === selectedBankName);
  }, [bankList, selectedBankName]);

  useImperativeHandle(ref, () => ({ selectedBank }), [selectedBank]);

  return (
    <Select>
      {bankList.map(bank => (
        <Option key={bank.id} onChange={onchange(bank)}>
          {bank.name}
        </Option>
      ))}
    </Select>
  );
};
```

We created a `은행_선택` (BankSelect) component and separated out the logic that looks up bank information based on the selected bank name. It returns the value through a ref so the parent component can know about the 'selected bank.'

## Rethinking Controlled Components

We improved how we use Controlled Components, but we still have to declare a handler for every input, and as a form grows, we can run into performance issues from re-rendering.

![controlled_uncontrolled_rerender](./images/form-handling/controlled_uncontrolled_rerender.gif)

While managing every input value as state, changing even a single input's value causes the whole thing to re-render. Before reaching for memoization to optimize this, let's ask a more fundamental question.

### Do we need to observe every piece of state?

Let's think about the purpose of a Form. **The default behavior of a Form is to submit the information a user entered when the submit button is pressed.** Some inputs might need to run certain logic on every `onChange`, but it's hard to say that falls within the scope of the default behavior.

How should we deal with re-renders caused by changes to input values we don't even need to know about? How do we keep each input isolated?

The moment you start wondering about this, it's worth considering handling things as an Uncontrolled Component.

### Uncontrolled Component

With an Uncontrolled Component, each input's value **is stored in the DOM.** Instead of defining state and building handlers, you access the DOM through a `ref` to handle events.

```jsx
const NameForm = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event) {
    alert('A name was submitted: ' + inputRef.current.value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" ref={inputRef} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  )
}
```

Rather than subscribing to input value changes, this **pulls** the value through the ref passed to the input, only when you need it.

### Switching to an Uncontrolled Component

The `BasicInformationFormGroup` component we made above can be changed into an Uncontrolled Component like this.

```jsx
const BasicInformationFormGroup = (
  _,
  ref: Ref<{ values: BasicInfoFields }>
) => {
  const nameRef = useRef<HTMLInputElement | null>(null);
  const aboutMeRef = useRef<HTMLInputElement | null>(null);
  const phoneNumberRef = useRef<HTMLInputElement | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      get values() {
        return {
          name: nameRef.current?.value,
          aboutMe: nameRef.current?.value,
          phoneNumber: phoneNumberRef.current?.value,
        };
      },
    }),
    []
  );

  return (
    <>
      <Input ref={nameRef} name="Name" />
      <Input ref={aboutMeRef} name="About Me" />
      <Input ref={phoneNumberRef} name="Phone Number" />
    </>
  );
};
```

Each input no longer needs to receive `value` and `handler` as props.

What's different from before is the use of a [getter](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions/get). The second argument to `useImperativeHandle` is a function, and this creates a closure that captures values. By returning a function through the `getter`, and having that getter function get called only at the moment `values` is referenced, you can avoid bugs caused by that capturing.

## Situations Where Uncontrolled Components Are Hard to Use

Because Uncontrolled Components don't subscribe to every change in an input's value, and instead pull the value only when needed, they can feel hard to work with in situations like these.

- When you need to run specific logic based on a validation result at the moment of onChange
- When many forms depend on each other's values

Because you don't fully control the state value, this part can be difficult, but I didn't want to give up the various advantages Uncontrolled Components offer (performance, concise code, and so on), so I solved the downsides above using react-hook-form's [watch](https://react-hook-form.com/api#watch) and [useFormContext](https://react-hook-form.com/api#useFormContext).

> Just as there's no 'perfect answer' for any technology, this is admittedly a hard part of Uncontrolled Components, but even so, I didn't want to give them up. I felt that simply solving the verbosity and wasted performance that bother you when handling forms was already advantage enough.

## [react-hook-form](https://react-hook-form.com/)

react-hook-form is a library that makes it easy to handle forms the Uncontrolled way. Let's look at react-hook-form along with some usage examples.

### When Inputs Are Added Dynamically

Sometimes the number of inputs you can fill in grows dynamically. If you access values by passing a `ref`, you'd need to create a new ref every time the number of fields increases, which is impossible if you don't know ahead of time how many there will be.

Every time the number of forms increases, you'd need to assign an ID and handle the data as a Map structure.

```jsx
// https://github.com/fitzmode/use-dynamic-refs/blob/master/src/index.tsx
const map = new Map<string, React.RefObject<unknown>>();

function useDynamicRefs<T>(): [
  (key: string) => void | React.RefObject<T>,
  (key: string) => void | React.RefObject<T>
] {
  return [getRef, setRef];
}

const Example = () =>  {
  const foo = ['random_id_1', 'random_id_2'];
  const [getRef, setRef] =  useDynamicRefs();

  return (
    <>
      { foo.map((eachId, idx) => (
        <input ref={setRef(eachId)} />))
      }
    </>
  )
}
```

You could implement this yourself as shown above, but a good wheel has already been invented. You can solve this simply with [useFieldArray](https://react-hook-form.com/api#useFieldArray).

```jsx
const FIELD_NAME = 'test';
const ArrayForm = () => {
  const { control, register } = useForm();
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: FIELD_NAME,
    }
  );

  return (
    <>
      {fields.map((field, index) => (
        <input
          key={field.id}
          name={`${FIELD_NAME}[${index}].value`}
          ref={register()}
          defaultValue={field.value}
        />
      ))}
    </>
  );
};
```

### When You Need Logic Based on the Value at onChange Time

```tsx
const WatchedInput = () =>  {
  const { register, watch, errors, handleSubmit } = useForm();
  const watchShowAge = watch("showAge", false); // false: defaultValue

  const onSubmit = data => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="checkbox" name="showAge" ref={register} />

      {watchShowAge && <input type="number" name="age" ref={register({ min: 50 })} />}
      <input type="submit" />
    </form>
  );
}
```

Every time the value of `showAge` changes, `WatchedInput` re-renders, and if it's true, it renders the `age input`. `watch` subscribes to changes through an event listener and triggers a re-render based on the field value. I thought this solved one of the hard parts of Uncontrolled Components really well, which made me curious how it works internally, and I wrote up the details separately in [A Closer Look at react-hook-form](https://github.com/SoYoung210/soso-tip/issues/53).

### When Many Forms Depend on Each Other's Values

![complex-form](./images/form-handling/complex-form.png)

We split 'Basic Info' (`기본정보`) and 'Account Info' (`계좌정보`) into separate components, but let's think about a case where verifying an account (`계좌 실명인증`) requires a bank name, an account number, and a **resident registration number** (Korea's national ID number).

When forms depend on each other's values like this, it's hard to split them into separate components, and handling it all in one file concentrates responsibility and makes props drilling worse. Right now it's just a single reference, so it can be solved simply, but the more deeply components need to be nested, the harder it gets to manage. A situation like this can be solved easily using [FormContext](https://react-hook-form.com/api#useFormContext).

```tsx
const ParentForm = () => {
  const methods = useForm({
    mode: 'onBlur',
    defaultValues,
  });

  return (
    <FormProvider {...methods}>
      <기본정보 />
      <급여정보 />
    </FormProvider>
  )
}

const 계좌정보 = () => {
  const { getValues } = useFormContext();

  return (
    <급여계좌번호>
      <계좌실명인증
        onClick={() => {
          validateAccount(은행명, 계좌번호, getValues('주민등록번호'));
        }}
      />
    </급여계좌번호>
  );
};
```

From `계좌정보` (AccountInfo)'s perspective, **since the resident registration number is an external value,** we made a separate component that connects to FormContext so the value can be injected in.

```tsx
export const ConnectRTHValue = ({
  children,
}: {
  children: (params: FormContextParamsType) => JSX.Element;
}) => {
  const methods = useFormContext();

  return children({ ...methods });
};

const ParentForm = () => {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <기본정보 />
      <ConnectRTHValue>
        {({ getValues }) => (
          <급여정보 getSsnValue={() => getValues('주민등록번호')} />
        )}
      </ConnectRTHValue>
    </FormProvider>
  );
};

```

Using the [renderProps](https://reactjs.org/docs/render-props.html) pattern this way means the child Form component can be used both together with react-hook-form and without it, and since you can write tests without mocking the Provider, testing becomes easier too.

## Conclusion

There's no Best Practice that fits every form well. This post mainly introduced handling forms as Uncontrolled Components using react-hook-form, but when specific logic needs to run on every change event, or when a large-scale form has a wide range of value dependencies, combining Controlled Components with the Context API might be a better choice.

## Reference

- [https://reactjs.org/docs/uncontrolled-components.html](https://ko.reactjs.org/docs/uncontrolled-components.html)
- [https://react-hook-form.com/](https://react-hook-form.com/)
- [https://github.com/fitzmode/use-dynamic-refs](https://github.com/fitzmode/use-dynamic-refs/blob/master/src/index.tsx)
