'use strict';

var request = require('request');
var cheerio = require('cheerio');

var Logger = require('../middlewares/logger');

exports.mostrar = function(jar, req, res) {
  var semestres = [];
  var urls = ['notas/', 'notas_especial/'];
  var i = 0;

  funcionAsyncA(urls[i], semestres);

  function funcionAsyncA(url, semestres) {
    var total = 0;
    var suma = 0;
    var año, sem;


    var options = {
      url: 'https://dirdoc.utem.cl/curricular/' + url,
      method: 'GET',
      jar: jar
    };

    request(options, function(error, response, html) {
      if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);

        var j = 0;
        var trs = $('table:nth-of-type(2) tr').slice(1);

        año = parseInt($('h3').text().match(/[0-9]+/g));
        sem = $('h3').text().search('Primer') != -1 ? 1 : 2;

        var asignaturas = [];

        funcionAsyncB(trs[j], asignaturas, semestres);

        function funcionAsyncB(tr, asignaturas, semestres) {
          var id = parseInt($(tr).find('td').eq(-1).find('a').attr('href').replace('/curricular/notas/', ''));

          var asignatura = {
            id: id,
            codigo: $(tr).find('td').eq(0).text(),
            nombre: $(tr).find('td').eq(1).text().toTitleCase(),
            profesor: $(tr).find('td').eq(2).text().toTitleCase(),
            seccion: parseInt($(tr).find('td').eq(3).text()),
            estado: $(tr).find('td').eq(4).text().toTitleCase() || null,
            notaFinal: parseFloat($(tr).find('td').eq(5).text().replace(',', '.')),
            notas: '/estudiantes/' + req.params.rut + '/carreras/' + req.params.codigoCarrera + '/asignaturas/' + id + '/notas',
            bitacora: '/estudiantes/' + req.params.rut + '/carreras/' + req.params.codigoCarrera + '/asignaturas/' + id + '/bitacora',
            atencionProfesor: '/estudiantes/' + req.params.rut + '/carreras/' + req.params.codigoCarrera + '/asignaturas/' + id + '/atencion'
          }

          if (req.params.asignaturaId == id) {
            res.status(200).json(asignatura);
          } else {
            suma += asignatura.notaFinal;

            asignaturas.push(asignatura);

            j++;

            if (j < trs.length) {
              funcionAsyncB(trs[j], asignaturas, semestres);
            } else {
              var semestre = {
                semestre: sem,
                año: año,
                promedio: (suma / j).toFixed(1),
                totalAsignaturas: j,
                asignaturas: asignaturas
              }

              semestres.push(semestre);
            }
          }
        }

        i++;

        if (i < urls.length) {
          funcionAsyncA(urls[i], semestres);
        } else if (!req.params.asignaturaId) {
          res.status(200).json(semestres);
        }
      }

    });
  }
}

exports.guardar = function(decoded, req, res) {

}
