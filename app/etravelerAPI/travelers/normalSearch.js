var traveler = require('../../models/traveler');

module.exports = (req, res) =>{

	var type = req.query.type;
	var query = {};
	console.log(typeof req.query.data);
	if(type === 'docNum'){
		query["itemRecord.docNum"] = req.query.data;
	}else{
		query[type] = req.query.data;
	}
	
	traveler.find(query,(err, data)=>{
		if(err){
			res.send(err);
		}
		res.json(data);
	});
};