import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../client/App';
import template from '../client/template';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  const appString = renderToString(<App />);
  
  console.log(_store_);
  res.send(template({
    body: appString,
    title: 'SSR test'
  }));
});

app.listen(port);
console.log(`Listening on port ${port}`);
