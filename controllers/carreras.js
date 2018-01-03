'use strict'

var request = require('request');
var cheerio = require('cheerio');

var Logger = require('../controllers/logger');

exports.mallaCurricular = function(decoded, req, res) {
  Logger.dirdoc(decoded, res, function(jar) {
    var url;

    var options = {
      url: 'https://dirdoc.utem.cl/curricular',
      method: 'GET',
      jar: jar
    };

    request(options, function(rErr, response, html) {
      var $ = cheerio.load(html);

      $('table:nth-of-type(2) tr').slice(1).each(function(i, tr) {
        if(req.params.codigoCarrera == parseInt($(this).find('td').eq(0).text())) {
          url = 'https://dirdoc.utem.cl' + $(this).find(a).attr('href');
        } else {
          // El alumno no cursa esa carrera
        }
      });
    });

    options = {
      url: url,
      method: 'GET',
      jar: jar,
    };

    request(options, function(error, response, html) {
      var $ = cheerio.load(html);

      $('table:nth-of-type(3) tr').slice(1).each(function(i, tr) {
        if (req.params.codigoCarrera == parseInt($(this).find('td').eq(0).text())) {
          url = 'https://dirdoc.utem.cl' + $(this).find(a).attr('href');
        } else {
          // El alumno no cursa esa carrera
        }
      });
    });
  });
}
