'use strict';

var request = require('request');
var cheerio = require('cheerio');
var jwt = require('jsonwebtoken');
var config = require('../config');

var Logger = require('../controllers/logger')

exports.generar = function(req, res) {
  Logger.dirdoc(req.query, res, function(jar) {
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

exports.decodificar = function(autenticacion) {
  var token = autenticacion.replace('Bearer ', '');

  if(token) {
    jwt.verify(token, config.secreto, function(err, decoded) {
      if (error) {
        // Error: err
        return null;
      } else {
        return decoded;
      }
    });
  } else {
    return null;
    // No proporcionó una token
  }

}

exports.validar = function(autenticacion) {
  var token = autenticacion.replace('Bearer ', '');

  if(token) {
    jwt.verify(token, config.secreto, function(err, decoded) {
      if (err) {
        return false;
      } else {
        return true;
      }
    });
  }
  return false;

}
