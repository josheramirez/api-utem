var mongoose = require('mongoose');

var CarreraSchema = new mongoose.Schema({
  id: Number,
  nombre: String,
  plan: Number,
  asignaturas: [{
    nivel: Number,
    nombre: String,
    tipo: String,
     }]
});

mongoose.model('Carrera', CarreraSchema);
module.exports = mongoose.model('Carrera');
