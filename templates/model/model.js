var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var <%= modelNameUCase %>Schema = new Schema({
    
});

module.exports = mongoose.model("<%= modelNameUCase %>", <%= modelNameUCase %>Schema);