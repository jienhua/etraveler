var docNum = require('../../models/docNum');

module.exports = (req, res) =>{

	var type = req.query.type;
	var query = {};
	query[type] = req.query.data;

	docNum.findOne(query, (err, data)=>{
		if(err)
			res.send(err);
		res.json(data);
	})

};