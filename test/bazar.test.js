// async sleep
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Bazar tests', async () => {
  const server = 'http://127.0.0.1:8080/test/pages';
  let page;

  before(async () => {
    page = await browser.newPage();
  });

  after(async () => {
    await page.close();
  });

  it('Create empty store on initStore', async () => {
    await page.goto(`${server}/createStore.html`, {
      waitUntil: 'networkidle0',
    });

    const store = await page.evaluate(() => window._BAZAR_STORE_);
    const keys = Object.keys(store);
    expect(keys).to.be.an('array');
    expect(keys.length).to.be.equal(1);
  });

  it('Create NON empty store on initStore with props', async () => {
    await page.goto(`${server}/createNonEmptyStore.html`, {
      waitUntil: 'networkidle0',
    });

    const store = await page.evaluate(() => window._BAZAR_STORE_);
    const keys = Object.keys(store.initial);
    expect(keys).to.be.an('array');
    expect(keys.length).to.be.equal(2);
  });

  it('Register a single ID', async () => {
    await page.goto(`${server}/registerID.html`, {
      waitUntil: 'networkidle0',
    });

    const store = await page.evaluate(() => window._BAZAR_STORE_);
    const keys = Object.keys(store);
    expect(keys).to.be.an('array');
    expect(keys.length).to.be.equal(2);
    expect(keys[1]).to.be.a('string');
    expect(keys[1]).to.be.equal('C1');
  });

  it('Register multiple IDs', async () => {
    await page.goto(`${server}/registerIDs.html`, {
      waitUntil: 'networkidle0',
    });

    const store = await page.evaluate(() => window._BAZAR_STORE_);
    const keys = Object.keys(store);
    expect(keys).to.be.an('array');
    expect(keys.length).to.be.equal(3);
    expect(keys[1]).to.be.a('string');
    expect(keys[1]).to.be.equal('C1');
    expect(keys[2]).to.be.a('string');
    expect(keys[2]).to.be.equal('C2');
  });

  it('Throw if a multiple registration of the same ID is attempted (without expliciting a rerender)', async () => {
    const errors = [];
    page.on('pageerror', err => errors.push(err));
    await page.goto(`${server}/throwIfNotUniqueID.html`, {
      waitUntil: 'networkidle0',
    });

    await sleep(1000);

    expect(errors[0]).to.be.an('error');
    expect(errors[0].message.match('Expected unique id')[0]).to.be.equal('Expected unique id');
  });

  it('Should not throw if a multiple registration of the same ID is attempted (expliciting a rerender)', async () => {
    const errors = [];
    page.on('pageerror', err => errors.push(err));
    await page.goto(`${server}/notThrowIfRerenderIsNotified.html`, {
      waitUntil: 'networkidle0',
    });

    await sleep(1000);

    expect(errors).to.be.not.an('error');
  });

  it('Throw if no ID is provided at registration', async () => {
    const errors = [];
    page.on('pageerror', err => errors.push(err));
    await page.goto(`${server}/throwIfNotID.html`, {
      waitUntil: 'networkidle0',
    });

    await sleep(1000);

    expect(errors[0]).to.be.an('error');
    expect(errors[0].message.match('Expected non-null id')[0])
      .to.be.equal('Expected non-null id');
  });

  it('Should throw if notify is invoked from element without sync function', async () => {
    const errors = [];
    page.on('pageerror', err => errors.push(err));
    await page.goto(`${server}/throwIfNotSyncOnNotify.html`, {
      waitUntil: 'networkidle0',
    });

    await page.evaluate(() => document.querySelector('#testClick').click());

    await sleep(1000);

    expect(errors[0]).to.be.an('error');
    expect(errors[0].message.match('Sync is required to notify a state update')[0])
      .to.be.equal('Sync is required to notify a state update');
  });

  it('Should invoke onNotify if a component send a notification', async () => {
    await page.goto(`${server}/notifyInvokeonNotify.html`, {
      waitUntil: 'networkidle0',
    });

    await page.evaluate(() => document.querySelector('#testClick').click());

    await sleep(100);

    const test = await page.evaluate(() => window.test);

    expect(test).to.be.not.an('undefined');
    expect(test).to.be.a('string');
    expect(test).to.be.equal('C1');
  });

  it('Should throw if onNotify is invoked but undefined', async () => {
    const errors = [];
    page.on('pageerror', err => errors.push(err));
    await page.goto(`${server}/throwIfNotonNotify.html`, {
      waitUntil: 'networkidle0',
    });

    await page.evaluate(() => document.querySelector('#testClick').click());

    await sleep(1000);

    expect(errors[0]).to.be.an('error');
    expect(errors[0].message.match('Triggering undefined onNotify on')[0])
      .to.be.equal('Triggering undefined onNotify on');
  });

  it('Should return a single state if getState is invoked on a registered component', async () => {
    await page.goto(`${server}/getState.html`, {
      waitUntil: 'networkidle0',
    });

    const C1 = await page.evaluate(() => bazar.getState('C1'));

    expect(C1).to.be.an('object');
    expect(C1.count).to.be.a('number').to.be.equal(0);
  });

  it('Should return undefined if getstate is invoked on non-registered component', async () => {
    await page.goto(`${server}/getState.html`, {
      waitUntil: 'networkidle0',
    });

    const C3 = await page.evaluate(() => bazar.getState('C3'));

    expect(C3).to.be.an('undefined');
  });

  it('Should return undefined if getstate is invoked on non-registered component', async () => {
    await page.goto(`${server}/getStateWithoutSync.html`, {
      waitUntil: 'networkidle0',
    });

    const C1 = await page.evaluate(() => bazar.getState('C1'));

    expect(C1).to.be.an('undefined');
  });

  it('Should return undefined when invoking initState on empty store', async () => {
    await page.goto(`${server}/createStore.html`, {
      waitUntil: 'networkidle0',
    });

    const test = await page.evaluate(() => bazar.initState('C1'));

    expect(test).to.be.an('undefined');
  });

  it('Should return a non-null value when invoking initState on non-initially-empty store', async () => {
    await page.goto(`${server}/createNonEmptyStore.html`, {
      waitUntil: 'networkidle0',
    });

    const test = await page.evaluate(() => bazar.initState('C1'));

    expect(test).to.be.not.an('undefined');
    expect(test).to.be.equal(1);
  });

  it('Should pass arg when anonimously poking component', async () => {
    await page.goto(`${server}/poke.html`, {
      waitUntil: 'networkidle0',
    });

    await page.evaluate(() => bazar.poke('C2', 'test'));

    await sleep(100);

    const test = await page.evaluate(() => window.test);

    expect(test).to.be.a('string');
    expect(test).to.be.equal('test');
  });

  it('Should throw when poking component without onPoke method', async () => {
    const errors = [];
    page.on('pageerror', err => errors.push(err));
    await page.goto(`${server}/poke.html`, {
      waitUntil: 'networkidle0',
    });

    await page.evaluate(() => document.querySelector('#testClick').click());

    await sleep(1000);

    expect(errors[0]).to.be.an('error');
    expect(errors[0].message.match('Poking component without onPoke method')[0])
      .to.be.equal('Poking component without onPoke method');
  });
});
