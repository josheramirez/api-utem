'use strict';

require('./helpers/string');

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var app = express();
var db = mongoose.connect(process.env.MONGODB_URI);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.use('/', require('./routes/index'));

module.exports = app;
