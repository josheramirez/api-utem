'use strict';

var request = require('request');
var cheerio = require('cheerio');

exports.dirdoc = function(rut, pass, callback) {
  var options = {
    url: 'https://dirdoc.utem.cl/valida.php',
    method: 'POST',
    jar: request.jar(),
    form: {
      'tipo': 0,
      'rut': rut,
      'password': pass
    }
  };

  request(options, function(error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      var mensaje = $('body b').text();

      switch (mensaje) {
        case 'Bienvenido':
          callback(options.jar);
          break;
        case 'El password ingresado no es válido. Intentelo nuevamente':
          // El RUT ingresado no está registrado, o la contraseña no es válida
          break;
        case 'No ha ingresado RUT o Password. Intentelo nuevamente.':
          // Campos incompletos.
          break;
        case 'Ud. no está autorizado para entrar a gestión.':
          // Permisos insuficientes
          break;
        default:
          // Ocurrió un error inesperado
      }
    } else {
      // Ocurrió un error inesperado
    }
  });
}
