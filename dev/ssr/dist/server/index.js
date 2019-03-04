"use strict";

var _express = _interopRequireDefault(require("express"));

var _react = _interopRequireDefault(require("react"));

var _server = require("react-dom/server");

var _App = _interopRequireDefault(require("../client/App"));

var _template = _interopRequireDefault(require("../client/template"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express.default)();
const port = 3000;
app.get('/', (req, res) => {
  const appString = (0, _server.renderToString)(_react.default.createElement(_App.default, null));
  console.log(_store_);
  res.send((0, _template.default)({
    body: appString,
    title: 'SSR test'
  }));
});
app.listen(port);
console.log(`Listening on port ${port}`);