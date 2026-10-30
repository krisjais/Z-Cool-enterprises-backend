const fs = require('fs');

async function fetchListing(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const html = await res.text();
    const m = html.match(/https:\/\/[^\s"'<>]+\.(?:jpeg|jpg|png|webp)/gi);
    const imgs = Array.from(new Set(m || [])).filter(x => 
      !x.includes('template-mdc') && 
      !x.includes('favicon') && 
      !x.includes('imLogo') &&
      !x.includes('google')
    );
    console.log(`Images for ${url}:`, imgs);
    return imgs;
  } catch (err) {
    console.error('Fetch error:', err.message);
    return [];
  }
}

async function main() {
  await fetchListing('https://www.indiamart.com/proddetail/ate690-highly-rotary-compressor-2858985028812.html');
}

main();
