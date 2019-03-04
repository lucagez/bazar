"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = (_ref) => {
  let body = _ref.body,
      title = _ref.title;
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
      </head>
      
      <body>
        <div id="root">${body}</div>
      </body>
    </html>
  `;
};

exports.default = _default;