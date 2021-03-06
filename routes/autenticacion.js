'use strict';

var express = require('express');
var errors = require('../middlewares/errors');
var autenticador = require('../controllers/autenticacion');

var router = express.Router();

router.post('/', function(req, res, next) {
  if (req.body.correo && req.body.contrasenia_pasaporte && req.body.contrasenia_dirdoc) {
    autenticador.generar(req, res, next);
  } else {
    next(new errors(400, 'Debe ingresar todos los parametros requeridos'));
  }

});

module.exports = router;
