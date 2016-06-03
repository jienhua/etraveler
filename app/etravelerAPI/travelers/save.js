var Traveler = require('../../models/traveler');

module.exports = (req, res) => {

	console.log(req.body._id);
	// Traveler.find({"_id":req.body._id})
	// 		.limit(1)
	// 		.exec((err, data) => {

	// 			// already exist
	// 			if(data.length){

	// 				data = req.body;

	// 				data.save((err)=>{
	// 					if(err)
	// 						res.send(err);
	// 					res.json({message: 'from updated!'});
	// 				});
	// 			}else{

	// 			}
	// });
	Traveler.findOneAndUpdate(
		{"_id":req.body._id},
		req.body,
		(err, data)=>{
			if(err)
				res.send(err);
			res.json({message: 'form updated!', data: data});
		});

};	