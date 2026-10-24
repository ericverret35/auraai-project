import fs from 'fs';
const state = JSON.parse(fs.readFileSync('./auto-finance-state.json', 'utf-8'));
console.log(state.logs.slice(0, 3));
