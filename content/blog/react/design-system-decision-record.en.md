---
title: 'Design System Decision Record'
date: 2022-11-05 16:00:09
category: react
thumbnail: './images/design-system-decision-record/thumbnail.png'
---

![image-thumbnail](./images/design-system-decision-record/thumbnail.png)

This post covers the thinking and decisions behind a design system called linear that I didn't get to cover in my [FEConf2022 talk, "Design Systems, Beyond Form"](https://speakerdeck.com/soyoung210/dijain-siseutem-hyeongtaereul-neomeoseo).

## Table of Contents

- [Principle](#principle)
  - [Problem from Principle](#problem-from-principle)
- [Interface](#interface)
  - [Compound Component](#compound-component)
- [Headless](#headless)
  - [Example 1. Trigger](#예시-1-trigger)
  - [Example 2. Various functional components](#예시-2-다양한-기능-컴포넌트)
- [The design system's strangeness budget](#디자인-시스템의-낯섦-예산)
  - [Example 1. Slot](#예시-1-slot)
  - [Example 2. state](#예시-2-state)
  - [Example 3. PortalContainer](#예시-3-portalcontainer)
- [Supporting "not using" a feature](#사용하지-않음에-대한-지원)
- [Abstraction](#추상화)
  - [Example: TimePicker](#예시-timepicker)
- [Preventing wrong choices](#틀린-선택-막아주기)
- [Accessibility](#접근성)
  - [Example. TextField](#예시-textfield)
- [Closing](#맺으며)
- [References](#참고자료)

## Principle

***"Do only what's necessary." / "Flexibility is a duty."***

Flexibility, extensibility, and constraint are words commonly mentioned alongside design systems.

In a design system built on the assumption that it will be used by a single product, constraint is treated as being just as important as flexibility and extensibility, tied to the word "consistency."

In linear, however, we prevent user mistakes, but we didn't impose many strong constraints purely for the sake of consistency.

That decision wasn't without downsides. It led to fragmentation in places, and it sometimes confused users about how much they were allowed to customize.

Even so, the main reason we weight flexibility over constraint is that we believe a design system is itself a product that needs to stay flexible to change.

A changing product goes through iterations, incorporating customer requirements or reversing earlier decisions in favor of new ones. A design system, as the material a changing product is built from, may change on a relatively smaller scale, but it obviously still needs to respond flexibly to change.

Consistency achieved through constraint produces a system that struggles to respond to change, and in many cases that response comes at a high cost. Just as users don't fall in love with a product that only keeps changing, if the only way a design system can respond to change is a breaking change, the developers who use that system won't love it either.

That's why we need to treat the current decision as something that can change, and separate what the system must guarantee from what it doesn't need to.

### Problem from Principle

Because we pursue flexibility even while having a defined form, there aren't many constraints in place for the sake of consistency. Since some of the responsibility for consistency is delegated to the call site, things can easily slip through the cracks.

The ideal way to achieve both of these conflicting goals — flexibility and constraint — would be to predict every way the system will be used, i.e. every design case, and fully define which parts need to change and which need to be controlled.

But given that a product keeps changing and evolving, this approach is highly unrealistic. It could also turn the team that manages the design system into a blocker for every product improvement.

## Interface

In linear, we chose a Compound Component interface so that responsibility is divided and a component's behavior stays predictable.

![Example of a styled select component](./images/design-system-decision-record/select_example.png)

```jsx
<Select
  label="Your favorite framework/library"
  placeholder="Pick one"
  value={value}
  onChange={...}
  data={[
    { value: 'react', label: 'React' },
    { value: 'ng', label: 'Angular' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'vue', label: 'Vue' },
   ]}
  radius={4}
  inputWraper={<input />}
  shouldCreate={true}
  creatable={true}
  allowDeselect={false}
  {...props}
/>
```

For example, suppose the Select component used the interface above. Every prop sits at the same hierarchical level on a single component, but where each one is actually applied ranges from the very top of Select down to Option, and even the icon. The component's user can't easily predict where or how a given prop will end up being used.

```jsx
<Select value={value} onChange={...}>
  <Select.Label>
    Your favorite framework/library
  </Select.Label>
  <Select.Trigger>
    <Input style={{borderRadius: 4}} placeholder='Pick one' />
  </Select.Trigger>
  <Select.Content creatable>
    <Select.Option value='react'>React</Select.Option>
    <Select.Option value='ng'>Angular</Select.Option>
    <Select.Option value='vue'>Vue</Select.Option>
  </Select.Content>
</Select>
```

We changed it so that a prop is passed where it's actually used. Because the place a value is passed and the place it's used now match, it's easy for the call site to predict how a value it sets will be used.

Passing every prop from one place is somewhat provider-centric. Because every value the component's logic needs is delivered explicitly, the desired functionality was easy to implement. But the fact that props aren't all passed from one place doesn't mean the values that are needed become unknowable.

### [Compound Component](https://kentcdodds.com/blog/compound-components-with-react-hooks)

A "Compound Component" refers to a form in which two or more components cooperate to carry out the required functionality. It's composed of parent-child components, with state shared between them that isn't exposed externally.

State that several components need can be shared through a Context at a higher layer.

```jsx
// linear
function Select({value: valueProp, defaultValue, onChange}) {
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange,
  });

  return (
    <SelectProvider
      value={value}
      onValueChange={setValue}
    >
    </SelectProvider>
  )
}

// linear
function SelectOption(props) {
  const ctx = useSelectContext();

  return (
    <Prmitive.div
      role='option'
      onKeyDown={composeEventHandlers(props.onKeyDown, () => {
        if (SELECTION_KEYS.includes(event.key)) {
          // call context's onValueChange
          ctx.onValueChange(props.value)
        }
      })}
    />
  )
}
```

The top-level `onChange` prop passed at the call site is shared through Context and delivered to the Option component, where the actual selection event happens. In this way, even when the place a prop is passed from doesn't match the place it's needed, the necessary value can still be used through a Context above it, while keeping the interface intuitive.

## Headless

A design system defines both functionality and style. But if using a piece of functionality always forces a fixed style on you, that amounts to a lot of constraint baked in at the system level.

Having many constraints means less room for fragmentation, so the consistency you're after is easier to achieve, but freedom and flexibility suffer. When putting together a design system, which of these two opposing values — constraint or flexibility — to weight more heavily is a matter of choice.

Because linear weighted flexibility more heavily, we separated form and function in a lot of places.

### Example 1. **Trigger**

The most representative example in the headless space is the Trigger component.

![Screenshot showing where the trigger component that toggles the select content sits](./images/design-system-decision-record/select_trigger.png)

A Trigger component is a component that can turn on/off an element — like a Dropdown or Select — that appears by covering part of the screen.

![Example screenshot showing that a select trigger can be many different components](./images/design-system-decision-record/select_trigger.jpg)

The role of opening and closing a Select's option list should work with anything that plays the role of a button — a Ghost Button with a ChevronIcon, a Tag-shaped Button, and so on.

```jsx
<Select>
  <Select.Trigger>
    <Button />
    {/* or <Tag role='button' /> */}
    {/* or <IconButton icon={<SearchIcon />} /> */}
    {/* or <FieldBox /> */}
  </Select.Trigger>
  <Select.Content />
</Select>
```

This concept also relies on the Compound Component pattern mentioned earlier. I covered it in detail in the [talk slides](https://speakerdeck.com/soyoung210/dijain-siseutem-hyeongtaereul-neomeoseo?slide=81), and it's easy to implement using a library like [radix-ui](https://www.radix-ui.com/) or [ariakit](https://ariakit.org/).

### Example 2. Various functional components

There are several other places where we made a similar choice to separate function from form, as we did with the Trigger component.

![Screenshot of the selected-count and clear areas in a multi select](./images/design-system-decision-record/mulit_select_search.png)

The first example is at the top of MultiSelect: the "0 selected" (Count) area and the "Reset" (Clear) area.

In the `Count` area, everything besides the `0` — which represents the number of selected items — belongs to Count's presentation. The count data itself doesn't change, but how it's presented can. For example, it's currently rendered as "0 selected," but when the count is zero it could just as easily read "No selection" or "-".

If we consider that the wording of `Clear`'s "Reset" label could also change, this is another area where presentation needs to be separated from functionality.

```jsx
<MultiSelect>
  <MultiSelect.Content>
    <MultiSelect.Count>
      {({count}) => `${count} selected`}
    </MultiSelect.Count>
    <MultiSelect.Clear asChild>
      <Button>Reset</Button>
    </MultiSelect.Clear>
  </MultiSelect.Content>
</MultiSelect>
```

The Count component only supplies the selected-count data via [render props](https://reactjs.org/docs/render-props.html), and the Clear component, like Trigger, only supplies functionality.

This is a device for flexibility, but it can be tiring for frequently used cases, so it's worth also providing a ready-made preset like the one below.

```jsx
<MultiSelect>
  <MultiSelect.Content>
    {/* renders as "{count} selected" */}
    <MultiSelect.CountText />
    {/* renders as "Reset" */}
    <MultiSelect.ClearButton />
  </MultiSelect.Content>
</MultiSelect>
```

## The design system's strangeness budget

The term "strangeness budget" comes from the post [The language strangeness budget](https://steveklabnik.com/writing/the-language-strangeness-budget). It describes how, if a new programming language ships too few new features, people won't bother taking an interest in it, while if it introduces too much that's new, the barrier to entry gets too high and few people end up using it — meaning every new choice has a cost. (Quoted from the talk [FEConf2021 "Why I Love React"](https://www.youtube.com/watch?v=dJAEWhR83Ug).)

A design system is no different, in that it bundles many features under one name and has to help users use them easily and often. Whenever a component or feature is added, every decision has to avoid contradicting the system's underlying stance while keeping what the user needs to learn to a minimum.

In linear, we defined abstract interfaces, and for functionality that felt similar, we pursued a consistent interface rather than one tailored to each individual component.

### Example 1. Slot

![Screenshot explaining the position of leftSlot](./images/design-system-decision-record/leftSlot.png)

A Slot refers to a prop that can be rendered in a fixed area. Depending on its position, it's named `leftSlot` or `rightSlot`.

In some components, that slot position might end up being specific to icons only, but for the sake of keeping the interface consistent across positions and reducing constraints, we treat it as a `slot` that can hold anything.

### Example 2. How to express state (error, success, warning)

![Example of Alert and toast components with error and success states](./images/design-system-decision-record/state.png)

Many components need a predefined form for states such as error and success. This requirement is no different: it still has to be delivered through an interface that's comfortable for the user while keeping constraints to a minimum.

```jsx
// Alert
<Alert leftSlot={<InfoIcon />} />
<Alert.Error />
<Alert.Success />

// Toast
const toast = useToast();

toast.show(
  <div>This part is the content.</div>,
  { leftSlot: <ClipIcon /> },
);

toast.error(<div>This part is the content.</div>);
toast.success(<div>This part is the content.</div>);
```

The `Alert` and `toast` interfaces are structured similarly. There's a base type — `<Alert />` and `toast.show` — capable of expressing various forms, and the predefined form for each state can be used by referencing a property.

### Example 3. PortalContainer

![Example of Dialog and Popover used while covering the entire screen](./images/design-system-decision-record/portalContainer.png)

For floating components like Dialog and Popover that render at a separate hierarchy, we provide `PortalContainer` as a way to change the reference element from `document.body` to something else.

```jsx
<Dialog>
  <Dialog.PortalContainer asChild>
    <div>It'll show up here.</div>
  </Dialog.PortalContainer>
  <Dialog.Content />
</Dialog>
```

There were interfaces that fit an individual component a little better than plain JSX, but to lower the learning fatigue around this functionality, we currently only offer this one approach.

## Supporting "not using" a feature

![Screenshot highlighting the close button on a Notion side page](./images/design-system-decision-record/notion_page.png)

Suppose some component defines a `>>` button (CloseIconButton) that performs a close action as a default feature.

```jsx
// Let's call this example component 'SidePeek'.
<SidePeek
  // The '>>' icon button (CloseIconButton) isn't declared
  toolBar={
    <Toolbar>
      <ExpandIconButton />
      <ModeToggleIconButton />
    </Toolbar>
  }
>
  {...}
</SidePeek>
```

Wherever the button is needed, it can be used without any extra typing.

![Screenshot of a Notion side page not using the close button](./images/design-system-decision-record/notion_page_not_use.png)

But what if a requirement comes up that says the `>>` button shouldn't be used? How would we express that? Since SidePeek defines it as a default feature, we need to provide an additional way to exclude it.

```jsx
// Let's call this example component 'SidePeek'.
<SidePeek
  // A prop for excluding the '>>' icon button (CloseIconButton)
  notUseCloseButton={true}
  toolBar={
    <Toolbar>
      <ExpandIconButton />
      <ModeToggleIconButton />
    </Toolbar>
  }
>
  {...}
</SidePeek>
```

We added "not using it" as a `notUseCloseButton` prop. But looking only at the interface, there's no way to predict which button this prop is declaring as unused. It forces the user to learn every possible outcome tied to the `notUseCloseButton` value.

The most natural way to declare that a component isn't being used isn't a boolean prop — it's to actually not use it. In other words, don't define CloseIconButton as a default feature in the first place.

```jsx {7,24}
// When using CloseIconButton
function MySidePeekWithCloseIconButton() {
  return (
    <SidePeek
      toolBar={
        <Toolbar>
          <CloseIconButton />
          <ExpandIconButton />
          <ModeToggleIconButton />
        </Toolbar>
      }
    >
      {...}
    </SidePeek>
  )
}

// When not using CloseIconButton
function MySidePeekWithoutCloseIconButton() {
  return (
      <SidePeek
        toolBar={
          <Toolbar>
            {/*<CloseIconButton />*/}
            <ExpandIconButton />
            <ModeToggleIconButton />
          </Toolbar>
        }
      >
        {...}
      </SidePeek>
  )
}

```

Declaring this for every repeated use case can feel somewhat tedious, but since the cost of dealing with a default feature you can't remove is high, and it tends to show up in ways that are hard to predict, always-included functionality needs to be judged conservatively.

## Abstraction

Staying flexible to change requires a component's spec to support general-purpose use cases, which calls for a high level of abstraction.

### Example: TimePicker

![Example showing TimePicker used for both single-time selection and range selection](./images/design-system-decision-record/timepicker.png)

This is a TimePicker that can be used to select a single time, or as a start/end time range.

There are various ways to structure the interface for this spec.

- Implement SingleTimePicker and RangeTimePicker as separate components.
- Create FromTimePicker and ToTimePicker, and use only FromTimePicker when selecting a single time.
- Create only TimePicker, and let the call site handle start/end time selection in controlled mode.

All three approaches left a lot to be desired. Choosing the first and building a `RangeTimePicker` made it hard to arrive at the compositional interface linear aims for, and the other two didn't seem to offer good DX.

So we extended the Single/Range concept and decided to build `TimePicker` and `DependentTimePicker`.

DependentTimePicker took its idea from how [ant.design's Form.Item](https://ant.design/components/form/#components-form-demo-control-ref) accesses form values through the `getFieldValue` render prop.

```jsx
// antd Form
<Form>
  <Form.Item name='foo-field' />
  <Form.Item>
    {({ getFieldValue }) => {
      const fooValue = getFieldValue('foo-field');

      return <input />
    }}
  </Form.Item>
</Form>
```

Values can be shared between Form.Item instances under a Form component. Likewise, if TimePicker had a means of sharing values between Select components, it could support not just single selection and start–end time selection, but N different time selections.

```jsx
function MyRangeTimePicker() {
  return (
    <TimePicker>
      {/* Select the start time */}
      <TimePicker.Select id='from' />
      <TimePicker.DependentSelect>
        {({ getValue }) => {
          // Based on the start time
          const startValue = getValue('from');
          // Generate as many intervals as we want and use them
           const endInterval = getTimeInterval({
              start: addHours(startValue, 1),
              end: addHours(startValue, 24),
              step: 45,
            });

          return (
            <>
              <TimePicker.Trigger />
              <TimePicker.Content />
            </>
          )
        }}
      </TimePicker.DependentSelect>
    </TimePicker>
  )
}

```

In DependentSelect's `getValue`, the `id` passed to a Select lets you reach that other Select's value.

## Preventing wrong choices

Pursuing flexibility over constraint doesn't mean we're off the hook for the user's (the developer's) mistakes. We can reduce the constraints on expression, but we're still responsible for preventing the wrong expression.

### Example. Creating a new option in TimePicker

![Screenshot showing that creating a new option in TimePicker's range selection has to account for the min and max time](./images/design-system-decision-record/timepicker_new_option.png)

TimePicker has a feature that generates and shows a new option for a time not already in the list, as long as it's a valid input.

When a user types "547," which option should be shown can differ depending on the min and max time. If the start time is "5:45 PM," then "5:47 AM" is a wrong choice.

Handling time input and generating new options are basic responsibilities of TimePicker, so we need a mechanism that ensures this feature is used correctly.

```jsx
// The call site generates and uses the options it wants
function MyTimePicker() {
  const timeInterval = getTimeInterval({
    start: new Date(),
    end: addHours(new Date(), 24),
    step: 30,
  });

  return (
    <TimePicker>
      <TimePicker.Select>
        {timeInterval.map(time => {
          return (
            <TimePicker.Option key={time} value={time} />
          )
        })}
      </TimePicker.Select>
    </TimePicker>
  );
}
```

Just like Select, TimePicker leaves the decision of which Option to render to the call site, so it's hard to directly determine the min and max time from inside the component.

But accepting min/max time props isn't a good option. From the user's perspective, they've already decided which options to render, and in the code above, the first value of `timeInterval` is already the minimum time value. If min/max time props also had to be passed, the same information would be expressed twice, and the minimum time value would lose a guaranteed single source of truth.

Even without the user passing it directly, that information is already being expressed somewhere, so TimePicker can just figure it out internally.

```jsx
// linear
function TimePickerOption(props) {
  return (
    <Collection.ItemSlot value={props.value}>
      <Select.Option value={props.value} />
    </Collection.ItemSlot>
  )
}

function TimePickerNewOptionContent(props) {
  const getItems = useCollection();
  return (...)
}
```

By using the [Collection Context I mentioned in my FEConf2022 talk](https://speakerdeck.com/soyoung210/dijain-siseutem-hyeongtaereul-neomeoseo?slide=93), TimePicker can know its own list of options internally.

```jsx
// linear
function TimePickerNewOptionContent(props) {
  const getItems = useCollection();
  const [min, setMin] = useState<Timestamp | undefined>(undefined);
  const [max, setMax] = useState<Timestamp | undefined>(undefined);

  useEffect(() => {
    const items = getItems();
    const values = items.map(({ value }) => value);
    const [minTimeValue, maxTimeValue] = [
      Math.min(...values),
      Math.max(...values),
    ];

    setMax(maxTimeValue);
    setMin(minTimeValue);
  }, [getItems]);

  const options = useMemo(() => {
    while (isBefore(baseDate, max)) {
      const value = setHoursMinsFromDate(baseDate, {
        hours: parsedValue.hours,
        mins: parsedValue.mins,
      });
      // ...
      newOptions
        .filter(
          newOption => isAfter(newOption, min) && isBefore(newOption, max)
        )
        .forEach(newOption => baseOptions.push(newOption));

      baseDate = addDays(baseDate, 1);
    }

    return baseOptions;
  }, [formattedSearchValue, max, min]);

  return children({
    hours: parseSearchValue(formattedSearchValue.value).hours,
    mins: parseSearchValue(formattedSearchValue.value).mins,
    options,
  });
}
```

Through the collection, we can know the full list of times TimePicker has rendered, and when showing a new option, we can make sure only times within the min/max range are rendered.

```jsx {9,10,11,12}
function MyTimePickerWithNewOption() {
  return (
    <TimePicker>
      <TimePicker.Select>
        <TimePicker.Content affix={<TimePicker.SearchInput />}>
          <TimePicker.Options />
          {/* Component shown only when there are no search results */}
          <TimePicker.SearchEmpty>
            <TimePicker.NewOptionsContent>
              {({ options }) => {
                return options.map(() => <Select.Option />)
              }}
            </TimePicker.NewOptionsContent>
          </TimePicker.SearchEmpty>
        </TimePicker.Content>
      </TimePicker.Select>
    </TimePicker>
  )
}
```

Because the options that should be rendered for a given input are computed inside `NewOptionsContent` and handed over as render props, the call site can just use the component — without worrying about internal implementation details — and still end up with a TimePicker that offers the correct set of options.

## Accessibility

Since a design system has to guarantee consistent usability, supporting accessibility should be the design system's responsibility rather than something left up to the call site wherever possible.

### Example. TextField

```tsx
// ❌ Avoid defining these attributes directly wherever possible
<TextField
  describeId='my-id'
  helperText={<TextField.HelperText id='my-id' />}
/>

// ⭕️ Structure it so the component figures this out internally
<TextField helperText={<TextField.HelperText />} />
```

To convey TextField's role to a screen reader, the description and label ids need to be supplied to the input component's `aria-describedby` and `aria-labelledby`.

```jsx
// linear
function TextField() {
  const [describedBy, setDescribeBy] = useState();

  return (
    <TextFieldProvider
      describedBy={describedBy}
      onDescribeByChange={setDescribeBy}
    >
      {children}
    </TextFieldProvider>
  )
}

// linear
function HelperText(props) {
  const helperTextId = useId(props.id);

  useLayoutEffect(() => {
    onDescribeByChange(helperTextId);
  }, [helperTextId, setDescribedBy]);

  return (...)
}

// linear
function Input() {
  const { describedBy } = useTextFieldContext();

  return (
    <input
      aria-describedby={describedBy}
    />
  )
}
```

So the call site doesn't have to generate and pass an id every time, we generate the id internally and pass it down through context so the input still gets the right id.

Beyond TextField, we applied the same approach to other components that need to pass extra information to screen readers, such as Dialog, Dropdown, and Select.

## Closing

There were far more big and small decisions behind this design system than this post covers. We discussed at length with the team what needed thinking through and what trade-offs each decision carried, and we looked through the implementations, PRs, and issues of a number of open-source projects.

![Open-source projects we referenced](./images/design-system-decision-record/references.png)

Looking through many libraries for their interfaces and implementation details let us think through the direction and composition our design system needed.

I can't yet say for certain that today's decisions are the best ones, but I hope this design system — built on a great deal of thought and deliberation — stays free of rust for a long time and keeps growing into good material for the product.

## References

- [https://youtu.be/BcVAq3YFiuc](https://youtu.be/BcVAq3YFiuc)
- [https://kentcdodds.com/blog/compound-components-with-react-hooks](https://kentcdodds.com/blog/compound-components-with-react-hooks)
