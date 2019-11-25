var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var path = require("path");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use('/css', express.static('css'));
app.use('/html', express.static('html'));
app.use('/images',express.static('images'));
app.use('/swiper',express.static('swiper'));
app.use('/js',express.static('js'));
app.use('/icons', express.static('icons'));

//app.use(express.static("/logo"));

var person_name;
var seats_booked = 0;

mongoose.connect("mongodb://localhost/tickets");

var poster_schema = new mongoose.Schema({
    name: String,
    img_path: String
});

var movies_schema = new mongoose.Schema({
    name: String,
    back_path: String,
    img_path: String,
    rating: Number,
    duration: String,
    release_date: String,
    languages: [String],
    genre: [String],
    votes: String,
    synopsis: [String],
    cast: [{name: String, proffession: String, role: String, img_path: String}],
    crew: [{name: String, role: [String], img_path: String}],
    adult: Boolean,
});

var user_schema = new mongoose.Schema({
    fname: String,
    lname: String,
    email: String,
    city: String,
    dbate: Date,
    pwd: String,
    gender: String
});

var errors = null;

var movie = mongoose.model("movie", movies_schema);
var poster = mongoose.model("poster", poster_schema);
var user = mongoose.model("user", user_schema);

var login = 0;

/*poster.create({
    name: "Housefull 4",
    img_path: "https://in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/housefull-4-et00064161-27-10-2017-02-08-55.jpg"
});*/


/*movie.create({
    name: "Terminator: Dark Fate",
    back_path: "https://specials-images.forbesimg.com/imageserve/5daf89a2fc85aa0007a45c1c/960x0.jpg?",
    img_path: "https://in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/terminator-et00090177-05-12-2018-02-35-26.jpg",
    rating: 78,
    duration: "2 hrs 08 mins",
    release_date: "01 November, 2019",
    languages: ["English"," Hindi", "Kannada"," Tamil"," Telugu"," Malayalam"],
    genre: ["Action","Sci-fi","Thriller"],
    votes: "30,991",
    synopsis: ["In Mexico City, a newly modified liquid Terminator -- the Rev-9 model -- arrives from the future to kill a young factory worker named Dani Ramos. Also sent back in time is Grace, a hybrid cyborg human who must protect Ramos from the seemingly indestructible robotic assassin. But the two women soon find some much-needed help from a pair of unexpected allies -- seasoned warrior Sarah Connor and the T-800 Terminator."],
    cast: [
        {name: "Arnold Schwarzenegger",proffession: "Actor",role: "As Terminator",img_path: "https://assets.londonist.com/uploads/2014/09/i333/arnold-schwarzenegger-official-pic-1.jpeg"},
        {name: "Linda Hamilton",proffession: "Actress",role: "As Sarah Connor",img_path: "http://7wallpapers.net/wp-content/uploads/4_Linda-Hamilton.jpg"},
        {name: "Mackenzie Davis",proffession: "Actress",role: "As Grace",img_path: "https://celebmafia.com/wp-content/uploads/2015/01/mackenzie-davis-halt-and-catch-fire-panel-tca-press-tour-in-pasadena_1.jpg"},
        {name: "Diego Boneta",proffession: "Actor",role: "As Maguel Ramos",img_path: "https://www.theplace2.ru/cache/archive/diego_boneta/img/1_(5)(58)-gthumb-gwdata1200-ghdata1200-gfitdatamax.jpg"},
        {name: "Edward Forlong",proffession: "Actor",role: "As John Connor",img_path: "https://i.pinimg.com/236x/35/16/d3/3516d3997bb08995a71d5da1f568eb30--edward-furlong-character-ideas.jpg"},
        {name: "Steven Cree",proffession: "Actor",role: "As Rigby",img_path: "https://m.media-amazon.com/images/M/MV5BMjI1MzI2NDM5NV5BMl5BanBnXkFtZTgwMDkwOTg2NTE@._V1_SY1000_CR0,0,666,1000_AL_.jpg"}
    ],
    crew: [
        {name: "Tim Miller",role: ["Director"],img_path: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Tim_Miller_by_Gage_Skidmore_2.jpg"},
        {name: "James Cameron",role: ["Producer,Writer"],img_path: "https://media.vanityfair.com/photos/5a15cfcf1310ef0d93e09716/1:1/w_1462,h_1462,c_limit/james-cameron-embed.jpg"},
        {name: "David Ellison",role: ["Producer"],img_path: "http://www1.pictures.zimbio.com/gi/David+Ellison+Premiere+Paramount+Pictures+Y9asnbVhNPIl.jpg"},
        {name: "Junkie XL",role: ["Musician"],img_path: "http://images.fandango.com/ImageRenderer/0/0/redesign/static/img/default_poster.png/0/images/masterrepository/performer%20images/p241146/JunkieXL.jpg"}
    ],
    adult: false
});*/

app.get("/", function (req, res) {
    console.log("Title Page");
    movie.find({},function(err, movie) {
        if (err) {
            console.log(err);
        }
        else {
            poster.find({}, function (err, poster) {
                if(err){
                    console.log(err)
                }
                else {
                    login = 0;
                    res.render("tickets", {movie_posters: poster, movie_cards: movie});
                }
            });
        }
    });
});

app.get("/success", function (req, res) {
    if(login === 1){
        res.render("success", {person: person_name});
    }
    else {
        res.render("login_signup");
    }
});

app.get("/payment", function (req, res) {
    if(login === 1){
        res.render("payment", {person: person_name});
    }
    else {
        res.render("login_signup");
    }
});

app.get("/about", function(req, res) {
    res.render("about");
});

app.get("/contact", function (req, res) {
    res.render("contact");
});

app.get("/tos", function (req, res) {
    res.render("tos");
});

app.get("/privacy", function (req, res) {
    res.render("privacy");
});

app.get("/forgotpassword", function (req, res) {
    res.render("forgotpassword");
});

app.get("/login_signup", function (req, res) {
    console.log("Sign Up Page");
    res.render("login_signup", {su_error: errors});
});

app.get('/logo/logo.png', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'logo', 'logo.png'));
});

app.get("/book/:movie", function (req, res) {
    console.log(req.params.movie);
    if(login === 1){
        if(req.params.movie !== "logo.png"){
            movie.find({name: req.params.movie}, function (err, movie) {
                if(err){
                    console.log(err);
                }
                else{
                    res.render("book", {person: person_name, movie: movie[0]});
                }
            });
        }
    }
    else {
        res.render("login_signup");
    }
});

app.get("/home", function (req, res) {
    console.log("Home Page");
    if(login === 1){
        movie.find({},function(err, movie) {
            if (err) {
                console.log(err);
            }
            else {
                poster.find({}, function (err, poster) {
                    if(err){
                        console.log(err)
                    }
                    else {
                        res.render("home", { person: person_name, movie_posters: poster, movie_cards: movie});
                    }
                });
            }
        });
    }
    else {
        res.render("login_signup");
    }
});

app.get("/home/:movie", function (req, res) {
    console.log("Page of " + req.params.movie);
    movie.find({name: req.params.movie},function(err, movie) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("movie_page", {person: person_name, movie: movie[0]});
        }
    });
});

app.get("/:movie", function (req, res) {
    if(login === 1){
        movie.find({name: req.params.movie},function(err, movie) {
            if (err) {
                console.log(err);
            }
            else {
                res.render("movie_page", {movie: movie[0]});
            }
        });
    }
    else {
        res.render("login_signup");
    }
    console.log("Page of " + req.params.movie);
});

app.post("/signup", function(req, res){
    console.log("Posted to signup");
    var d = req.body.bdate;
    d = new Date(d);
    user.find({email: req.body.email}, function(err, usr){
        if(err){
            console.log("ERROR");
        }
        else{
            if(usr.length > 0){
                console.log(usr);
                console.log(req.body);
                errors = "Email is already in use.";

                res.redirect("/login_signup");
            }
            else{
                if(req.body.pwd === req.body.rpwd){
                    user.create({
                        fname: req.body.fname,
                        lname: req.body.lname,
                        email: req.body.email,
                        city: req.body.city,
                        bdate: d,
                        pwd: req.body.pwd,
                        gender: req.body.gender
                    });
                    movie.find({},function(err, movie) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            poster.find({}, function (err, poster) {
                                if(err){
                                    console.log(err)
                                }
                                else {
                                    login = 1;
                                    person_name=req.body;
                                    res.render("home", {person: req.body, movie_posters: poster, movie_cards: movie});
                                }
                            });
                        }
                    });
                }
                else {
                    res.redirect("/login_signup");
                }
            }
        }
    });
});

app.post("/pmt", function (req, res) {
    if(login === 1){
        res.render("payment", {person: person_name});
    }
    else{
        res.render("login_signup");
    }
});

app.post("/success", function (req, res) {
    res.redirect("/success");
});

app.post("/login", function(req, res){
    user.find({$and: [{email: req.body.si_email}, {pwd: req.body.si_pwd}]}, function (err, persons) {
        if(err){
            console.log("ERROR1");
            console.log(err);
        }
        else{
            if(persons.length > 0){
                movie.find({},function(err, movie) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        poster.find({}, function (err, poster) {
                            if(err){
                                console.log(err)
                            }
                            else {
                                login = 1;
                                person_name = persons[0];
                                res.render("home", {person: persons[0], movie_posters: poster, movie_cards: movie});
                            }
                        });
                    }
                });
            }
            else {
                res.render("login_signup");
            }
        }
    });
});

app.listen(3000, process.env.IP, function () {
    console.log("Local server started");
});