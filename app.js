const express = require('express');
const { thinkany, GoodyAI, luminai, blackbox } = require('./scrape/scraper');
const config = require('./config');
const msg = config.messages;
const app = express();
const PORT = process.env.PORT || 3000;

app.set('json spaces', 4);

app.get('/', (req, res) => {
  res.redirect('http://shannmoderz.rf.gd');
});

app.get('/ai/claude', async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ status: false, code: 400, author: config.author, result: msg.query });
  }
  try {
    const result = await thinkany(query);
    const response = {
      status: true,
      code: 200,
      author: config.author,
      result: result
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({ status: false, code: 500, author: config.author, result: msg.error });
  }
});

app.get('/ai/goody', async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ status: false, code: 400, author: config.author, result: msg.query });
  }
  try {
    const result = await GoodyAI(query);
    const response = {
      status: true,
      code: 200,
      author: config.author,
      result: result
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({ status: false, code: 500, author: config.author, result: msg.error });
  }
});

app.get('/ai/luminai', async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ status: false, code: 400, author: config.author, result: msg.query });
  }
  try {
    const result = await luminai(query);
    const response = {
      status: true,
      code: 200,
      author: config.author,
      result: result
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({ status: false, code: 500, author: config.author, result: msg.error });
  }
});

app.get('/ai/blackbox', async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ status: false, code: 400, author: config.author, result: msg.query });
  }
  try {
    const result = await blackbox(query);
    const response = {
      status: true,
      code: 200,
      author: config.author,
      result: result
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({ status: false, code: 500, author: config.author, result: msg.error });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Author: ${config.author}`);
});