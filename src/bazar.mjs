const dispatch = config => {
  const { id } = config;

  // Array of IDs to notify for the state change just dispatched.
  const notifs = [];

  const t1 = Date.now();
  // preferring forEach over a more functional .filter followed by .map
  // to keep O(n) time complexity when looping through a large store.
  Object.keys(_BAZAR_STORE_)
    .forEach(currentId => {
      // Safely accessing store[id].interests.
      // Looping through IDs to check all the components that expressed interest in
      // the state change.
      if ((_BAZAR_STORE_[currentId].interests || []).indexOf(id) !== -1) {
        notifs.push(currentId);
      }
    });



  // execute effects
  notifs.forEach(notif => {
    const current = _BAZAR_STORE_[notif];

    const { interests, handler } = current;
    if (!handler) throw new Error(`Attempted trigger of undefined handler on ${notif}`);

    // creating states object
    const states = {};
    interests
      .forEach(interest => states[interest] = _BAZAR_STORE_[interest].sync());

    // Directly passing states at component level to avoid reading from global
    handler(states);
  });
  console.log(Date.now() - t1);
};


// Registering a new component in the global store.
// Make sure that `register` function runs only one time per registered component.
// Otherwise an error of `Expected unique ID` will be thrown.
// e.g. in a React component: Call `register` in the `constructor` method.
const register = config => {
  const {
    id,
    sync,
    handler,
    interests,
  } = config;

  if (!id) throw new Error('Expected registrant to have non-null id value');
  if (!sync) throw new Error('Expected registrant to have a sync function');
  if (_BAZAR_STORE_.hasOwnProperty(id)) throw new Error('Expected unique id');

  // Creating instance
  _BAZAR_STORE_[id] = {
    interests,
    handler,
    sync,
  };
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
  register,
  dispatch,
};
