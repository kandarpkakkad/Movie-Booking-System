const express = require('express');
const Poster = require('../models/poster')
const Movie = require('../models/movie')

const homeRouter = express.Router();

homeRouter.use(express.json());

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}

homeRouter.get('/', isLoggedIn, (req, res) => {
	Movie.find({}).then(
		(movies) => {
			Poster.find({}).then(
				(posters) => {
					res.render("home", { person: req.user, movie_cards: movies, movie_posters: posters });
				}
			).catch(
				(err) => { throw err }
			)
		}
	).catch(
		(err) => { throw err }
	)
    
});

module.exports = homeRouter;