'use strict';

var request = require('request');
var cheerio = require('cheerio');

var Logger = require('../controllers/logger');

exports.mostrar = function(decoded, res) {
  Logger.dirdoc(decoded, res, function(jar) {
    var asignaturas = [];

    var options = {
      url: 'https://dirdoc.utem.cl/curricular/notas',
      method: 'GET',
      jar: jar
    };

    request(options, function(error, response, html) {
      if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);

        $('table:nth-of-type(2) tr').slice(1).each(function(i, tr) {
          var asignatura = {
            id: parseInt($(this).find('td').eq(-1).find('a').attr('href').replace('/curricular/notas/', '')),
            codigo: $(this).find('td').eq(0).text(),
            nombre: $(this).find('td').eq(1).text().toTitleCase(),
            profesor: $(this).find('td').eq(2).text().toTitleCase(),
            seccion: parseInt($(this).find('td').eq(3).text()),
            estado: $(this).find('td').eq(4).text().toTitleCase() || null,
            notaFinal: parseFloat($(this).find('td').eq(5).text().replace(',', '.')),
            // notas: []
          }

          /*
          request('https://dirdoc.utem.cl/curricular/notas/' + asignatura.id, function(error, response, html) {
            var $ = cheerio.load(html);

            if($('p').text() == "No hay ponderadores ingresados") {
            } else {
              $('table:nth-of-type(2) tr:nth-of-type(2):not(.titulo_fila) th').each(function() {
                var nota = parseFloat($(this).text().replace(',', '.')) || null;
                asignatura.notas.push(nota);
              });
            }

          });
          */
          asignaturas.push(asignatura);
        });
        res.status(200).json(asignaturas);
      }

    });
  });
}
