const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const userRouter = express.Router();

userRouter.use(express.json());

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}

function isLoggedOut(req, res, next) {
	if (!req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
}

userRouter.get('/login', isLoggedOut, (req, res) => {
    res.render("login_signup");
});

userRouter.post('/login', isLoggedOut, passport.authenticate('local', {
	successRedirect: "/",
	failureRedirect: "/login",
}));

userRouter.post("/signup", isLoggedOut, async (req, res, next) => {
	const email = req.body.email;
	const password = req.body.pwd;
	const re_password = req.body.rpwd;
	const first_name = req.body.fname;
	const last_name = req.body.lname;
	const city = req.body.city;
	const bdate = req.body.bdate;
	const gender = req.body.gender;
	const exists = await User.exists({ email: email });
	if (exists) {
		res.redirect("/login");
		return;
	}

	if (password != re_password) {
		res.redirect("/login");
		return;
	}

	bcrypt.genSalt(10, (err, salt) => {
		if (err) {
			return next(err);
		}
		bcrypt.hash(password, salt, (error, hash) => {
			if (error) {
				return next(error);
			}
			const newUser = new User({
				email: email,
				password: hash,
				first_name: first_name,
				last_name: last_name,
				city: city,
				bdate: bdate,
				gender: gender
			});
			newUser.save();
			res.redirect("/login");
		});
	});
});

userRouter.get("/logout", isLoggedIn, (req, res, next) => {
	req.logout();
	res.redirect('/login');
});

module.exports = userRouter;