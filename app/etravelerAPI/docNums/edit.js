var docNum = require('../../models/docNum');


module.exports = (req, res) =>{

	var id = req.body._id;
	delete req.body._id;
	docNum.findOneAndUpdate(
		{"_id":id},
		req.body,
		(err, data)=>{
			if(err){
				console.log(err);
				res.send(err);
			}else{
				res.json(data);
			}
	});
};