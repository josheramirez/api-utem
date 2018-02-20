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

    Promise.all([pemAJwk(process.env.PUBLIC_KEY), pemAJwk(process.env.PRIVATE_KEY)]).then(function(llaves) {
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

exports.desencriptar = function(req) {
  return new Promise(function(resolve, reject) {
    if (req.query.token || req.headers.authorization) {
      var token;
      var pemAJwk = pem => JWK.asKey(pem, 'pem');

      if (req.headers.authorization) {
        if(req.headers.authorization.search('Bearer ') == 0) {
          token = req.headers.authorization.replace('Bearer ', '');
        } else {
          reject('El token tiene un formato incorrecto')
        }
      } else if (req.query.token) {
        token = req.query.token
      }

      Promise.all([pemAJwk(process.env.PUBLIC_KEY), pemAJwk(process.env.PRIVATE_KEY)]).then(function(llaves) {
        var { encrypt, decrypt } = jose(llaves[1], llaves[0]);
        decrypt(token).then((desencriptado) => {
          if(desencriptado.exp < d.getTime()) {
            reject('El token expiró');
          } else if (!req.params.rut) {
            reject('No se necesita acceder a los datos del usuario');
          } else if (req.params.rut != desencriptado.rut) {
            reject('No es posible obtener los datos de otro usuario con estas credenciales')
          } else {
            Logger.dirdoc(desencriptado).then(function(cookies) {
              resolve(cookies);
            });
          }
        });
      });
    } else {
      reject('No se ingresó ninguna token')
    }
  });
}
