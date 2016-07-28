var travelers      = require('express').Router();
var create         = require('./create');
var single         = require('./single');
var searchLike     = require('./searchLike');
var save           = require('./save');
var deleteTraveler = require('./delete'); 
var normalSearch   = require('./normalSearch');

travelers.post('/', create);
travelers.get('/normalSearch', normalSearch);
travelers.get('/searchLike/:sn', searchLike);
travelers.get('/', single);
travelers.put('/', save);
travelers.delete('/:_id', deleteTraveler);

module.exports = travelers;