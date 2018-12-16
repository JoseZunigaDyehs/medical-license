const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    age: Number,
    crewId: String,
    scoreId: String,
    worksId: Array
});

module.exports= mongoose.model("User",userSchema);