var express = require('express');
var app = express();
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
var port = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({ 'extended': 'true' }));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
var mongoose = require('mongoose');

//establish connection with database and initialize the movie model
var db = require('./config/database1');

// method to add a new movie
app.post('/api/movies', function (req, res) {

    // create mongose method to create a new record into collection
    //console.log(req.body);
    // on collection we apply .create(). So here Movie is the collections
    db.addNewMovie(req.body)
        .then(result => res.status(200).send(result))
        .catch(err => res.status(500).send(err));
});


// app.all(function (req, res) {
//     db.initialize("mongodb+srv://root:secretpassword@cluster0.6bhud2z.mongodb.net/sample_mflix")
//         .then(result => res.status(200).send(mongoose.connect(result)))
//         .catch(err => res.status(500).send(err));
//     console.log("connected");
// });

// method to get all the movies from db according to page, perPage and title	
app.get('/api/movies', function (req, res) {
    var perPage = req.query.perPage || 0;
    var page = req.query.page || 0;
    // use mongoose to get all todos in the database
    Movie.find()
        .sort({ _id: 1 })
        .skip(perPage * page)
        .limit(perPage)
        .exec(function (err, movies) {
            // if there is an error retrieving, send the error otherwise send data
            if (err)
                res.send(err)
            res.json(movies); // return all movie in JSON format according to page no and perpage count
        });
});


app.get('/api/movie/:movie_id', function (req, res) {
    // to get the id from req params as id is object type
    var id = new mongoose.Types.ObjectId(req.params.movie_id);
    // to get the id from mongosse type object
    Movie.findById(id, function (err, movies) {
        if (err)
            res.send(err)
        res.json(movies);
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
