var docNum = require('../../models/docNum');

module.exports = (req, res) =>{

	docNum.find({"formId":req.params._id}, {}, (err, data)=>{
		if(err){
			res.send(err);
		}else{
			res.json(data);
		}
	});
};