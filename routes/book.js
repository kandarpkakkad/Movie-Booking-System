const express = require('express');
const Poster = require('../models/poster')
const Movie = require('../models/movie')

const bookRouter = express.Router();

bookRouter.use(express.json());

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}

bookRouter.get('/book/:movie', isLoggedIn, (req, res) => {
    if(req.params.movie !== "logo.png"){
        Movie.find({name: req.params.movie}).then( 
            (movies) => {
                res.render("book", { person: req.user, movie: movies[0] });
            }
        ).catch(
            (err) => { throw err; }
        );
    }
});

module.exports = bookRouter;