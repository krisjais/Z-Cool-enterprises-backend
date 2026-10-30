const http = require('http');

http.get('http://localhost:3000/products', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Contains SM110S4EA:', data.includes('SM110S4EA'));
    console.log('Contains danfoss-sm110s4ea:', data.includes('danfoss-sm110s4ea'));
    console.log('Contains Copeland:', data.includes('Copeland'));
    const matches = data.match(/href="\/products\/[^"]+"/g);
    console.log('First 10 product hrefs on page:');
    if (matches) {
      console.log([...new Set(matches)].slice(0, 10));
    }
  });
}).on('error', err => console.log('Error:', err.message));
