'use strict'

var request = require('request');
var cheerio = require('cheerio');

var Logger = require('../controllers/logger');

exports.datos = function(decoded, res) {
  Logger.dirdoc(decoded, res, function(jar) {
    var options = {
      url: 'https://dirdoc.utem.cl/curricular',
      method: 'GET',
      jar: jar
    };

    var alumno = request(options, function(error, response, html) {
      var carreras = [];
      var $ = cheerio.load(html);

      $('table:nth-of-type(2) tr').slice(1).each(function(i, tr) {
        var carrera = {
          // id: $('table:nth-of-type(2) tr:nth-of-type(2) td a').attr('href').replace('/curricular/avance?', '').toId(),
          codigo: parseInt($(this).find('td').eq(0).text()),
          nombre: $(this).find('td').eq(0).text().replace(/[0-9]/g, '').trim().toTitleCase(),
          estado: $(this).find('td').eq(1).text().trim(),
          añoIngreso: parseInt($(this).find('td').eq(2).text().slice(0, 4)),
          semestreIngreso: parseInt($(this).find('td').eq(2).text().slice(5, 6)),
          añoTermino: parseInt($(this).find('td').eq(2).text().slice(0, 4)) || null,
          semestreTermino: parseInt($(this).find('td').eq(2).text().slice(5, 6)) || null
        }
        carreras.push(carrera);
      });

      var alumno = {
        nombre: $('table:first-of-type tr:nth-of-type(2):not(.titulo_fila) td').eq(1).text().toTitleCase(),
        rut: $('table:first-of-type tr:nth-of-type(2):not(.titulo_fila) td').eq(0).text(),
        carreras: carreras
      }
      res.status(200).json(alumno);
    });
  });
}

exports.cambiarEmail = function(req, res) {
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
