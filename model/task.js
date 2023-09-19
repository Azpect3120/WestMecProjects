const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    task: String,
});

module.exports = mongoose.model("Task", taskSchema);