'use strict';

var express = require('express');

var router = express.Router({mergeParams: true});

var Auth = require('../controllers/autenticacion');
var Notas = require('../controllers/notas');
var Responses = require('../responses/clientError');

router.get('/', function(req, res) {
  if (req.headers.authorization) {
    if (Auth.validar(req.headers.authorization)) {
      Notas.mostrar(decodificado, req, res);
    } else {
      console.log("Token inválida");
    }
  } else {
    console.log("No introduce token");
  }
});

module.exports = router;
