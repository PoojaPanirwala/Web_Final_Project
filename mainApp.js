/****************************************************************************** ***
* ITE5315 – Project
* I declare that this assignment is my own work in accordance with Humber Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students. *
* Group member Name: Pooja Panirwala, Malika Sachdeva 
* Student IDs: N01472903, N01472277 Date: 7-dec-2022 ****************************************************************************** ***/

var express = require('express');
var app = express();
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
var port = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({ 'extended': 'true' }));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

//localstorage
// var LocalStorage = require('node-localstorage').LocalStorage,
//     localStorage = new LocalStorage('./scratch');

var path = require('path');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

app.use(express.static(path.join(__dirname, 'public')));//defines absolute path to access static data
app.set('views', path.join(__dirname, 'views'));
app.set('images', path.join(__dirname, 'images'));
app.engine('.hbs', exphbs.engine({ extname: '.hbs', handlebars: allowInsecurePrototypeAccess(Handlebars), layoutsDir: path.join(app.get('views'), 'layouts') }));//set up the handlebars for the app 
app.set('view engine', 'hbs');

const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));

dotenv.config();

//establish connection with database and initialize the movie model
var db = require('./config/movieController');
db.initialize(process.env.CONNECTION_STRING);

//establish connection with database and initialize the user model
var userdb = require('./config/userController');

//----------User APIs-------------------------

app.get('/api', function (req, res) {
    res.render('login', { title: 'Login Page' });
})

app.post('/api', function (req, res) {
    userdb.login(req.body).then(function (result) {
        res.status(200);
        if (result == "success") {
            res.redirect('/api/movies');
        }
        else {
            res.render('login', { title: 'Login Page', error: result });
        }
    }).catch(function (err) {
        res.status(500);
        res.render('login', { title: 'Login Page', error: err });
    });
})

app.get('/api/register', function (req, res) {
    res.render('register', { title: 'Registration Page' });
})

app.post('/api/register', function (req, res) {
    userdb.register(req.body).then(function (result) {
        res.status(200);
        if (result == "success") {
            res.render('login', { title: 'Login Page', error: result });
        }
        else {
            res.render('register', { title: 'Registration Page', error: result });
        }
    }).catch(function (err) {
        res.status(500);
        res.render('register', { title: 'Registration Page', error: err });
    });
})

app.get('/api/search', function (req, res) {
    res.render('search', { title: 'Advanced Search Page' });
})

//----------Movie APIs-------------------------

// method to get all the movies from db according to page, perPage and title	
app.get('/api/movies', function (req, res) {
    //if (validateToken) {
    var perPage = req.body.perPage || 0;
    var page = req.body.page || 0;
    var _title = req.body.title;
    if (perPage == 0 && page == 0) {
        page = 0;
        perPage = 500;
    }
    if (_title) {
        if (_title.length > 0) {
            page = 0;
        }
    }
    else {
        _title = "";
    }
    db.getAllMovies(page, perPage, _title).then(function (result) {
        res.status(200);
        res.render('index', { title: 'Index Page', data: result });
    }).catch(function (err) {
        res.status(500);
        res.render('index', { title: 'Index Page', error: err });
    });
    //}
});

app.post('/api/movies', function (req, res) {
    //if (validateToken) {
    var perPage = req.body.perPage || 0;
    var page = req.body.page || 0;
    var _title = req.body.title;
    if (perPage == 0 && page == 0) {
        page = 0;
        perPage = 500;
    }
    if (_title) {
        if (_title.length > 0) {
            page = 0;
        }
    }
    else {
        _title = "";
    }
    db.getAllMovies(page, perPage, _title).then(function (result) {
        res.status(200);
        res.render('index', { title: 'Index Page', data: result });
    }).catch(function (err) {
        res.status(500);
        res.render('index', { title: 'Index Page', error: err });
    });
    //}
});

// method to add a new movie
app.post('/api/createmovies', function (req, res) {
    db.addNewMovie(req.body).then(function (result) {
        res.status(200);
        res.send(result);
    }).catch(function (err) {
        res.status(500);
        res.send(err);
    });
});

app.get('/api/movies/:movie_id', function (req, res) {
    //validateToken();
    // to get the id from req params as id is object type
    var id = req.params.movie_id;
    db.getMovieById(id).then(function (result) {
        res.status(200);
        console.log(result);
        res.send(result);
    }).catch(function (err) {
        console.log(err);
        res.status(500);
        res.send(err);
    });
});

// to update a movie
// working well
app.put('/api/movies/:movie_id', function (req, res) {
    //validateToken();
    let id = req.params.movie_id;
    db.updateMovieById(req.body, id).then(function (result) {
        res.status(200);
        res.send(result);
    }).catch(function (err) {
        res.status(500);
        res.send(err);
    });
});

// to get the id from req params as id is object type
app.delete('/api/movies/:movie_id', function (req, res) {
    //validateToken();
    let id = req.params.movie_id;
    db.deleteMovieById(id).then(function (result) {
        res.status(200);
        res.send(result);
    }).catch(function (err) {
        res.status(500);
        res.send(err);
    });
});

// form to 
app.use(express.urlencoded({ extended: true }));

app.listen(port);
console.log("App listening on port : " + port);

// function validateToken() {
//     const token = localStorage.getItem("token");

//     if (token) {
//         jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
//             if (err) {
//                 return false;
//             } else {
//                 return true;
//             }
//         })
//     } else {
//         return false;
//     }
// }
