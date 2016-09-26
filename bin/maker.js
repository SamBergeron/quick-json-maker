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
      if(this.outputFile === undefined)
        this.outputFile = 'results.txt';
      fs.writeFileSync(this.outputFile, writeData);
    }

    parse (line) {
      // Each line we have 3 possibilities key:value key:object key:array
      // Use double dots (:) as a delimiter
      line.trim();

      // Do we have a double dot in the line?
      let index = line.indexOf(':');
      if(index !== -1 && index !== line.length - 1) {
        this.parsePair(line);
      }


    }

    parsePair (line) {
      let index = line.indexOf(':');
      let key = line.substring(0, index).trim();
      let value = line.substring(index + 1, line.length).trim();

      if(value === 'true') { value = true; }
      if(value === 'false') { value = false; }
      // Not that strict number parsing
      let num = Number.parseFloat(value);
      if(!Number.isNaN(num)) { value = num; }

      // console.log(key + ':' + value);
      this.jsonObj[key] = value;
    }

}

module.exports = Maker;
