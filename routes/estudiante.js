'use strict';

var express = require('express');

var router = express.Router();

var Estudiante = require('../controllers/estudiante');

router.post('/:rut', function(req, res) {
  Estudiante.datos(req, res);
});

router.put('/:rut', function(req, res) {
  if (req.body.email) {
    Estudiante.cambiarEmail(req, res);
  } else if (req.body.pass || req.body.contrasena) {
    //Estudiante.cambiarContrasena(req, res);
  }

});

module.exports = router;
