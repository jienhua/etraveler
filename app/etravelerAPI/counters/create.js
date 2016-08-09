var Counter = require('../../models/counters');

module.exports = (req, res) =>{

	Counter.create(req.body, (err, data) =>{
		if(err){
			res.send(err);
		}else{
			res.status(200).json(data);
		}
	});
};