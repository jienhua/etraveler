var traveler = require('../../models/traveler');

module.exports = (req, res) =>{

	var type = req.query.type.split('|');
	var data = req.query.data.split('|');
	var query = {};
	var selectInput = req.query.select;
	var select = {};
	// console.log(typeof req.query.data);
	for(var i = 0;i<type.length;i++){
		if(type[i] === 'itemRecord.docNum' || type[i]==='docNum'){
			query["itemRecord.docNum"] = data[i];
		}else if(type[i]==='itemRecord.docNumId'){
			query["itemRecord.docNumId"] = data[i]; 
		}
		else{
			query[type[i]] = data[i];
		}
	}

	if(selectInput !== ''){
	
		selectInput = selectInput.split('|');
		for(var i = 0;i < selectInput.length;i++){
			if(selectInput[i] === '_id'){
				select[selectInput[i]] = 0;
			}else{
				select[selectInput[i]] = 1;
			}
		}
	}
	traveler.find(query,select,(err, data)=>{
		if(err){
			res.send(err);
		}else{
			res.json(data);
		}
	});
};