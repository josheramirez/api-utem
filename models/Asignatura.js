var mongoose = require('mongoose');

var AsignaturaSchema = new mongoose.Schema({
  id: Number,
  codigo: String,
  nombre: String,
  profesor: String,
  seccion: Number
});

mongoose.model('Asignatura', AsignaturaSchema);
module.exports = mongoose.model('Asignatura');
