const puppeteer = require('puppeteer');
const { expect } = require('chai');
const _ = require('lodash');

const globalVariables = _.pick(global, ['browser', 'expect', 'memore']);

// puppeteer options
const opts = {
  headless: true,
  timeout: 20000,
};

// expose variables
before(async () => {
  global.expect = expect;
  global.browser = await puppeteer.launch(opts);
});

// close browser and reset global variables
after(async () => {
  browser.close();

  global.browser = globalVariables.browser;
  global.expect = globalVariables.expect;
});
