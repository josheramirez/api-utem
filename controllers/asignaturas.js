'use strict';

var request = require('request');
var cheerio = require('cheerio');

exports.mostrar = async function(sesion, req, res) {
  var urls = ['notas/', 'notas_especial/'];

  var semestres = await Promise.all([procesarSemestre(urls[0]), procesarSemestre(urls[1])]);

  res.status(200).json(semestres);

  function procesarSemestre(url) {
    return new Promise(function(resolve, reject) {
      var total = 0;
      var suma = 0;
      var anio, sem, cant, semN;

      var opciones = {
        url: 'https://dirdoc.utem.cl/curricular/' + url,
        method: 'GET',
        jar: sesion
      };

      request(opciones, async function(error, response, html) {
        if (!error && response.statusCode == 200) {
          var $ = cheerio.load(html);
          var asignaturas, total;

          if ($('p').text() == 'No registras inscripción académica para este semestre') {
            asignaturas = null;
            total = 0;
          } else {
            var asignaturas = [];
            $('table:nth-of-type(2) tr').slice(1).map(function() {
              var id = parseInt($(this).find('td').eq(-1).find('a').attr('href').replace('/curricular/notas/', ''));
              if (!req.params.id || (req.params.id && req.params.id == id)) {
                var asignatura = {
                  id: id,
                  codigo: $(this).find('td').eq(0).text(),
                  nombre: $(this).find('td').eq(1).text().toTitleCase(),
                  profesor: $(this).find('td').eq(2).text().toTitleCase(),
                  seccion: parseInt($(this).find('td').eq(3).text()),
                  estado: $(this).find('td').eq(4).text().toTitleCase() || null,
                  notaFinal: parseFloat($(this).find('td').eq(5).text().replace(',', '.')).toFixedNumber(1) || null,
                  notas: req.originalUrl + id + '/notas',
                  bitacora: req.originalUrl + id + '/bitacora',
                  atencionProfesor: req.originalUrl + id + '/atencion'
                }
                if (asignatura.notaFinal) {
                  suma += asignatura.notaFinal;
                  cant++;
                }
                asignaturas.push(asignatura);
              }

            });
            total = $('table:nth-of-type(2) tr').slice(1).length;
          }

          if ($('h3').text().search('Primer') != -1) {
            sem = 'Primero';
            semN = 1;
          } else if ($('h3').text().search('Segundo') != -1) {
            sem = 'Segundo';
            semN = 2;
          } else if ($('h3').text().search('Verano') != -1) {
            sem = 'Verano';
            semN = null;
          }

          var semestre = {
            anio: parseInt($('h3').text().match(/[0-9]+/g)),
            semestre: sem,
            semestreNumero: semN,
            promedio: total != 0 ? (suma / cant).toFixedNumber(1) : null,
            totalAsignaturas: total,
            asignaturas: asignaturas
          }

          resolve(semestre);

        } else {
          reject('El documento no se cargó correctamente');
        }
      });
    });
  }
}

exports.guardar = function(decoded, req, res) {

}
