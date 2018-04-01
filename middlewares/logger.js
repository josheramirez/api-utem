'use strict';

var request = require('request');
var cheerio = require('cheerio');
var errors = require('./errors');
var rut = require('../helpers/rut');

function dirdoc(params) {
  return new Promise(function(resolve, reject) {
    var opciones = {
      url: 'https://dirdoc.utem.cl/valida.php',
      method: 'POST',
      jar: request.jar(),
      timeout: 5000,
      followAllRedirects: true,
      form: {
        'tipo': 0,
        'rut': params.rut,
        'password': params.contrasenia_dirdoc
      }
    }

    request(opciones, function(error, response, html) {
      if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        var mensaje = $('body b').text();
        if (mensaje == 'Bienvenido') {
          resolve(opciones.jar);
        } else {
          reject(new errors(502, 'No se pudo iniciar sesión por:', mensaje));
        }
      } else {
        reject(new errors(502, 'No se pudo iniciar sesión en Academia UTEM'));
      }
    });
  });
}
/*

function miUtem(params) {
  return new Promise(function(resolve, reject) {
    var opciones = {
      url: 'https://mi.utem.cl/login',
      method: 'POST',
      form: {
        'rut_alumno': rut,
        'contrasena': contraseniaDirdoc,
        'recordar_password': 0
      },
      jar: request.jar()
    }

    request(opciones, function(error, response, html) {

      opciones = {
        url: 'https://mi.utem.cl/',
        method: 'GET',
        jar: opciones.jar
      }
      resolve(opciones.jar);
    });
  });
}
*/

function academia(params) {
  return new Promise(function(resolve, reject) {
    var opciones = {
      url: 'https://academia.utem.cl/login',
      method: 'POST',
      jar: request.jar(),
      timeout: 5000,
      followAllRedirects: true,
      form: {
        'txt_usuario': params.correo,
        'txt_password': params.contrasenia_pasaporte
      }
    }

    request(opciones, function(error, response, html) {
      if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        resolve(opciones.jar);
      } else {
        reject(new errors(502, 'No se pudo iniciar sesión en Academia UTEM'));
      }
    });
  });
}

async function validarDatos(parametros) {
  return new Promise(async function(resolve, reject) {
    var academiaRut;

    try {
      // var sesionMiUtem = await miUtem(parametros);
      var sesionAcademia = await academia(parametros);

      var opciones = {
        url: 'https://academia.utem.cl/usuario/perfil/editar',
        method: 'GET',
        jar: sesionAcademia
      };

      request(opciones, async function(error, response, html) {
        var $ = cheerio.load(html);
        academiaRut = $('#content .profile-section .profile-right .profile-info table tbody tr:nth-of-type(1) td:nth-of-type(2)').eq(0).text();

        if (parametros.contrasenia_dirdoc) {
          var parametrosDirdoc = {
            rut: rut.limpiar(academiaRut).slice(0, -1),
            contrasenia_dirdoc: parametros.contrasenia_dirdoc
          }

          var sesionDirdoc = await dirdoc(parametrosDirdoc);
        }
        
        resolve(academiaRut);
      });
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = {dirdoc, academia, validarDatos}
