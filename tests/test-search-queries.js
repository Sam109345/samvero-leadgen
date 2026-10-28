async function testSearchQueries() {
  const tests = [
    'https://nominatim.openstreetmap.org/search?q=clinic+Lahore&format=json&limit=5',
    'https://nominatim.openstreetmap.org/search?q=hotel+Dubai&format=json&limit=5',
    'https://nominatim.openstreetmap.org/search?q=restaurant+Karachi&format=json&limit=5',
    'https://nominatim.openstreetmap.org/search?q=dentist+London&format=json&limit=5',
    'https://nominatim.openstreetmap.org/search?q=hospital+Austin&format=json&limit=5'
  ];

  for (const url of tests) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'SamveroLeadGen/2.0 (contact@samvero.com)' }
      });
      const data = await res.json();
      const q = new URL(url).searchParams.get('q');
      console.log(`Query: "${q}" -> ${data.length} results:`);
      if (data.length > 0) {
        data.slice(0, 2).forEach(item => {
          console.log(`   - ${item.name || item.display_name.split(',')[0]} | ${item.type}`);
        });
      }
    } catch (e) {
      console.error('Error:', e.message);
    }
  }
}

testSearchQueries();
