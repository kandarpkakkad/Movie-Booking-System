const express = require('express');
const Poster = require('../models/poster')
const Movie = require('../models/movie')

const movieRouter = express.Router();

movieRouter.use(express.json());

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}

movieRouter.get('/:movie/', isLoggedIn, (req, res) => {
	Movie.find({name: req.params.movie}).then(
		(movies) => {
			if (movies.length !== 0) {
				res.render("movie_page", { person: req.user, movie: movies[0] });
			}
			else {
				res.redirect("/");
			}
		}
	).catch(
		(err) => { throw err }
	)
});

module.exports = movieRouter;