'use strict';

var express = require('express');

var router = express.Router({mergeParams: true});

var Auth = require('../../../../controllers/autenticacion');
var Asignaturas = require('../../../../controllers/asignaturas');
var Notas = require('../../../../controllers/notas');
var Bitacora = require('../../../../controllers/bitacora');

router.get('/', function(req, res) {
  if (req.headers.authorization) {
    if (Auth.validar(req.headers.authorization)) {
      var decodificado = Auth.decodificar(req.headers.authorization);

      if(decodificado.rut == req.params.rut) {
        Asignaturas.mostrar(decodificado, req, res);
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

router.get('/:asignaturaId/notas', function(req, res) {
  if (req.headers.authorization) {
    if (Auth.validar(req.headers.authorization)) {
      var decodificado = Auth.decodificar(req.headers.authorization);

      if(decodificado.rut == req.params.rut) {
        Notas.mostrar(decodificado, req, res);
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

router.get('/:asignaturaId/atencion', function(req, res) {

});

router.get('/:asignaturaId/bitacora', function(req, res) {
  if (req.headers.authorization) {
    if (Auth.validar(req.headers.authorization)) {
      var decodificado = Auth.decodificar(req.headers.authorization);

      if(decodificado.rut == req.params.rut) {
        Bitacora.mostrar(decodificado, req, res);
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

module.exports = router;
