var formTemplates = require('../../models/formTemplate');

module.exports = (req, res) => {

	formTemplates.find({}, (err, data) => {
		if(err)
			res.send(err);
		res.json(data);
	});
};