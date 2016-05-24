const data = require('../../../formData.json');

module.exports = (req, res) => {
	const forms = data;

	res.status(200).json({forms});
};