const express = require('express');

const successRouter = express.Router();

successRouter.use(express.json());

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}

successRouter.post('/success', isLoggedIn, (req, res) => {
    res.render("success", { person: req.user });
});

module.exports = successRouter;