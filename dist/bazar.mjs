var e=function(e){var n=e.id,r=[];Object.keys(_BAZAR_STORE_).forEach(function(e){try{return Promise.resolve(new Promise(function(t){-1!==(_BAZAR_STORE_[e].interests||[]).indexOf(n)&&r.push(e),t()}))}catch(e){return Promise.reject(e)}}),r.forEach(function(e){var n=_BAZAR_STORE_[e],r=n.interests,t=n.handler;if(!t)throw new Error("Attempted trigger of undefined handler on "+e);var i={};r.forEach(function(e){return i[e]=_BAZAR_STORE_[e].sync()}),t(i)})},n=function(e){var n=e.id,r=e.sync,t=e.handler,i=e.interests;if(!n)throw new Error("Expected registrant to have non-null id value");if(!r)throw new Error("Expected registrant to have a sync function");if(_BAZAR_STORE_.hasOwnProperty(n))throw new Error("Expected unique id");_BAZAR_STORE_[n]={interests:i,handler:t,sync:r}},r=function(e){return(_BAZAR_STORE_.initial||{})[e]},t=function(e){void 0===e&&(e={}),("undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})._BAZAR_STORE_={},_BAZAR_STORE_.initial={};var n=Object.keys(e);n.length>0&&n.forEach(function(n){_BAZAR_STORE_.initial[n]=e[n]})};export{t as initStore,r as initState,n as register,e as dispatch};
//# sourceMappingURL=bazar.mjs.map
