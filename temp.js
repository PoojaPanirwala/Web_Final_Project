var express = require('express');
var app = express();
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
var port = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({ 'extended': 'true' }));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
var url = "mongodb+srv://root:secretpassword@cluster0.6bhud2z.mongodb.net/sample_mflix";

//establish connection with database and initialize the movie model
var db = require('./config/database1');
db.initialize(url);

// method to add a new movie
app.post('/api/movies', function (req, res) {
    db.addNewMovie(req.body).then(function (result) {
        res.status(200);
        res.send(result);
    }).catch(function (err) {
        res.status(500);
        res.send(err);
    });
});

// method to get all the movies from db according to page, perPage and title	
app.get('/api/movies', function (req, res) {
    var perPage = req.query.perPage || 0;
    var page = req.query.page || 0;
    var _title = req.query.title;

    if (_title.length > 0) {
        page = 0;
    }
    db.getAllMovies(page, perPage, _title).then(function (result) {
        res.status(200);
        res.send(result);
    }).catch(function (err) {
        res.status(500);
        res.send(err);
    });
});


app.get('/api/movies/:movie_id', function (req, res) {
    // to get the id from req params as id is object type
    var id = req.params.movie_id;
    db.getMovieById(id).then(function (result) {
        res.status(200);
        res.send(result);
    }).catch(function (err) {
        res.status(500);
        res.send(err);
    });
});

// to update a movie
// working well
app.put('/api/Movies/:movie_id', function (req, res) {
    // create mongose method to update an existing record into collection
    console.log(req.body);
    let id = req.params.movie_id;
    var data = {
        plot: req.body.plot
    }
    // save the user
    Movie.findByIdAndUpdate(id, data, function (err, movie) {
        if (err) throw err;
        res.send('Successfully! Movie updated ');
    });
});

// to get the id from req params as id is object type
app.delete('/api/movies/:movie_id', function (req, res) {
    console.log(req.params.movie_id);
    let id = req.params.movie_id;
    Movie.remove({
        _id: id
    }, function (err) {
        if (err)
            res.send(err);
        else
            res.send('Successfully! Movie has been Deleted.');
    });
});

// form to 
app.use(express.urlencoded({ extended: true }));
/** Show page with a form */
app.post('/', (req, res) => {
    res.send(`<form method="GET" action="/">
		<input type="text" name="page" placeholder="page">
		<input type="text" name="perPage" placeholder="perPage">
		<input type="text" name="title" placeholder="title">
		<input type="submit">
		</form>`);
});

app.listen(port);
console.log("App listening on port : " + port);
