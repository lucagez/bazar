var n=function(n){var e=n.id,t=[],r=Date.now();Object.keys(_BAZAR_STORE_).forEach(function(n){-1!==(_BAZAR_STORE_[n].interests||[]).indexOf(e)&&t.push(n)}),t.forEach(function(n){var e=_BAZAR_STORE_[n],t=e.interests,r=e.handler;if(!r)throw new Error("Attempted trigger of undefined handler on "+n);var i={};t.forEach(function(n){return i[n]=_BAZAR_STORE_[n].sync()}),r(i)}),console.log(Date.now()-r)},e=function(n){var e=n.id,t=n.sync,r=n.handler,i=n.interests;if(!e)throw new Error("Expected registrant to have non-null id value");if(!t)throw new Error("Expected registrant to have a sync function");if(_BAZAR_STORE_.hasOwnProperty(e))throw new Error("Expected unique id");_BAZAR_STORE_[e]={interests:i,handler:r,sync:t}},t=function(n){return(_BAZAR_STORE_.initial||{})[n]},r=function(n){void 0===n&&(n={}),("undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})._BAZAR_STORE_={},_BAZAR_STORE_.initial={};var e=Object.keys(n);e.length>0&&e.forEach(function(e){_BAZAR_STORE_.initial[e]=n[e]})};export{r as initStore,t as initState,e as register,n as dispatch};
//# sourceMappingURL=bazar.mjs.map
