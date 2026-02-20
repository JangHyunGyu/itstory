const fs = require('fs'); const data = JSON.parse(fs.readFileSync('c:/workspace/itstory/extracted.json', 'utf8')); console.log(data.length);
