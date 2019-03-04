const dispatch = config => {
  const { notifs = [] } = config;

  // execute effects
  notifs.forEach(notif => {
    const current = _BAZAR_STORE_[notif];
    if (!current) throw new Error('Trying to notify a non-existent component');

    // creating states object
    const states = {};
    current.interests
      .forEach(interest => states[interest] = _BAZAR_STORE_[interest].sync());

    // pass states to avoid reading from global
    // avoid expose global object
    current.handler(states);
  });
};

const register = config => {
  const {
    id,
    notifs = [],
    interests = [],
    handler = undefined,
    sync = undefined,
  } = config;

  if (!id) throw new Error('Expected registrant to have non-null id value');
  if (_BAZAR_STORE_.hasOwnProperty(id)) throw new Error('Expected unique id');

  // create snapshop in global
  _BAZAR_STORE_[id] = {
    notifs,
    interests,
    handler,
    sync,
  };
};

const initStore = () => {
  const context = typeof global !== 'undefined'
    ? global
    : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
        ? window
        : {};

  context._BAZAR_STORE_ = {};
};

export {
  initStore,
  register,
  dispatch,
};
