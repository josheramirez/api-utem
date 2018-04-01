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
        url: 'https://academia.utem.cl/usuario/perfil/editar',
        method: 'GET',
        jar: sesionAcademia
      };

      request(opciones, async function(error, response, html) {
        var $ = cheerio.load(html);
        var puntajePsu = parseFloat($('#content .profile-section .profile-right .profile-info table tbody tr:nth-of-type(3) td:nth-of-type(2)').text());
        var nombre = $('#content .profile-section .profile-right .profile-info table thead tr th:nth-of-type(2) h4').clone().children().remove().end().text().trim();
        var correoPersonalAcademia = $('#content .profile-section .profile-right .profile-info table tbody tr:nth-of-type(11) td:nth-of-type(2)').text();
        var direccionAcademia = $('#content .profile-section .profile-right .profile-info table tbody tr:nth-of-type(10) td:nth-of-type(2)').text();
        var movilAcademia = $('#content .profile-section .profile-right .profile-info table tbody tr:nth-of-type(4) td:nth-of-type(2) a').text();
        var telefonoAcademia = $('#content .profile-section .profile-right .profile-info table tbody tr:nth-of-type(5) td:nth-of-type(2) a').text();

        var alumno = {
          nombre: nombre.toTitleCase(),
          rut: $('#content .profile-section .profile-right .profile-info table tbody tr:nth-of-type(1) td:nth-of-type(2)').text(),
          correoUtem: $('#content .profile-section .profile-right .profile-info table tbody tr:nth-of-type(6) td:nth-of-type(2)').text(),
          correoPersonal: correoPersonalAcademia === 'usuario@correo.cl' ? null : correoPersonalAcademia,
          fotoUrl: $('#content .profile-section .profile-left .profile-image img').attr('src'),
          edad: $('#content .profile-section .profile-right .profile-info table tbody tr:nth-of-type(2) td:nth-of-type(2)').text() || null,
          puntajePsu: puntajePsu < 150 ? null : puntajePsu,
          telefonoMovil: movilAcademia === 'Añadir Numero' ? null : (parseInt(movilAcademia) == 0 ? null : parseInt(movilAcademia)),
          telefonoFijo: telefonoAcademia === 'Añadir Numero' ? null : (parseInt(movilAcademia) == 0 ? null : parseInt(movilAcademia)),
          sexo: $('#content .profile-section .profile-right .profile-info table tbody tr:nth-of-type(7) td:nth-of-type(2) select option[selected]').text(),
          nacionalidad: $('#content .profile-section .profile-right .profile-info table tbody tr:nth-of-type(8) td:nth-of-type(2) select option[selected]').text().toSentenceCase(),
          comuna: $('#content .profile-section .profile-right .profile-info table tbody tr:nth-of-type(9) td:nth-of-type(2) select option[selected]').text().toTitleCase(),
          direccion: direccionAcademia === 'Añadir Dirección' ? null : direccionAcademia,
          anioIngreso: parseInt($('#content .profile-section:nth-of-type(2) .row div:nth-of-type(2) table tbody tr td:nth-of-type(1)').text().trim()),
          ultimaMatricula: parseInt($('#content .profile-section:nth-of-type(2) .row div:nth-of-type(2) table tbody tr td:nth-of-type(3)').text().trim()),
          carrerasCursadas: parseInt($('#content .profile-section:nth-of-type(2) .row div:nth-of-type(2) table tbody tr td:nth-of-type(2)').text().trim())
        }

        var parametrosDirdoc = {
          rut: rut.limpiar(alumno.rut).slice(0, -1),
          contrasenia_dirdoc: parametros.contraseniaDirdoc
        }

        var sesionDirdoc = await logger.dirdoc(parametrosDirdoc);

        var correoDirdoc;
        var opciones = {
          url: 'https://dirdoc.utem.cl/alumnos/datos.php',
          method: 'GET',
          jar: sesionDirdoc,
        };

        request(opciones, function(error, response, html) {
          var $ = cheerio.load(html);
          correoDirdoc = $('input[name="correo"]').val() || null;
        });

        resolve(alumno);
      });

    /*  var sesionMiUtem = await logger.miUtem(parametros);
        opciones = {
          url: 'https://mi.utem.cl/perfil/mis_datos',
          method: 'GET',
          jar: sesionMiUtem
        };

        request(opciones, function(error, response, html) {
          var $ = cheerio.load(html);

          var miUtem = {
            edad: parseInt($('.main-content #user-profile-2 #home .profile-user-info .profile-info-row:nth-of-type(2) .profile-info-value span').text()),
            sexo: $('.main-content #user-profile-2 #home .profile-user-info .profile-info-row:nth-of-type(3) .profile-info-value span').text(),
            nacionalidad: $('.main-content #user-profile-2 #home .profile-user-info .profile-info-row:nth-of-type(4) .profile-info-value span').text().toSentenceCase(),
            correoPersonal: $('.main-content #user-profile-2 #home .profile-user-info .profile-info-row:nth-of-type(6) .profile-info-value span').text(),
            telefono: parseInt($('.main-content #user-profile-2 #home .profile-user-info .profile-info-row:nth-of-type(7) .profile-info-value span').text()),
            direccionAcademica: {
              direccion: $('.main-content #user-profile-2 #misDirecciones div:nth-of-type(2) ul li:nth-of-type(1)').clone().children().remove().end().text().trim().toTitleCase(),
              comuna: $('.main-content #user-profile-2 #misDirecciones div:nth-of-type(2) ul li:nth-of-type(2)').clone().children().remove().end().text().trim().toTitleCase(),
              telefono: parseInt($('.main-content #user-profile-2 #misDirecciones div:nth-of-type(2) ul li:nth-of-type(3)').clone().children().remove().end().text().trim())
            },
            direccionFamiliar: {
              direccion: $('.main-content #user-profile-2 #misDirecciones div:nth-of-type(3) ul li:nth-of-type(1)').clone().children().remove().end().text().trim().toTitleCase(),
              comuna: $('.main-content #user-profile-2 #misDirecciones div:nth-of-type(3) ul li:nth-of-type(2)').clone().children().remove().end().text().trim().toTitleCase(),
              telefono: parseInt($('.main-content #user-profile-2 #misDirecciones div:nth-of-type(3) ul li:nth-of-type(3)').clone().children().remove().end().text().trim())
            },
            anioIngreso: parseInt($('.main-content #user-profile-2 #home .row:nth-of-type(2) div:nth-of-type(2) .widget-main .clearfix div:nth-of-type(1) span').text()),
            ultimaMatricula: parseInt($('.main-content #user-profile-2 #home .row:nth-of-type(2) div:nth-of-type(2) .widget-main .clearfix div:nth-of-type(3) span').text()),
            carreras: parseInt($('.main-content #user-profile-2 #home .row:nth-of-type(2) div:nth-of-type(2) .widget-main .clearfix div:nth-of-type(2) span').text())
          };
        }); */
    } catch (e) {
      reject(e);
    }
  });
}


exports.actualizar = async function(autenticacion, parametros) {
  return new Promise(async function(resolve, reject) {
    try {
      var exitosos = [];
      var fallidos = [];

      var sesionAcademia = await logger.academia(autenticacion);

      var opciones = {
        url: "https://academia.utem.cl/ajax/usuario/persona/mantenedor",
        method: "POST",
        headers: {
          "X-Requested-With": "XMLHttpRequest"
        },
        jar: sesionAcademia,
        form: {
          accion: "set",
          nombre: null,
          valor: null
        }
      }

      if (parametros.nacimiento) {
        opciones.form.nombre = "txt_fecha_nacimiento";
        opciones.form.valor = parametros.nacimiento;
        request(opciones, function(error, response, body) {
          if (!error && response.statusCode == 200) {
            if (JSON.parse(body)["R_MENSAJE"] == "La PERSONA fue actualizada correctamente.") {
              exitosos.push("Fecha de nacimiento");
            }
          }
        });
      }

      if (parametros.movil) {
        opciones.form.nombre = "txt_celular";
        opciones.form.valor = parametros.movil;
        request(opciones, function(error, response, body) {
          if (!error && response.statusCode == 200) {
            if (JSON.parse(body)["R_MENSAJE"] == "La PERSONA fue actualizada correctamente.") {
              exitosos.push("Teléfono móvil");
            }
          }
        });
      }
      if (parametros.fijo) {
        opciones.form.nombre = "txt_telefono";
        opciones.form.valor = parametros.fijo;
        request(opciones, function(error, response, body) {
          if (!error && response.statusCode == 200) {
            if (JSON.parse(body)["R_MENSAJE"] == "La PERSONA fue actualizada correctamente.") {
              exitosos.push("Teléfono fijo");
            }
          }
        });
      }
      if (parametros.sexo) {
        opciones.form.nombre = "cmb_sexo";
        opciones.form.valor = parametros.sexo;
        request(opciones, function(error, response, body) {
          if (!error && response.statusCode == 200) {
            if (JSON.parse(body)["R_MENSAJE"] == "La PERSONA fue actualizada correctamente.") {
              exitosos.push("Sexo");
            }
          }
        });
      }
      if (parametros.nacionalidad) {
        opciones.form.nombre = "cmb_nacionalidad";
        opciones.form.valor = parametros.nacionalidad;
        request(opciones, function(error, response, body) {
          if (!error && response.statusCode == 200) {
            if (JSON.parse(body)["R_MENSAJE"] == "La PERSONA fue actualizada correctamente.") {
              exitosos.push("Nacionalidad");
            }
          }
        });
      }
      if (parametros.comuna) {
        opciones.form.nombre = "cmb_comuna";
        opciones.form.valor = parametros.comuna;
        request(opciones, function(error, response, body) {
          if (!error && response.statusCode == 200) {
            if (JSON.parse(body)["R_MENSAJE"] == "La PERSONA fue actualizada correctamente.") {
              exitosos.push("Comuna");
            }
          }
        });
      }
      if (parametros.direccion) {
        opciones.form.nombre = "txt_direccion";
        opciones.form.valor = parametros.direccion;
        request(opciones, function(error, response, body) {
          if (!error && response.statusCode == 200) {
            if (JSON.parse(body)["R_MENSAJE"] == "La PERSONA fue actualizada correctamente.") {
              exitosos.push("Dirección");
            }
          }
        });
      }
      if (parametros.correo) {
        opciones.form.nombre = "txt_email_personal";
        opciones.form.valor = parametros.correo;
        request(opciones, function(error, response, body) {
          if (!error && response.statusCode == 200) {
            if (JSON.parse(body)["R_MENSAJE"] == "La PERSONA fue actualizada correctamente.") {
              exitosos.push("Correo electrónico personal");
            }
          }
        });
      }

      resolve(exitosos);
    } catch (e) {
      reject(e);
    }
  });
}

exports.cambiarCorreoDirdoc = async function(parametros) {
  return new Promise(async function(resolve, reject) {
    try {
      var sesionDirdoc = await logger.dirdoc(parametros);
      var opciones = {
        url: 'https://dirdoc.utem.cl/alumnos/datos.php?do=guardar',
        method: 'POST',
        jar: sesionDirdoc,
        form: {
          'correo': req.query.email,
        }
      };
      request(opciones, function(error, response, html) {
        var $ = cheerio.load(html);
        resolve('Mensaje');
      });
    } catch (e) {
      reject(e);
    }
  });
};
