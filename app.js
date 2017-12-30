'use strict';

require('./helpers/strings');

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config');

var app = express();
//var db = mongoose.connect(config.database);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));

//app.set('superSecret', config.secret); // secret variable

app.use('/autenticacion', require('./routes/autenticacion'));
app.use('/estudiantes', require('./routes/estudiante'));

module.exports = app;
