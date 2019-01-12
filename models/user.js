var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    email: {type: String, default: "", unique: true},
    isAdmin: {type: Boolean, default: false},
    isHeadAdmin: {type: Boolean, default: false},
    resetPasswordToken: {type: String},
    resetPasswordExpires: {type: Date}
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);