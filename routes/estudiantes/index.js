'use strict';

var express = require('express');

var router = express.Router({mergeParams: true});

var Auth = require('../controllers/autenticacion');
var Estudiante = require('../controllers/estudiante');
var Responses = require('../responses/clientError');

router.post('/:rut', function(req, res) {
  var token = req.headers.authorization.replace('Bearer ', '');
  if(token) {
    var decoded = Auth.validar(token);

    if(decoded != null) {
      Estudiante.datos(decoded, res);
    } else {
      // Token inválida.
      Responses.r403(1, res);
    }
  } else {
    // No proporcionó una token
  }

});

router.put('/:rut', function(req, res) {
  if (req.body.email) {
    Estudiante.cambiarEmail(req, res);
  } else if (req.body.pass || req.body.contrasena) {
    //Estudiante.cambiarContrasena(req, res);
  }

});

router.use('/:rut/carreras', require('./carreras/index.js'));

module.exports = router;
