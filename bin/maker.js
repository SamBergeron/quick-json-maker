'use strict'
const fs = require('fs');
const rl = require('readline');

class JsonNode {
  constructor (data, depth) {
    if(data !== null)
      this.data = data;
    else this.data = null;

    this.parentNode = {};
    this.depth = depth;
  }
}

class Maker {
    constructor (input, output) {
      this.inputFile = input;
      this.outputFile = output;
      this.data = '';
      this.root = new JsonNode({}, -1);
      this.workingNode = this.root;
    }

    read (cb) {
      let lineReader = rl.createInterface({input: fs.createReadStream(this.inputFile)});
      lineReader.on('line', (line) => {
        this.parse(line);
      });
      lineReader.on('close', cb);
    }

    write () {
      let writeData = JSON.stringify(this.root.data, null, 2);
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
        let key = this.parseSubObject(line);
        let tempNode = this.workingNode;
        this.workingNode = new JsonNode({}, tempNode.depth + 1)
        this.workingNode.parentNode = tempNode;
        this.workingNode.parentNode.data[key] = this.workingNode.data;
      }

      // Do we have a double dot in the line?
      else if(index !== -1 && index !== line.length - 1) {
        console.log(this.workingNode.parentNode.data);
        // Check if line has a tab
        console.log(line.lastIndexOf('\t') + ' == ' + this.workingNode.depth);
        if(line.lastIndexOf('\t') === this.workingNode.depth)
          this.parsePair(line, this.workingNode.data);
        else {
          this.parsePair(line, this.workingNode.parentNode.data);
          this.workingNode = this.workingNode.parentNode;
        }
      }

    }

    parseSubObject (line) {
      console.log('Parsing inner-object at line: ' + line);
      let index = line.indexOf(':');
      let key = line.substring(0, index).trim();
      console.log('Object key is: ' + key);
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
