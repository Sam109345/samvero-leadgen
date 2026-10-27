const http = require('http');

http.get('http://localhost:3000/api/leads?userId=admin-01', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      console.log('Total Leads Received:', data.leads?.length);
      data.leads.forEach((l, idx) => {
        console.log(
          `[${idx + 1}] ${l.id} | ${l.type} | ${l.businessName.substring(0, 32).padEnd(32)} | Email: ${(l.contact?.email || 'MISSING').padEnd(36)} | Phone: ${l.contact?.phone} | WA: ${l.contact?.whatsapp}`
        );
      });
    } catch (e) {
      console.error('Error parsing response:', e);
    }
  });
}).on('error', e => console.error(e));
