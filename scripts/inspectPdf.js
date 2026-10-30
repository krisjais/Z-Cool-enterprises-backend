const fs = require('fs');
const zlib = require('zlib');

const pdfPath = 'C:\\Users\\AFFAN KHAN\\Downloads\\Danfoss-product-details-2026-10-28.pdf';
const buf = fs.readFileSync(pdfPath);
console.log('PDF file size:', buf.length);

// Extract text streams
let foundTexts = [];
let offset = 0;
while (offset < buf.length) {
  const streamStart = buf.indexOf('stream', offset);
  if (streamStart === -1) break;
  const streamEnd = buf.indexOf('endstream', streamStart);
  if (streamEnd === -1) break;

  // Find start of data (skip newline)
  let dataStart = streamStart + 6;
  if (buf[dataStart] === 0x0d && buf[dataStart + 1] === 0x0a) dataStart += 2;
  else if (buf[dataStart] === 0x0a || buf[dataStart] === 0x0d) dataStart += 1;

  let dataEnd = streamEnd;
  if (buf[dataEnd - 1] === 0x0a) dataEnd--;
  if (buf[dataEnd - 1] === 0x0d) dataEnd--;

  const slice = buf.subarray(dataStart, dataEnd);
  try {
    const inflated = zlib.inflateSync(slice);
    const str = inflated.toString('utf8');
    // Extract strings in parenthesis: ( ... )
    const matches = str.match(/\(([^)]+)\)/g);
    if (matches) {
      foundTexts.push(matches.map(m => m.slice(1, -1)).join(' '));
    }
  } catch (e) {
    // Might not be flate or might be image
  }

  offset = streamEnd + 9;
}

console.log('Found text stream chunks:', foundTexts.length);
if (foundTexts.length > 0) {
  console.log('Sample text stream output:');
  console.log(foundTexts.slice(0, 5).join('\n---\n'));
}
