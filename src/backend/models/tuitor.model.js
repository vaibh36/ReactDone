var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var tuitorSchema = new Schema({

        FirstName: String,
        LastName: String,
        Email: { type: String, unique: true, required: true },
        Phonenumber: Number,
        Password: String,
        Subject: String,
        Gender: String,
        FavouriteCount: {type: Number, default: 0},
        State: String,
        City: String,
        Places: [{ type: String }],
        Students: [{ type: String}],
        resetPasswordToken:String,
        resetPasswordExpires: Date




}, { collection: 'tuitorinfos' });

tuitorSchema.plugin(uniqueValidator)
var tuitorinfo = mongoose.model('TuitorInfo', tuitorSchema);

module.exports = tuitorinfo;