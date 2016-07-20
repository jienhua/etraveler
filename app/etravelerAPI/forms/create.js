var formTemplate = require('../../models/formTemplate');

module.exports = (req, res) => {

	formTemplate.create(req.body, (err, data)=>{
		if(err){
			res.send(err);
		}
		res.status(200).json(data);
	});

};