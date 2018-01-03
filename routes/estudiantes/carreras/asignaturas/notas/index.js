'use strict';

var express = require('express');

var router = express.Router({mergeParams: true});

var Auth = require('../controllers/autenticacion');
var Notas = require('../controllers/notas');
var Responses = require('../responses/clientError');

router.get('/', function(req, res) {
  var token = req.headers.authorization.replace('Bearer ', '');
  if(token) {
    var decoded = Auth.validar(token);

    if(decoded != null) {
      Notas.mostrar(decoded, req, res);
    } else {
      // Token inválida.
      Responses.r403(1, res);
    }
  } else {
    // No proporcionó una token
  }
});

module.exports = router;
