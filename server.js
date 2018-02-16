const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const config = require('./config');

const server = express();
const PORT = config.port;
const GMAPS_KEY = config.googleMaps.apiKey;

const STATUS_SUCCESS = 200;
const STATUS_USER_ERROR = 422;

const URI_PLACE_SEARCH = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=';
const URI_PLACE_DETAILS = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=';

server.use(bodyParser.json());

server.get('/places', (req, res) => {
  // check if search term was provided
  if (!req.query.search) {
    res.status(STATUS_USER_ERROR);
    res.json({ error: 'No search term provided'});
    return;
  }

  // search term was provided, get the data from Google Place Search
  fetch( URI_PLACE_SEARCH + req.query.search + '&key=' + GMAPS_KEY)
    .then(response => response.json())
    .then(json => {
      console.log('number of results: ', json.results.length);
      // get the detailed info on each from Google Place Details
      const allResultPromises = json.results.map(result => {
        fetch( URI_PLACE_DETAILS + result.place_id + '&key=' + GMAPS_KEY)
          .then(response => response.json())
          .then(json => {
            return json;
          })
          .catch(error => console.log(error));
      })
      console.log(allResultPromises);
      Promise.all(allResultPromises).then(response => res.status(200).json(response));
      // res.status(STATUS_SUCCESS);
      // res.json(Promise.all(allResults));
    })
    .catch(error => console.log(error));
});

server.get('/places', (req, res) => {
  // check if search term was provided
  if (!req.query.search) {
    res.status(STATUS_USER_ERROR);
    res.json({ error: 'No search term provided'});
    return;
  }

  // search term was provided, get the data from Google Place Search
  fetch( URI_PLACE_SEARCH + req.query.search + '&key=' + GMAPS_KEY)
    .then(response => response.json())
    .then(json => {
      console.log('number of results: ', json.results.length);
      // get the detailed info on each from Google Place Details
      json.results.map(result => {
        fetch( URI_PLACE_DETAILS + result.place_id + '&key=' + GMAPS_KEY )
          .then(response => response.json())
          .then(json => {
            res.status(STATUS_SUCCESS)
            res.json(json)
          })
          .catch(error => console.log(error));
      })
    })
    .catch(error => console.log(error));
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`);
});