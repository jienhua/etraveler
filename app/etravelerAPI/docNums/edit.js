var docNum = require('../../models/docNum');

module.exports = (req, res) =>{

	var id = req.body._id;
	delete req.body._id;
	docNum.findOneAndUpdate(
		{"_id":id},
		req.body,
		(err, data)=>{
			if(err)
				res.send(err);
			res.json({message:'updated!'})
		});
};