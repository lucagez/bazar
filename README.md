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
 
Bazar is a global container of connections between components.
It is designed with React in mind, so are the examples. However you can use Bazar with/without any JS framework of choice. 

## Installation

With NPM:
```bash
  npm install bazar
```

Without:
```html
  <script src="https://unpkg.com/bazar@0.2.0/dist/bazar.js"></script>
```

## Demo

> link

## TLDR;

One-to-Many:
1. Some components (a), (b) express an `interest` in a registered component (c).
2. (c) updates its state and issue an `edict`.
3. (a) and (b) immediately receive the updated (c)'s state. 

One-to-One:
1. A component (a) stores some info useful for the unreachable component (b).
2. (a) can `poke` (b) passing the useful info.

## Usage

Bazar provides `One-to-One` and `One-to-Many` communications between Components through a global store which contains all the required connections to do so.
In order to accomplish that you have to:
  1. Initialize a store.
  2. Register some components.
  3. Dispatch events (either via `edict` or `poke`).

## Preparation

#### Initialize an empty store

```jsx
import { initStore } from 'bazar';

initStore();
```

#### Initialize a non-empty store

```jsx
import { initStore } from 'bazar';

initStore({
  ID1: {},
  ID2: {},
  // ...
});
```

#### Register a component

The id prop is the only strictly require to register a new component.
However a component registered like that is useless as it cannot `edict` neither being `poked`.

```jsx
import React, { Component } from 'react';
import { initStore, register } from 'bazar';

initStore();

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
import { initStore, register, edict } from 'bazar';

initStore();

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
import { initStore, poke } from 'bazar';

initStore();

const C1 = () => (
  <button 
    onClick={() => poke('registeredComponent', { passed: 'argument' })}>
    update
  </button>
);
```

⬇⬇⬇ from here ⬇⬇⬇
## One-to-Many communication



