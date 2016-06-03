var travelers  = require('express').Router();
var create     = require('./create');
var single     = require('./single');
var searchLike = require('./searchLike');
var save       = require('./save');

travelers.post('/', create);
travelers.get('/searchLike/:sn', searchLike);
travelers.get('/', single);
travelers.put('/', save);

module.exports = travelers;