const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

const scoreSchema = new Schema({
    value: Number,
    name: String,
});

module.exports= mongoose.model("Score",scoreSchema);