var travelers = require('express').Router();
var create = require('./create');
var search = require('./search');

travelers.post('/', create);
travelers.get('/search/:sn', search);

module.exports = travelers;