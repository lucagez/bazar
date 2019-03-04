import React, { Component } from 'react';

import { initStore, register, dispatch } from '../../../../dist/bazar';

initStore();

class C1 extends Component {
  constructor() {
    super();
    this.state = {
      count: 0,
      secret: 'secret'
    };

    this.config = {
      id: 'C1',
      interests: ['C2'],
      notifs: ['C2'],
      handler: (states) => console.log('C1', states),
      ignores: ['secret']
    };
    register(this.config, this.state);
  }

  render() {
    const { count } = this.state;
    return (
      <div>
        <h1>Component 1</h1>
        <span>{count}</span>
        <button onClick={() => this.setState({ count: count + 1 })}>increment</button>
      </div>
    );
  }
}

export default class App extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    console.log('ciao');
  }

  render() {
    return (
      <div>
        Hi (:
        <C1 />
      </div>
    );
  }
}