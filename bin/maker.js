'use strict'
const fs = require('fs');
const rl = require('readline');

class JsonNode {
  constructor (data, depth) {
    this.data = data;
    this.parentNode = {};
    this.parentKey = '';
    this.depth = depth;
    this.isArray = false;
  }
}

class Maker {
    constructor (input, output) {
      this.inputFile = input;
      this.outputFile = output;
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
        this.outputFile = 'results.json';
      fs.writeFileSync(this.outputFile, writeData);
    }

    parse (line) {

      if (line.trim().length === 0) { // If it's an empty line
        if(this.workingNode.isArray) {
          // Push the object into the parent array
          let pKey = this.workingNode.parentKey;
          this.workingNode.parentNode.data[pKey].push(this.workingNode.data);

          // Reset the child
          let temp = this.workingNode;
          this.workingNode = new JsonNode({}, temp.depth);
          this.workingNode.isArray = true;
          this.workingNode.parentNode = temp.parentNode;
          this.workingNode.parentKey = pKey;
        }
      } else {
        // Use double dots (:) as a delimiter
        let index = line.indexOf(':');

        // : at the end is a new object
        if(index === line.length - 1 || line.indexOf('[]') === line.length - 2) {
          let key = line.substring(0, index).trim();
          let tempNode = this.workingNode;

          this.workingNode = new JsonNode({}, tempNode.depth + 1);
          this.workingNode.parentNode = tempNode;
          this.workingNode.parentNode.data[key] = this.workingNode.data;

          if(line.indexOf('[]') === line.length - 2) {
              this.workingNode.isArray = true;
              this.workingNode.parentKey = key;
              this.workingNode.parentNode.data[key] = [];
          }

        } else if (index !== -1) {  // Otherwise we parse a key:value
          // Check if line has a tab
          if(line.lastIndexOf('\t') === this.workingNode.depth)
            this.parsePair(line, this.workingNode.data, index);
          else {
            this.parsePair(line, this.workingNode.parentNode.data, index);
            this.workingNode = this.workingNode.parentNode;
          }
        }
      }
    }

    parsePair (line, object, index) {
      let key = line.substring(0, index).trim();
      let value = line.substring(index + 1, line.length).trim();

      if(value === 'true') { value = true; }
      else if(value === 'false') { value = false; }
      else if(!isNaN(value)) { value = Number.parseFloat(value); }

      object[key] = value;
      //console.log(key + ":" + value);
    }

}

module.exports = Maker;
