!function(n,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e(n.bazar={})}(this,function(n){n.initStore=function(n){void 0===n&&(n={}),("undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})._BAZAR_STORE_={},_BAZAR_STORE_.initial={};var e=Object.keys(n);e.length>0&&e.forEach(function(e){_BAZAR_STORE_.initial[e]=n[e]})},n.initState=function(n){return(_BAZAR_STORE_.initial||{})[n]},n.getState=function(n){var e=(_BAZAR_STORE_[n]||{}).sync;return e?e():void 0},n.register=function(n){var e=n.id,i=n.willRerender;if(void 0===i&&(i=!1),!e)throw new Error("Expected non-null id");if(_BAZAR_STORE_.hasOwnProperty(e)&&!i)throw new Error("Expected unique id");_BAZAR_STORE_[e]=Object.assign({},n)},n.edict=function(n){var e=_BAZAR_STORE_[n].sync;if(!e)throw new Error("Sync is required to issue an edict");var i=e();Object.keys(_BAZAR_STORE_).forEach(function(e){if(-1!==(_BAZAR_STORE_[e].interests||[]).indexOf(n)){var t=_BAZAR_STORE_[e].onEdict;if(!t)throw new Error("Triggering undefined onEdict on "+e);t(n,i)}})},n.poke=function(n,e){var i=(_BAZAR_STORE_[n]||{}).onPoke;if(!i)throw new Error("Poking component without onPoke method");i(e)}});
