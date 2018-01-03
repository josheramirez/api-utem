'use strict';

var Auth = require('../controllers/autenticacion');

exports.validarToken(token) {
  if(token) {
    var decoded = Auth.validar(token);

    if(decoded != null) {
      Notas.mostrar(decoded, req, res);
    } else {
      // Token inválida.
      Responses.r403(1, res);
    }
  } else {
    // No proporcionó una token
  }
}
