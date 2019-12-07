// Require .env File
require('dotenv').config();

// Links keys.js File
const keys = require('./keys.js');

// Require necessary Modules and APIs
let request = require('request');

const moment = require('moment');

const fs = require('fs');

// Spotify API
const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);

// OMDb & Bands In Town
let omdb = (keys.omdb);
let bandsintown = (keys.bandsintown);


// User Command & Input
let userInput = process.argv[2];
let userQuery = process.argv.slice(3).join(' ');


// Logic
function userCommand(userInput, userQuery) {
    // Available Commands
    switch (userInput) {
        case 'concert-this':
            concertThis();
            break;
        case 'spotify-this':
            spotifyThis();
            break;
        case 'movie-this':
            movieThis();
            break;
        case 'do-what-it-says':
            doThis();
            break;
    }
}

userCommand(userInput, userQuery);

// SEARCH CONCERTS
function concertThis() {
    console.log(`\n--------------------\n\nSearching for...${userQuery}'s next show...`);
    // Use 'request' as our query URL
    request('https://rest.bandsintown.com/artists/' + userQuery + '/events?app_id=codingbootcamp' + bandsintown, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            // Capture data in JSON 
            let userBand = JSON.parse(body);
            // Parse data & loop
            if (userBand.length > 0) {
                for (i = 0; i < 1; i++) {

                    // Console logs data in E6 Syntax
                    console.log(`\nArtist: ${userBand[i].lineup[0]} \nVenue: ${userBand[i].venue.name}\nVenue Location: ${userBand[i].venue.latitude},${userBand[i].venue.longitude}\nVenue City: ${userBand[i].venue.city}, ${userBand[i].venue.country}`);

                    // Formats date using Moment
                    let concertDate = moment(userBand[i].datetime).format('MM/DD/YYYY hh:00 A');
                    console.log(`Date and Time: ${concertDate}\n\n--------------------\n`);
                };
            } else {
                console.log('Band or concert not found!');
            };
            
            // Allows data to be appended to the log file
            let concertData = `\nCommand 'concert-this' for '${userQuery}' returns...\n--------------------\n\nArtist: ${userBand[i].lineup[0]} \nVenue: ${userBand[i].venue.name}\nVenue Location: ${userBand[i].venue.latitude},${userBand[i].venue.longitude}\nVenue City: ${userBand[i].venue.city}, ${userBand[i].venue.country}\n--------------------\n`;

            fs.appendFile('log.txt', concertData, function (error) {
                if (error) throw error;
            });
        }
    })
}

// SEARCH SONG BY TITLE
function spotifyThis() {
    console.log(`\n--------------------\n\nSearching for...'${userQuery}'`);

    // Defaults to following  
    if (!userQuery) {
        userQuery = 'The Sign Ace of Base'
    };

    // Sets format for song search
    spotify.search({
        type: 'track',
        query: userQuery,
        limit: 4
    }, function (error, data) {
        if (error) {
            return console.log('Error occurred: ' + error);
        }
        // Array for data
        let spotifyArr = data.tracks.items;

        for (i = 0; i < spotifyArr.length; i++) {
            console.log(`\nArtist: ${data.tracks.items[i].album.artists[0].name} \nSong: ${data.tracks.items[i].name}\nAlbum: ${data.tracks.items[i].album.name}\nSpotify link: ${data.tracks.items[i].external_urls.spotify}\n\n--------------------\n`);
            
            // Allows data to be appended to the log file
            let songData = `\nCommand 'spotify-this' for '${userQuery}' returns...\n--------------------\n\nArtist: ${data.tracks.items[i].album.artists[0].name} \nSong: ${data.tracks.items[i].name}\nAlbum: ${data.tracks.items[i].album.name}\nSpotify link: ${data.tracks.items[i].external_urls.spotify}\n\n--------------------\n`;

            fs.appendFile('log.txt', songData, function (error) {
                if (error) throw error;
            })
        }
    });
}

// SEARCH MOVIE BY TITLE
function movieThis() {
    console.log(`\n--------------------\n\nSearchign for...'${userQuery}'`);
    if (!userQuery) {
        userQuery = 'Mr. Nobody';
        console.log("\nIf you haven't watched Mr. Nobody, then you should: http://www.imdb.com/title/tt0485947/","\nIt's on Netflix!");
    };
    // Request using OMDb API
    request('http://www.omdbapi.com/?apikey=trilogy&t=' + userQuery, function (error, response, body) {
        let userMovie = JSON.parse(body);

        // To pull Both IMDb & Rotten Tomtoes
        let ratingsArr = userMovie.Ratings;
        if (ratingsArr.length > 2) {}

        if (!error && response.statusCode === 200) {
            console.log(`\nTitle: ${userMovie.Title}\nCast: ${userMovie.Actors}\nReleased: ${userMovie.Year}\nIMDb Rating: ${userMovie.imdbRating}\nRotten Tomatoes Rating: ${userMovie.Ratings[1].Value}\nCountry: ${userMovie.Country}\nLanguage: ${userMovie.Language}\nPlot: ${userMovie.Plot}\n\n--------------------\n`);
        } else {
            return console.log('Movie unable to be found. Error:' + error)
        };

            // Allows data to be appended to the log file
            let movieData = `\nCommand 'movie-this' for '${userQuery}' returns...\n--------------------\n\nTitle: ${userMovie.Title}\nCast: ${userMovie.Actors}\nReleased: ${userMovie.Year}\nIMDb Rating: ${userMovie.imdbRating}\nRotten Tomatoes Rating: ${userMovie.Ratings[1].Value}\nCountry: ${userMovie.Country}\nLanguage: ${userMovie.Language}\nPlot: ${userMovie.Plot}\n\n--------------------\n`;

            fs.appendFile('log.txt', movieData, function (error) {
                if (error) throw error;
            
        })
    });
}

function doThis() {
    // Accesses random.txt file to pull request from containing text
    fs.readFile('random.txt', 'utf8', function (error, data) {
        if (error) {
            return console.log(error);
        }
        // Seperates objects in the array
        let dataArr = data.split(',');

        // Pass as parameter from random.txt
        userInput = dataArr[0];
        userQuery = dataArr[1];
        // Calls function with new parameters
        userCommand(userInput, userQuery);
    });
}
