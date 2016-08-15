var Traveler = require('../../models/traveler');

module.exports = (req, res) => {

	var id = req.body._id;
	delete req.body._id;
	Traveler.findOneAndUpdate(
		{"_id":id},
		req.body,
		(err, data)=>{
			if(err){
				res.send(err);
			}else{
				res.json({message: 'form updated!'});
			}
		});
};	