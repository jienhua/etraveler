var formTemplate = require('../../models/formTemplate');

module.exports = (req, res) =>{

	formTemplate.find({}, {formNo:1, formRev:1, isPublish:1}, (err, data) =>{
		if(err){
			console.log(err);
			res.send(err);
		}
		res.json(data);
	});
};