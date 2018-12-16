const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

const crewSchema = new Schema({
    name: String,
    scoreId: String,
});

module.exports= mongoose.model("Crew",crewSchema);