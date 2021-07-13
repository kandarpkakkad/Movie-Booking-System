const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    name: { type: String, require: true },
    back_path: { type: String, require: true },
    img_path: { type: String, require: true },
    rating: { type: Number, require: true, min: 0, max: 100 },
    duration: { type: String, require: true },
    release_date: { type: String, require: true },
    languages: [{ type: String, trim: true }],
    genre: [{ type: String, trim: true }],
    votes: { type: String, require: true },
    synopsis: [{ type: String, trim: true }],
    cast: [{
        name: { type: String, require: true },
        profession: { type: String, require: true },
        role: { type: String, require: true },
        img_path: { type: String, require: true }
    }],
    crew: [{
        name: { type: String, require: true },
        role: [{ type: String }],
        img_path: { type: String, require: true }
    }],
    adult: { type: Boolean, require: true }
}, {
    timestamps: true
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;