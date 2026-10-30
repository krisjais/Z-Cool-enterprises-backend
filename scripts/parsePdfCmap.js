const fs = require('fs');

function extractPdfSpecs(pdfPath) {
  const buf = fs.readFileSync(pdfPath);
  const content = buf.toString('latin1');

  // 1. Split by endobj to isolate each PDF object cleanly
  const objBlocks = content.split('endobj');
  const cmaps = {};
  const fontToCmapObj = {};

  for (const b of objBlocks) {
    const m = b.match(/(\d+)\s+0\s+obj/);
    if (!m) continue;
    const objNum = m[1];

    // Check if it is a CMap object
    if (b.includes('begincmap')) {
      const map = {};
      // Parse beginbfchar
      const bfcharRegex = /beginbfchar([\s\S]*?)endbfchar/g;
      let bfcMatch;
      while ((bfcMatch = bfcharRegex.exec(b)) !== null) {
        const lines = bfcMatch[1].trim().split('\n');
        for (const line of lines) {
          const parts = line.trim().match(/<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>/);
          if (parts) {
            const srcCode = parts[1].toLowerCase().padStart(4, '0');
            const charCode = parseInt(parts[2], 16);
            map[srcCode] = String.fromCharCode(charCode);
          }
        }
      }

      // Parse beginbfrange
      const bfrangeRegex = /beginbfrange([\s\S]*?)endbfrange/g;
      let bfrMatch;
      while ((bfrMatch = bfrangeRegex.exec(b)) !== null) {
        const lines = bfrMatch[1].trim().split('\n');
        for (const line of lines) {
          const parts = line.trim().match(/<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>/);
          if (parts) {
            const start = parseInt(parts[1], 16);
            const end = parseInt(parts[2], 16);
            const target = parseInt(parts[3], 16);
            for (let c = start; c <= end; c++) {
              const srcCode = c.toString(16).toLowerCase().padStart(4, '0');
              map[srcCode] = String.fromCharCode(target + (c - start));
            }
          }
        }
      }
      cmaps[objNum] = map;
    }

    // Check if it is a Font object with /ToUnicode
    const u = b.match(/\/ToUnicode\s+(\d+)\s+0\s+R/);
    if (u) {
      fontToCmapObj[objNum] = u[1];
    }
  }

  // 2. Find Page resources font aliases: /Font << ... >>
  const fontAliases = {};
  const fontResIdx = content.lastIndexOf('/Font <<');
  if (fontResIdx !== -1) {
    const end = content.indexOf('>>', fontResIdx);
    const fontResBlock = content.slice(fontResIdx, end);
    const aliasRegex = /\/([A-Za-z0-9_]+)\s+(\d+)\s+0\s+R/g;
    let aMatch;
    while ((aMatch = aliasRegex.exec(fontResBlock)) !== null) {
      const alias = aMatch[1];
      const fontObjNum = aMatch[2];
      const cmapNum = fontToCmapObj[fontObjNum];
      if (cmapNum && cmaps[cmapNum]) {
        fontAliases[alias] = cmaps[cmapNum];
      }
    }
  }

  // 3. Extract text tokens using font aliases
  const lines = [];
  let currentFont = null;
  const tokenRegex = /\/([A-Za-z0-9_]+)\s+[\d.]+\s+Tf|<([0-9a-fA-F]+)>\s*Tj/g;
  let tMatch;
  while ((tMatch = tokenRegex.exec(content)) !== null) {
    if (tMatch[1]) {
      currentFont = tMatch[1];
    } else if (tMatch[2]) {
      const hex = tMatch[2];
      const cmap = fontAliases[currentFont] || {};
      let decoded = '';
      for (let i = 0; i < hex.length; i += 4) {
        const code = hex.slice(i, i + 4).toLowerCase().padStart(4, '0');
        if (currentFont === 'F18' || currentFont === 'F4') {
          // Icons font: external link or symbol
          decoded += '';
        } else {
          decoded += cmap[code] || '?';
        }
      }
      if (decoded.trim()) {
        lines.push(decoded.trim());
      }
    }
  }

  return {
    lines,
    fontAliasesCount: Object.keys(fontAliases).length,
    cmapsCount: Object.keys(cmaps).length,
  };
}

module.exports = { extractPdfSpecs };

if (require.main === module) {
  const parsed = extractPdfSpecs('C:\\Users\\AFFAN KHAN\\Downloads\\Danfoss-product-details-2026-10-28.pdf');
  console.log('Font aliases resolved:', parsed.fontAliasesCount);
  console.log('CMaps resolved:', parsed.cmapsCount);
  console.log('Extracted lines count:', parsed.lines.length);
  console.log('\n--- EXTRACTED SPECIFICATIONS & TEXT ---');
  parsed.lines.forEach((l, idx) => console.log(`${idx}: ${l}`));
}
