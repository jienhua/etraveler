var forms  = require('express').Router();
var single = require('./single');
var all    = require('./all');
var create = require('./create');

forms.get('/', all);
forms.get('/:formId', single);
forms.post('/', create);

module.exports = forms;