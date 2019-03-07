/**
 *
 * CONFIG:
 * `config` object is the fundamental part of `bazar`.
 *  It stores the required connections to issue edicts to the correct elements
 *  and syncing state from every part of your application.
 *  The composing parts of `config` object are:
 * @param {string} id - REQUIRED. Must be unique. Defines, in the global store, the
 *  reference of the element when you register or edict.
 * @param {Function} sync - OPTIONAL. Here you are returning which part of the local state you want
 *  to expose in the global store.
 * @param {array} interests - OPTIONAL. Array of watched IDs. When any of the ID edict,
 *  the `onEdict` function is invoked.
 * @param {Function} onEdict - OPTIONAL. Function invoked when any of the IDs specified in
 *  `interests` issue an edict. It is invoked with (id, state) as arguments. So you can
 *  update your local state accordingly to avoid unnecessary re-renders.
 * @param {Function} onPoke - OPTIONAL. Function invoked when a `poke` function is invoked with
 *  the id of the current component as first argument. `onPoke` is invoked with an optional argument
 *  passed from `poke`.
 */

// Looping through global store and invoking `onEdict` on every element that expressed an interest
// on the ID that provoked a notification.
const edict = id => {
  const { sync } = _BAZAR_STORE_[id];
  if (!sync) throw new Error('Sync is required to issue an edict');
  const state = sync();

  // preferring forEach over a more functional .filter followed by .map
  // to keep O(n) time complexity when looping through a large store.
  Object.keys(_BAZAR_STORE_)
    .forEach(currentId => {
      // Safely accessing store[id].interests.
      // Looping through IDs to check all the components that expressed interest in
      // the state change.
      if ((_BAZAR_STORE_[currentId].interests || []).indexOf(id) !== -1) {
        const current = _BAZAR_STORE_[currentId];

        const { onEdict } = current;
        if (!onEdict) throw new Error(`Triggering undefined onEdict on ${currentId}`);

        // Directly passing id and state at component level to avoid reading from global
        onEdict(id, state);
      }
    });
};

// Registering a new component in the global store.
// Make sure that `register` function runs only one time per registered component.
// Otherwise an error of `Expected unique ID` will be thrown.
// e.g. in a React component: Call `register` in the `constructor` method.
const register = config => {
  const { id, willRerender = false } = config;

  if (!id) throw new Error('Expected non-null id');
  if (_BAZAR_STORE_.hasOwnProperty(id) && !willRerender) throw new Error('Expected unique id');

  // Creating instance
  _BAZAR_STORE_[id] = { ...config };
};

// The poke function let's you `poke` registered components with a valid `onPoke` function.
const poke = (id, arg) => {
  const { onPoke } = (_BAZAR_STORE_[id] || {});
  if (!onPoke) throw new Error('Poking component without onPoke method');
  onPoke(arg);
};

// Safely reading synced state from one ID.
const getState = id => {
  const { sync } = (_BAZAR_STORE_[id] || {});
  return sync ? sync() : undefined;
};

// Safely reading initial state. Returns undefined if no initial state is defined
// for that specific ID.
const initState = id => (_BAZAR_STORE_.initial || {})[id];

// Must run only one time
const initStore = (states = {}) => {
  // Evaluating the global execution context.
  // Useful because:
  // e.g. In Node.js you don't have access to a `window` object
  // but you can create a global store in `global`.
  // e.g. in a webWorker you don't have access to a `window` object
  // but you can create a global store in `self`.
  const context = typeof global !== 'undefined'
    ? global
    : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
        ? window
        : {};

  context._BAZAR_STORE_ = {};

  // setting up an initial store containing optional initial states
  _BAZAR_STORE_.initial = {};
  const initials = Object.keys(states);
  if (initials.length > 0) initials.forEach(id => {
    _BAZAR_STORE_.initial[id] = states[id];
  });
};

export {
  initStore,
  initState,
  getState,
  register,
  edict,
  poke,
};
