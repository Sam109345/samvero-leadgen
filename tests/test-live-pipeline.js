const dns = require('dns').promises;

async function testLiveJobFeeds() {
  console.log('Testing Live Job Feeds & Places APIs...');
  
  // 1. Remotive Live Remote Jobs
  try {
    const res = await fetch('https://remotive.com/api/remote-jobs?limit=5');
    const data = await res.json();
    console.log(`[Remotive] Fetched ${data.jobs?.length || 0} live jobs.`);
    if (data.jobs && data.jobs.length > 0) {
      console.log(`  Sample Job: "${data.jobs[0].title}" at ${data.jobs[0].company_name} (${data.jobs[0].candidate_required_location})`);
    }
  } catch (e) {
    console.error('[Remotive Error]', e.message);
  }

  // 2. We Work Remotely RSS
  try {
    const res = await fetch('https://weworkremotely.com/categories/remote-programming-jobs.rss');
    const xml = await res.text();
    const itemMatches = [...xml.matchAll(/<title><!\[CDATA\[(.*?)\]\]><\/title>/g)].map(m => m[1]);
    console.log(`[We Work Remotely] Fetched ${itemMatches.length} live jobs.`);
    if (itemMatches.length > 0) {
      console.log(`  Sample Job: ${itemMatches[0]}`);
    }
  } catch (e) {
    console.error('[WWR Error]', e.message);
  }

  // 3. OpenStreetMap Nominatim Live Businesses in Lahore / Dubai / London
  try {
    const res = await fetch('https://nominatim.openstreetmap.org/search?q=hospital+Lahore&format=json&limit=3', {
      headers: { 'User-Agent': 'SamveroLeadGen/1.0' }
    });
    const places = await res.json();
    console.log(`[Nominatim] Fetched ${places.length} live local businesses.`);
    if (places.length > 0) {
      console.log(`  Sample Business: ${places[0].display_name.split(',')[0]} (${places[0].type})`);
    }
  } catch (e) {
    console.error('[Nominatim Error]', e.message);
  }
}

testLiveJobFeeds();
