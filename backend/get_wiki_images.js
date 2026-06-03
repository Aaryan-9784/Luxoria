const cars = [
  'Rolls-Royce Phantom',
  'Bentley Flying Spur',
  'Mercedes-Benz S-Class',
  'Porsche Taycan',
  'Tesla Model S',
  'Lucid Air',
  'Aston Martin Valkyrie',
  'McLaren P1',
  'Ferrari LaFerrari',
  'Koenigsegg Jesko',
  'Pagani Huayra'
];

async function getWikiImage(carName) {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(carName)}&prop=pageimages&format=json&pithumbsize=1000`;
    const response = await fetch(searchUrl);
    const data = await response.json();
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    if (pageId !== '-1' && pages[pageId].thumbnail) {
      return pages[pageId].thumbnail.source;
    }
    return null;
  } catch (error) {
    return null;
  }
}

async function main() {
  for (const car of cars) {
    const url = await getWikiImage(car);
    console.log(`${car}: ${url || 'Not Found'}`);
  }
}

main();
