const express = require('express');
const { thinkany, GoodyAI, luminai, blackbox, CgtAi, Simsimi, leptonAi, yousearch, LetmeGpt, AoyoAi } = require('./scrape/scraper');
const config = require('./config');
const msg = config.messages;
const app = express();
const PORT = process.env.PORT || 3000;

app.set('json spaces', 4);

// Variabel untuk melacak statistik
let totalRequests = 0;
let totalVisitors = 0;
const visitors = new Set();

// Middleware untuk melacak statistik
app.use((req, res, next) => {
  totalRequests++;
  if (req.path === '/') {
    const visitorIP = req.ip;
    if (!visitors.has(visitorIP)) {
      visitors.add(visitorIP);
      totalVisitors++;
    }
  }
  next();
});

app.get('/', (req, res) => {
  res.redirect('https://shannmoderz.rf.gd');
});

// Endpoint untuk mendapatkan statistik
app.get('/stats', (req, res) => {
  res.json({
    status: true,
    code: 200,
    author: config.author,
    result: {
      totalRequests,
      totalVisitors
    }
  });
});

const handleAIRequest = (aiFunction) => async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ status: false, code: 400, author: config.author, result: msg.query });
  }
  try {
    const result = await aiFunction(query);
    res.json({ status: true, code: 200, author: config.author, result: result });
  } catch (error) {
    res.status(500).json({ status: false, code: 500, author: config.author, result: msg.error });
  }
};

app.get('/ai/claude', handleAIRequest(thinkany));
app.get('/ai/goody', handleAIRequest(GoodyAI));
app.get('/ai/luminai', handleAIRequest(luminai));
app.get('/ai/blackbox', handleAIRequest(blackbox));
app.get('/ai/cgt', handleAIRequest(CgtAi));
app.get('/ai/simsimi', handleAIRequest(Simsimi));
app.get('/ai/lepton', handleAIRequest(leptonAi));
app.get('/ai/yousearch', handleAIRequest(yousearch));
app.get('/ai/letmegpt', handleAIRequest(LetmeGpt));
app.get('/ai/aoyo', handleAIRequest(AoyoAi));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: false, code: 500, author: config.author, result: msg.error });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Author: ${config.author}`);
});