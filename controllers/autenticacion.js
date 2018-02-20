'use strict';

var request = require('request');
var cheerio = require('cheerio');
var jose = require('jose-simple');
var { JWK } = require('node-jose');
var keygen = require('generate-rsa-keypair')

var Logger = require('../middlewares/logger')

var d = new Date();

exports.generar = function(req, res) {
  Logger.dirdoc(req.query).then(function(jar) {
    var credenciales = {
      tipo: req.query.tipo,
      rut: req.query.rut,
      pass: req.query.pass,
      exp: d.getTime() + 1000 * 60 * 60,
    };

    var pemAJwk = pem => JWK.asKey(pem, 'pem');

    Promise.all([pemAJwk(process.env.PUBLIC_KEY), pemAJwk(process.env.PRIVATE_KEY)]).then(function (llaves) {
      var { encrypt, decrypt } = jose(llaves[1], llaves[0]);
      encrypt(credenciales).then((token) => {
        res.status(200).send({
          mensaje: "El token se generó correctamente",
          token: token
        });
      });
    });
  });
}

exports.desencriptar = function(autenticacion) {
  var token = autenticacion.replace('Bearer ', '');
  return new Promise(function(resolve, reject) {
    if(token) {
      var pemAJwk = pem => JWK.asKey(pem, 'pem');

      Promise.all([pemAJwk(llaves.public), pemAJwk(llaves.private)]).then(function (llaves) {
        var { encrypt, decrypt } = jose(llaves[1], llaves[0]);
        decrypt(token).then((desencriptado) => {
          if(desencriptado.exp < d.getTime()) {
            reject("El token expiró");
          } else {
            Logger.dirdoc(desencriptado).then(function(jar) {
              resolve(jar);
            });
          }
        });
      });
    } else {
      reject("No hay token o tiene un mal formato");
    }
  });
}
