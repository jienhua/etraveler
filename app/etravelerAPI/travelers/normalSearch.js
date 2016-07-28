var traveler = require('../../models/traveler');

module.exports = (req, res) =>{

	var type = req.query.type;
	var query = {};
	console.log(typeof req.query.data);
	if(type === 'docNum'){
		console.log(1);
		query["itemRecord.docNum"] = req.query.data;
	}else{
		console.log(2);
		query[type] = req.query.data;
	}
	
	traveler.find(query,(err, data)=>{
		if(err){
			res.send(err);
		}
		res.json(data);
	});
};