'use strict';const jsonMaker=require('./maker.js');var input=process.argv[2],out=process.argv[3],maker=new jsonMaker(input,out);maker.read(()=>{maker.write()});