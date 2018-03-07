'use strict';

var request = require('request');
var cheerio = require('cheerio');

exports.dirdoc = function(params) {
  return new Promise(function(resolve, reject) {
    var opciones = {
      url: 'https://dirdoc.utem.cl/valida.php',
      method: 'POST',
      jar: request.jar(),
      form: {
        'tipo': params.tipo || 0,
        'rut': params.rut,
        'password': params.pass
      }
    }

    console.log(opciones.form);

    request(opciones, function(error, response, html) {
      if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        var mensaje = $('body b').text();
        if(mensaje == 'Bienvenido') {
          resolve(opciones.jar);
        } else {
          reject(Error("No se inició sesión porque: " + mensaje));
        }
      } else {
        reject(Error("No cargó la pagina"));
      }
    });
  });


}
