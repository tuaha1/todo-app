const mongoose = require("mongoose");

mongoose.connect("mongodb://admin:iqYz3AisJWlkDZVQ@ac-rgymney-shard-00-00.inyokaa.mongodb.net:27017,ac-rgymney-shard-00-01.inyokaa.mongodb.net:27017,ac-rgymney-shard-00-02.inyokaa.mongodb.net:27017/?ssl=true&replicaSet=atlas-1hq1nv-shard-0&authSource=admin&retryWrites=true&w=majority")

const itemSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, require: true },
    userID: { type: String, require: true }
})

module.exports = mongoose.model("todoItem", itemSchema);