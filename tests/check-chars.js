const fs = require('fs');
const content = fs.readFileSync('src/components/leads/LeadManagementView.tsx', 'utf8');
const lines = content.split('\n');
for (let i = 285; i < 296; i++) {
  const line = lines[i];
  console.log(`Line ${i + 1}: length=${line.length}`);
  for (let j = 0; j < Math.min(line.length, 30); j++) {
    process.stdout.write(`[${line.charCodeAt(j)}]${line[j]} `);
  }
  console.log('\n');
}
