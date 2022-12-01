Movie = require('../models/movies');

const initialize = (connection) => Promise.resolve(connection);
const addNewMovie = (data)=> {
    return new Promise((resolve,reject)=>{
        
    })
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
    }, function (err, movies) {
        console.log("1"+movies);
        if (err) {
            return err;
        }
        return movies;
    });
}

module.exports = {
    //url : "mongodb+srv://dbuser:test1234@nodetuts.kwiwram.mongodb.net/sample_mflix"
    initialize,
    addNewMovie
};
