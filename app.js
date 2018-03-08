'use strict';

require('./helpers/string');

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var app = express();
var db = mongoose.connect(process.env.MONGODB_URI);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.use('/', require('./routes/index'));

app.use(function(req, res) {
  res.status(404).send({mensaje: 'El directorio ' + req.originalUrl + ' no existe, o no se puede acceder con el método ' + req.method});
});

var port = process.env.PORT || 5000;

var server = app.listen(port, function() {
  console.log('API funcionando correctamente en el puerto ' + port);
});

module.exports = app;
