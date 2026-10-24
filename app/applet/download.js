const https = require('https');
const url = 'https://codeload.github.com/NoFxAiOS/nofx/zip/refs/heads/main';
https.get(url, (res) => {
  console.log('Status: ', res.statusCode);
  console.log('Content-Length: ', res.headers['content-length']);
});
