// File made for developing purpose

const { Component, useState, useEffect } = React;
const { register, edict, poke } = bazar;

const C1 = () => {
  return (
    <div onClick={() => poke('APP')}>
      hi1 (:
    </div>
  );
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      data: [1, 2, 3]
    };
    register({
      id: 'APP',
      sync: () => this.state,
      onPoke: () => console.log('lol'),
    });
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
