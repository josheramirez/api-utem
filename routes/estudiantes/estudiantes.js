'use strict';

var express = require('express');

var router = express.Router({mergeParams: true});

var Auth = require('../../controllers/autenticacion');
var Estudiantes = require('../../controllers/estudiantes');

router.get('/:rut', function(req, res) {
  if (req.headers.authorization) {
    if (Auth.validar(req.headers.authorization)) {
      var decodificado = Auth.decodificar(req.headers.authorization);

      if(decodificado.rut == req.params.rut) {
        Estudiantes.mostrar(decodificado, req, res);
      } else {
        console.log("No tiene acceso a la información de otra persona");
      }
    } else {
      console.log("Token inválida");
    }
  } else {
    console.log("No introduce token");
  }
});

router.patch('/:rut', function(req, res) {
  if (req.headers.authorization) {
    if (Auth.validar(req.headers.authorization)) {
      var decodificado = Auth.decodificar(req.headers.authorization);

      if(decodificado.rut == req.params.rut) {
        Estudiantes.cambiarEmail(decodificado, req, res);
      } else {
        console.log("No tiene acceso a la información de otra persona");
      }
    } else {
      console.log("Token inválida");
    }
  } else {
    console.log("No introduce token");
  }
});

router.get('/:rut/excepcion', function(req, res) {

});

router.get('/:rut/horario', function(req, res) {

});

router.get('/:rut/contacto', function(req, res) {

});

router.use('/:rut/carreras', require('./carreras/carreras'));

module.exports = router;
