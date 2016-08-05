var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var feedSchema = new Schema({
	name: String,
	sequence_value: Number
});

module.exports = mongoose.model('docNum', feedSchema);