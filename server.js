'use strict';

var app = require('./app');
var port = process.env.PORT || 5000;

var server = app.listen(port, function() {
  console.log('API funcionando correctamente en el puerto ' + port);
});

app.use(function(req, res) {
  res.status(404).send({url: 'El directorio ' + req.originalUrl + ' no se encuentra'});
});
