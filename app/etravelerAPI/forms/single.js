// const data = require('../../../formData.json');
var formTemplates = require('../../models/formTemplate');

module.exports = (req, res) => {
	// const forms = data;
	var formId = req.params.formId;

	formTemplates.findOne({'_id': formId}, (err,data)=>{
		if(err)
			res.send(err);
		res.json(data);
	});
	
	// res.status(200).json({forms});
};