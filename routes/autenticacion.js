'use strict';

var express = require('express');

var router = express.Router();

var Auth = require('../controllers/autenticacion');

router.post('/', function(req, res) {
  res.status(200).send({
    mensaje: "El token se generó correctamente",
    token: Auth.generar(req, res)
  });
});

module.exports = router;
