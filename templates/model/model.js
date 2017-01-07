var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var <%= modelNameUCase %>Schema = new Schema({
    active: { type: Boolean, default: true },
    deleted: { type: Boolean, select: false, default: false }
});

module.exports = mongoose.model("<%= modelNameUCase %>", <%= modelNameUCase %>Schema);