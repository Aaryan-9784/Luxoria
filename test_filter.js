import { vehicles } from './frontend/src/pages/public/components/collection/data.js';

let result = [...vehicles];

// Testing Limited Editions
let le = [...result].filter(v => v.category === 'Limited Editions');
console.log('Limited Editions:', le.length);

// Testing Supercars
let sc = [...result].filter(v => v.category === 'Supercars');
console.log('Supercars:', sc.length);

// Testing Luxury Sedans
let ls = [...result].filter(v => v.category === 'Luxury Sedans');
console.log('Luxury Sedans:', ls.length);

// Testing Electric Luxury
let el = [...result].filter(v => v.category === 'Electric Luxury');
console.log('Electric Luxury:', el.length);

// Testing SUVs
let suvs = [...result].filter(v => v.category === 'SUVs');
console.log('SUVs:', suvs.length);
