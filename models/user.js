var mongoose = require("mongoose");
var PassportLocalMongoose = require("passport-local-mongoose");


var userSchema = new mongoose.Schema({
    username:String,
    password:String
});

userSchema.plugin(PassportLocalMongoose);

module.exports = mongoose.model("User",userSchema);
