async function testOverpass() {
  console.log('Testing Overpass API for real local businesses in Lahore & Dubai...');
  
  // Overpass QL for dentists/clinics in Lahore
  const query = `
    [out:json][timeout:10];
    area["name"="Lahore"]->.searchArea;
    (
      node["amenity"~"dentist|clinic|doctors|hospital"](area.searchArea);
    );
    out center 5;
  `;

  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
      headers: {
        'User-Agent': 'SamveroLeadGen/2.0'
      }
    });

    if (!res.ok) {
      console.log('Overpass status:', res.status);
      return;
    }

    const data = await res.json();
    console.log(`Overpass returned ${data.elements?.length || 0} real businesses in Lahore!`);
    if (data.elements) {
      data.elements.forEach(el => {
        console.log(`  - ${el.tags?.name || 'Unnamed'} (amenity: ${el.tags?.amenity}, phone: ${el.tags?.phone || el.tags?.['contact:phone'] || 'N/A'}, website: ${el.tags?.website || 'N/A'})`);
      });
    }
  } catch (e) {
    console.error('Overpass error:', e.message);
  }
}

testOverpass();
