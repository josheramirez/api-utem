'use strict';

var request = require('request');
var cheerio = require('cheerio');

var Fecha = require('../helpers/tiempo')

exports.mostrar = function(sesion, req, res) {
  var opciones = {
    url: 'https://dirdoc.utem.cl/curricular/notas/' + req.params.asignaturaId,
    method: 'GET',
    jar: sesion
  };

  request(opciones, function(error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);

      if ($('form strong').text().trim() == 'El profesor NO a ingresado ningun hito en la bitacora.') {
        res.status(200).json({
          mensaje: "El profesor no ha ingresado ningún registro."
        })
      } else {
        var i = 1;
        var registros = [];
        var asistidos = 0;
        var dias = $('select#dia_bitacora option');

        funcionAsync(dias[i], registros);

        function funcionAsync(dia, registros) {
          var bitacora;
          var observacion;
          var asistencia;
          var registro;

          opciones = {
            url: 'https://dirdoc.utem.cl/alumnos/acta_ajax.php',
            method: 'POST',
            jar: sesion,
            form: {
              'p1': dia.attribs.value,
              'p2': req.params.asignaturaId,
              'p3': req.params.rut
            }
          };

          request(opciones, function(error, response, html) {
            if (!error && response.statusCode == 200) {
              var $ = cheerio.load(html);
              if ($('body').clone().children().remove().end().text().trim() == 'Usted está presente para este dia.') {
                asistencia = true;
                asistidos++;
              } else if ($('body').clone().children().remove().end().text().trim() == 'Usted no registra asistencia para este dia.') {
                asistencia = false;
              } else {
                asistencia = null;
              }
              bitacora = $('table tr:nth-of-type(2):not(.titulo_fila) td').text().trim();

              bitacora = bitacora == 'Sin Bitacora' ? null : bitacora;
              observacion = $('table tr:nth-of-type(4):not(.titulo_fila) td').text().trim();
              observacion = observacion == 'Sin Observaciones' ? null : observacion;

              registro = {
                dia: dia.attribs.value.slice(0, 3) + Fecha.mesTresLetras(dia.attribs.value.slice(3, 6)) + '-20' + dia.attribs.value.slice(7, 9),
                periodo: Fecha.horaAPeriodo(dia.attribs.value.slice(10, 15)),
                horaInicio: dia.attribs.value.slice(10, 15),
                horaTermino: dia.attribs.value.slice(16, 21),
                asistencia: asistencia,
                bitacora: bitacora,
                observacion: observacion
              }
              registros.push(registro);
              i++;

              if (i < dias.length) {
                funcionAsync(dias[i], registros);
              } else {

                res.status(200).json({
                  clasesRegistradas: i - 1,
                  clasesAsistidas: asistidos,
                  porcentajeAsistencia: (asistidos / (i - 1)).toFixedNumber(2),
                  registros: registros
                });
              }
            }
          });
        }
      }
    }
  });
}
