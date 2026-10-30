const fs = require('fs');

const stepFile = 'C:/Users/AFFAN KHAN/.gemini/antigravity-ide/brain/19ebe0e8-b5dc-4bac-bbb5-5d5aa6b35f15/.system_generated/steps/1066/content.md';
if (fs.existsSync(stepFile)) {
  const content = fs.readFileSync(stepFile, 'utf8');
  const m = content.match(/https:\/\/[^\s"'<>]+\.(?:jpeg|jpg|png|webp)/gi);
  console.log('Images in step file:', Array.from(new Set(m || [])));
}
