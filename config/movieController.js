var Movie = require('../models/movies');
var mongoose = require('mongoose');
// const { resolve } = require('path');
// const { rejects } = require('assert');

function initialize(connection) {
    mongoose.connect(connection)
        .then(function (result) {
            console.log("connection established..")
        })
        .catch(err => console.log(err.message));
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
        }, function (err, movie) {
            if (err) {
                reject(err.message);
            }
            resolve("Movie has been added Successfully!");
        });
    });
    return promise;
}

// const getMovies = async () => {
//     return await Movie.find({});
// }

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
                        reject(err.message);
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
                        reject(err.message);
                    resolve(movies);
                });
        }
    });
    return promise;
};

const getMovieById = function (id) {
    var promise = new Promise(function (resolve, reject) {
        var movies = Movie.findById(id)
        resolve(movies);
    });
    return promise;
}

const updateMovieById = function (data, id) {
    var data = {
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
    }
    var promise = new Promise(function (resolve, reject) {
        Movie.findByIdAndUpdate(id, data).then(resolve("Movie has been updated Successfully!"))
        .catch(err=>console.log(err.message))
        
    });
    return promise;
}

const deleteMovieById = function (id) {
    var promise = new Promise(function (resolve, reject) {
        Movie.remove({
            _id: id
        })
        resolve('Movie has been deleted Successfully!');
    });
    return promise;
}

module.exports = {
    //url : "mongodb+srv://dbuser:test1234@nodetuts.kwiwram.mongodb.net/sample_mflix"
    initialize,
    addNewMovie,
    getAllMovies,
    getMovieById,
    updateMovieById,
    deleteMovieById
};
