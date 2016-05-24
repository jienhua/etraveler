var forms = require('express').Router();
var all = require('./all');

forms.get('/', all);

module.exports = forms;