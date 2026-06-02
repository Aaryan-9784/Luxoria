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
  'Bugatti Chiron',
  'Rolls Royce Spectre',
  'Ferrari SF90 Stradale',
  'Lamborghini Revuelto',
  'Bentley Flying Spur',
  'Aston Martin DB12',
  'McLaren 750S',
  'Porsche 911 Turbo S',
  'Mercedes Maybach S680',
  'BMW XM',
  'Range Rover SV',
  'Maserati MC20'
];

async function main() {
  for (const car of cars) {
    const url = await getImageUrl(car);
    console.log(`${car}: ${url}`);
  }
}

main();
