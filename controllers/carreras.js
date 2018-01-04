'use strict';

var request = require('request');
var cheerio = require('cheerio');
var async = require("async");


var Logger = require('../middlewares/logger');

exports.mostrar = function(decoded, req, res) {
  Logger.dirdoc(decoded, res, function(jar) {
    var urls = [];

    var options = {
      url: 'https://dirdoc.utem.cl/curricular',
      method: 'GET',
      jar: jar
    };

    request(options, function(error, response, html) {
      var $ = cheerio.load(html);

      $('table:nth-of-type(2) tr').slice(1).each(function() {
        var url = 'https://dirdoc.utem.cl' + $(this).find('a').attr('href');
        if (req.params.codigoCarrera) {
          if (req.params.codigoCarrera == parseInt($(this).find('td').eq(0).text())) {
            urls.push(url);
          } else {
            console.log("El alumno no cursa esta carrera");
          }
        } else {
          urls.push(url);
        }
      });

      var carreras = [];
      var i = 0;

      funcionAsync(urls[i], carreras);

      function funcionAsync(url, carreras) {
        options = {
          url: url,
          method: 'GET',
          jar: jar,
        };

        var carrera;
        request(options, function(error, response, html) {
          var $ = cheerio.load(html);

          var tr = $('table:nth-of-type(2) tr:nth-of-type(2)');
          var codigo = parseInt(tr.find('td').eq(0).text());
          carrera = {
            codigo: codigo,
            nombre: tr.find('td').eq(0).text().replace(/[0-9]/g, '').trim().toTitleCase(),
            plan: parseInt(tr.find('td').eq(1).text()),
            estado: tr.find('td').eq(2).text().trim().toSentenceCase(),
            anoIngreso: tr.find('td').eq(3).text().slice(0, 4),
            semestreIngreso: tr.find('td').eq(3).text().slice(5, 6),
            anoTermino: tr.find('td').eq(4).text().slice(0, 4) || null,
            semestreTermino: tr.find('td').eq(4).text().slice(5, 6) || null,
            mallaCurricular: "/estudiantes/" + req.params.rut + "/carreras/" + codigo + "/malla"
          }
          carreras.push(carrera);
          i++;

          if (i < urls.length) {
            funcionAsync(urls[i], carreras);
          } else {
            res.status(200).json(carreras);
          }
        });
      }
    });
  });
}

exports.mallaCurricular = function(decoded, req, res) {
  Logger.dirdoc(decoded, res, function(jar) {
    var url;

    var options = {
      url: 'https://dirdoc.utem.cl/curricular',
      method: 'GET',
      jar: jar
    };

    request(options, function(error, response, html) {
      var $ = cheerio.load(html);

      $('table:nth-of-type(2) tr').slice(1).each(function() {
        if(req.params.codigoCarrera == parseInt($(this).find('td').eq(0).text())) {
          url = 'https://dirdoc.utem.cl' + $(this).find('a').attr('href');
        } else {
          console.log("El alumno no cursa esta carrera");
        }
      });

      options = {
        url: url,
        method: 'GET',
        jar: jar,
      };

      request(options, function(error, response, html) {
        var $ = cheerio.load(html);
        var asignaturas = [];
        var niveles = [];
        var aprobada;
        var nivel, asignatura;
        var total = 0, aprobadas = 0, reprobadas = 0, obligatorias = 0, actual = -1;

        var nivelI = parseInt($('table:nth-of-type(3) tr').find('td').eq(0).text());

        $('table:nth-of-type(3) tr').slice(1).each(function() {

          if ($(this).find('td').eq(1).text() != '') {
            total++;
            if (nivelI != parseInt($(this).find('td').eq(0).text())) {
              nivel = {
                nivel: nivelI,
                asignaturas: asignaturas
              }

              asignaturas = [];

              nivelI = parseInt($(this).find('td').eq(0).text()) || null;

              niveles.push(nivel);

            }

            if ($(this).find('td').eq(4).text().search('APROBADA') != -1) {
              aprobadas++;
              aprobada = true;
            } else {
              if((actual == -1 || actual > nivelI) && nivelI != null) {
                actual = nivelI;
              }
              if ($(this).find('td').eq(4).text().search('REPROBADO') != -1) {
                reprobadas++;
                aprobada = false;
              } else {
                aprobada = null;
              }
            }

            asignatura = {
              nombre: $(this).find('td').eq(1).text().toTitleCase(),
              tipo: $(this).find('td').eq(2).text().toSentenceCase(),
              vecesCursada: parseInt($(this).find('td').eq(3).text()),
              aprobada: aprobada,
              seccion: parseInt($(this).find('td').eq(5).text()) || null,
              nota: parseFloat($(this).find('td').eq(6).text().replace(',', '.'))
            }
            asignaturas.push(asignatura);
          }
        });

        nivel = {
          nivel: nivelI,
          asignaturas: asignaturas
        }
        
        niveles.push(nivel);

        var malla = {
          nivelActual: actual,
          asignaturasTotal: total,
          asignaturasAprobadas: aprobadas,
          asignaturasReprobadas: reprobadas,
          avanceMalla: aprobadas / total,
          asignaturas: niveles
        }
        res.status(200).json(malla);
      });

    });
    /*





    */
  });
}