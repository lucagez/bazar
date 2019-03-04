"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _bazar = require("../../../../dist/bazar");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

(0, _bazar.initStore)();

class C1 extends _react.Component {
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
      handler: states => console.log('C1', states),
      ignores: ['secret']
    };
    (0, _bazar.register)(this.config, this.state);
  }

  render() {
    const count = this.state.count;
    return _react.default.createElement("div", null, _react.default.createElement("h1", null, "Component 1"), _react.default.createElement("span", null, count), _react.default.createElement("button", {
      onClick: () => this.setState({
        count: count + 1
      })
    }, "increment"));
  }

}

class App extends _react.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    console.log('ciao');
  }

  render() {
    return _react.default.createElement("div", null, "Hi (:", _react.default.createElement(C1, null));
  }

}

exports.default = App;