/**
 *
 * CONFIG:
 * `config` object is the fundamental part of `bazar`.
 *  It stores the required connections to notify events to the correct elements
 *  and syncing state from every part of your application.
 *  The composing parts of `config` object are:
 * @param {string} id - REQUIRED. Must be unique. Defines, in the global store, the
 *  reference of the element when you register or notify.
 * @param {Function} sync - REQUIRED. Where you return which part of the local state you want
 *  to expose in the global store.
 * @param {array} interests - OPTIONAL. Array of watched IDs. When any of the ID notify,
 *  the `onNotify` function is invoked.
 * @param {Function} onNotify - OPTIONAL. Function invoked when any of the IDs specified in
 *  `interests` notify an update. It is invoked with (id, state) as arguments. So you can
 *  update your local state accordingly to avoid unnecessary re-renders.
 */

// Looping through global store and invoking `onNotify` on every element that expressed an interest
// on the ID that provoked a notification.
const notify = config => {
  if (!config) throw new Error('config object is required to correctly notify a state update');
  const { id, sync } = config;
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

        const { onNotify } = current;
        if (!onNotify) throw new Error(`Attempted trigger of undefined onNotify function on ${currentId}`);

        // Directly passing id and state at component level to avoid reading from global
        onNotify(id, state);
      }
    });
};

// Registering a new component in the global store.
// Make sure that `register` function runs only one time per registered component.
// Otherwise an error of `Expected unique ID` will be thrown.
// e.g. in a React component: Call `register` in the `constructor` method.
const register = config => {
  const {
    id,
    sync,
    onPoke,
    onNotify,
    interests,
  } = config;

  if (!id) throw new Error('Expected registrant to have non-null id value');
  if (!sync) throw new Error('Expected registrant to have a sync function');
  if (_BAZAR_STORE_.hasOwnProperty(id)) throw new Error('Expected unique id');

  // Creating instance
  _BAZAR_STORE_[id] = {
    sync,
    onPoke,
    onNotify,
    interests,
  };
};

// The poke function let's you `poke` registered components with a valid `onPoke` function.
const poke = (id, arg) => {
  const { onPoke } = (_BAZAR_STORE_[id] || {});
  if (!onPoke) throw new Error('Attempted to poke component without an onPoke function');
  onPoke(arg);
};

// Safely reading synced state drom one ID.
const getState = id => {
  if (!_BAZAR_STORE_.hasOwnProperty(id)) throw new Error(`Attempted reading state from ${id}, non-registered component`);
  return _BAZAR_STORE_[id].sync();
};

// Safely reading synced state drom multiple IDs.
// Returns an handy object containing states grouped by ID.
const getStates = arr => {
  const states = {};
  arr.forEach(id => {
    if (!_BAZAR_STORE_.hasOwnProperty(id)) throw new Error(`Attempted reading state from ${id}, non-registered component`);
    states[id] = _BAZAR_STORE_[id].sync();
  });
  return states;
};

// Safely reading initial state. Returns undefined if no initial state is defined
// for that specific ID.
const initState = id => (_BAZAR_STORE_.initial || {})[id];

// Must run only one time
const initStore = (states = {}) => {
  // Evaluating the global execution context.
  // Useful because e.g. In Node.js you don't have access to a `window` object
  // but you can create a global store through `global`.
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
  getStates,
  register,
  notify,
  poke,
};
