var forms          = require('express').Router();
var single         = require('./single');
var all            = require('./all');
var create         = require('./create');
var save           = require('./save');
var deleteTemplate = require('./delete');

forms.get('/', all);
forms.get('/:formId', single);
forms.post('/', create);
forms.put('/', save);
forms.delete('/:_id', deleteTemplate);

module.exports = forms;