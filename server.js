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

server.post('/place', (req, res) => {
  if (!req.body.search) {
    res.status(STATUS_USER_ERROR);
    res.json({ error: 'No search query provided'});
    return;
  }
  console.log('\n\n\n----------------------------------------------------------------\n\n\n');
  let data = fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${req.body.search}&key=${GMAPS_KEY}`)
    .then(res => res.json())
    .then(json => json)
    .catch(error => console.log(error));
  res.status(STATUS_SUCCESS);
  console.log(data);
  res.json(data);
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`);
});