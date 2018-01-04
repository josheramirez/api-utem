'use strict';

var request = require('request');
var cheerio = require('cheerio');
var jwt = require('jsonwebtoken');
var config = require('../config');

var Logger = require('../middlewares/logger')

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
  /*
  var token = autenticacion.replace('Bearer ', '');

  if(token) {
    jwt.verify(token, config.secreto, function(err, decoded) {
      if (error) {
        console.log(err);
        return null;
      } else {
        return decoded;
      }
    });
  } else {
    return null;
    // No proporcionó una token
  }
  */
  return {
    rut: 19649846,
    pass: "Pollo123"
  }
}

exports.validar = function(autenticacion) {
  /*
  var token = autenticacion.replace('Bearer ', '');

  if(token) {
    jwt.verify(token, config.secreto, function(err, decoded) {
      if (err) {
        console.log(err);
        console.log("hola 2");
        return false;
      } else {
        return true;
      }
    });
  } else {
    console.log("hola");
    return false;
  }
  */
  return true;

}
