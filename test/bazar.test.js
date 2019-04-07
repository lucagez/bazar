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

  it('Register a single ID', async () => {
    await page.goto(`${server}/registerID.html`, {
      waitUntil: 'networkidle0',
    });

    // If C1 respond with its state is successfully registered.
    const { who } = await page.evaluate(() => window.bazar.getState('C1'));
    expect(who).to.be.a('string');
    expect(who).to.be.equal('C1');
  });

  it('Register multiple IDs', async () => {
    await page.goto(`${server}/registerIDs.html`, {
      waitUntil: 'networkidle0',
    });

    const { who1, who2 } = await page.evaluate(() => ({
      who1: window.bazar.getState('C1'),
      who2: window.bazar.getState('C2'),
    }));

    expect(who1).to.be.an('object');
    expect(who2).to.be.an('object');
    expect(who1.who).to.be.a('string');
    expect(who1.who).to.be.equal('C1');
    expect(who2.who).to.be.a('string');
    expect(who2.who).to.be.equal('C2');
  });

  it('Should throw if a multiple registration of the same ID is attempted (without expliciting a rerender)', async () => {
    const errors = [];
    page.on('pageerror', err => errors.push(err));
    await page.goto(`${server}/throwIfNotUniqueID.html`, {
      waitUntil: 'networkidle0',
    });

    await sleep(1000);

    expect(errors[0]).to.be.an('error');
    expect(errors[0].message.match('Expected unique id')[0]).to.be.equal('Expected unique id');
  });

  it('Should not throw if a multiple registration of the same ID is attempted (explicit rerender)', async () => {
    const errors = [];
    page.on('pageerror', err => errors.push(err));
    await page.goto(`${server}/notThrowIfRerenderIsNotified.html`, {
      waitUntil: 'networkidle0',
    });

    await sleep(1000);

    expect(errors).to.be.not.an('error');
  });

  it('Should throw if no ID is provided at registration', async () => {
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

  it('Should throw if an edict is issued from element without sync method', async () => {
    const errors = [];
    page.on('pageerror', err => errors.push(err));
    await page.goto(`${server}/throwIfNotSyncOnEdict.html`, {
      waitUntil: 'networkidle0',
    });

    await page.evaluate(() => document.querySelector('#testClick').click());

    await sleep(1000);

    expect(errors[0]).to.be.an('error');
    expect(errors[0].message.match('Sync is required to issue an edict')[0])
      .to.be.equal('Sync is required to issue an edict');
  });

  it('Should invoke onEdict if an interesting component issue an edict', async () => {
    await page.goto(`${server}/edictInvokeOnEdict.html`, {
      waitUntil: 'networkidle0',
    });

    await page.evaluate(() => document.querySelector('#testClick').click());

    await sleep(1000);

    const test = await page.evaluate(() => window.test);

    expect(test).to.be.not.an('undefined');
    expect(test).to.be.a('string');
    expect(test).to.be.equal('C1');
  });

  it('Should throw if onEdict is invoked but undefined', async () => {
    const errors = [];
    page.on('pageerror', err => errors.push(err));
    await page.goto(`${server}/throwIfNotOnEdict.html`, {
      waitUntil: 'networkidle0',
    });

    await page.evaluate(() => document.querySelector('#testClick').click());

    await sleep(1000);

    expect(errors[0]).to.be.an('error');
    expect(errors[0].message.match('Triggering undefined onEdict on')[0])
      .to.be.equal('Triggering undefined onEdict on');
  });

  it('Should return a single state if getState is invoked on a registered component', async () => {
    await page.goto(`${server}/getState.html`, {
      waitUntil: 'networkidle0',
    });

    const C1 = await page.evaluate(() => window.bazar.getState('C1'));

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
