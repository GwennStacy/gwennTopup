const fs = require('fs');
const txt = fs.readFileSync('d:\\Topup\\GwennnTopup\\g2bulk_curl.html', 'utf16le');
const matches = txt.match(/https:\/\/api\.g2bulk\.com[^\s\'\"<]+/g) || [];
console.log([...new Set(matches)]);
