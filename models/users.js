var mongoose = require('mongoose');
var Schema = mongoose.Schema;
UserSchema = new Schema({
    "firstname": "String",
    "lastname": "String",
    "email": "String",
    "password": "String",
    "token": "String"
});
module.exports = mongoose.model('myUsers', UserSchema);