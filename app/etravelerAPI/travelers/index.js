var travelers      = require('express').Router();
var create         = require('./create');
var single         = require('./single');
var searchLike     = require('./searchLike');
var save           = require('./save');
var deleteTraveler = require('./delete'); 
var normalSearch   = require('./normalSearch');
var updateMultiple = require('./updateMultiple');


travelers.post('/', create);
travelers.get('/normalSearch', normalSearch);
travelers.get('/searchLike/:sn', searchLike);
travelers.get('/', single);
travelers.put('/', save);
travelers.put('/updateMultiple',updateMultiple);
travelers.post('/deleteTraveler', deleteTraveler);

module.exports = travelers;