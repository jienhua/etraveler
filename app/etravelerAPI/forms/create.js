var formTemplate = require('../../models/formTemplate');

module.exports = (req, res) => {

	formTemplate.create(req.body);

	res.status(200).json(req.body);
};