var Movie = require('../models/movies');
var mongoose = require('mongoose');
// const { resolve } = require('path');
// const { rejects } = require('assert');

function initialize(connection) {
    mongoose.connect(connection)
        .then(function (result) {
            console.log("connection established..")
        })
        .catch(err => console.log(err));
}

const addNewMovie = function (data) {
    var promise = new Promise(function (resolve, reject) {
        Movie.create({
            plot: data.plot,
            genres: data.genres,
            runtime: data.runtime,
            cast: data.cast,
            num_mflix_comments: data.num_mflix_comments,
            title: data.title,
            fullplot: data.fullplot,
            countries: data.countries,
            released: data.released,
            directors: data.directors,
            rated: data.rated,
            awards: data.awards,
            lastupdated: data.lastupdated,
            year: data.year,
            imdb: data.imdb,
            type: data.type,
            tomatoes: data.tomatoes
        })
        resolve("Added successfully!");
    });
    return promise;
};

const getAllMovies = function (page, perPage, _title) {
    var promise = new Promise(function (resolve, reject) {
        if (_title.length > 0) {
            Movie.find(
                { title: { $eq: _title } }
            )
                .sort({ _id: 1 })
                .skip(perPage * page)
                .limit(perPage)
                .exec(function (err, movies) {
                    if (err)
                        reject(err);
                    resolve(movies);
                });
        }
        else {
            Movie.find()
                .sort({ _id: 1 })
                .skip(perPage * page)
                .limit(perPage)
                .exec(function (err, movies) {
                    if (err)
                        reject(err);
                    resolve(movies);
                });
        }
    });
    return promise;
}

const getMovieById = function (id) {
    var promise = new Promise(function (resolve, reject) {
        var movies = Movie.findById(id)
        resolve(movies);
    });
    return promise;
}

module.exports = {
    //url : "mongodb+srv://dbuser:test1234@nodetuts.kwiwram.mongodb.net/sample_mflix"
    initialize,
    addNewMovie,
    getAllMovies,
    getMovieById
};
