var mongoose = require('mongoose');

var EstudianteSchema = new mongoose.Schema({
  rut: Number,
  nombre: String,
  email: String,
  codigoCarrera: Number,
  planCarrera: Number,
  IdsAsignatura: [Number]
});

mongoose.model('Estudiante', EstudianteSchema);
module.exports = mongoose.model('Estudiante');
