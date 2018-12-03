var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    email: {type: String, default: ""},
    isAdmin: {type: Boolean, default: false},
    isHeadAdmin: {type: Boolean, default: false}
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);