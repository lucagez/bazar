// File made for developing purpose

const { Component } = React;
const { initStore, register, dispatch } = bazar;

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
        <button onClick={() => this.setState({ count: count + 1 }, () => dispatch(this.config, this.state))}>increment</button>
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
      interests: ['C1'],
      notifs: ['C1'],
      handler: (states) => {
        const { C1 } = states;
        this.setState({
          count: this.state.count + 1
        });
      },
    };

    register(this.config, this.state);
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
  }
  render() {
    return (
      <div className="App">
        <h1>Parent (:</h1>
        <C1 />
        <C2 />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
