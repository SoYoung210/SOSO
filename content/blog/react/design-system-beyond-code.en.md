---
title: 'Design Systems, Beyond the Code'
date: 2024-04-07 16:00:09
category: react
thumbnail: './images/design-system-beyond-code/thumbnail.png'
---

![image-thumbnail](./images/design-system-beyond-code/thumbnail.png)

I'm building my third design system in my career. One of them I built from scratch, and the other two I redeveloped on top of existing systems. Through these three experiences I learned what matters and what doesn't, and I've written up the various difficulties I ran into along the way.

- [Before you build](#만들기-전에)
  - [Goals](#목표)
  - [Quality is what matters](#중요한-것은-퀄리티)
  - [Establishing core principles](#대원칙-만들기)
- [While building](#만드는-중에)
  - [Guarding the core principles](#대원칙-수호하기)
  - [Code is the baseline](#코드는-기본이다)
  - [Definition is everything](#정의가-전부다)
  - [If I had to pick just one thing, it's test code](#하나만-선택해야-한다면-테스트-코드)
  - [Securing slack time](#여유시간-확보하기)
- [After building](#만들고-나서)
  - [Getting feedback fast](#피드백-빨리-받기)
  - [Distinguishing what to do from what not to do](#해야-할-것과-하지-않을-것-구분하기)
- [Appendix](#부록)
  - [So how should you get started?](#그래서-어떻게-시작해야-할까)
  - [Product systems](#프로덕트-시스템)
- [In closing](#끝으로)

## Before You Build

The very first stage — "before you build" — is the most important stage in the whole process. It's where you lay the groundwork for the decisions you'll face during development and later operation, and set the overall direction.

If someone asked me what to do first when building a design system, I'd say: "Set your goals, and make clear what you will and won't achieve."

### Goals

A design system exists to deliver two values for a product: consistency and efficiency.

But the specific goals should differ depending on the product that needs the system. You might raise how strictly the system is enforced, pursuing unbreakable consistency and high productivity — or you might treat the system as raw material and pursue high extensibility and freedom instead.

The philosophy and goals of the system you want to build become the foundation for every **decision** you'll stack on top of it going forward. Even if you're adopting an external design system, you still need to define what a design system fit for your team actually looks like.

#### If You're Pursuing Extensibility

A design system that pursues high extensibility and freedom delegates part of the responsibility for consistency to the consuming side, so you need to set your target beyond just the design system layer itself.

- Design system layer
- Product system layer

You should view the product's component layers as at least these two, and also consider how you'll support the consuming teams in building their own product systems.

Organizations that build a design system team are usually smaller than the product organizations they serve, so it's hard for the design system team alone to drive every layer — trying to do so can actually slow product development down. That's why the design system layer should treat supporting and guiding the community toward building their own product-system layer as one of its key missions.

### Quality Is What Matters

Why should designers and developers building products outside the system team actually use the design system?

Users don't use just any product. They don't use something simply because it was "well made." They need to feel value in the product, so that they come looking for it themselves.

A design system is a product too. What sets it apart from a typical product is that it has two groups of users: the end users of the product, and the team members who build that product.

For a design system to be one that team members seek out on their own, **the design system itself has to deliver overwhelming satisfaction**. It needs to offer a high enough level of UI/UX that people want to apply it to their product, and it must not get in the way when they extend it.

When team members actively use the design system, both the system and the product can mature quickly. This process of turning users into fans also pays off later, in the "winning over early adopters" section.

### Establishing Core Principles

Once the goals and philosophy are set, you need to build the core principles for system decision-making on top of them.

You should think through and document, as concretely as possible, what the design system will and won't do, and how the code interface will reflect the design constraints.

Philosophy, as an abstract construct, isn't enough on its own to solve the wide range of problems you'll face. You need to build principles on top of your goals and philosophy, refining them further as you solve real problems.

## While Building

### Guarding the Core Principles

When you focus on the trees, it's easy to lose sight of the forest. You'll make countless decisions while building the system, and none of them should contradict the direction the team has agreed on.

You need to consider things like whether you're aiming for a consistent level of abstraction — from interface naming all the way up to the component level — and whether you're sufficiently fulfilling basic responsibilities like accessibility.

Making decisions grounded in core principles takes practice. At first it requires conscious effort, and you may end up reversing some decisions. But once the team has practiced this kind of decision-making enough, you'll naturally reach decisions that don't break the principles without much effort. Sometimes breaking a principle is necessary too — that's fine, as long as the cost is worth the value.

### Code Is the Baseline

You shouldn't let good code or good design eat up too much of your time. A design system is a continuous stream of decisions. As with any product, stacking beautiful code on top of the wrong decisions is meaningless.

#### What You Should Already Know

You should deliberately use a variety of services and study the decisions behind various open-source design systems. Different services can give you hints for new component decisions, and looking through open-source design systems can teach you about component taxonomy, interface design, and writing good code.

#### Don't Get Held Back by Feasibility

Another reason code is the baseline is that you'll constantly face decision points about the value of an implementation, not just whether it's feasible. To make good decisions, you can't let judgments about feasibility tie your hands.

Decisions for a good system can't rest on any one person. Regardless of role, every team member needs a strong design sensibility and needs to relentlessly pursue UX quality.

#### Pursue Sustainability

The moment a system gets adopted, its lifespan outlasts that of the product. That's exactly why you have to think about sustainability.

If you're building a system, you need to hold both perspectives covered in [“The Rise of Worse is Better”](https://www.dreamsongs.com/RiseOfWorseIsBetter.html): *the right thing* and *worse is better*.

Implement things simply, within a consistent interface. A consistent interface makes behavior predictable, and a simple implementation lets other developers easily grasp the system's code. That builds the foundation for contribution. A system has to be maintainable, extensible, and open for anyone to contribute to.

Pursue simplicity, but judge the value of any complexity added for usability's sake and choose deliberately. As a rough rule of thumb, if code complexity increases by 100, the resulting usability improvement should be at least 80. To give examples from the perspective of a component's interface and UI/UX completeness:

- **Interface:** Simplicity of the interface matters more than simplicity of the implementation. Pursue interface consistency, except in cases where doing so would make it behave incorrectly.
- **Completeness:** If the value of completeness isn't large relative to the internal implementation complexity it costs, you should compromise. Treat simplicity as an important value in itself.

Code Complexity Debt and Usability Debt are in a trade-off relationship. You have to make the right value judgment for every problem that keeps coming up. In a design system, decision-making is everything. Implementation skill is more like the underlying fitness that supports what really matters.

### Definition Is Everything

Just as you set the design system's overall goals before you started building, while you're building it you need to define the goal of each component. The same process you used to separate what the design system is and isn't for needs to happen at the component level too.

![modal_popover_guide](./images/design-system-beyond-code/modal_popover_guide.png)

What happens when a component's definition is lacking? I put together an example of the kind of situation you might run into while developing Modal and Popover components.

#### If the Definition Is Lacking

It's easy to mistake a component's design guide for an agreed-upon definition.

**What the developer thinks the component is:**

- Modal
  - An overlay shown at the center of the screen, covering other elements
- Popover
  - An overlay containing a button and text
  - Allows elements other than a button to be placed inside
  - The content area is defined as `children`.

**What the designer thinks the component is:**

- Modal
  - An overlay shown at the center of the screen, covering other elements
- Popover
  - An overlay containing a brief description and a cancel button
  - Too much varied content looks cluttered. Since the design mockup only has text and a cancel button in it, they assume it can only be used that way.

Now imagine a request like the one below comes in under these circumstances.

> Please add an option so that when a button is clicked, the Modal can be positioned relative to that button. Right now it always opens dead center on the screen, so customizing its position takes a lot of work.

Because the designer thought `Popover` could only handle text, they asked the developer to add an option to `Modal` instead. Since Modal has no information for judging "relative to the button that was clicked," supporting this spec requires adding a prop like the one below.

```jsx
<Modal
  trigger={<Button>Button</Button>}
/>
```

If only `trigger` is added, the intent behind the modal's position stays ambiguous, so a `mode` prop is added to make explicit whether it should be centered or positioned relative to the trigger.

```jsx
<Modal
  trigger={<Button>Button</Button>}
  mode="trigger"
/>
```

Looking at the result, it's identical to `Popover`'s default behavior. Worse, since the feature was bolted onto the `Modal` component, the implementation ends up more complex. Implementing the same functionality in two different components wastes resources and confuses users at the same time.

If a user's first mental model of the feature is "it covers the screen when it opens, and I can control its position," they'll think of Modal. If it's "the content should be shown relative to a trigger," they'll think of Popover.

The reason the request came in at all, and the reason solving it got complicated, both come down to the same thing: **the component's responsibility wasn't clearly defined.**

#### If the Definition Is Sufficient

Beyond design guides for things like spacing and color, think first about the responsibilities and use cases of components that look similar.

- `Modal`
  - Deliberately breaks context to present something
  - The page can't be interacted with until the modal is closed
- `Popover & Tooltip`
  - For cases where you need to keep the context connected to the entry trigger
  - Provides supplementary information for the trigger, with actions related to that content allowed
  - Tooltip: for delivering short, concise information (text recommended) / Popover: used when additional information or an action is needed (no page navigation inside the component)

> Please add an option so that when a button is clicked, the Modal can be positioned relative to that button. Right now it always opens dead center on the screen, so customizing its position takes a lot of work.

With a sufficient definition, when a request like the one above comes in, you can point straight to the `Popover` component and head off any decision that would saddle a component with unnecessary implementation complexity.

### If I Had to Pick Just One Thing, It's Test Code

A design system has to correctly provide its core functionality and remain sustainable. Both of those need to be guaranteed by the minimal safety net that is test code.

The biggest value of test code is that it mechanically guarantees, into the future, what's obviously true right now. A test that breaks when it should break protects a product beautifully. It's obviously necessary from the perspective of the developer who keeps maintaining the design system, and it's also an essential piece of the direction the design system ultimately needs to grow in. In this piece I want to talk about that direction — the direction a design system should grow in.

Despite its importance, test code often gets deprioritized. While you're developing, checking things visually in the UI feels faster than writing a test. When you can verify something with your own eyes right away, writing test code can feel unproductive. But I want to say: even if it means giving up something that feels more important — like the beauty of an implementation, as opposed to its interface — hold on to your test code.

![the orbit model](./images/design-system-beyond-code/orbit_model_color.png)
<small style="opacity: 0.5;">https://github.com/orbit-love/orbit-model/blob/main/orbit_model_color.png</small>

Users keep growing, while the people maintaining the library stay few relative to that user count. A library that fails to build an ecosystem has a ceiling on how far it can grow, so the team building the library needs to build an ecosystem where users contribute and grow together with it. Take the lead on improving core functionality, but also draw users into participating.

That was a long preamble, but the core point I wanted to make is this: without test code, you can't expect direct code contributions.

In the short term, test code might look like just one more task added to the pile, but it's a cost-effective device that raises the system's stability and lowers the barrier to entry for contributions. This piece isn't going to dig into code in detail, so I won't spell out exactly how to write test code — but I'll introduce a few things that helped me.

#### Approach Behavior and Style Separately

The core of a design system is behavior and style. For behavior I use [react-testing-library](https://testing-library.com/) (hereafter rtl), and for style I use [playwright's image testing](https://playwright.dev/docs/test-snapshots). ([chromatic](https://www.chromatic.com/) is also a good style-testing tool, but I didn't use it due to environment-setup issues.)

Styling is a visual element. Approaching it with rtl makes the outcome hard to predict and the test code verbose. I split them apart on the idea that a visual element needs a visual approach, and I still think that approach holds up. That said, I'm still not sure whether playwright's image testing is the best method for it.

#### References

Testing a design system is easier than testing a typical product. There's less to consider in terms of user state or external dependencies (APIs) compared to a service. If you follow web accessibility well, you can generalize situations with rtl and test them.

Whenever I was unsure what to test and how, I picked up insight from various open-source projects like [primer](https://primer.style/), [ark ui](https://ark-ui.com/), [mui](https://mui.com/), and [react-spectrum](https://react-spectrum.adobe.com/react-spectrum/index.html).

#### Keeping Sight of What Test Code Is For

Test code is, at the end of the day, a means of helping the product. Just as you weigh code complexity against UX quality, test code is only meaningful when its value is appropriate relative to the cost of writing it.

Test code also has multiple levels — unit, integration, E2E, and so on — and you need to judge how far up that ladder is worth the time cost, and apply it accordingly.

Tests don't protect you from every bug. On that topic, I'd recommend reading Jbee's post [Misconceptions and Facts About Testing](https://www.jbee.io/articles/developments/%ED%85%8C%EC%8A%A4%ED%8A%B8%EC%97%90%20%EB%8C%80%ED%95%9C%20%EC%98%A4%ED%95%B4%EC%99%80%20%EC%82%AC%EC%8B%A4).

### Securing Slack Time

Slack time means stepping outside the team's normal cycle for about a day, to implement high-priority backlog items or reinforce automated tests — time spent paying down technical debt.

Paradoxically, the busier the team is, the more you need to protect this time. When you're under pressure to move fast, spending a whole day can feel like a burden, but technical debt and backlog pile up just as fast as you're running, and eventually become unmanageable. As the number of components and problems the team manages grows, using slack time lets you solve more problems, faster, in the long run.

## After Building

Just as every product goes through a continuous process of improvement, a design system keeps being improved endlessly too. I titled this section "After Building," but what I really mean is "after building it **to some extent**."

I've written about what that "to some extent" level looks like, and what problems I ran into — and am still working through — once I reached this stage.

### Getting Feedback Fast

If you're building a design system from scratch or redeveloping one, you need to set a bar for when you can tell other teams it's ready.

That bar will differ by team, but **it shouldn't come too late.** No matter how much test code you write and how carefully you test within the team, you're bound to run into problems big and small once it's actually applied. The later the feedback comes, the later you discover important problems, and the more expensive they get to fix.

It's fine to apply it directly to a simple page or service. Nothing verifies a system as reliably as dog fooding. If contributing directly to a service is hard, prepare the system's core components — Button, Checkbox, Dropdown — and from the moment you've built other components on top of those core pieces, start encouraging real-service adoption and collecting feedback.

#### 1. Recruiting Volunteers

A system you've just built is weak. Even armed with good UI/UX and a good interface, it's hard to beat the presence of legacy that's been used for a long time.

From a product team's perspective, a new system is a burden. It's only natural that they'd be reluctant to adopt it, and you need to be able to empathize with that.

![rogers-diffusion-of-innovation-curve](./images/design-system-beyond-code/rogers-diffusion-of-innovation-curve.png)
<small style="opacity: 0.5;">Rogers' Diffusion of Innovation Curve (after Rogers 1995)</small>

Whatever the product, when it reaches the market, customers fall into a distribution like the one above. (For convenience, in this piece I'll refer to both innovators and early adopters collectively as "early adopters.")

Early-adopter customers have the power to willingly spread the product to other customers (the majority). You should bring like-minded early adopters into the product development process and actively reflect their opinions in the product. That lets you get ahead quickly, both in product improvement and in sales.<br />
<small style="opacity: 0.5;"><a href="https://fromundefined.com/posts/2024-02-uxs-working-culture/" target="_blank">Reference: fromundefined/2024-02-uxs-working-culture/</a></small>

**The key to spreading a new design system is how quickly and how many early adopters you can win over.**

Don't stop at a message-board announcement or a general call to action — go recommend it and recruit people directly.

To give an example from my own experience: whenever a question came in about a legacy system component, I'd also explain the improvements in the new system's version and encourage them to use it. A couple of people, thankfully, showed interest, and I set up an in-person meeting to pitch the new system's strengths, which got adoption started in a small corner.

#### 2. Turning Early Adopters Into Fans

The point of recruiting early adopters isn't just fast feedback for the system — it's turning them into fans devoted enough to spread the word themselves and bring in more customers.

**A new system is weak and unfamiliar.** You'll get a lot of questions early on, and you need to genuinely help solve problems from the user's own perspective, in a way that moves them. Both response speed and quality have to be overwhelming.

In practice, I treated the first users' questions as unconditional interrupts to whatever else I was doing, and if the issue was in the service environment, I'd run it myself, analyze it, and pass along a detailed account of exactly what was wrong. (One bug turned out to be related to the emotion library, and I wrote up the entire surrounding context before sending it over.)

Once the first user applied the new system to their product and shared it as a success story with the team, I started hearing positive comments — "this looks worth trying" — even from developers who had been wary of the new system.

#### 3. The Beginning Is the Most Important, and the Hardest

Once you have your first user and the user count starts to climb one by one, at some point you run into an "operational-support rush."

You now have to handle new component development, operational support, and bug fixes all at once. The team hasn't grown, but the workload has, so you have to cut back on something. Thinking you can just spend more time and do everything at the same intensity is greedy.

What should get cut back here? Obviously, new component development. **The early rush of inquiries is an opportunity.** It's the period where an immature system can grow at a steep slope, and the window during which you absolutely must earn the trust of the developers who became your early adopters.

This period isn't long. If you focus and get a system in place, the rush can be wrapped up in around one to two weeks. Don't lose your composure under the flood of questions — keep making decisions under the principles you set at the start, and where possible, leave records so that problem-solving doesn't become the personal skill of one particular team member.

You usually start with the button. Probably because it's used the most and becomes the raw material for many other components. Button is a fine place to start, but that doesn't mean it's an easy component. Maybe because it looks simple relative to its difficulty, its complexity tends to get underestimated.

If you're building a brand-new design system, you can complete the component set, apply it to a service, and approach it from a "continuous improvement" standpoint. But if you're migrating to a new system, the button is quite literally a "component with a dense tangle of sweet-potato vines" — used in a huge number of other components.

A component that serves as raw material for others is hard. It looks easy, but it never is. That's why the beginning is the most important part, and the hardest.

### Distinguishing What to Do From What Not to Do

As the new system spreads and the user count starts to grow, requests naturally increase. Beyond bugs that absolutely must be fixed, demand also grows for convenience improvements and richer documentation. This is the stage where the system moves past being used only by early adopters and starts settling in.

In the "Turning Early Adopters Into Fans" section, I said both the speed and quality of responding to inquiries had to be overwhelming — but once you reach this stage, you need to change strategy. Not only can you not respond to every incoming request, but responding to each small-looking request one by one can push back the work that actually matters. Judging priority matters in every situation, but it matters even more at the stage where a design system is just starting to settle in.

One approach is to boldly pass on nice-to-have work, and to settle for a blunt but low-cost solution wherever one is available.

I brought a few real examples. I want to talk about priority and criteria through the story of how I handled each request.

- (Feature request) "It'd be great if the Combobox component supported highlighting the search term."
- (Feature request) "It'd be great if keyboard item-navigation also worked from the search input inside the Dropdown content."
- (Feature request) "It'd be great if the design handoff were more automated."
- (Documentation) "It'd be great to have detailed prop descriptions and rich examples, like an open-source library."

<br/>

**1. (Feature request) "It'd be great if the Combobox component supported highlighting the search term"**

<span style="border-color: rgb(55, 53, 47);border-bottom: 0.05em solid;">Won't do it.</span>

This falls outside the basic functionality already defined for the Combobox component. We could consider offering it as core functionality, but at this stage of building out components, reopening the discussion on the core-functionality definition of a component we've already finished doesn't fit where we are.

The functionality a system provides has to be sufficiently general, and the decision needs to account for both UX and DX. If a feature isn't important enough to justify breaking the flow of work the team is currently focused on, we don't provide it. This is exactly why building with extensibility in mind matters. You can't provide every feature. If an add-on feature is needed, the consuming side should be able to build it themselves.

**2. (Feature request) "It'd be great if keyboard item-navigation also worked from the search input inside the Dropdown content"**

<span style="border-color: rgb(55, 53, 47);border-bottom: 0.05em solid;">Will do it.</span>

This falls within general functionality, and keyboard accessibility for item navigation is core functionality for the Dropdown component, so we should support it.

Next we need to decide **when** to do the work. Since we've decided to do it, it could be handled whenever a developer has some slack, but the more people involved, the more inefficiency creeps in. (Context switching is a cost too.)

For a problem like this — medium priority, but still needing to be solved — I'd recommend handling it using the slack time mentioned back in the "While Building" section.

**3. (Feature request) "It'd be great if the design handoff were more automated"**

<span style="border-color: rgb(55, 53, 47);border-bottom: 0.05em solid;">Won't do it.</span>

Touching an add-on feature before you've finished the "basics" is greedy. For a platform team that's supposed to be contributing to the product organization's productivity, deciding not to do something is hard. But you have to define what you won't do, in order to properly finish what you actually need to do, on time.

Sometimes you have to choose a crude, low-cost solution instead of great engineering and an elegant, expensive one. At this stage, a request like this automation ask was exactly the kind of problem that needed a crude solution.

**4. (Documentation) "It'd be great to have detailed prop descriptions and rich examples, like an open-source library"**

<span style="border-color: rgb(55, 53, 47);border-bottom: 0.05em solid;">Won't do it.</span>

Documentation is an important element that forms an ecosystem. It should be aesthetically pleasing, and worth investing in so people can find the information they want quickly.

But the essence — the system's completeness — comes first. You need to judge how much the team can currently focus on, and if you can't take on another context beyond protecting that essence, solve it bluntly. Right now, additional investment in documentation is hard, so we're only providing it through [Storybook](https://storybook.js.org/) using [control](https://storybook.js.org/docs/api/doc-block-controls).

The decision not to do something is harder than the decision to do it. Most problems are solvable if you throw enough time at them, and as an engineer that can be tempting. But you need to clearly recognize the difference between "we can do it" and "we can do it at low cost." At the team level too, the judgment needs to come from the angle of "can our team actually take on more context than we're handling right now."

## Appendix

### So How Should You Get Started?

I've talked about how setting goals and defining components matter. So what input do you need in order to produce that kind of output?

A good place to start is looking at existing design systems — what criteria they used to split up components, how they handle extensibility — and using that to build the groundwork for your own decisions. Below is a list of libraries I reference; some are headless libraries, some I reference for styling, and some just for how a couple of specific components are implemented.

- [radix-ui](https://www.radix-ui.com/)
- [ark-ui](https://ark-ui.com/)
- [react-spectrum](https://react-spectrum.adobe.com/)
- [ariakit](https://ariakit.org/)
- [primer/react](https://primer.style/react/)
- [mantine](https://mantine.dev/)
- [chakra-ui](https://chakra-ui.com/)
- [next-ui](https://nextui.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [intergalactic](https://developer.semrush.com/intergalactic/)

### Product Systems

Even if you set your design system's goals toward lowering extensibility and raising uniformity, if the product spans multiple domains, the design system alone can't cover everything.

Specific domains will have their own recurring patterns. Opinions will differ on how to systematize those recurring domain-context patterns. Some will argue that, since a domain is also part of the product, it should be folded into the design system. Others will argue that a design system needs to stay unbound from any domain, in order to remain common-level raw material.

There's probably no single right answer, but my answer is **"the product system."**

#### Product Systems and the Component Hierarchy

The components that make up a product can be broadly split into four kinds.

- Components composed of combinations of domain components: **Usability** >>> Extensibility
  - The layer that provides value by combining domain components
- Domain components: **Usability** > Extensibility
  - The layer that carries domain context. Even while carrying domain context, it can still be used across multiple services.
- Product system components: Usability < **Extensibility**
  - Provides the design system with its abstraction lowered by one step, to fit the product
- Design system components: Usability <<< **Extensibility**
  - The layer with high extensibility, built to be easy to customize

The further you move toward the domain-component-combination layer, the lower the extensibility gets, and usability goes up as a simple API delivers consistent UI/UX. If you look at a commerce-context component like the one used as an example earlier at the design-system level, a single system ends up carrying more than one message.

Team members, as the system's users, won't try to untangle a complicated message. They may perceive both the highly abstract components meant for handling common elements and the ones that aren't as belonging to a single system, and come away thinking the design system can handle everything.

That kind of understanding can create two major problems.

1. The design system always has to subscribe to domain changes
2. As the number of domains it handles grows, it becomes a blocker for product teams

If the team handling the design system (hereafter the "design platform" team) is large enough to keep up with every change needed at the product-system and domain-system levels, this isn't a problem. But if it's only sized to handle the common-level design system, it can't keep pace with the product teams' fast rhythm. In the early stage, while there's still not enough shared learning about the system, the design platform team might lay out the product system's design — but ultimately this is territory where the product organization needs to take the lead in building. The farther apart a product and the components that reflect it grow, the lower the cohesion and the higher the coupling.

## In Closing

Across three design systems, I've made some decisions I'm proud of and some I'm not. Every time I look back, I come away thinking that what matters most in a design system is the accumulation of decisions.

This piece has focused on the process of building a design system, but I also think choosing an open-source design system that's already been through countless rounds of trial and error is a perfectly good answer. I'll also add [Inflearn's case study](https://tech.inflab.com/20240224-design-system/) of building their system on top of an open-source design system.

I hope this piece helps anyone out there building a design system.
