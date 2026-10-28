const dns = require('dns').promises;

const testDomains = [
  // PK
  'alfatah.pk', 'habitt.com', 'crescent.com.pk', 'daraz.pk', 'pakwheels.com', 'rozee.pk',
  'mustakbil.com', 'careem.com', 'sapphireonline.pk', 'khaadi.com', 'gulahmedshop.com',
  'servis.com', 'jdot.com', 'chenone.com', 'chughtailab.com', 'shaukatkhanum.org.pk',
  'arbisoft.com', '10pearls.com', 'imtiaz.com.pk', 'naheed.pk', 'hbl.com',
  // UAE
  'mediclinic.ae', 'asterdmhealthcare.com', 'nmc.ae', 'dubaimarinayachts.ae', 'noon.com',
  'bayut.com', 'propertyfinder.ae', 'dubizzle.com', 'al-futtaim.com', 'emaar.com',
  'damacproperties.com', 'nakheel.com', 'chalhoubgroup.com', 'alshaya.com', 'dubaiholding.com',
  'emirates.com', 'landmarkgroup.com',
  // UK
  'smilepod.co.uk', 'bupa.co.uk', 'hcahealthcare.co.uk', 'monzo.com', 'revolut.com',
  'barclays.co.uk', 'cotswoldinteriors.co.uk', 'savills.com', 'knightfrank.com',
  'pixelcraftstudios.co.uk', 'foxtons.co.uk', 'harrods.com', 'selfridges.com',
  'cambridge.org', 'monolitharchitecture.co.uk', 'asos.com', 'boohoo.com', 'deliveroo.co.uk',
  'gymshark.com', 'cliffordchance.com', 'linklaters.com', 'bbc.co.uk',
  // US & Global
  'stripe.com', 'hubspot.com', 'salesforce.com', 'ycombinator.com', 'techstars.com',
  'centimark.com', 'gaf.com', 'epic.com', 'cloudflare.com', 'fastly.com',
  'digitalocean.com', 'tesla.com', 'sunrun.com', 'twosigma.com', 'citadel.com',
  'bloomberg.com', 'omniflowlogistics.com', 'illumina.com', 'synapsecoretech.com',
  'apexcapitallending.com', 'semrush.com', 'ahrefs.com', 'webflow.com', 'figma.com',
  'frontierdispatch.com', 'vanguardgrowthpartners.com', 'datadoghq.com', 'postman.com',
  'nature.com', 'mit.edu', 'helixtherapeutics.com', 'spotify.com', 'dolby.com',
  'maisonsainthonore.fr', 'taskrabbit.com', 'upwork.com', 'fiverr.com', 'freelancer.com',
  'toptal.com', 'wellfound.com', 'remoteok.com', 'weworkremotely.com', 'behance.net',
  'dribbble.com', 'contra.com', 'peopleperhour.com', 'guru.com', 'bark.com', 'thumbtack.com'
];

async function verifyAll() {
  console.log(`Verifying ${testDomains.length} domains...`);
  let validCount = 0;
  let invalid = [];

  for (const d of testDomains) {
    try {
      const mx = await dns.resolveMx(d);
      const valid = mx && mx.filter(m => m.exchange && m.exchange.trim().length > 0 && m.exchange !== '.');
      if (valid && valid.length > 0) {
        validCount++;
      } else {
        invalid.push(`${d} (Null MX record: ${JSON.stringify(mx)})`);
      }
    } catch (e) {
      invalid.push(`${d} (${e.code})`);
    }
  }

  console.log(`\nResults: ${validCount} / ${testDomains.length} VALID`);
  if (invalid.length > 0) {
    console.log('Invalid domains:', invalid);
  }
}

verifyAll();
