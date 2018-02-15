const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const config = require('./config');

const server = express();
const PORT = config.port;
const GMAPS_KEY = config.googleMaps.apiKey;

const STATUS_SUCCESS = 200;
const STATUS_USER_ERROR = 422;

server.use(bodyParser.json());

// server.post('/place', (req, res) => {
//   if (!req.body.search) {
//     res.status(STATUS_USER_ERROR);
//     res.json({ error: 'No search query provided'});
//     return;
//   }
//   console.log('\n\n\n----------------------------------------------------------------\n\n\n');
//   let data = fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${req.body.search}&key=${GMAPS_KEY}`)
//     .then(res => res.json())
//     .then(json => json)
//     .catch(error => console.log(error));
//   res.status(STATUS_SUCCESS);
//   console.log(data);
//   res.json(data);
// });

function getData(req, res) {
  fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${req.body.search}&key=${GMAPS_KEY}`)
    .then(response => response.json())
    .then(json => {
      fetch(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${json.results[0].place_id}&key=${GMAPS_KEY}`)
      .then(response => response.json())
      .then(json => {
        res.status(STATUS_SUCCESS)
        res.json(json)
      })
    })
    .catch(error => console.log(error));
}

server.post('/place', (req, res) => {
  // check if search term was provided
  if (!req.body.search) {
    res.status(STATUS_USER_ERROR);
    res.json({ error: 'No search term provided'});
    return;
  }

  // search term was provided, get the data from Google
  getData(req, res);
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`);
});