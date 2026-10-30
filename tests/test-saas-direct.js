// Direct import test
const path = require('path');

try {
  // Let's inspect data/saas-db.json
  const fs = require('fs');
  const dbFile = path.join(__dirname, '..', 'data', 'saas-db.json');
  console.log('DB File exists:', fs.existsSync(dbFile));
  if (fs.existsSync(dbFile)) {
    const raw = fs.readFileSync(dbFile, 'utf8');
    const db = JSON.parse(raw);
    console.log('Plans in saas-db.json:', db.plans ? db.plans.length : 0);
    console.log('Users in saas-db.json:', db.users ? db.users.length : 0);
    console.log('Subscriptions in saas-db.json:', db.subscriptions ? db.subscriptions.length : 0);
  }
} catch (err) {
  console.error('Error reading db:', err);
}
