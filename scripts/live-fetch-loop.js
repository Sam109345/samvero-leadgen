// Live fetch loop using built-in fetch (Node >=18)
function log(msg){ console.log(new Date().toISOString(), msg); }

log('Live fetch loop started');

setInterval(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/leads?refresh=live');
    if (!res.ok) {
      log(`Fetch failed: ${res.status}`);
    } else {
      log('Fetched live leads');
    }
  } catch (err) {
    log(`Error: ${err.message}`);
  }
}, 10000);
