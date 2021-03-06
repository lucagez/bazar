<p align="center">
  <img src="logo.svg" alt="bazar" />
  <br>
  <a href="https://travis-ci.org/lucagez/bazar"><img src="https://travis-ci.com/lucagez/bazar.svg?branch=master" alt="travis"></a>
  <a href="https://www.npmjs.org/package/bazar"><img src="https://img.shields.io/npm/v/bazar.svg?style=flat" alt="npm"></a>
  <img src="https://img.shields.io/badge/license-MIT-f1c40f.svg" alt="MIT">
  <img src="https://img.shields.io/badge/PRs-welcome-6574cd.svg" alt="PR's welcome">
  <a href="https://unpkg.com/bazar"><img src="https://img.badgesize.io/https://unpkg.com/bazar/dist/bazar.js?compression=gzip" alt="gzip size"></a>
  <!-- <a href="https://www.npmjs.com/package/tattica"><img src="https://img.shields.io/npm/dt/tattica.svg" alt="downloads" ></a> -->
</p>

# Bazar
> `One-to-One` and `One-to-Many` communications between Components.

Bazar is a **500b** (framework agnostic) container of connections between js Components.
It is designed with React in mind, so are the examples. However you can use Bazar with/without any JS framework of choice. 
It has been tested with success in connecting React and Vue components inside the same app.

## Table of Contents

  - [Installation](#installation)
  - [Demo](#demo)
  - [TL;DR](#tldr)
      - [One-to-Many:](#one-to-many)
      - [One-to-One:](#one-to-one)
  - [Usage](#usage)
      - [Register a component](#register-a-component)
      - [Register a component: can `edict`](#register-a-component-can-edict)
      - [Register a component: can `poke`](#register-a-component-can-poke)
      - [Register a component: can `getState`](#register-a-component-can-getstate)
      - [Register a component: `willRerender`](#register-a-component-willrerender)
      - [One-to-Many communication](#one-to-many-communication)
      - [One-to-One communication](#one-to-one-communication)
      - [Get (registered) component's state](#get-registered-components-state)
      - [Clearing store](#clearing-store)
  - [API](#api)
      - [register](#register)
      - [edict](#edict)
      - [getState](#getstate)
      - [poke](#poke)
      - [clearStore](#clearStore)
  - [Contributing](#contributing)
  - [License](#license)


## Installation

With NPM:
```bash
  npm install bazar
```

Without:
```html
  <script src="https://unpkg.com/bazar@0.5.2/dist/bazar.js"></script>
```

## Demo

- Codepen demo showcasing `onPoke`:
https://codepen.io/lucagez/full/GeRZeg

- Lots of snippets below.


## TL;DR

#### One-to-Many:
1. Some components **(a)**, **(b)** express an `interest` in a registered component **(c)**.
2. **(c)** updates its state and issue an `edict`.
3. **(a)** and **(b)** immediately receive the updated **(c)**'s state. 

#### One-to-One:
1. A component **(a)** stores some info useful for the unreachable component **(b)**.
2. **(a)** can `poke` **(b)** passing the useful info.

## Usage

Bazar provides `One-to-One` and `One-to-Many` communications between Components through a global store which contains all the required connections to do so.
In order to accomplish that you have to:
  1. Register some components.
  2. Dispatch events (either via `edict` or `poke`).

#### Register a component

The id prop is the only strictly requirement to register a new component.
However a component registered like that is useless as it cannot `edict` neither being `poked`.

```jsx
import React, { Component } from 'react';
import { register } from 'bazar';

class C1 extends Component {
  constructor() {
    super();
    this.state = {};

    register({
      id: 'C1' // unique id
    });
  }

  render = () => <p>C1</p>
} 
```

#### Register a component: can `edict`

A component with the ability to issue an `edict` must have a method to `sync` its state.
You can choose which part of the state you prefer to keep in `sync`.

```jsx
import React, { Component } from 'react';
import { register, edict } from 'bazar';

class C1 extends Component {
  constructor() {
    super();
    this.state = {
      updated: false,
    };

    register({
      id: 'C1', // unique id
      sync: () => this.state, // function
    });
  }

  // Calling `edict` in `setState` callback will invoke `onEdict` of interested
  // components with the updated state of C1.
  onUpdate = () => this.setState({
    update: true,
  }, () => edict('C1'));

  render = () => <button onClick={this.onUpdate}>update</button>
} 
```

#### Register a component: can `poke`

A component with the ability to `poke` could also be stateless. 
As the `poke` function is anonymously invoked.

```jsx
import React, { Component } from 'react';
import { poke } from 'bazar';

const C1 = () => (
  <button 
    onClick={() => poke('registeredComponent', { passed: 'argument' })}>
    update
  </button>
);
```

#### Register a component: can `getState`

A component with the ability to provide its current state must have
a valid `sync` method.

```jsx
import React, { Component } from 'react';
import { register } from 'bazar';

class C1 extends Component {
  constructor() {
    super();
    this.state = { state: 'to keep in sync' }

    register({
      id: 'C1',
      sync: () => this.state,
    });
  }
  render = () => <div>C1</div>
};
```

#### Register a component: `willRerender`

To make the presence of multiple components with the same id obvious, Bazar will throw an error when will find some duplicates.
When a component rerender will automatically re-register itself in the global store.
Pass `willRerender: true` when registering to notify Bazar that the current component will re-register itself.

```jsx
import React, { Component } from 'react';
import { register } from 'bazar';

class C1 extends Component {
  constructor() {
    super();
    register({
      id: 'C1',
      willRerender: true,
    });
  }
  render = () => <div>C1</div>
};
```

#### One-to-Many communication

In the following example:
1. Registration of 3 components: **(a)**, **(b)**, **(c)**. 
2. **(a)**, **(b)** express an `interest` in a registered component **(c)**.
3. **(c)** updates its state and issue an `edict`.
4. **(a)** and **(b)** immediately receive the updated **(c)**'s state, via `onEdict`. 

**note:** Usually this kind of communication is useful between STATEFUL components.
As the `onEdict` function comes handy for updating a component's state.

```jsx
import React, { Component } from 'react';
import { register, edict } from 'bazar';

class A extends Component {
  constructor() {
    super();
    register({
      id: 'A',
      interests: ['C'],
      // When C issues an `edict`, this `onEdict` function is invoked.
      // You can update A's state accordingly.
      onEdict: (id, state) => this.setState({ received: true }),
    });
  }
  render = () => <div>A</div>
};

class B extends Component {
  constructor() {
    super();
    this.state = { received: false };
    register({
      id: 'B',
      interests: ['C'],
      onEdict: (id, state) => console.log(`I just received a ${state} update from ${id}`),
    });
  }
  render = () => <div>B</div>
};


class C extends Component {
  constructor() {
    super();
    this.state = { interesting: false };
    register({
      id: 'C',
      sync: () => this.state,
    });
  }

  // Issuing an `edict` on setState callBack => so we have access to the just updated state.
  clicked = () => this.setState({ interesting: true }, edict('C'));

  render = () => <div onClick={this.clicked}>C</div>
};
```

#### One-to-One communication

In the following example:
1. Registration of 2 (unrelated) components: **(a)**, **(b)**. 
2. A component **(a)** stores some info useful for the unreachable component **(b)**.
3. **(a)** can `poke` **(b)** passing the useful info.

**note:** This kind of communication is useful between a STATELESS component and a STATEFUL one.
The `poke` function is completely anonimous, so it can be invoked from an unregistered component.

```jsx
import React, { Component } from 'react';
import { register, poke } from 'bazar';

const A = (props) => <button onCLick={() => poke('B', props)}>A</button>

class B extends Component {
  constructor() {
    super();
    this.state = { empty: {} };
    register({
      id: 'B',
      onPoke: (arg) => this.setState({ empty: arg }),
    });
  }
  render = () => <div>B</div>
};
```

#### Get (registered) component's state

Invoking `getState` you can get the current state of the component belonging to the provided id.
If the component is not registered `undefined` will be returned.

```jsx
import React, { Component } from 'react';
import { register, getState } from 'bazar';

const A = (props) => <button onCLick={() => getState('B')}>A</button>

class B extends Component {
  constructor() {
    super();
    this.state = { empty: {} };
    register({
      id: 'B',
      sync: () => this.state,
    });
  }
  render = () => <div>B</div>
};
```

#### Clearing store

You can clear bazar store at any time.
Useful if connecting many components that will be repeated many times.

**e.g.** You are connecting widgets of a dashboard. Every widget has an id relative to the dashboard. You render one dashboard at a time but using the same widgets.
Clearing the store between dashboard renders prevents ID clashes and let's you reuse the same IDs within the dashboard.

```jsx
import React, { Component } from 'react';
import { clearStore } from 'bazar';

// Call it without arguments.
clearStore();

```

## API

#### register

Most important part of Bazar as it stores all the required informations to connect all the registered components.

| param     | type     | required | default   | explaination                                                   |
|-----------|----------|----------|-----------|----------------------------------------------------------------|
| id        | string   | yes      |           | unique identifier for the registered Component                 |
| sync      | function | no       | undefined | sync state on request                                          |
| interests | array    | no       | []        | express interests on Components                                |
| onEdict   | function | no       | undefined | invoked when a Component in `interests` issue an `edict`       |
| onPoke    | function | no       | undefined | invoked when `poke` is called providing `id` as first argument |

- `onEdict`: invoked passing (id, state) as arguments.
- `onPoke`: invoked passing (arg) an optional argument.

#### edict

Issuing an `edict` from a stateful Component.

| param | type   | required | default | explaination                                           |
|-------|--------|----------|---------|--------------------------------------------------------|
| id    | string | yes      |         | Identifier of the component that is issuing an `edict` |

#### getState

Safely get the current state from a registered component

| param | type   | required | default | explaination                                                   |
|-------|--------|----------|---------|----------------------------------------------------------------|
| id    | string | yes      |         | Returns undefined if no Component or no `sync` method is found |

#### poke

Poking Component passing optional argument.

| param | type         | required | default   | explaination                                             |
|-------|--------------|----------|-----------|----------------------------------------------------------|
| id    | string       | yes      |           | Throw Error if the `id` component has no `onPoke` method |
| arg   | user-defined | no       | undefined | Optional argument to pass to `onPoke`                    |

#### clearStore

`clearStore` will empty the bazar store. It's called without specifying arguments.

## Contributing

Every PR is welcomed 🎉 
If you have ideas on how to improve upon this library don't hesitate to email me at `lucagesmundo@yahoo.it`.


## License

MIT.
