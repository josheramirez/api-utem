'use strict';

var express = require('express');

var router = express.Router({mergeParams: true});

var Auth = require('../../../controllers/autenticacion');
var Carreras = require('../../../controllers/carreras');

router.get('/', function(req, res) {
  Auth.desencriptar(req.headers.authorization).then(function(jar) {
    Carreras.mostrar(jar, req, res);
  });
});

router.get('/:codigoCarrera', function(req, res) {
  Auth.desencriptar(req.headers.authorization).then(function(jar) {
    Carreras.mostrar(jar, req, res);
  });
});

router.get('/:codigoCarrera/malla', function(req, res) {
  Auth.desencriptar(req.headers.authorization).then(function(jar) {
    Carreras.mallaCurricular(jar, req, res);
  });
});

router.use('/:codigoCarrera/asignaturas', require('./asignaturas/asignaturas'));

module.exports = router;
