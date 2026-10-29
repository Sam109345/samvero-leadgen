const fs = require('fs');
const dns = require('dns').promises;

// Curated verified domains with live MX records matching mock-data.ts
const verifiedMap = {
  // Pakistan
  'pk-gmb-101': { domain: 'stile.com.pk', email: 'info@stile.com.pk', website: 'https://stile.com.pk', phone: '+92 21 111 000 375', whatsapp: '922111000375' },
  'pk-gmb-102': { domain: 'alfatah.pk', email: 'info@alfatah.pk', website: 'https://alfatah.pk', phone: '+92 42 111 253 282', whatsapp: '9242111253282' },
  'pk-gmb-103': { domain: 'riaabarkergillette.com', email: 'islamabad@riaabg.com', website: 'https://riaabarkergillette.com', phone: '+92 51 281 4050', whatsapp: '92512814050' },
  'pk-job-104': { domain: 'daraz.pk', email: 'customer.pk@care.daraz.com', website: 'https://daraz.pk', phone: '+92 21 111 132 729', whatsapp: '9221111132729' },
  'pk-job-105': { domain: 'sapphireonline.pk', email: 'wecare@sapphireonline.pk', website: 'https://sapphireonline.pk', phone: '+92 42 111 738 245', whatsapp: '9242111738245' },
  'tru-job-510': { domain: 'crescent.com.pk', email: 'info@crescent.com.pk', website: 'https://crescent.com.pk', phone: '+92 41 878 0121', whatsapp: '92418780121' },
  'mst-job-548': { domain: 'sapphiremills.com', email: 'wecare@sapphireonline.pk', website: 'https://sapphiremills.com', phone: '+92 42 111 738 245', whatsapp: '9242111738245' },
  'roz-job-513': { domain: 'rozee.pk', email: 'support@rozee.pk', website: 'https://rozee.pk', phone: '+92 42 111 769 332', whatsapp: '9242111769332' },
  'wp-job-601': { domain: 'khaadi.com', email: 'customercare@khaadi.com', website: 'https://khaadi.com', phone: '+92 21 111 542 234', whatsapp: '922111542234' },
  'meta-job-701': { domain: 'gulahmedshop.com', email: 'complaints@gulahmedshop.com', website: 'https://gulahmedshop.com', phone: '+92 21 111 485 485', whatsapp: '9221111485485' },

  // UAE
  'uae-gmb-401': { domain: 'mediclinic.ae', email: 'info@mediclinic.ae', website: 'https://mediclinic.ae', phone: '+971 4 435 9999', whatsapp: '97144359999' },
  'uae-gmb-402': { domain: 'xclusiveyachts.com', email: 'charters@xclusiveyachts.com', website: 'https://xclusiveyachts.com', phone: '+971 4 457 3185', whatsapp: '97144573185' },
  'uae-gmb-403': { domain: 'noon.com', email: 'partnerships@noon.com', website: 'https://noon.com', phone: '+971 4 362 7000', whatsapp: '97143627000' },
  'uae-job-404': { domain: 'al-futtaim.com', email: 'contact@al-futtaim.com', website: 'https://al-futtaim.com', phone: '+971 4 208 5000', whatsapp: '97142085000' },
  'uae-job-405': { domain: 'chalhoubgroup.com', email: 'contact@chalhoubgroup.com', website: 'https://chalhoubgroup.com', phone: '+971 4 804 5000', whatsapp: '97148045000' },
  'uae-gmb-406': { domain: 'dubaiholding.com', email: 'contact@dubaiholding.com', website: 'https://dubaiholding.com', phone: '+971 4 362 2000', whatsapp: '97143622000' },
  'fl-job-502': { domain: 'propertyfinder.ae', email: 'info@propertyfinder.ae', website: 'https://propertyfinder.ae', phone: '+971 4 556 0300', whatsapp: '97145560300' },
  'guru-job-505': { domain: 'landmarkgroup.com', email: 'info@landmarkgroup.com', website: 'https://landmarkgroup.com', phone: '+971 4 517 4000', whatsapp: '97145174000' },
  'bh-job-508': { domain: 'emaar.com', email: 'enquiry@emaar.ae', website: 'https://emaar.com', phone: '+971 4 367 3333', whatsapp: '97143673333' },
  'bayt-job-514': { domain: 'bayut.com', email: 'support@bayut.com', website: 'https://bayut.com', phone: '+971 4 429 8888', whatsapp: '97144298888' },
  'dbz-job-515': { domain: 'dubizzle.com', email: 'support@dubizzle.com', website: 'https://dubizzle.com', phone: '+971 4 429 8888', whatsapp: '97144298888' },
  'dh-job-528': { domain: 'emirates.com', email: 'media.relations@emirates.com', website: 'https://emirates.com', phone: '+971 600 555 555', whatsapp: '971600555555' },
  'wnm-job-535': { domain: 'alshaya.com', email: 'info@alshaya.com', website: 'https://alshaya.com', phone: '+971 4 409 6000', whatsapp: '97144096000' },
  'nkg-job-549': { domain: 'damacproperties.com', email: 'customerrelations@damacproperties.com', website: 'https://damacproperties.com', phone: '+971 4 373 1000', whatsapp: '97143731000' },

  // UK
  'uk-gmb-301': { domain: 'smilepod.co.uk', email: 'info@smilepod.co.uk', website: 'https://smilepod.co.uk', phone: '+44 20 7836 6866', whatsapp: '442078366866' },
  'uk-job-302': { domain: 'monzo.com', email: 'help@monzo.com', website: 'https://monzo.com', phone: '+44 20 3872 0620', whatsapp: '442038720620' },
  'uk-job-303': { domain: 'cotswoldco.com', email: 'care@cotswoldco.com', website: 'https://cotswoldco.com', phone: '+44 333 200 1725', whatsapp: '443332001725' },
  'uk-job-304': { domain: 'savills.com', email: 'info@savills.com', website: 'https://savills.com', phone: '+44 20 7499 8644', whatsapp: '442074998644' },
  'fvr-job-501': { domain: 'pentagram.com', email: 'info@pentagram.com', website: 'https://pentagram.com', phone: '+44 20 7229 3477', whatsapp: '442072293477' },
  'pph-job-504': { domain: 'foxtons.co.uk', email: 'enquiries@foxtons.co.uk', website: 'https://foxtons.co.uk', phone: '+44 20 7893 6000', whatsapp: '442078936000' },
  'drb-job-507': { domain: 'harrods.com', email: 'customer.service@harrods.com', website: 'https://harrods.com', phone: '+44 20 7730 1234', whatsapp: '442077301234' },
  '99d-job-509': { domain: 'barclays.co.uk', email: 'wealth@barclays.com', website: 'https://barclays.co.uk', phone: '+44 20 7116 1000', whatsapp: '442071161000' },
  'cda-job-512': { domain: 'cambridge.org', email: 'information@cambridge.org', website: 'https://cambridge.org', phone: '+44 1223 358 331', whatsapp: '441223358331' },
  'dc-job-518': { domain: 'selfridges.com', email: 'customerservices@selfridges.com', website: 'https://selfridges.com', phone: '+44 20 7160 6222', whatsapp: '442071606222' },
  'myp-job-523': { domain: 'asos.com', email: 'press@asos.com', website: 'https://asos.com', phone: '+44 20 7756 1000', whatsapp: '442077561000' },
  'seo-job-526': { domain: 'deliveroo.co.uk', email: 'support@deliveroo.co.uk', website: 'https://deliveroo.co.uk', phone: '+44 20 3699 9977', whatsapp: '442036999977' },
  'crp-job-530': { domain: 'fosterandpartners.com', email: 'mail@fosterandpartners.com', website: 'https://fosterandpartners.com', phone: '+44 20 7738 0455', whatsapp: '442077380455' },
  'rmv-job-534': { domain: 'revolut.com', email: 'feedback@revolut.com', website: 'https://revolut.com', phone: '+44 20 3322 8352', whatsapp: '442033228352' },
  'jbl-job-537': { domain: 'knightfrank.com', email: 'enquiries@knightfrank.com', website: 'https://knightfrank.com', phone: '+44 20 7629 8171', whatsapp: '442076298171' },
  'ind-job-538': { domain: 'selfridges.com', email: 'customerservices@selfridges.com', website: 'https://selfridges.com', phone: '+44 20 7160 6222', whatsapp: '442071606222' },
  'smh-job-540': { domain: 'cliffordchance.com', email: 'info@cliffordchance.com', website: 'https://cliffordchance.com', phone: '+44 20 7006 1000', whatsapp: '442070061000' },
  'wph-job-541': { domain: 'boohooplc.com', email: 'corporate@boohoo.com', website: 'https://boohooplc.com', phone: '+44 161 236 5656', whatsapp: '441612365656' },
  'v12-job-545': { domain: 'bbc.co.uk', email: 'corporate.enquiries@bbc.co.uk', website: 'https://bbcstudios.com', phone: '+44 20 8743 8000', whatsapp: '442087438000' },
  'meta-job-704': { domain: 'bupa.co.uk', email: 'customerrelations@bupa.co.uk', website: 'https://bupa.co.uk', phone: '+44 345 609 0111', whatsapp: '443456090111' },

  // US & Global
  'us-gmb-201': { domain: 'austindentalcare.com', email: 'info@austindentalcare.com', website: 'https://austindentalcare.com', phone: '+1 512 377 9780', whatsapp: '15123779780' },
  'us-job-202': { domain: 'stripe.com', email: 'media@stripe.com', website: 'https://stripe.com', phone: '+1 888 926 2289', whatsapp: '18889262289' },
  'us-job-203': { domain: 'hubspot.com', email: 'info@hubspot.com', website: 'https://hubspot.com', phone: '+1 888 482 7768', whatsapp: '18884827768' },
  'us-gmb-204': { domain: 'interstateroof.com', email: 'info@interstateroof.com', website: 'https://interstateroof.com', phone: '+1 303 763 9114', whatsapp: '13037639114' },
  'cntr-job-503': { domain: 'rwguild.com', email: 'info@rwguild.com', website: 'https://rwguild.com', phone: '+1 212 852 9097', whatsapp: '12128529097' },
  'wlf-job-506': { domain: 'epic.com', email: 'info@epic.com', website: 'https://epic.com', phone: '+1 608 271 9000', whatsapp: '16082719000' },
  'top-job-511': { domain: 'cloudflare.com', email: 'info@cloudflare.com', website: 'https://cloudflare.com', phone: '+1 888 993 5273', whatsapp: '18889935273' },
  'thb-job-516': { domain: 'tesla.com', email: 'energysupport@tesla.com', website: 'https://tesla.com', phone: '+1 888 518 3752', whatsapp: '18885183752' },
  'wrk-job-517': { domain: 'loewe.com', email: 'clientservice@loewe.com', website: 'https://loewe.com', phone: '+34 91 577 6056', whatsapp: '34915776056' },
  'gun-job-519': { domain: 'citadelsecurities.com', email: 'media@citadelsecurities.com', website: 'https://citadelsecurities.com', phone: '+1 312 395 2100', whatsapp: '13123952100' },
  'arc-job-520': { domain: 'flexport.com', email: 'sales@flexport.com', website: 'https://flexport.com', phone: '+1 855 353 9872', whatsapp: '18553539872' },
  'lmn-job-521': { domain: 'illumina.com', email: 'info@illumina.com', website: 'https://illumina.com', phone: '+1 858 202 4500', whatsapp: '18582024500' },
  'btr-job-522': { domain: 'fastly.com', email: 'support@fastly.com', website: 'https://fastly.com', phone: '+1 844 432 7859', whatsapp: '18444327859' },
  'mkh-job-524': { domain: 'morningstar.com', email: 'support@morningstar.com', website: 'https://morningstar.com', phone: '+1 312 696 6000', whatsapp: '13126966000' },
  'lgt-job-525': { domain: 'semrush.com', email: 'mail@semrush.com', website: 'https://semrush.com', phone: '+1 800 815 9959', whatsapp: '18008159959' },
  'wwr-job-527': { domain: 'webflow.com', email: 'contact@webflow.com', website: 'https://webflow.com', phone: '+1 415 964 0555', whatsapp: '14159640555' },
  'wnw-job-529': { domain: 'figma.com', email: 'support@figma.com', website: 'https://figma.com', phone: '+1 800 344 6220', whatsapp: '18003446220' },
  'cor-job-531': { domain: 'postman.com', email: 'help@postman.com', website: 'https://postman.com', phone: '+1 415 655 1090', whatsapp: '14156551090' },
  'flx-job-532': { domain: 'datadoghq.com', email: 'info@datadoghq.com', website: 'https://datadoghq.com', phone: '+1 866 328 2364', whatsapp: '18663282364' },
  'rok-job-533': { domain: 'voxmedia.com', email: 'contact@voxmedia.com', website: 'https://voxmedia.com', phone: '+1 212 284 7500', whatsapp: '12122847500' },
  'dyn-job-536': { domain: 'insightpartners.com', email: 'contact@insightpartners.com', website: 'https://insightpartners.com', phone: '+1 212 230 9200', whatsapp: '12122309200' },
  'gld-job-539': { domain: 'digitalocean.com', email: 'contact@digitalocean.com', website: 'https://digitalocean.com', phone: '+1 646 397 8051', whatsapp: '16463978051' },
  'pbj-job-542': { domain: 'nature.com', email: 'nature@nature.com', website: 'https://nature.com', phone: '+1 212 726 9200', whatsapp: '12127269200' },
  'wac-job-543': { domain: 'biogen.com', email: 'investor.relations@biogen.com', website: 'https://biogen.com', phone: '+1 617 679 2000', whatsapp: '16176792000' },
  'voc-job-544': { domain: 'spotify.com', email: 'support@spotify.com', website: 'https://spotify.com', phone: '+1 917 565 3894', whatsapp: '19175653894' },
  'mlt-job-546': { domain: 'cartier.com', email: 'relationclientele@cartier.com', website: 'https://cartier.com', phone: '+33 1 42 18 43 83', whatsapp: '33142184383' },
  'tsr-job-547': { domain: 'taskrabbit.com', email: 'support@taskrabbit.com', website: 'https://taskrabbit.com', phone: '+1 844 340 8275', whatsapp: '18443408275' },
  'wp-job-603': { domain: 'wpengine.com', email: 'sales@wpengine.com', website: 'https://wpengine.com', phone: '+1 512 273 3145', whatsapp: '15122733145' },
  'meta-job-703': { domain: 'shopify.com', email: 'support@shopify.com', website: 'https://shopify.com', phone: '+1 888 746 7439', whatsapp: '18887467439' },
};

async function testAllMapped() {
  const keys = Object.keys(verifiedMap);
  console.log(`Testing all ${keys.length} mapped domains via DNS MX lookup...`);
  const uniqueDomains = Array.from(new Set(keys.map(k => verifiedMap[k].domain)));
  console.log(`Unique domains to check: ${uniqueDomains.length}`);

  let failed = 0;
  for (const d of uniqueDomains) {
    try {
      const mx = await dns.resolveMx(d);
      if (!mx || mx.length === 0) {
        console.error(`MX missing for: ${d}`);
        failed++;
      }
    } catch (e) {
      console.error(`DNS lookup failed for ${d}:`, e.code);
      failed++;
    }
  }

  if (failed === 0) {
    console.log(`SUCCESS! All ${uniqueDomains.length} unique domains have ACTIVE DNS MX records!`);
  } else {
    console.error(`${failed} domains failed.`);
  }
}

testAllMapped();
