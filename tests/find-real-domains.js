const dns = require('dns').promises;

// Candidate real businesses / domains across industries in PK, UAE, US, UK, Global
const candidateDomains = [
  // Pakistan
  'systems.ltd',
  'arbisoft.com',
  '10pearls.com',
  'telenor.com.pk',
  'jazz.com.pk',
  'shaukatkhanum.org.pk',
  'chughtailab.com',
  'kravemart.com.pk',
  'daraz.pk',
  'pakwheels.com',
  'zameen.com',
  'rozee.pk',
  'mustakbil.com',
  'careem.com',
  'albaraka.com.pk',
  'habibbank.com',
  'hbl.com',
  'sapphireonline.pk',
  'khaadi.com',
  'gulahmedshop.com',
  'servis.com',
  'jdot.com',
  'chenone.com',
  'habitt.com',
  'interwood.pk',
  'nishatmillsltd.com',
  'crescent.com.pk',
  'imtiaz.com.pk',
  'naheed.pk',
  'alfatah.pk',
  // UAE
  'emaar.com',
  'damacproperties.com',
  'nakheel.com',
  'emirates.com',
  'dubaiholding.com',
  'asterdmhealthcare.com',
  'mediclinic.ae',
  'nMC.ae',
  'bayut.com',
  'propertyfinder.ae',
  'dubizzle.com',
  'alshaya.com',
  'chalhoubgroup.com',
  'al-futtaim.com',
  'alhabtoor.com',
  'sharafgroup.com',
  'landmarkgroup.com',
  'noon.com',
  // UK
  'harrods.com',
  'selfridges.com',
  'savills.com',
  'knightfrank.com',
  'foxtons.co.uk',
  'bupa.co.uk',
  'hcahealthcare.co.uk',
  'dentalsurgery.co.uk',
  'smilepod.co.uk',
  'barclays.co.uk',
  'monzo.com',
  'revolut.com',
  'deliveroo.co.uk',
  'asos.com',
  'boohoo.com',
  'gymshark.com',
  // US
  'shopify.com',
  'stripe.com',
  'hubspot.com',
  'salesforce.com',
  'webflow.com',
  'fiverr.com',
  'upwork.com',
  'freelancer.com',
  'toptal.com',
  'wellfound.com',
  'remoteok.com',
  'weworkremotely.com',
  'dribbble.com',
  'behance.net',
  'medium.com',
  'techstars.com',
  'ycombinator.com',
];

async function testMx() {
  console.log(`Checking ${candidateDomains.length} candidate domains...`);
  for (const d of candidateDomains) {
    try {
      const mx = await dns.resolveMx(d);
      if (mx && mx.length > 0) {
        console.log(`[VALID] ${d} -> ${mx[0].exchange}`);
      }
    } catch (e) {
      console.log(`[INVALID] ${d}: ${e.code}`);
    }
  }
}

testMx();
