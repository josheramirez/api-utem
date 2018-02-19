'use strict';

var express = require('express');

var router = express.Router();

var Auth = require('../controllers/autenticacion');

router.post('/', function(req, res) {
  Auth.generar(req, res);
});

module.exports = router;
