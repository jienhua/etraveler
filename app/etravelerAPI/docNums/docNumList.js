var docNum = require('../../models/docNum');

module.exports = (req, res) =>{

	docNum.find({"templateID":req.params._id}, {}, (err, data)=>{
		if(err)
			res.send(err);
		res.json(data);
	});
};