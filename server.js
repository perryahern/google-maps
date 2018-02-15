const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const config = require('./config');

const server = express();
const PORT = config.port;
const GMAPS_KEY = config.googleMaps.apiKey;

server.use(bodyParser.json());

server.listen(PORT);