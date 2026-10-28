const https = require('https');

async function testQuery() {
  const query = encodeURIComponent('Lahore dental clinic contact email phone');
  const url = `https://html.duckduckgo.com/html/?q=${query}`;
  
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' } }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        console.log('Status:', res.statusCode);
        const emails = body.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
        const phones = body.match(/\+?92[\s-]?3\d{2}[\s-]?\d{7}/g) || [];
        console.log('Emails found:', [...new Set(emails)].slice(0, 8));
        console.log('Phones found:', [...new Set(phones)].slice(0, 8));
        resolve();
      });
    }).on('error', e => {
      console.error(e.message);
      resolve();
    });
  });
}

testQuery();
