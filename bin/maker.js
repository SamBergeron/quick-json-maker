'use strict'
const fs = require('fs');
const rl = require('readline');

class Maker {
    constructor (input, output) {
      this.inputFile = input;
      this.outputFile = output;
      this.data = '';
      this.jsonObj = {};

      this.depth = -1;
      this.workingObject = this.jsonObj;
      this.parentObject = null;
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

      // Following lines will form new object
      let index = line.indexOf(':');
      if(index === line.length - 1) {
        let newObjKey = this.parseSubObject(line);
        this.parentObject = this.workingObject;
        this.workingObject = this.workingObject[newObjKey];
        this.depth++;
      }

      // Do we have a double dot in the line?
      else if(index !== -1 && index !== line.length - 1) {
        console.log(this.parentObject);
        // Check if line has a tab
        if(line.lastIndexOf('\t') === this.depth)
          this.parsePair(line, this.workingObject);
        else {
          this.parsePair(line, this.parentObject);
          this.workingObject = this.parentObject;
          this.parentObject = null;
          this.depth--;
        }
      }

    }

    parseSubObject (line) {
      console.log('Parsing inner-object at line: ' + line);
      let index = line.indexOf(':');
      let key = line.substring(0, index).trim();
      console.log('Object key is: ' + key);
      this.jsonObj[key] = {};
      return key;
    }

    parsePair (line, object) {
      let index = line.indexOf(':');
      let key = line.substring(0, index).trim();
      let value = line.substring(index + 1, line.length).trim();

      if(value === 'true') { value = true; }
      if(value === 'false') { value = false; }
      // Not that strict number parsing
      let num = Number.parseFloat(value);
      if(!Number.isNaN(num)) { value = num; }

      // console.log(key + ':' + value);
      object[key] = value;
    }

}

module.exports = Maker;
