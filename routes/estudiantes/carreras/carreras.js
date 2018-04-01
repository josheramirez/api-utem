'use strict';

var express = require('express');

var router = express.Router({mergeParams: true});

var Auth = require('../../../controllers/autenticacion');
var Carreras = require('../../../controllers/carreras');

router.get('/', function(req, res) {
  Auth.desencriptar(req).then(function(cookies) {
    Carreras.mostrar(cookies, req, res);
  });
});

router.get('/:codigoCarrera', function(req, res) {
  Auth.desencriptar(req).then(function(cookies) {
    Carreras.mostrar(cookies, req, res);
  });
});

router.get('/:codigoCarrera/malla', function(req, res) {
  Auth.desencriptar(req).then(function(cookies) {
    Carreras.mallaCurricular(cookies, req, res);
  });
});



module.exports = router;
