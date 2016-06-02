var Traveler = require('../../models/traveler');

module.exports = (req, res) => {

	//console.log(JSON.stringify(req.body));
	var sn = req.params.sn.toString();
	Traveler.find({"sn": new RegExp('^'+sn)}, (err, data)=>{
		if (err) 
			res.send(err);

		res.json(data);
	});

};