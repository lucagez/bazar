exports.initStore=function(){("undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})._store_={}},exports.register=function(e,t){var o=e.id,n=e.notifs;void 0===n&&(n=[]);var r=e.interests;void 0===r&&(r=[]);var i=e.ignores;void 0===i&&(i=[]);var s=e.handler;void 0===s&&(s=void 0);var a=e.sync;if(void 0===a&&(a=void 0),!o)throw new Error("Expected registrar to have non-null id value");if(_store_.hasOwnProperty(o))throw new Error("Expected unique id");var d=Object.assign({},t);i.length>0&&i.forEach(function(e){delete d[e]}),_store_[o]={notifs:n,interests:r,handler:s,sync:a,state:d}},exports.dispatch=function(e,t){var o=e.id,n=e.notifs;void 0===n&&(n=[]);var r=e.ignores;void 0===r&&(r=[]);var i="object"==typeof t?Object.assign({},t):t;r.length>0&&r.forEach(function(e){delete i[e]}),_store_[o]=Object.assign({},_store_[o],{state:i}),n.forEach(function(e){var t=_store_[e];if(!t)throw new Error("Trying to notify a non-existent component");var o={};t.interests.forEach(function(e){return o[e]=_store_[e].sync()}),t.handler(o)})};
//# sourceMappingURL=bazar.js.map