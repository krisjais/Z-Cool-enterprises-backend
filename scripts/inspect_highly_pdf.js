const fs = require('fs');
const zlib = require('zlib');

const pdfPath = 'temp_images/Highly_rotary_compressor_catalogue.pdf';
if (!fs.existsSync(pdfPath)) {
  console.log('PDF not found:', pdfPath);
  process.exit(1);
}

const buf = fs.readFileSync(pdfPath);
console.log('PDF size:', buf.length, 'bytes');

// Check uncompressed strings first
const raw = buf.toString('latin1');
const rawMatches = raw.match(/ATE[0-9A-Za-z_-]+/gi);
console.log('Raw ATE matches:', [...new Set(rawMatches || [])]);

// Check compressed streams
let decompressedCount = 0;
let allText = '';
let offset = 0;
while (offset < buf.length) {
  const streamStart = buf.indexOf('stream', offset);
  if (streamStart === -1) break;
  const streamEnd = buf.indexOf('endstream', streamStart);
  if (streamEnd === -1) break;

  let dataStart = streamStart + 6;
  if (buf[dataStart] === 0x0d && buf[dataStart + 1] === 0x0a) dataStart += 2;
  else if (buf[dataStart] === 0x0a || buf[dataStart] === 0x0d) dataStart += 1;

  let dataEnd = streamEnd;
  if (buf[dataEnd - 1] === 0x0a) dataEnd--;
  if (buf[dataEnd - 1] === 0x0d) dataEnd--;

  const slice = buf.subarray(dataStart, dataEnd);
  try {
    const inflated = zlib.inflateSync(slice);
    decompressedCount++;
    allText += ' ' + inflated.toString('latin1');
  } catch (e) {
    // skip non-zlib streams
  }

  offset = streamEnd + 9;
}

console.log('Decompressed streams:', decompressedCount);
console.log('Total decompressed text length:', allText.length);

const ateDecomp = allText.match(/ATE[0-9A-Za-z_-]+/gi);
console.log('Decompressed ATE matches:', [...new Set(ateDecomp || [])]);

const matches690 = allText.match(/.{0,50}(?:690|ATE690|TE690).{0,50}/gi);
console.log('Matches around 690:');
(matches690 || []).slice(0, 15).forEach((m, i) => console.log(`${i}: ${m.trim()}`));

// Check title/catalogue names
const titleMatches = allText.match(/.{0,30}(?:Highly|Rotary|Compressor|Series).{0,30}/gi);
console.log('Title snippets:');
(titleMatches || []).slice(0, 10).forEach((m, i) => console.log(`${i}: ${m.trim()}`));
