'use strict';

var express = require('express');

var router = express.Router({mergeParams: true});

var Auth = require('../../../../controllers/autenticacion');
var Asignaturas = require('../../../../controllers/asignaturas');
var Notas = require('../../../../controllers/notas');
var Bitacora = require('../../../../controllers/bitacora');
var Atencion = require('../../../../controllers/bitacora'); // Atencion controller

router.get('/', function(req, res) {
  Auth.desencriptar(req).then(function(cookies) {
    Asignaturas.mostrar(cookies, req, res);
  });
});

router.get('/:asignaturaId', function(req, res) {
  Auth.desencriptar(req).then(function(cookies) {
    Asignaturas.mostrar(cookies, req, res);
  });
});

router.get('/:asignaturaId/notas', function(req, res) {
  Auth.desencriptar(req).then(function(cookies) {
    Notas.mostrar(cookies, req, res);
  });
});

router.get('/:asignaturaId/atencion', function(req, res) {
  Auth.desencriptar(req).then(function(cookies) {
    Atencion.mostrar(cookies, req, res);
  });
});

router.get('/:asignaturaId/bitacora', function(req, res) {
  Auth.desencriptar(req).then(function(cookies) {
    Bitacora.mostrar(cookies, req, res);
  });
});

module.exports = router;
