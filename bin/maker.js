'use strict'
const fs = require('fs');
const rl = require('readline');

class JsonNode {
  constructor (data, depth, parentNode, parentKey, isArray) {
    this.data = data;
    this.depth = depth;
    this.parentNode = parentNode === undefined ? {} : parentNode;
    this.parentKey = parentKey === undefined ? '' : parentKey;
    this.isArray = isArray ? true : false;
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
      let writeData = JSON.stringify(this.root.data, null, 4);
      if(this.outputFile === undefined)
        this.outputFile = 'results.json';
      fs.writeFileSync(this.outputFile, writeData);
    }

    parse (line) {
      // If it's an empty line
      if (line.trim().length === 0) {
        if(this.workingNode.isArray) {
          // Push the object into the parent array
          let pKey = this.workingNode.parentKey;
          this.workingNode.parentNode.data[pKey].push(this.workingNode.data);

          // Reset the child
          let temp = this.workingNode;
          this.workingNode = new JsonNode({}, temp.depth, temp.parentNode, pKey, true);
          this.workingNode.isArray = true;
        }
      // Every other line
      } else {
        // Use double dots (:) as a delimiter
        let index = line.indexOf(':');

        // : at the end is a new object
        if(index === line.length - 1 || line.indexOf('[]') === line.length - 2) {
          let key = line.substring(0, index).trim();
          let tempNode = this.workingNode;

          this.workingNode = new JsonNode({}, tempNode.depth + 1, tempNode);
          this.workingNode.parentNode.data[key] = this.workingNode.data;

          if(line.indexOf('[]') === line.length - 2) {
              this.workingNode.isArray = true;
              this.workingNode.parentKey = key;
              this.workingNode.parentNode.data[key] = [];
          }

        } else if (index !== -1) {  // Otherwise we parse a key:value
          // Check if line has a tab
          if(line.lastIndexOf('\t') !== this.workingNode.depth) {
            // Back up to the correct depth
            let depthDiff = this.workingNode.depth - line.lastIndexOf('\t');
            for (let i=0; i < depthDiff; i++) {
              this.workingNode = this.workingNode.parentNode;
            }
          }
          this.parsePair(line, this.workingNode.data, index);
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
    }
}

module.exports = Maker;
