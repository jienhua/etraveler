var docNums    = require('express').Router();
var create     = require('./create');
var docNumList = require('./docNumList');

docNums.post('/', create);
docNums.get('/:_id', docNumList);
module.exports = docNums;