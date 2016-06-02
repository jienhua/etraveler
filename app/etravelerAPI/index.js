var routes    = require('express').Router();

var travelers = require('./travelers');
var forms     = require('./forms');

routes.get('/', (req, res) => {
	res.status(200).json({message: 'connected!'});
});

routes.use('/forms', forms);
routes.use('/traveler', travelers);

module.exports = routes;