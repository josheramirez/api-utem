'use strict';

var request = require('request');
var cheerio = require('cheerio');

exports.mostrar = function(sesion, req, res) {
  var matriculas = [];

  var opciones = {
    url: 'https://dirdoc.utem.cl/alumnos/excepcion.php',
    method: 'GET',
    jar: sesion
  };

  request(opciones, function(error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);

      $('table:nth-of-type(2) tr').slice(1).each(function() {
        var id = parseInt($(this).find('td').eq(-1).find('a').attr('href').replace('?do=html&p1=', ''));
        var numero = parseInt($(this).find('td').eq(0).text());
        var fecha = $(this).find('td').eq(1).text();
        var estado = $(this).find('td').eq(3).text();
        var asignaturas = [];

        opciones = {
          url: 'https://dirdoc.utem.cl/alumnos/excepcion.php?do=html&p1=' + id,
          method: 'GET',
          jar: sesion
        };

        request(opciones, function(error, response, html) {
          if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);

            var justificacion;
            var asignatura = {

            }
          }
        });

        var matricula = {
          id: id,
          numero: numero,
          fecha: fecha,
          estado: estado,
          justificacion: 'Debido a que he reprobado la asignatura por irresponsabilidad y descuido de mi parte, sin embargo, creo que, si se me presenta una nueva oportunidad, seré capaz de aprobarlo. Es por esto último que estoy preinscrito en el Curso de Verano de dicha asignatura para poder cursarlo en enero, pero aún así necesito efectuar esta matrícula en caso de no tomar dicho curso por motivos externos.',
          asignaturas: [{
            código: 'MATC8030',
            nombre: 'ALGEBRA SUPERIOR'.toTitleCase(),
            seccion: parseInt('102'),
            nota: parseFloat('3,4'.replace(',', '.'))
          }]
        }
        matriculas.push(matricula);
      });
      res.status(200).json(matriculas);
    }

  });
}
