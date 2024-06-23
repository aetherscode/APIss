const axios = require("axios");
const config = require("../config");

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

module.exports = { thinkany };