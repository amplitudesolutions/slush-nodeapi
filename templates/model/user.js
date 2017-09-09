var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: String,
    email: String,
    password: { type: String, select: false },
    active: { type: Boolean, default: true },
    deleted: { type: Boolean, select: false, default: false }
});

module.exports = mongoose.model("User", UserSchema);