'use strict';

var express = require('express');

var router = express.Router({mergeParams: true});

var Auth = require('../../controllers/autenticacion');
var Estudiantes = require('../../controllers/estudiantes');
var Excepcion = require('../../controllers/excepcion');

router.get('/:rut', function(req, res) {
  Auth.desencriptar(req.headers.authorization).then(function(jar) {
    Estudiantes.mostrar(jar, req, res);
  });
});

router.patch('/:rut', function(req, res) {
  Auth.desencriptar(req.headers.authorization).then(function(jar) {
    Estudiantes.cambiarEmail(jar, req, res);
  });
});

router.get('/:rut/excepcion', function(req, res) {
  Auth.desencriptar(req.headers.authorization).then(function(jar) {
    Excepcion.mostrar(jar, req, res);
  });
});

router.get('/:rut/horario', function(req, res) {

});

router.get('/:rut/contacto', function(req, res) {

});

router.use('/:rut/carreras', require('./carreras/carreras'));

module.exports = router;
