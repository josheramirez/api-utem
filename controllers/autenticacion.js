'use strict';

var request = require('request');
var cheerio = require('cheerio');
var jose = require('jose-simple');
var { JWK } = require('node-jose');

var Logger = require('../middlewares/logger')

exports.generar = function(req, res) {

  Logger.dirdoc(req.query, res, function(jar) {
    var credenciales = {
      tipo: req.query.tipo,
      rut: req.query.rut,
      pass: req.query.pass,
      exp: Date.getTime() + 1000 * 60 * 60,
    };

    var pemAJwk = pem => JWK.asKey(pem, 'pem');

    Promise.all([pemAJwk(process.env.PUBLIC_KEY), pemAJwk(process.env.PRIVATE_KEY)]).then(function (llaves) {
      var { encrypt, decrypt } = jose(llaves[1], llaves[0]);
    });

    encrypt(credenciales).then((token) => {
      res.status(200).send({
        mensaje: "El token se generó correctamente",
        token: token
      });
    });
  });

}

exports.desencriptar = function(token) {
  decrypt(token).then((desencriptado) => {
    return desencriptado;
  });
}

exports.validar = function(autenticacion) {
  var token = autenticacion.replace('Bearer ', '');

  if(token) {
    return true;
    // Si hay token
  } else {
    return false;
    // Si no hay token
  }
}
