const mongoose = require('mongoose');

const posterSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    img_path: {
        type: String,
        require: true
    }
}, {
    timestamps: true
});

const Poster = mongoose.model("Poster", posterSchema);

module.exports = Poster;