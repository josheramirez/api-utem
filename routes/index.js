'use strict';

var express = require('express');
var errors = require('../middlewares/errors');

var router = express.Router();

router.use('/autenticacion', require('./autenticacion'));
router.use('/validacion', require('./validacion'));
router.use('/estudiantes', require('./estudiantes/estudiantes'));

router.all('/', function(req, res) {
  res.status(200).send({
    nombre: 'API UTEM',
    version: '0.1.0',
    repositorio: 'https://github.com/mapacheverdugo/api-utem',
    descripcion: 'API REST no oficial que unifica todas las plataformas de la Universidad Tecnológica Metropolitana de Chile',
    autor: {
      nombre: 'Jorge Verdugo Chacon',
      correo: 'jorgeverdugoch@gmail.com',
      github: 'https://github.com/mapacheverdugo',
    },
  })
});

module.exports = router;
