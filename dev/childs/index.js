// File made for developing purpose

const { Component, useState, useEffect } = React;
const { initStore, register, dispatch } = bazar;

initStore();

const Child = (props) => (
  <div>

  </div>
);

const C1 = () => {
  const [count, setCount] = useState(0);
  const [isRegistered, setIsRegistered] = useState(false);
  const config = {
    id: 'C1',
    interests: ['C2'],
    notifs: ['C2'],
    handler: (states) => console.log('C1', states)
  };

  if (!isRegistered) {
    register(config, count);
    setIsRegistered(true);
  };

  useEffect(() => { if (count > 0) dispatch(config, count) });

  return (
    <div>
      <h3>Component 1</h3>
      <span>{count}</span>
      <button onClick={() => setCount(count + 1)}>increment</button>
    </div>
  );
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
        {/* <C2 /> */}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
