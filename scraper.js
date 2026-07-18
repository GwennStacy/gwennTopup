const fs = require('fs');

fetch('https://api.g2bulk.com/')
  .then(res => res.text())
  .then(html => {
    // Find lines with endpoint paths
    const regex = /<span class="path">([^<]+)<\/span>/g;
    let match;
    console.log("Endpoints found:");
    while ((match = regex.exec(html)) !== null) {
      console.log(match[1]);
    }
  })
  .catch(err => console.error(err));
