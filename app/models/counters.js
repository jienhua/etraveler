var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var feedSchema = new Schema({}, {strict: false});

module.exports = mongoose.model('counter', feedSchema);