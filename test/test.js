'use strict'
const jsonMaker = require('../bin/maker.js');


var input = process.argv[2];
var out = process.argv[3];

var maker = new jsonMaker(input, out);
maker.read(() => {
  maker.write();
});
