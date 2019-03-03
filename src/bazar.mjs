const dispatch = (config, state) => {
  const {
    id,
    notifs = [],
    ignores = [],
  } = config;

  const clone = typeof state === 'object'
    ? { ...state }
    : state;

  if (ignores.length > 0) {
    ignores.forEach(ignore => {
      delete clone[ignore];
    });
  }

  // update global store
  _store_[id] = {
    ..._store_[id],
    state: clone,
  };

  // execute effects
  notifs.forEach(notif => {
    const current = _store_[notif];
    if (!current) throw new Error('Trying to notify a non-existent component');

    // creating states object
    const states = {};
    current.interests
      .forEach(interest => states[interest] = _store_[interest].state);

    // pass states to avoid reading from global
    // avoid expose global object
    current.handler(states);
  });
};

const register = (config, state) => {
  const {
    id,
    notifs = [],
    interests = [],
    ignores = [],
    handler = undefined,
  } = config;

  if (!id) throw new Error('Expected registrar to have non-null id value');
  if (_store_.hasOwnProperty(id)) throw new Error('Expected unique id');

  const clone = Object.assign({}, state);

  if (ignores.length > 0) {
    ignores.forEach(ignore => {
      delete clone[ignore];
    });
  }

  // create snapshop in global
  _store_[id] = {
    notifs,
    interests,
    handler,
    state: clone,
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

  context._store_ = {};
};

export {
  initStore,
  register,
  dispatch,
};
