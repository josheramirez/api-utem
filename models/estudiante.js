var mongoose = require('mongoose');

var EstudianteSchema = new mongoose.Schema({
  nombre: String,
  rut: Number,
  email: String,
  password: String
});

mongoose.model('Estudiante', EstudianteSchema);
module.exports = mongoose.model('Estudiante');
