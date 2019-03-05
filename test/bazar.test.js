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

  it('Throw if a multiple registration of the same ID is attempted', async () => {
    const errors = [];
    page.on('pageerror', err => errors.push(err));
    await page.goto(`${server}/throwIfNotUniqueID.html`, {
      waitUntil: 'networkidle0',
    });

    await sleep(1000);

    expect(errors[0]).to.be.an('error');
    expect(errors[0].message.match('Expected unique id')[0]).to.be.equal('Expected unique id');
  });

  it('Throw if no ID is provided at registration', async () => {
    const errors = [];
    page.on('pageerror', err => errors.push(err));
    await page.goto(`${server}/throwIfNotID.html`, {
      waitUntil: 'networkidle0',
    });

    await sleep(1000);

    expect(errors[0]).to.be.an('error');
    expect(errors[0].message.match('Expected registrant to have non-null id value')[0])
      .to.be.equal('Expected registrant to have non-null id value');
  });

  it('Throw if no SYNC function is provided at registration', async () => {
    const errors = [];
    page.on('pageerror', err => errors.push(err));
    await page.goto(`${server}/throwIfNotSync.html`, {
      waitUntil: 'networkidle0',
    });

    await sleep(1000);

    expect(errors[0]).to.be.an('error');
    expect(errors[0].message.match('Expected registrant to have a sync function')[0])
      .to.be.equal('Expected registrant to have a sync function');
  });

  it('Should throw if notify is invoked withot config object', async () => {
    const errors = [];
    page.on('pageerror', err => errors.push(err));
    await page.goto(`${server}/throwIfNotConfig.html`, {
      waitUntil: 'networkidle0',
    });

    await page.evaluate(() => document.querySelector('#testClick').click());

    await sleep(1000);

    expect(errors[0]).to.be.an('error');
    expect(errors[0].message.match('config object is required to correctly notify a state update')[0])
      .to.be.equal('config object is required to correctly notify a state update');
  });

  it('Should invoke handler if a component send a notification', async () => {
    await page.goto(`${server}/notifyInvokeHandler.html`, {
      waitUntil: 'networkidle0',
    });

    await page.evaluate(() => document.querySelector('#testClick').click());

    await sleep(100);

    const test = await page.evaluate(() => window.test);

    expect(test).to.be.not.an('undefined');
    expect(test).to.be.a('string');
    expect(test).to.be.equal('C1');
  });

  it('Should throw if a handler is invoked but undefined', async () => {
    const errors = [];
    page.on('pageerror', err => errors.push(err));
    await page.goto(`${server}/throwIfNotHandler.html`, {
      waitUntil: 'networkidle0',
    });

    await page.evaluate(() => document.querySelector('#testClick').click());

    await sleep(1000);

    expect(errors[0]).to.be.an('error');
    expect(errors[0].message.match('Attempted trigger of undefined handler on')[0])
      .to.be.equal('Attempted trigger of undefined handler on');
  });

  it('Should return a single state if getState is invoked', async () => {
    await page.goto(`${server}/getState.html`, {
      waitUntil: 'networkidle0',
    });

    const test = await page.evaluate(() => bazar.getState('C1'));

    expect(test).to.be.an('object');
    expect(test.count).to.be.a('number').to.be.equal(0);
  });

  it('Should return a multiple states if getStates is invoked', async () => {
    await page.goto(`${server}/getStates.html`, {
      waitUntil: 'networkidle0',
    });

    const test = await page.evaluate(() => bazar.getStates(['C1', 'C2']));

    expect(test).to.be.an('object');
    expect(test.C1).to.be.an('object');
    expect(test.C2).to.be.an('object');
    expect(test.C1.count).to.be.a('number').to.be.equal(0);
    expect(test.C2.count).to.be.a('number').to.be.equal(0);
  });

  it('Should throw if getState is invoked on non-registered id', async () => {
    const errors = [];
    page.on('pageerror', err => errors.push(err));
    await page.goto(`${server}/getState.html`, {
      waitUntil: 'networkidle0',
    });

    await sleep(1000);

    expect(errors[0]).to.be.an('error');
    expect(errors[0].message.match('Attempted reading state from')[0])
      .to.be.equal('Attempted reading state from');
  });

  it('Should throw if getStates is invoked on non-registered id', async () => {
    const errors = [];
    page.on('pageerror', err => errors.push(err));
    await page.goto(`${server}/getStates.html`, {
      waitUntil: 'networkidle0',
    });

    await sleep(1000);

    expect(errors[0]).to.be.an('error');
    expect(errors[0].message.match('Attempted reading state from')[0])
      .to.be.equal('Attempted reading state from');
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
});
