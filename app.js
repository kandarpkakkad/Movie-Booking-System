const express = require('express');
const session = require('express-session');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const config = require('./config');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const homeRouter = require('./routes/home');
const userRouter = require('./routes/user');
const movieRouter = require('./routes/movie');
const bookRouter = require('./routes/book');
const paymentRouter = require('./routes/payment');
const winston = require('winston')

// Create app
const app = express();

// Database
mongoose.connect(
    config.mongo_url,
    { useNewUrlParser: true, useUnifiedTopology: true }
).then(
    () => console.log("Database connected...")
).catch(
    (err) => console.log(`Error: ${err}`)
);

// Logger
const myWinstonOptions = {
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: 'logs/info.log'
        }),
        new winston.transports.File({
            level: 'warn',
            filename: 'logs/warnings.log'
        }),
        new winston.transports.File({
            level: 'error',
            filename: 'logs/errors.log'
        })
    ],
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'MMM-DD-YYYY HH:mm:ss'
        }),
        winston.format.printf(info => `${[info.timestamp]}: ${info.level.toUpperCase()}: ${info.message}`),
    )
}
const logger = new winston.createLogger(myWinstonOptions)

function logRequest(req, res, next) {
    logger.info(req.url)
    next()
}
app.use(logRequest);

function logError(req, res, next) {
    logger.error(`Error occurred at URL: ${req.url}`);
    next()
}
app.use(logError);

// Middleware
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(session({
    secret: config.secret,
    maxAge: 36000000,
    resave: false,
    saveUninitialized: true,
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Passport
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(new localStrategy({ usernameField: "si_email", passwordField: "si_pwd"},  (si_email, si_pwd, done) => {
    User.findOne({ email: si_email }, (err, user) => {
        if (err) {
            return done(err, { error: err });
        }
        if (!user) {
            return done(null, false, { error: "Invalid email." });
        }
        bcrypt.compare(si_pwd, user.password, (error, res) => {
            if (error) {
                return done(error, { error: error});
            }
            if (res === false) {
                return done(null, false, { error: "Invalid password." });
            }
            return done(null, user);
        });
    });
}));

// Routes
app.use("/", userRouter);
app.use("/", homeRouter);
app.use("/", movieRouter);
app.use("/", bookRouter);
app.use('/', paymentRouter);

// Run app
app.listen(3000, () => {
    console.log("Listening on port 3000...");
});