// const { initStore, register, dispatch } = require('../dist/bazar');

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

  it('Assign default config', async () => {
    await page.goto(`${server}/assignDefaultConfig.html`, {
      waitUntil: 'networkidle0',
    });
  });
});
