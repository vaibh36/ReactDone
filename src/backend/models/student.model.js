var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var studentSchema = new Schema({

    FirstName: String,
    LastName: String,
    Email: { type: String, unique: true, required: true },
    Password: String,
    tuitors:  [{ type: String }],


},{ collection: 'students' });

studentSchema.plugin(uniqueValidator)
var studentinfo = mongoose.model('StudentInfo', studentSchema);

module.exports = studentinfo;