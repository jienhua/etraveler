// grab the mongoose module
var mongoose = require('mongoose');

// define our nerd model
// module.exports allows us to pass this to other files with it is called
module.exports = mongoose.model('Nerd', {
	name:{
		type: String,
		default: ''
	}
});