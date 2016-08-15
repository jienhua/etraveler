var docNum = require('../../models/docNum');

module.exports = (req, res) => {

	// console.log(req.body);
	docNum.create(req.body, (err, data) =>{
		if(err){
			res.send(err);
		}else{
			res.status(200).json(data);
		}	
	})
};