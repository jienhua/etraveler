var Counter = require('../../models/counters');

module.exports = (req, res) =>{

	var name = req.body.name;
	Counter.findOneAndUpdate({"name":name},{$inc:{sequence_value:1}}, function(err, data){
		if(err){
			res.send(err);
		}else{
			res.status(200).json(data);
		}
	});
};