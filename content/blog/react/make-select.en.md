---
title: 'Select Component'
date: 2022-04-23 16:00:09
category: react
thumbnail: './images/make-select/thumbnail.jpg'
---

![image-thumbnail](./images/make-select/thumbnail.jpg)

## Intro

If a design system provides a `Select` component, what functionality would you expect from it?

This post walks through the functionality we want from a Select component, along with how to implement it and example code.

> ⚠️ All the code shown in this post is **pseudo code**. It's written to convey the concepts being introduced rather than to guarantee that it actually runs.

## Table of Contents

- [Why](#why)
- [What. (Defining the functionality)](#what-기능-정의)
- [How. (Implementation)](#how-구현)
- [Extra 1) Autocomplete Select](#번외-1-자동완성-select)
- [Extra 2) A Multi Select that isn't coupled to a UI](#번외-2-multi-select이되-ui와-결합-되지-않는)
- [Extra 3) The native element matters](#번외-3-기본-element는-중요하다)
- [Wrapping up](#맺으며)

## Why

![headlessui.dev_react_listbox](./images/make-select/headlessui.dev_react_listbox.png)

<div style="opacity: 0.5" align="right">
    <sup><a href="https://headlessui.dev/react/listbox" target="_blank">https://headlessui.dev/react/listbox</a></sup>
</div>

When someone says **"I'm using the design system's Select component,"** what they expect is a Select with a polished UI like the screenshot above. The reason this post goes into so much depth on how to implement Select is that giving the plain `<select>` element that same polished UI, along with good UX, isn't nearly as simple as it is for other elements.

For example, a Button component is usually implemented by **applying** styles (CSS) directly to a `<button>` element. Select, however, is hard to "style" because [the CSS it supports is limited](https://developer.mozilla.org/ko/docs/Web/HTML/Element/select#css_%EC%8A%A4%ED%83%80%EC%9D%BC%EB%A7%81).

Let's look at how to implement a component that keeps `<select>`'s functionality, allows a custom UI, and still respects accessibility.

### An interface similar to the native element

Before diving into the implementation, let's first pin down the interface. The `<select>` element has an interface like this:

```html
<label for="pet-select">Choose a pet:</label>

<select name="pets" id="pet-select">
  <option value="">--Please choose an option--</option>
  <option value="dog">Dog</option>
  <option value="cat">Cat</option>
  <option value="hamster">Hamster</option>
</select>
```

If, because implementing the requirements directly is hard, we decide to take `value` as an array and render the `option`s internally, the component becomes hard to extend and fragile to change. So the component we're going to build will keep the same interface and the same functionality as `<select>`.

## What. (Defining the functionality)

Here are the requirements, organized around the core functionality of the `<select>` element:

- Keyboard and mouse actions can open and close the option list area.
- While the list is open, the selected option should be focused, and keyboard navigation between options should be possible.
- Searching within the options should be possible.
- Selection via keyboard action should be possible.

## How. (Implementation)

How can we build the requirements defined above — with what approach, and with what data (state)? Let's restate the requirements from an implementation perspective.

- Keyboard and mouse actions can open and close the option list area.
  - Need an `open` state that decides whether the options are rendered.
- While the list is open, the selected option should be focused, and keyboard navigation between options should be possible.
  - Whether each option is "selected" is determined by the `Select` component's `value` prop.
  - We need to know each option's [ref](https://reactjs.org/docs/refs-and-the-dom.html) and value.
- Searching within the options should be possible.
  - Same as above.
- Selection via keyboard action should be possible.
  - The "Select's selected value" state needs to change to the value of the option on which the Enter action occurs.

### Compound Component API

Along with fleshing out the requirements, we also need to flesh out the component interface defined earlier. To properly divide responsibility for a complex set of requirements, the `Select`-`Option` components need to cooperate, and for that we'll use the [Compound Component](https://kentcdodds.com/blog/compound-components-with-react-hooks) pattern.

A **"Compound Component"** refers to a form where two or more components cooperate to perform the required functionality. It usually consists of a parent and child components, sharing state between them that isn't exposed externally.

```html
<select>
  <option value="value1">key1</option>
  <option value="value2">key2</option>
  <option value="value3">key3</option>
</select>
```

Let's think about the relationship between the `<select>` and `<option>` elements. The two exist independently, but neither can be used on its own.

Still, an expression like the one above is the best from an interface standpoint. For example, if we focus purely on "these can't exist independently," we might end up with something like this:

```html
<select options="key1:value1;key2:value2;key3:value3"></select>
```

Expressing just `value` might look simple enough, but once you consider that other attributes like `disabled` are also needed, this turns out not to be a good API.

So the `Select` component ends up with the interface below, implicitly sharing `open` and `value` between the `<Select>` component and the `<Select.Option>` component.

```jsx
<Select open={open} defaultValue="value">
  <Select.Trigger>open select</Select.Trigger>
  <Select.OptionList>
    <Select.Option value="value1">value1</Select.Option>
    <Select.Option value="value2">value2</Select.Option>
    <Select.Option value="value3">value3</Select.Option>
  </Select.OptionList>
</Select>
```

Compared to the `<select>` element, `Trigger` and `OptionList` components have been added.

The `Trigger` component controls "the action of opening the options," something `<select>` never had; `OptionList` lets the consumer customize styling and define whatever props a list component might have, while inside the `Select` component it handles things like `value` control. (More on this below.)

### Context

The `OptionList` component needs to decide whether to render its children based on the `open` state passed to `Select`, which means state needs to be shared between `Select` and its child components.

The [Context API](https://reactjs.org/docs/context.html#gatsby-focus-wrapper) is a means for sharing state like this between components that are otherwise used independently. We declare a Provider on the top-level component, and the `OptionList` component decides whether to render based on the `open` value from context.

```jsx
function Select() {
 const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

 return (
  <SelectContext.Provider
    value={{ open, onOpenChange: setOpen }}
  >
    {children}
  </SelectContext.Provider>
 )
}

function OptionList() {
 const context = useSelectContext()

 return (
  <Ul role="listbox" onInteractOutside={context.onOpenChange}>
    {context.open ? children : null}
  </Ul>
 )
}
```

We can implement whether an Option is "selected" in a similar way.

```tsx
// omitted: duplicate code from above

function Select() {
  // ✅ declare the hook that manages the 'currently selected value'
 const [value = '', setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });

 return (
  <SelectContext.Provider
    value={{ value, onValueChange: setValue }}
  >
    {children}
  </SelectContext.Provider>
 )
}

function OptionList() {
 const context = useSelectContext()

 return (
  <Ul role="listbox" onItemSelect={context.onValueChange}>
    {context.open ? children : null}
  </Ul>
 )
}

function Options() {
 const context = useSelectContext()

 return (
  <li role="option">
    {children}
    {/* ✅ if context's 'value' matches the prop's value, treat it as selected */}
    {context.value === props.value ? 'selected' : ''}
  </li>
}
```

The basic implementation and design direction are settled now. This post won't go into detail, but item selection, keyboard actions, and so on can likewise be implemented using Context.

### Providing the information a screen reader needs

The DOM structure of the finished component looks roughly like this:

```html
<button type="button">
  <span>Devon Webb</span>
</button>
<ul>
  <li>Wade Cooper</li>
  <li>Arlene Mccoy</li>
  <li>Tom Cook</li>
  <li>Tanya Fox</li>
</ul>
```

Clicking the button opens the list, and you can navigate it and select a value with keyboard actions — but this markup alone can't explain that behavior to a screen reader.

```html
<button
  type="button"
  id="select-box-1"
  aria-haspopup="true"
  aria-expanded="true"
  aria-controls="select-list"
>
 <span>Devon Webb</span>
</button>
<ul aria-labelledby="select-box-1" id="select-list" role="listbox">
  <li>Wade Cooper</li>
  <li>Arlene Mccoy</li>
  <li>Tom Cook</li>
  <li>Tanya Fox</li>
</ul>
```

The `id`, `aria-controls`, and `aria-labelledby` attributes spell out the relationship between the elements, and `role`, `aria-haspopup`, and `aria-expanded` spell out the role and state.

1. [aria-controls](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-controls)

    Used to point at the element being controlled, when one element controls another. In the `Select` component, since the button controls the `ul` element, the `ul`'s id needs to be set as the button's `aria-controls` attribute.

    ```jsx
    <button aria-controls="custom-select-1">Button</button>
    <ul id="custom-select-1">...</ul>
    ```

2. [aria-expanded](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-expanded)

    Used to indicate whether a child element is shown, or whether the element referenced by `aria-controls` is expanded/collapsed.

3. [aria-haspopup](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-haspopup)

### Keyboard Navigation

![select_keyboard.gif](./images/make-select/select_keyboard.gif)

One important feature the `<select>` element supports is keyboard navigation between options. To provide the same UX, `Select` needs its own handling for keyboard navigation too.

To "navigate," we need to know what we're navigating over. When the `onKeyDown` event fires, we need to know **the full list of options (values)** and **each option's [ref](https://reactjs.org/docs/refs-and-the-dom.html)** in order to determine the next focus target relative to the currently focused element.

#### Collection

Let's revisit the component interface we defined earlier.

```jsx
<Select open={open} defaultValue="value1">
  <Select.Trigger>open select</Select.Trigger>
  <Select.OptionList>
    <Select.Option value="value1">value1</Select.Option>
    <Select.Option value="value2">value2</Select.Option>
    <Select.Option value="value3">value3</Select.Option>
  </Select.OptionList>
</Select>
```

To find out what all the options are, the `Select` component can either use the [React Children API](https://reactjs.org/docs/react-api.html#reactchildren) or have them declared explicitly. Both approaches have downsides.

- Children API: there's no guarantee the Option component will be a one-depth child of Select, so you'd have to traverse the entire children tree.
- Explicit declaration: something like `<Select options={['value1', 'value2']}>`. The problem here is that "what Select's options are" ends up expressed in two places. Having the same information expressed in two places creates an unnecessary maintenance burden, and from a usage standpoint, it's an API whose intent isn't clear.

Let's think about how the top-level component can learn the full list of options without changing the existing interface.

We already have the answer. **Since the information already exists, we just need to use it.** We declared `value` as a prop of `Select.Option`, so all the top-level component needs to do is find out what that value is.

For the implementation, we'll create a Context-managing component called Collection. (The idea and implementation of Collection are based on [radix-ui/collection](https://github.com/radix-ui/primitives/blob/main/packages/react/collection/src/Collection.tsx).)

```jsx
function Select() {
 return (
  <SelectContext.Provider
    value={{ open, onOpenChange: setOpen }}
  >
    <Collection.Provider>
      {children}
    </Collection.Provider>
  </SelectContext.Provider>
 )
}

function SelectOption() {
 return (
  <Collection.Item value={value}>
    <li>{children}</li>
  </Collection.Item>
 )
}
```

The Collection context holds an itemMap data structure, containing each option's value and ref.

```tsx
type ContextValue = {
  itemMap: Map<RefObject<ItemElement>, { ref: React.RefObject<ItemElement> } & ItemData>
}

function CollectionProvider() {
  const itemMap = React.useRef<ContextValue['itemMap']>(new Map()).current;

  return (
    <Collection.Provider value={{ itemMap }}>
      {children}
    </Collection.Provider>
 )
}

const ITEM_DATA_ATTR = 'data-radix-collection-item';
function CollectionItem(props) {
  const context = useCollectionContext();

  useEffect(() => {
    context.itemMap.set(ref, { ref, value: props.value })
  }, [])
 
  return <Slot {...{ [ITEM_DATA_ATTR]: '' }} ref={ref}>{children}</Slot>
}

function useCollection() {
  const context = useCollectionContext();
 
  const getItems = useCallback(() => {
    const collectionNode = context.collectionRef.current;
    const orderedNodes = Array.from(collectionNode.querySelectorAll(`[${ITEM_DATA_ATTR}]`));

    return orderedItems;
  }, [])

  return getItems;
}

Collection.Provider = CollectionProvider;
Collection.Item = CollectionItem;
```

The `CollectionProvider` component creates the context, and the `CollectionItem` component adds each element's ref and value to it.

The `useCollection` hook returns `getItems`, a function that returns the context value, giving consumers the full list of options (values) along with each option's ref information.

#### Handling events

With "keyboard navigation for the `<select>` element" now solved conceptually, we can implement it using the `useCollection` hook: **when a keyboard action occurs, find the next item and `focus` it.**

In the `onKeyDown` handler, whenever an arrow-key movement action happens, we use the `getItems` function to look up the full list of options and, depending on which arrow key was pressed, find and activate the previous/next element.

```jsx
function OptionList() {
  const context = useSelectContext()
  const getItems = useCollection();

 return (
  <Ul
    role="listbox"
    onKeyDown={event => {
      const items = getItems().filter((item) => !item.disabled);
      const candidateNodes = items.map((item) => item.ref.current!);

      isUpArrowPressed ? focusPrev(candidateNodes) : focusNext(candidateNodes);
    }}>
    {context.open ? children : null}
  </Ul>
 )
}
```

The code above is a simple pseudocode meant to illustrate the concept. For an actual working flow, I'd recommend checking out [radix-ui's menu/onKeyDown](https://github.com/radix-ui/primitives/blob/6da75e0dbb2d1aebd2dae5a044c595bca39a2347/packages/react/menu/src/Menu.tsx#L606).

## Extra 1) Autocomplete Select

### There can't be two focuses under the sun

![headlessui.dev_react_combobox](./images/make-select/headlessui.dev_react_combobox.png)

Consider a requirement like the one in the [Combobox example](https://headlessui.dev/react/combobox): **"searching and keyboard movement need to work at the same time."**

We're already used to a Select that "just works this way," but thinking about it from an implementation standpoint, it's actually an odd feature, in the sense that it can't be implemented using the `focus` function.

> An example illustrating "you can't have two focuses" is available in this [CodeSandbox](https://codesandbox.io/s/elated-glitter-3jci7h?file=/src/App.tsx).
>

The Combobox component doesn't actually hold two focuses at once — it needs to be implemented by applying a focus effect (style) during keyboard navigation instead.

Implementing the feature via a "focus effect (style)" also means we need to think about how to convey this feature to a screen reader. Since the actually-focused element never changes, a screen reader gets no information about the navigation even when arrow-key actions occur.

**Providing the information a screen reader needs**

We can solve this by using the right aria attributes.

1. [role="combobox"](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/combobox_role)

    Assigns the role of an autocomplete Select input.

2. [aria-activedescendant](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-activedescendant)

    The user's actual focus sits on the input (or some other focusable element), but when you want a UI that behaves as though another element were also focused, this attribute holds that element's id.

    For example, in the screenshot above, `aria-activedescendant="the id of the Wade Cooper element"`.

### KeyDown Event

The requirement is now a bit more concrete: **"when the input has focus in the autocomplete Select, and an arrow-key action occurs, apply a focus style to the relevant element."**

> This post only covers pseudocode, so if you need working code, I'd recommend using [floating-ui/useListNavigation](https://floating-ui.com/docs/useListNavigation).
>

```jsx
function useListNavigation() {
  const setFocusStyle = useCallback(() => {
    const presentListItems = getPresentListItems(listRef);
  
    // ✅ apply the focus style
    presentListItems[nextIndex].current?.classList.add(focusClassName);

    // ✅ remove the style from the item that previously had the focus style
    if (shouldRemovePreviousStyle) {
      presentListItems[currentIndex].current?.classList.remove(focusClassName);
    }
  }, [focusClassName]);

  const handleActiveIndex = useCallback((event: KeyboardEvent) => {
    const elementListRef = getListRef().map(item => item.ref);

    const minIndex = getMinIndex(elementListRef);
    const maxIndex = getMaxIndex(elementListRef);

    if (isDownArrowPressed) {
      /**
       * handle nextIndex
       */
    }
    /*...*/

    setFocusStyle(elementListRef, { currentIndex, nextIndex });
    setActivedescendantId(elementListRef[nextIndex].current?.id);
  }, []);

  return [activeIndex, { onKeyDown, 'aria-activedescendant': activedescendantId];
}
```

Applying `focusClassName` to the next item during arrow-key navigation gives us the focus effect, and the hook holding this logic returns the following values:

- **activeIndex:** the currently active (focus-styled) index
- **onKeyDown:** the keyDown handler that navigates to the previous/next item
- **aria-activedescendant:** the id of the currently active element

With this hook as a building block, we can implement further requirements like "select the item on Enter."

## Extra 2) A Multi Select that isn't coupled to a UI

![multi_select.png](./images/make-select/multi_select.png)

<div style="opacity: 0.5" align="right">
    <sup><a>https://mantine.dev/core/multi-select/</a></sup>
</div>

Many open-source design systems' `MultiSelect` interfaces take the selected value as a `string[]` and take the full list as `data` (an array of label/string).

```jsx
// https://mantine.dev/core/multi-select/
<MultiSelect
  data={countriesData}
  valueComponent={Value}
  defaultValue={['US', 'FI']}
/>
```

It does take a `valueComponent` prop for rendering the selected value, but since where the value can be rendered is limited, it's still tied to the MultiSelect UI.

We can solve this using the `Context` and Collection API built earlier, arriving at an interface like this:

```jsx
<>
<div>selected: {value.join()}</div>
<MultiSelect defaultValue={values} onValueChange={setValue}>
  <MutliSelect.Trigger>trigger</MutliSelect.Trigger>
  <MutliSelect.Content>
    <MutliSelect.Option>Korea</MutliSelect.Option>
    <MutliSelect.Option>France</MutliSelect.Option>
    <MutliSelect.Option>United states</MutliSelect.Option>
  </MutliSelect.Content>
</MultiSelect>
</>
```

The concrete difference from the Select we built earlier is that the type of `value` changes to `string[]`.

The `MultiSelect` component's job is to know what options exist, select values, and manage which values are selected, and by not getting involved in the concrete UI, we end up with a MultiSelect that isn't constrained in how it's implemented.

## Extra 3) The native element matters

<video controls style="width: 100%;" src="/media/react/images/make-select/select_autofill.mp4" type="video/mp4" poster="/media/react/images/make-select/select_autofill.png">
   Sorry, your browser doesn't support embedded videos,
</video>

When login info is autofilled, the Select's value gets autofilled from Student to Developer. (After saving 1Password's section > label together with the select's name and value, you can test this yourself at this [CodeSandbox link](https://codesandbox.io/s/autocomplete-example-bvqnwp?file=/src/App.tsx:189-229).)

<details style="margin-bottom: 10px;"><summary>1Password saved info</summary>
  <img src="/media/react/images/make-select/1pw_info.png" />
</details>

To support this kind of autofill in a Select built with a custom UI too, you need to keep a native select element around, even if it isn't shown on screen.

```jsx
function Select() {
  return (
    <SelectContext.Provider>
      {/* omitted: code in between */}
      <VisuallyHidden>
        <select name='job'>
          <option value="student">Student</option>
          <option value="developer">Developer</option>
          <option value="designer">Designer</option>
        </select>
      </VisuallyHidden>
    </SelectContext.Provider>
  )
}
```

### Visually Hidden

We used a `VisuallyHidden` component to keep it off-screen. The first approach that probably comes to mind for styling this component is setting `display` to `none`.

```jsx
const VisuallyHidden = styled('div', { display: 'none' })
```

This achieves the visual goal, but it can't convey any information to screen reader users, and the autoFill feature mentioned earlier won't work either.

We can use a "clip pattern" to get the same visual effect as `display: none` while still respecting accessibility.

```tsx
const VisullayHidden = styled('div', {
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: '1px',
})
```

## Wrapping up

I think Select is a component that a lot of web apps need.

Since overriding the native select element's style is difficult, it usually ends up being implemented by creating a custom element and attaching behavior to it — and in that process, covering all the functionality the existing select element already has while still keeping the component extensible turned out to be anything but simple.

The concepts and implementations introduced in this post are based on a number of headless UI libraries. If you're curious about the actual working code and want more detail on how it's implemented, check out [radix-ui](https://www.radix-ui.com/) and [headlessui](https://headlessui.dev/), both listed under References.

## Reference

- [https://kentcdodds.com/blog/compound-components-with-react-hooks](https://kentcdodds.com/blog/compound-components-with-react-hooks)
- [https://floating-ui.com/docs/useListNavigation](https://floating-ui.com/docs/useListNavigation)
- <https://github.com/radix-ui/primitives>
- <https://github.com/tailwindlabs/headlessui>
- [https://www.a11yproject.com/posts/how-to-hide-content/](https://www.a11yproject.com/posts/how-to-hide-content/)
