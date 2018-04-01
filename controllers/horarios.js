'use strict';

var request = require('request');
var cheerio = require('cheerio');
var logger = require('../middlewares/logger');
var rut = require('../helpers/rut');

exports.mostrar = async function(parametros) {
  return new Promise(async function(resolve, reject) {
    try {
      var sesionAcademia = await logger.academia(parametros);

      var opciones = {
        url: 'https://academia.utem.cl/alumno/horario_seccion',
        method: 'GET',
        jar: sesionAcademia,
      };

      request(opciones, async function(error, response, html) {
        var $ = cheerio.load(html);
        var horarios = [];
        $('#content .panel .panel-body fieldset center div #accordion').each(function() {
          var tituloCarrera = $(this).find('.panel-info .panel-heading h3.panel-title').text().trim();
          var carrera = {
            código: parseInt(tituloCarrera.slice(0, tituloCarrera.search('/')).trim()),
            plan: parseInt(tituloCarrera.slice(tituloCarrera.search('/') + 1, tituloCarrera.search('-')).trim()),
            nombre: tituloCarrera.slice(tituloCarrera.search('-') + 1).trim().toTitleCase()
          };
          var asignaturas = [];
          var asignatura;
          $('.panel-collapse .panel-body').children('table').find('tbody tr.programa').each(function() {
            asignatura = {
                codigo: $(this).find('td:nth-of-type(1)').text().trim().toUpperCase(),
                nombre: $(this).find('td:nth-of-type(2)').text().trim().toTitleCase(),
                profesor: $(this).find('td:nth-of-type(3)').text().trim() == 'SIN PROFESOR' ? null : $(this).find('td:nth-of-type(3)').text().trim().toTitleCase(),
                tipo: $(this).find('td:nth-of-type(4)').text().trim().toTitleCase(),
                seccion: parseInt($(this).find('td:nth-of-type(5)').text())
            }
            asignaturas.push(asignatura);
          });

          var dias = [[], [], [], [], [], []];
          var numeroPeriodo;

          $('.panel-collapse .panel-body').children('div').find('table tbody tr').each(function(i) {

            var tds = $(this).find('td');
            if ((i + 1) % 2 != 0) {
              numeroPeriodo = parseInt($(this).find('td:nth-of-type(1)').text().trim());
            }

            function procesarTd(td) {
              if ($(td).hasClass('success')) {
                var textoBloque = $(td).text().trim();
                return {
                  codigoAsignatura: textoBloque.slice(0, textoBloque.search('/')).trim().toUpperCase(),
                  seccionAsignatura: parseInt(textoBloque.slice(textoBloque.search('/') + 1, textoBloque.search('\\(')).trim()),
                  sala: textoBloque.slice(textoBloque.search("\\(") + 1, textoBloque.search("\\)")).replace('SALA', '').trim().toTitleCase()
                }
              } else {
                return null;
              }
            }

            for (var j = 0; j < 6; j++) {
              dias[j].push(procesarTd(tds[j + 1 + (i + 1) % 2]));
            }

            /*
            if ((i + 1) % 2 == 0) {
              var periodo = {
                periodo: numeroPeriodo,
                bloques: bloques
              }

              console.log(periodo);
              bloques = [];

              periodos.push(periodo);
            }
            */
          });


          var objeto = {
            carrera: carrera,
            asignaturas: asignaturas,
            horario: {
              lunes: dias[0],
              martes: dias[1],
              miercoles: dias[2],
              jueves: dias[3],
              viernes: dias[4],
              sabado: dias[5],
            }
          }
          horarios.push(objeto);
        })
        resolve(horarios);
      });
    } catch (e) {
      reject(e);
    }
  });
}
