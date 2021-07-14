const express = require('express');
const Poster = require('../models/poster')
const Movie = require('../models/movie')

const paymentRouter = express.Router();

paymentRouter.use(express.json());

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}

paymentRouter.post('/:movie/payment', isLoggedIn, (req, res) => {
    let seats = req.body.seats;
    seats = seats.split(",");
    let total = seats.length * 150;
    let internet_charges = 25.7;
    res.render("payment", { person: req.user, total_cost: total, internet_charges: internet_charges, seats: seats });
});

module.exports = paymentRouter;