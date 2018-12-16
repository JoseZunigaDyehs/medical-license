const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

const workSchema = new Schema({
    name: String,
    createdDate: String,
    workStateId: String,
    doneDate: String
});

module.exports= mongoose.model("Work",workSchema);