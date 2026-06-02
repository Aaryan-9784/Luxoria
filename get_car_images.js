const fs = require('fs');

async function getImageUrl(query) {
  try {
    const res = await fetch(`https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=1&page=1`);
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    }
  } catch (e) {
    console.error("Failed for", query, e.message);
  }
  return null;
}

const cars = [
  'Rolls Royce Phantom',
  'Bentley Flying Spur',
  'Mercedes Benz S Class',
  'Porsche Taycan Turbo S',
  'Tesla Model S Plaid',
  'Lucid Air',
  'Aston Martin Valkyrie',
  'McLaren P1',
  'Ferrari LaFerrari',
  'Koenigsegg Jesko',
  'Pagani Huayra',
  'Maserati MC20'
];

async function main() {
  for (const car of cars) {
    const url = await getImageUrl(car);
    console.log(`${car}: ${url}`);
  }
}

main();
