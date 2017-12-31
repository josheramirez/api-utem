'use strict';

var express = require('express');

var router = express.Router();

var Auth = require('../controllers/autenticacion')
var Estudiante = require('../controllers/estudiante');

router.post('/:rut', function(req, res) {
  var token = req.query.token;
  var decoded = Auth.validar(token);

  if(decoded != null) {
    Estudiante.datos(decoded, res);
  } else {
    // Error validando token
  }
});

router.put('/:rut', function(req, res) {
  if (req.body.email) {
    Estudiante.cambiarEmail(req, res);
  } else if (req.body.pass || req.body.contrasena) {
    //Estudiante.cambiarContrasena(req, res);
  }

});

module.exports = router;
