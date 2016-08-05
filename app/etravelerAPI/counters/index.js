var counter   		  = require('express').Router();
var create     		  = require('./create');
var nextSequenceValue = require('./nextSequenceValue');

counter.post('/create', create);
counter.post('/nextSequenceValue', nextSequenceValue);

module.exports = counter;