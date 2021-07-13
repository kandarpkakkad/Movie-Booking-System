const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    first_name: {
        type: String,
        require: true
    },
    last_name: {
        type: String,
        require: true
    },
    city: {
        type: String,
        require: true
    },
    bdate: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        require: true
    }
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;