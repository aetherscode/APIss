const axios = require("axios");

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

async function blackbox(prompt) {
  try {
    const response = await axios.post('https://www.blackbox.ai/api/chat', {
      messages: [{
        id: uuid(),
        content: prompt,
        role: 'user'
      }],
      id: uuid(),
      previewToken: null,
      userId: '47b37fe9-1ac9-4097-a719-2cc1a0729b10',
      codeModelMode: true,
      agentMode: {},
      trendingAgentMode: {},
      isMicMode: false,
      isChromeExt: false,
      githubToken: null,
      clickedAnswer2: false,
      clickedAnswer3: false,
      clickedForceWebSearch: false,
      visitFromDelta: null
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    let result = response.data
    result = result.replace(/\$@v=v1\.10-rv2\$@\$/g, '')
    .replace(/Sources:.*/g, '')
    .replace(/$/g, '')
    const content = result.match(/content":"(.*?)"/)
    return content
  } catch (error) {
    console.error(error)
    throw error
  }
}

async function luminai(q) {
    try {
        const response = await axios.post("https://luminai.siputzx.my.id/", {
            content: q
        });
        return response.data.result;
    } catch (error) {
        console.error('Error fetching:', error);
        throw error;
    }
}

luminai("question")
    .then(result => {
        return('Result:', result);
    })
    .catch(error => {
        return('Error:', error);
    });

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

async function thinkany(prompt) {
  try {
    const response = await axios.post('https://thinkany.ai/api/chat',
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

module.exports = { thinkany, GoodyAI, luminai, blackbox };