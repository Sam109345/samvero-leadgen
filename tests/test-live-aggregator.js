const dns = require('dns').promises;

async function testLiveNominatimAggregator(query = 'clinic', city = 'Lahore', country = 'Pakistan') {
  console.log(`[TEST] Searching live businesses: "${query}" in "${city}, ${country}"...`);
  try {
    const searchUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(`${query} in ${city} ${country}`)}&format=json&addressdetails=1&limit=5`;
    const res = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'SamveroLeadGen/2.0 (contact@samvero.com)'
      }
    });

    if (!res.ok) {
      console.error('Nominatim returned error:', res.status);
      return [];
    }

    const places = await res.json();
    console.log(`[OK] Found ${places.length} live places!`);

    const leads = places.map((place, idx) => {
      const name = place.name || place.display_name.split(',')[0].trim();
      const address = place.display_name;
      return {
        id: `live-gmb-${place.place_id || idx}`,
        businessName: name,
        address: address,
        lat: place.lat,
        lon: place.lon,
        type: place.type,
      };
    });

    console.log('Sample Live Lead:', leads[0]);
    return leads;
  } catch (err) {
    console.error('Aggregator error:', err.message);
    return [];
  }
}

async function testLiveRemotiveAggregator(category = 'software-development') {
  console.log(`\n[TEST] Searching live marketplace jobs for category: "${category}"...`);
  try {
    const res = await fetch(`https://remotive.com/api/remote-jobs?category=${category}&limit=5`);
    const data = await res.json();
    const jobs = data.jobs || [];
    console.log(`[OK] Found ${jobs.length} live jobs on Remotive!`);

    if (jobs.length > 0) {
      console.log('Sample Live Job:', {
        title: jobs[0].title,
        company: jobs[0].company_name,
        location: jobs[0].candidate_required_location,
        url: jobs[0].url,
        published: jobs[0].publication_date
      });
    }
    return jobs;
  } catch (err) {
    console.error('Remotive error:', err.message);
    return [];
  }
}

async function run() {
  await testLiveNominatimAggregator('dental clinic', 'Lahore', 'Pakistan');
  await testLiveNominatimAggregator('luxury hotel', 'Dubai', 'UAE');
  await testLiveRemotiveAggregator('software-development');
}

run();
