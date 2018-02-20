+'use strict'

var request = require('request');
var cheerio = require('cheerio');

exports.mostrar = function(sesion, req, res) {
  var email;
  var opciones = {
    url: 'https://dirdoc.utem.cl/alumnos/datos.php',
    method: 'GET',
    jar: sesion,
  };

  request(opciones, function(error, response, html) {
    var $ = cheerio.load(html);
    email = $('input[name="email"]').val() || null;
  });

  opciones = {
    url: 'https://dirdoc.utem.cl/curricular',
    method: 'GET',
    jar: sesion
  };

  var alumno = request(opciones, function(error, response, html) {
    var $ = cheerio.load(html);

    var alumno = {
      nombre: $('table:first-of-type tr:nth-of-type(2):not(.titulo_fila) td').eq(1).text().toTitleCase(),
      rut: $('table:first-of-type tr:nth-of-type(2):not(.titulo_fila) td').eq(0).text(),
      email: email,
      carreras: "/estudiantes/" + req.params.rut + "/carreras"
    }

    res.status(200).json(alumno);
  });
}

exports.cambiarEmail = function(sesion, req, res) {
  var opciones = {
    url: 'https://dirdoc.utem.cl/alumnos/datos.php?do=guardar',
    method: 'POST',
    jar: sesion,
    form: {
      'correo': req.query.email,
    }
  };

  request(opciones, function(error, response, html) {
    var $ = cheerio.load(html);
    res.status(200).send($('body').text().trim());
  });
};
