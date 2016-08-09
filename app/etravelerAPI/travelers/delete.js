var Traveler = require('../../models/traveler');

module.exports = (req, res) => {
	// console.log(123213);
	// console.log(req.params._id);
	Traveler.remove({"_id":req.params._id}, (err, data) =>{

		if(err){
			res.send(err);
		}else{
			res.json({message:'delted!'});
		}
	});

};