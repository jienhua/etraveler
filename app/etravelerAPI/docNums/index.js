var docNums      = require('express').Router();
var create       = require('./create');
var docNumList   = require('./docNumList');
var edit         = require('./edit');
var searchSingle = require('./searchSingle');

docNums.post('/', create);
docNums.get('/searchSingle', searchSingle);
docNums.get('/:_id', docNumList);
docNums.put('/', edit);

module.exports = docNums;