const axios = require("axios");
const config = require("../config");

async function GoodyAI(q) {
  try {
    const headers = {
      'Accept': '*/*',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7,af;q=0.6',
      'Content-Type': 'application/json',
      'Origin': 'https://www.goody2.ai',
      'Referer': 'https://www.goody2.ai/chat',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
    };

    const params = {
      message: q,
      debugParams: null
    };

    const response = await axios.post("https://www.goody2.ai/send", params, {
      headers,
      responseType: 'stream',
    });

    return new Promise((resolve, reject) => {
      let fullText = '';

      response.data.on('data', (chunk) => {
        const lines = chunk.toString().split('\n');
        for (let line of lines) {
          if (line.startsWith('data: {"content":')) {
            try {
              const content = JSON.parse(line.slice(6)).content;
              fullText += content;
            } catch (err) {
              console.error('Error parsing JSON:', err);
            }
          }
        }
      });

      response.data.on('end', () => {
        resolve(fullText);
      });

      response.data.on('error', (err) => {
        reject(err);
      });
    });

  } catch (error) {
    console.error(error);
    throw error;
  }
}

function uuid() {
  let d = new Date().getTime();
  let d2 = (performance && performance.now && (performance.now() * 1000)) || 0;
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = Math.random() * 16;
    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

async function thinkany(prompt) {
  try {
    const response = await axios.post(config.base_url,
      {
        role: 'user',
        content: prompt,
        conv_uuid: uuid(),
        mode: 'search',
        is_new: true,
        model: 'claude-3-haiku'
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = { thinkany, GoodyAI };