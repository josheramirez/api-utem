'use strict';

var request = require('request');
var cheerio = require('cheerio');
var logger = require('../middlewares/logger');
var rut = require('../helpers/rut');

exports.mostrar = async function(parametros, carrera) {
  return new Promise(async function(resolve, reject) {
    try {
      var sesionAcademia = await logger.academia(parametros);

      var opciones = {
        url: 'https://academia.utem.cl/certificados/alumno_regular',
        method: 'GET',
        jar: sesionAcademia,
      };

      request(opciones, async function(error, response, html) {
        var $ = cheerio.load(html);

        $('#content .panel .panel-body .tab-content form .form-group select:nth-of-type(1) option').each()

      });

      opciones = {
        url: 'https://academia.utem.cl/certificados/alumno_regular/GeneraCertificadoPDF',
        method: 'GET',
        jar: sesionAcademia,
        form: {
          'cmb_carrera': params.carrera || 30,
          'cmb_tipo_certificado': params.tipo || 1,
          'cmb_motivo': params.motivo || 27
        }
      };

      request(opciones, async function(error, response, html) {
        var $ = cheerio.load(html);
      });
    } catch (e) {
      reject(e);
    }
  });
}
