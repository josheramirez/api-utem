'use strict';

var request = require('request');
var cheerio = require('cheerio');
var jose = require('jose-simple');
var { JWK } = require('node-jose');
var keygen = require('generate-rsa-keypair');
var errors = require('../middlewares/errors');
var logger = require('../middlewares/logger');
var rut = require('../helpers/rut');

var llave = keygen();

var llavePublica = llave.public // process.env.PUBLIC_KEY;
var llavePrivada = llave.private; // process.env.PRIVATE_KEY

var d = new Date();

exports.generar = async function(req, res, next) {
  try {
    var rutObtenido = await logger.validarDatos(req.body);
    if (true) {
      var credenciales = {
        correo: req.body.correo,
        rut: rutObtenido,
        contraseniaPasaporte: req.body.contrasenia_pasaporte,
        contraseniaDirdoc: req.body.contrasenia_dirdoc,
        exp: d.getTime() + 1000 * 60 * 60
      };

      var pemAJwk = pem => JWK.asKey(pem, 'pem');

      Promise.all([pemAJwk(llavePublica), pemAJwk(llavePrivada)]).then(function(llaves) {
        var { encrypt, decrypt } = jose(llaves[1], llaves[0]);
        encrypt(credenciales).then((token) => {
          res.status(200).send({
            token: token
          })
        });
      });
    } else {
      next(new errors(400, 'Ocurrió un error inesperado al iniciar sesión'));
    }
  } catch (e) {
    next(e);
  }
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
          reject(new errors(400, 'El token tiene un formato incorrecto'));
        }
      } else if (req.query.token) {
        token = req.query.token
      }

      Promise.all([pemAJwk(llavePublica), pemAJwk(llavePrivada)]).then(function(llaves) {
        var { encrypt, decrypt } = jose(llaves[1], llaves[0]);
        decrypt(token).then((desencriptado) => {
          if(desencriptado.exp < d.getTime()) {
            reject(new errors(401, 'El token expiró'));
          } else if (req.params.rut != rut.limpiar(desencriptado.rut).slice(0, -1)) {
            reject(new errors(401, 'No puede ingresar a los datos de este estudiante con las credenciales introducidas'))
          } else {
            resolve(desencriptado);
          }
        });
      }).catch(function(e) {
        reject(new errors(500, e));
      });
    } else {
      reject(new errors(400, 'No se ingresó ninguna token'));
    }
  });
}
