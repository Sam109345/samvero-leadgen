const fs = require('fs');
const dns = require('dns').promises;

// Load mock-data.ts
const content = fs.readFileSync('./src/lib/mock-data.ts', 'utf8');

// Parse lead objects roughly
const leadBlocks = content.split(/\{\s*id:\s*['"]/g).slice(1);
console.log(`Parsed ${leadBlocks.length} lead blocks`);

leadBlocks.forEach((block, idx) => {
  const idMatch = block.match(/^([^'"]+)/);
  const titleMatch = block.match(/title:\s*['"]([^'"]+)['"]/);
  const emailMatch = block.match(/email:\s*['"]([^'"]+)['"]/);
  const phoneMatch = block.match(/phone:\s*['"]([^'"]+)['"]/);
  const platformMatch = block.match(/platform:\s*['"]([^'"]+)['"]/);
  const countryMatch = block.match(/country:\s*['"]([^'"]+)['"]/);

  const id = idMatch ? idMatch[1] : `lead-${idx}`;
  const title = titleMatch ? titleMatch[1] : '';
  const email = emailMatch ? emailMatch[1] : '';
  const phone = phoneMatch ? phoneMatch[1] : '';
  const platform = platformMatch ? platformMatch[1] : '';
  const country = countryMatch ? countryMatch[1] : '';

  console.log(`${idx + 1}. [${id}] [${platform}] [${country}] ${title} -> Email: ${email} | Phone: ${phone}`);
});
