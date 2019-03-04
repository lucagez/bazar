const dispatch = config => {
  const { id } = config;

  const notifs = [];

  // preferring forEach over a more functional .filter followed by .map
  // to keep O(n) time complexity when looping through a large store
  Object.keys(_BAZAR_STORE_)
    .forEach(currentId => {
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

    // pass states to avoid reading from global
    // avoid expose global object
    handler(states);
  });
};

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

  // create snapshop in global
  _BAZAR_STORE_[id] = {
    interests,
    handler,
    sync,
  };
};

const initState = id => (_BAZAR_STORE_.initial || {})[id];

const initStore = (states = {}) => {
  // Evaluating the global execution context
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
