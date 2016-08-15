var traveler = require('../../models/traveler');

module.exports = (req, res) =>{

	var type = req.query.type;
	var query = {};
	var selectInput = req.query.select;
	var select = {};
	// console.log(typeof req.query.data);
	if(type === 'itemRecord.docNum'){
		query["itemRecord.docNum"] = req.query.data;
	}else if(type==='itemRecord.docNumId'){
		query["itemRecord.docNumId"] = req.query.data;
	}
	else{
		query[type] = req.query.data;
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