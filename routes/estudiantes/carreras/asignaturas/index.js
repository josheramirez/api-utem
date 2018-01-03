'use strict';

var express = require('express');

var router = express.Router({mergeParams: true});

var Auth = require('../controllers/autenticacion');
var Asignatura = require('../controllers/asignatura');
var Responses = require('../responses/clientError');

router.get('/', function(req, res) {
  var token = req.headers.authorization.replace('Bearer ', '');
  if(token) {
    var decoded = Auth.validar(token);

    if(decoded != null) {
      Asignatura.mostrar(decoded, res);
    } else {
      // Token inválida.
      Responses.r403(1, res);
    }
  } else {
    // No proporcionó una token
  }
});

router.use('/:asignaturaId/notas', require('./notas/index.js'));

module.exports = router;
