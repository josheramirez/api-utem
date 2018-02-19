'use strict';

var request = require('request');
var cheerio = require('cheerio');

var Responses = require('../responses/clientError')

exports.dirdoc = function(params, res, callback) {
  var options = {
    url: 'https://dirdoc.utem.cl/valida.php',
    method: 'POST',
    jar: request.jar(),
    form: {
      'tipo': params.tipo,
      'rut': params.rut,
      'password': params.pass
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
        case 'No ha ingresado RUT o Password. Intentelo nuevamente.':
          Responses.r400(1, res);
          break;
        case 'El password ingresado no es válido. Intentelo nuevamente':
          Responses.r401(1, res);
          break;
        case 'Ud. no está autorizado para entrar a gestión.':
          Responses.r402(1, res);
          break;
        default:
          Responses.r500(1, res);
      }
    } else {
      Responses.r503(1, res);
    }
  });
}
