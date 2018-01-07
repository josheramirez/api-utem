'use strict';

var request = require('request');
var cheerio = require('cheerio');

var Logger = require('../middlewares/logger');

exports.mostrar = function(decoded, req, res) {
  Logger.dirdoc(decoded, res, function(jar) {
    var presentacion;
    var examen = null;
    var final;

    var options = {
      url: 'https://dirdoc.utem.cl/curricular/notas/' + req.params.asignaturaId,
      method: 'GET',
      jar: jar
    };

    request(options, function(error, response, html) {
      var $ = cheerio.load(html);
      var notas = [];

      if($('p').text() == "No hay ponderadores ingresados") {
        res.status(200).json({
          mensaje: 'El profesor no ha ingresado notas ni ponderadores.'
        })
      } else {
        $('table:nth-of-type(2) tr:nth-of-type(1) th').each(function(i, th) {
          var tipo;
          var valor = $('table:nth-of-type(2) tr:nth-of-type(2):not(.titulo_fila) th:nth-of-type(' + (i + 1) + ')').text();
          var aux = $(this).text().search('%');
          var ponderacion = $(this).text().slice(aux - 4, aux - 1);

          valor = parseFloat(valor.replace(',', '.')) || null;

          if ($(this).text().search('Prest') != -1) {
            presentacion = valor;
          } else if ($(this).text().replace('\n', '').trim().search('Examen') != -1) {
            if(valor != null) {
              examen = valor;
            }
          } else if ($(this).text().search('Final') != -1 && $(this).text().search('Estado') == -1) {
            final = valor;
          } else {
            if ($(this).text().search('Lab') != -1) {
              tipo = 'Laboratorio';
            } else if ($(this).text().search('Acum') != -1) {
              tipo = 'Acumulativa';
            } else if ($(this).text().search('%') != -1) {
              tipo = 'Parcial';
            } else {
              tipo = $(this).text().replace('\n', '').replace('Nota ', '').trim();
            }

            if((aux != -1 || valor != null) && $(this).text().search('Estado') == -1) {
              var nota = {
                tipo: tipo,
                ponderacion: parseInt(ponderacion) / 100,
                valor: valor
              }
              notas.push(nota);
            }
          }

        });
        res.status(200).json({
          presentacion: presentacion,
          rindeExamen: presentacion < 4 && presentacion >= 3,
          examen: examen,
          final: final,
          aprobado: presentacion >= 4 || final >= 4,
          notas: notas
        });
      }
    });
  });
}
