'use strict';

require('./helpers/strings');

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config');

var app = express();
//var db = mongoose.connect(config.db);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.use('/', require('./routes/index.js'));

module.exports = app;
