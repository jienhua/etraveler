var Traveler = require('../../models/traveler');

module.exports = (req, res) => {

	var _id = req.query._id;
	
	if(_id === 'new'){
		res.json({});
	}else{
		Traveler.findOne({"_id": _id}, (err, data) => {

			if(err)
				res.send(err);
			
			res.json(data);
			
		});
	}
};