'use strict';

var express = require('express');
var fs = require('fs');
var PDFParser = require("pdf2json");

var pdfParser = new PDFParser();

var router = express.Router({mergeParams: true});

var autenticador = require('../../controllers/autenticacion');
var estudiantes = require('../../controllers/estudiantes');
var horarios = require('../../controllers/horarios');
var certificados = require('../../controllers/certificados');
var errors = require('../../middlewares/errors')

router.get('/:rut', async function(req, res, next) {
  try {
    var parametros = await autenticador.desencriptar(req);
    var json = await estudiantes.mostrar(parametros);
    res.status(200).json(json);
  } catch (e) {
    next(e);
  }
});

router.put('/:rut', async function(req, res, next) {
  if (req.body.nacimiento || req.body.movil || req.body.fijo || req.body.sexo || req.body.nacionalidad || req.body.comuna || req.body.direccion || req.body.correo) {
    try {
      var autenticacion = await autenticador.desencriptar(req);
      var json = await estudiantes.actualizar(autenticacion, req.body);
      res.status(200).json(json);
    } catch (e) {
      next(e);
    }
  } else {
    console.log("adasdsa");
    next(new errors(404, "Hola"))
  }

});

router.get('/:rut/certificados', async function(req, res, next) {
  try {
    if (req.headers['content-type'] == 'application/pdf') {
      pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
      pdfParser.on("pdfParser_dataReady", pdfData => {
        //var stat = fs.statSync('./routes/estudiantes/output.pdf');
        //res.setHeader('Content-Length', stat.size);
        //res.contentType('application/pdf');
        //res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
        var certificado;
        var datos = [];
        pdfData.formImage.Pages[0].Texts.forEach(function(e, i) {
          if (decodeURIComponent(e.R[0].T) === decodeURIComponent(e.R[0].T).toUpperCase() && e.R[0].TS[1] == 16) {
            datos.push(decodeURIComponent(e.R[0].T));
          }
        });
        certificado = {
          nombre: 0,
          rut: 0,
          estado: 0,
          carrera: 0,
          motivo: 0,
          codigo: datos[-1]
        }
        res.status(200).json(datos);
      });

      pdfParser.loadPDF('./routes/estudiantes/output.pdf');
    } else {
      next(new errors(400, 'Cabecera HTTP incorrecta'))
    }
  } catch (e) {
    next(e);
  }

});

router.get('/:rut/horarios', async function(req, res, next) {
  try {
    var parametros = await autenticador.desencriptar(req);
    var json = await horarios.mostrar(parametros);
    res.status(200).json(json)
  } catch (e) {
    next(e);
  }
});

router.get('/:rut/excepcion', function(req, res) {
  Auth.desencriptar(req).then(function(cookies) {
    Excepcion.mostrar(cookies, req, res);
  });
});

router.get('/:rut/horario', function(req, res) {

});

router.get('/:rut/contacto', function(req, res) {

});

router.use('/:rut/carreras', require('./carreras/carreras'));
router.use('/:rut/asignaturas', require('./asignaturas/asignaturas'));

module.exports = router;
