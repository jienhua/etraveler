var routes    = require('express').Router();
var docNums   = require('./docNums');
var travelers = require('./travelers');
var forms     = require('./forms');
var counters  = require('./counters');

routes.get('/', (req, res) => {
	res.status(200).json({message: 'connected!'});
});

routes.use('/docNums', docNums);
routes.use('/forms', forms);
routes.use('/traveler', travelers);
routes.use('/counter', counters);

module.exports = routes;