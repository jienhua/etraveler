var formTemplate = require('../../models/formTemplate');

module.exports = (req, res) =>{

	formTemplate.remove({"_id": req.params._id}, (err, data)=>{
		if(err){
			res.send(err);
		}else{
			res.json({message:'deleted'});
		}
	});
};