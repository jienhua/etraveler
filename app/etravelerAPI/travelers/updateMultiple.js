var Traveler = require('../../models/traveler');

module.exports = (req, res) => {

	delete req.body.travelerData._id;
	Traveler.update(
		{_id:{"$in":req.body.idList}},
		req.body.travelerData,
		{multi:true},
		(err, data)=>{
			if(err){
				res.send(err);
			}else{
				res.json(data);
			}
		}
	)
};	