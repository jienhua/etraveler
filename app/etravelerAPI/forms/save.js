var formTemplate = require('../../models/formTemplate');

module.exports = (req, res) =>{

	formTemplate.findOneAndUpdate(
		{"_id": req.body._id},
		req.body,
		(err, data)=>{
			if(err)
				res.send(err);
			res.json({message: 'form updated!'});
		});

}