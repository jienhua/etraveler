var travelers  = require('express').Router();
var create     = require('./create');
var single     = require('./single');
var searchLike = require('./searchLike');

travelers.post('/', create);
travelers.get('/searchLike/:sn', searchLike);
travelers.get('/', single);

module.exports = travelers;