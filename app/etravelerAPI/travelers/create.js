var Traveler = require('../../models/traveler');

module.exports = (req, res) => {

	Traveler.create(req.body, (err, data)=>{
		if(err)
			res.send(err);

		res.status(200).json(data);
		
	});

};