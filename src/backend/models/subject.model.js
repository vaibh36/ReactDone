var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var subjectSchema = new Schema({
    Subject: String,
},{ collection: 'subjects' });

subjectSchema.plugin(uniqueValidator)
var subjectinfo = mongoose.model('SubjectInfo', subjectSchema);

module.exports = subjectinfo;