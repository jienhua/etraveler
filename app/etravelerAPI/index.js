var routes = require('express').Router();

var forms  = require('./forms');

routes.get('/', (req, res) => {
	res.status(200).json({message: 'connected!'});
});

routes.use('/forms', forms);

module.exports = routes;