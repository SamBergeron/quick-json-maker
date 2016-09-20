var fs = require('fs');

var Maker = function (input, output) {
  this.inputFile = input;
  this.outputFile = output;
  this.data = undefined;
  this.jsonObj = undefined;
};

Maker.prototype.read = function () {
  fs.readFile(inputFile, function(err, data) {
    if(err) {
      console.log('There was an error trying to read the input file');
      process.exit(1);
    } else {
      this.data = data;
    }
  });
};

Maker.prototype.write = function () {
  var writeData = this.jsonObj.toString();
  fs.writeFileSync(this.inputFile, writeData);
};

module.exports = Maker;
