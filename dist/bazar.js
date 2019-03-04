exports.initStore=function(n){void 0===n&&(n={}),("undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})._BAZAR_STORE_={},_BAZAR_STORE_.initial={};var t=Object.keys(n);t.length>0&&t.forEach(function(t){_BAZAR_STORE_.initial[t]=n[t]})},exports.initState=function(n){return(_BAZAR_STORE_.initial||{})[n]},exports.register=function(n){var t=n.id,e=n.sync,i=n.handler,r=n.notifs;void 0===r&&(r=[]);var o=n.interests;if(void 0===o&&(o=[]),!t)throw new Error("Expected registrant to have non-null id value");if(!e)throw new Error("Expected registrant to have a sync function");if(_BAZAR_STORE_.hasOwnProperty(t))throw new Error("Expected unique id");_BAZAR_STORE_[t]={notifs:r,interests:o,handler:i,sync:e}},exports.dispatch=function(n){var t=n.notifs;void 0===t&&(t=[]),t.forEach(function(n){var t=_BAZAR_STORE_[n];if(!t)throw new Error("Trying to notify a non-existent component");var e=t.handler,i={};t.interests.forEach(function(n){return i[n]=_BAZAR_STORE_[n].sync()}),e&&e(i)})};
//# sourceMappingURL=bazar.js.map
