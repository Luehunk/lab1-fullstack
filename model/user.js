const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    ID: {
        type: String,
        min: 6,
        max: 100,
        required: true
    },
    firstName:{
        type: String,
        min: 3,
        max: 100,
        required: true
    },
    lastName: {
        type: String,
        min: 8,
        max: 100,
        required: true
    }
});

module.exports = mongoose.model("user", userSchema);