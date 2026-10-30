const fs = require('fs');

function parseCSV(text) {
  if (text.charCodeAt(0) === 0xFEFF) {
    text = text.slice(1);
  }

  const rows = [];
  let currentRow = [];
  let currentField = '';
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentField);
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentField);
      if (currentRow.length > 1 || (currentRow.length === 1 && currentRow[0] !== '')) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }

  if (currentField !== '' || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  const headers = rows[0].map(h => h.trim());
  const data = rows.slice(1).map((row, rowIdx) => {
    const obj = {};
    headers.forEach((h, colIdx) => {
      obj[h] = row[colIdx] !== undefined ? row[colIdx] : '';
    });
    return obj;
  });

  return { headers, data };
}

module.exports = { parseCSV };

if (require.main === module) {
  const csvPath = 'C:/Users/AFFAN KHAN/Downloads/dataset_indiamart-scraper_2026-10-28_13-14-51-097.csv';
  const raw = fs.readFileSync(csvPath, 'utf8');
  const { headers, data } = parseCSV(raw);
  
  fs.writeFileSync('scripts/parsed_rows_raw.json', JSON.stringify(data, null, 2));
  console.log('Saved', data.length, 'parsed rows to scripts/parsed_rows_raw.json');
}
