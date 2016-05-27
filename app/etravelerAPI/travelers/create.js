var Traveler = require('../../models/traveler');

module.exports = (req, res) => {

	Traveler.create(req.body);
	//console.log(JSON.stringify(req.body));
	res.status(200).json(req.body);
};