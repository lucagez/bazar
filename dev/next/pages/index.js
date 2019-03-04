import React, { Component } from 'react'

// importing bazar
import { initStore, initState, register, dispatch } from '../../../dist/bazar';

class C3 extends Component {
  constructor() {
    super();
    this.state = {
      count: 0,
    };

    this.config = {
      id: 'C3',
      sync: () => this.state
    };
    register(this.config, this.state);
  }

  render() {
    const { count } = this.state;
    return (
      <div>
        <h1>Component 3</h1>
        <span>{count}</span>
        <button onClick={() => this.setState({ count: count + 1 })}>increment</button>
      </div>
    );
  }
}

class C1 extends Component {
  constructor() {
    super();
    this.state = {
      count: initState('C1') || 0,
      secret: 'secret'
    };
    
    this.config = {
      id: 'C1',
      interests: ['C2'],
      sync: () => this.state,
      handler: (states) => console.log('C1', states),
    };
    
    register(this.config);
  }

  render() {
    const { count } = this.state;
    return (
      <div>
        <h1>Component 1</h1>
        <span>{count}</span>
        <button onClick={() => this.setState({ count: count + 1 }, () => dispatch(this.config))}>increment</button>
      </div>
    );
  }
}

class C2 extends Component {
  constructor() {
    super();
    this.state = {
      count: 0,
      secret: 'secret'
    };

    this.config = {
      id: 'C2',
      interests: ['C1', 'C3'],
      sync: () => this.state,
      handler: (states) => {
        const { C1, C3 } = states;
        console.log('from C2', C1, C3);
        this.setState({
          count: C1.count + C3.count
        });
      },
    };

    register(this.config);
  }

  render() {
    const { count } = this.state;

    return (
      <div ref="mapContext">
        <h1>Component 2</h1>
        <span>{count}</span>
        <button onClick={() => this.setState({ count: count + 1 })}>increment</button>
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      data: [1, 2, 3]
    };

    initStore({
      C1: 3,
      C2: 4
    });
  }

  render() {
    return (
      <div className="App">
        <h1>Parent (:</h1>
        <C1 />
        <C2 />
        <C3 />
      </div>
    );
  }
}

export default App;
