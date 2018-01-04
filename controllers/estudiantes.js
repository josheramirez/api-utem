'use strict'

var request = require('request');
var cheerio = require('cheerio');

var Logger = require('../middlewares/logger');

exports.mostrar = function(decoded, req, res) {
  Logger.dirdoc(decoded, res, function(jar) {
    var options = {
      url: 'https://dirdoc.utem.cl/curricular',
      method: 'GET',
      jar: jar
    };

    var alumno = request(options, function(error, response, html) {
      var $ = cheerio.load(html);

      var alumno = {
        nombre: $('table:first-of-type tr:nth-of-type(2):not(.titulo_fila) td').eq(1).text().toTitleCase(),
        rut: $('table:first-of-type tr:nth-of-type(2):not(.titulo_fila) td').eq(0).text(),
        email: "jorge.verdugoc@utem.cl",
        carreras: "/estudiante/" + req.params.rut + "/carreras"
      }

      res.status(200).json(alumno);
    });
  });
}

exports.cambiarEmail = function(decoded, req, res) {
  Logger.dirdoc(decoded, res, function(jar) {
    var options = {
      url: 'https://dirdoc.utem.cl/alumnos/datos.php?do=guardar',
      method: 'POST',
      jar: jar,
      form: {
        'correo': req.query.email,
      }
    };

    request(options, function(error, response, html) {
      var $ = cheerio.load(html);
      res.status(200).send($('body').text().trim());
    });
  });
};