var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var feedSchema = Schema({}, {strict: false});

module.exports = mongoose.model('docNum', feedSchema);