'use strict';

var express = require('express');

var router = express.Router({mergeParams: true});

var Auth = require('../../../controllers/autenticacion');
var Carreras = require('../../../controllers/carreras');

router.get('/', function(req, res) {
  if (req.headers.authorization) {
    if (Auth.validar(req.headers.authorization)) {
      var decodificado = Auth.decodificar(req.headers.authorization);

      if(decodificado.rut == req.params.rut) {
        Carreras.mostrar(decodificado, req, res);
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

router.get('/:codigoCarrera', function(req, res) {
  if (req.headers.authorization) {
    if (Auth.validar(req.headers.authorization)) {
      var decodificado = Auth.decodificar(req.headers.authorization);

      if(decodificado.rut == req.params.rut) {
        Carreras.mostrar(decodificado, req, res);
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

router.get('/:codigoCarrera/malla', function(req, res) {
  if (req.headers.authorization) {
    if (Auth.validar(req.headers.authorization)) {
      var decodificado = Auth.decodificar(req.headers.authorization);

      if(decodificado.rut == req.params.rut) {
        Carreras.mallaCurricular(decodificado, req, res);
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

router.use('/:codigoCarrera/asignaturas', require('./asignaturas/asignaturas'));

module.exports = router;
