var e=new Object;exports.getState=function(r){var n=(e[r]||{}).sync;return n?n():void 0},exports.register=function(r){var n=r.id,o=r.willRerender;if(void 0===o&&(o=!1),!n)throw new Error("Expected non-null id");if(e.hasOwnProperty(n)&&!o)throw new Error("Expected unique id");Object.defineProperty(e,n,{value:Object.assign({},r),writable:!1,enumerable:!0})},exports.edict=function(r){var n=e[r].sync;if(!n)throw new Error("Sync is required to issue an edict");var o=n();Object.keys(e).forEach(function(n){if(-1!==(e[n].interests||[]).indexOf(r)){var t=e[n].onEdict;if(!t)throw new Error("Triggering undefined onEdict on "+n);t(r,o)}})},exports.poke=function(r,n){var o=(e[r]||{}).onPoke;if(!o)throw new Error("Poking component without onPoke method");o(n)};
//# sourceMappingURL=bazar.js.map
