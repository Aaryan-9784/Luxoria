const https = require('https');
const fs = require('fs');

const cars = [
  'Bugatti Chiron',
  'Rolls-Royce Spectre',
  'Ferrari SF90 Stradale',
  'Lamborghini Revuelto',
  'Bentley Flying Spur',
  'Aston Martin DB12',
  'McLaren 750S',
  'Porsche 911 Turbo S',
  'Mercedes-Maybach S680',
  'BMW XM',
  'Range Rover SV',
  'Maserati MC20'
];

async function getWikiImage(query) {
  return new Promise((resolve) => {
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(query)}`;
    const options = {
      headers: {
        'User-Agent': 'CoolBot/1.0'
      }
    };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query.pages;
          const pageId = Object.keys(pages)[0];
          if (pages[pageId].original) {
            resolve(pages[pageId].original.source);
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function main() {
  const results = {};
  for (const car of cars) {
    const img = await getWikiImage(car);
    results[car] = img;
  }
  fs.writeFileSync('wiki_urls.json', JSON.stringify(results, null, 2));
}
main();
