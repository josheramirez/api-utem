'use strict';

var request = require('request');
var cheerio = require('cheerio');
var jwt = require('jsonwebtoken');
var config = require('../config');

exports.generar = function(req, res) {
  var options = {
    url: 'https://dirdoc.utem.cl/valida.php',
    method: 'POST',
    jar: request.jar(),
    form: {
      'tipo': 0,
      'rut': req.query.rut,
      'password': req.query.pass
    }
  };

  request(options, function(error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      var mensaje = $('body b').text();

      if (mensaje == "Bienvenido") {
        const payload = {
          rut: req.query.rut,
          pass: req.query.pass,
        };

        var token = jwt.sign(payload, config.secret, {expiresIn: 86400});

        res.status(200).json({
          exito: true,
          message: 'Token creada correctamente.',
          token: token
        });

      } else {
        console.log('Error al iniciar.');
      }
    } else {
      console.log("Error al iniciar.");
    }
  });
}
