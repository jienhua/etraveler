var Traveler = require('../../models/traveler');

module.exports = (req, res) => {

	Traveler.findOneAndUpdate(
		{"_id":req.body._id},
		req.body,
		(err, data)=>{
			if(err)
				res.send(err);
			res.json({message: 'form updated!'});
		});

};	