var forms          = require('express').Router();
var single         = require('./single');
var all            = require('./all');
var create         = require('./create');
var save           = require('./save');
var deleteTemplate = require('./delete');
var formList       = require('./formList');

forms.get('/', all);
forms.get('/search/:formId', single);
forms.get('/formList', formList);
forms.post('/', create);
forms.put('/', save);
forms.delete('/:_id', deleteTemplate);

module.exports = forms;