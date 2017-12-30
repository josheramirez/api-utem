'use strict'

var request = require('request');
var cheerio = require('cheerio');
var jwt = require('jsonwebtoken');
var config = require('../config');

exports.datos = function(req, res) {
  jwt.verify(req.query.token, config.secret, function(err, decoded) {
    if (err) {
      res.status(500).send({
        auth: false,
        message: 'Failed to authenticate token.' });
    } else {

      var options = {
        url: 'https://dirdoc.utem.cl/valida.php',
        method: 'POST',
        jar: request.jar(),
        form: {
          'tipo': 0,
          'rut': decoded.rut,
          'password': decoded.pass
        }
      };

      request(options, function(error, response, html) {
        if (!error && response.statusCode == 200) {
          var $ = cheerio.load(html);
          var mensaje = $('body b').text();

          if(mensaje == "Bienvenido") {
            console.log('Se conectó correctamente');
          } else {
            console.log('Error al iniciar.');
          }
        } else {
          console.log("Error al iniciar.");
        }

        options.url = 'https://dirdoc.utem.cl/curricular';
        options.method = 'GET';

        request(options, function(error, response, auxHtml) {
          var $ = cheerio.load(auxHtml);
          var nombre = $('table:first-of-type tr:nth-of-type(2):not(.titulo_fila) td').eq(1).text().toTitleCase();
          res.status(200).json({
            nombre: nombre
          });

        });
    });
    }
  });
};

exports.cambiarEmail =  function(req, res) {
  var options = {
    url: 'https://dirdoc.utem.cl/valida.php',
    method: 'POST',
    jar: request.jar(),
    form: {
      'tipo': 0,
      'rut': req.params.rut,
      'password': req.query.pass
    }
  };

  request(options, function(error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      var mensaje = $('body b').text();

      if(mensaje == "Bienvenido") {
        console.log('Se conectó correctamente');
      } else {
        console.log('Error al iniciar.');
      }
    } else {
      console.log("Error");
    }

    options.url = 'https://dirdoc.utem.cl/alumnos/datos.php?do=guardar';
    options.method = 'POST';
    options.form = { 'correo': req.params.email };

    request(options, function(error, response, html) {
      var $ = cheerio.load(html);
      res.status(200).send($('body').text().trim());
    });

  });
};
