'use strict'
const fs = require('fs');
const rl = require('readline');

class Maker {
    constructor (input, output) {
      this.inputFile = input;
      this.outputFile = output;
      this.data = '';
      this.jsonObj = {};
    }

    read (cb) {
      let lineReader = rl.createInterface({input: fs.createReadStream(this.inputFile)});
      lineReader.on('line', (line) => {
        this.parse(line);
      });
      lineReader.on('close', cb);
    }

    write () {
      let writeData = JSON.stringify(this.jsonObj);
      fs.writeFileSync(this.outputFile, writeData);
    }

    parse (line) {
      // Each line we have 3 possibilities key:value key:object key:array
      // Use double dots (:) as a delimiter
      line.trim();

      // Do we have a double dot in the line?
      if(line.indexOf(':') !== -1) {
        this.parseKeyValue(line);
      }
    }

    parseKeyValue (line) {
      let index = line.indexOf(':');
      let key = line.substring(0, index);
      let value = line.substring(index + 1, line.length);

      console.log(key + ' :' + value);
      this.jsonObj[key] = value;
    }

}

module.exports = Maker;
