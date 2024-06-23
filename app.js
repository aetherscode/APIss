const express = require('express');
const { thinkany } = require('./scrape/scraper');
const config = require('./config');
const app = express();
const port = 3000;

// Mengatur indentasi JSON menjadi 4 spasi
app.set('json spaces', 4);

// Endpoint /ai/claude
app.get('/ai/claude', async (req, res) => {
  const query = req.query.query;
  if (!query) {
    // Respons JSON saat query tidak ada
    return res.status(400).json({
      status: false,
      code: 400,
      author: config.author,
      result: config.messages.query
    });
  }

  try {
    const result = await thinkany(query);
    const response = {
      status: true,
      code: 200,
      author: config.author,
      result: result
    };
    res.json(response); // Menggunakan res.json untuk mengirim respons JSON
  } catch (error) {
    // Respons JSON saat terjadi kesalahan
    res.status(500).json({
      status: false,
      code: 500,
      author: config.author,
      result: config.messages.error
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Author: ${config.author}`);
});