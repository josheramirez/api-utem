'use strict';

var express = require('express');

var router = express.Router();

router.use('/autenticacion', require('./autenticacion'));
router.use('/estudiantes', require('./estudiantes/index.js'));

module.exports = router;
