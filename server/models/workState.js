const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

const workStateSchema = new Schema({
    name: String,
});

module.exports= mongoose.model("WorkState",workStateSchema);