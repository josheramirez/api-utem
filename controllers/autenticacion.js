'use strict';

var request = require('request');
var cheerio = require('cheerio');
var jwt = require('jsonwebtoken');
var config = require('../config');

var Logger = require('../controllers/logger')

exports.generar = function(req, res) {
  Logger.dirdoc(req.query.rut, req.query.pass, function(jar) {
    const payload = {
      rut: req.query.rut,
      pass: req.query.pass,
    };

    var token = jwt.sign(payload, config.secreto, {expiresIn: 86400});

    res.status(200).json({
      exito: true,
      message: 'Token creada correctamente.',
      token: token
    });
  });
}

exports.validar = function(token) {
  return jwt.verify(token, config.secret, function(error, decoded) {
    if (error) {
      return null;
    } else {
      return decoded;
    }
  });
}
