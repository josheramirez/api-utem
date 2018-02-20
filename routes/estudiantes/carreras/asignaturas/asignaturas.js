'use strict';

var express = require('express');

var router = express.Router({mergeParams: true});

var Auth = require('../../../../controllers/autenticacion');
var Asignaturas = require('../../../../controllers/asignaturas');
var Notas = require('../../../../controllers/notas');
var Bitacora = require('../../../../controllers/bitacora');
var Atencion = require('../../../../controllers/bitacora'); // Atencion controller

router.get('/:asignaturaId', function(req, res) {
  Auth.desencriptar(req.headers.authorization).then(function(jar) {
    Asignaturas.mostrar(jar, req, res);
  });
});

router.get('/:asignaturaId/notas', function(req, res) {
  Auth.desencriptar(req.headers.authorization).then(function(jar) {
    Notas.mostrar(jar, req, res);
  });
});

router.get('/:asignaturaId/atencion', function(req, res) {
  Auth.desencriptar(req.headers.authorization).then(function(jar) {
    Atencion.mostrar(jar, req, res);
  });
});

router.get('/:asignaturaId/bitacora', function(req, res) {
  Auth.desencriptar(req.headers.authorization).then(function(jar) {
    Bitacora.mostrar(jar, req, res);
  });
});

module.exports = router;
