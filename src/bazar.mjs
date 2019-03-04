const dispatch = config => {
  const { notifs = [] } = config;

  // execute effects
  notifs.forEach(notif => {
    const current = _BAZAR_STORE_[notif];

    if (!current) throw new Error('Trying to notify a non-existent component');

    const { interests, handler } = current;

    // creating states object
    const states = {};
    interests
      .forEach(interest => states[interest] = _BAZAR_STORE_[interest].sync());

    // pass states to avoid reading from global
    // avoid expose global object
    if (handler) handler(states);
  });
};

const register = config => {
  const {
    id,
    sync,
    handler,
    notifs = [],
    interests = [],
  } = config;

  if (!id) throw new Error('Expected registrant to have non-null id value');
  if (!sync) throw new Error('Expected registrant to have a sync function');
  if (_BAZAR_STORE_.hasOwnProperty(id)) throw new Error('Expected unique id');

  // create snapshop in global
  _BAZAR_STORE_[id] = {
    notifs,
    interests,
    handler,
    sync,
  };
};

const initState = id => (_BAZAR_STORE_.initial || {})[id];

const initStore = (states = {}) => {
  const context = typeof global !== 'undefined'
    ? global
    : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
        ? window
        : {};

  context._BAZAR_STORE_ = {};
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
