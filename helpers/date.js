'use strict';

exports.mesTresLetras = function(letras) {
  switch (letras) {
    case 'ENE':
      return '01';
      break;
    case 'FEB':
      return '02';
      break;
    case 'MAR':
      return '03';
      break;
    case 'ABR':
      return '04';
      break;
    case 'MAY':
      return '05';
      break;
    case 'JUN':
      return '06';
      break;
    case 'JUL':
      return '07';
      break;
    case 'AGO':
      return '08';
      break;
    case 'SEP':
      return '09';
      break;
    case 'OCT':
      return '10';
      break;
    case 'NOV':
      return '11';
      break;
    case 'DIC':
      return '12';
      break;
    default:
      return '00';
  }
}

exports.horaAPeriodo = function(hora) {
  switch (hora) {
    case '08:00':
      return 1;
      break;
    case '09:40':
      return 2;
      break;
    case '11:20':
      return 3;
      break;
    case '13:00':
      return 4;
      break;
    case '14:40':
      return 5;
      break;
    case '16:20':
      return 6;
      break;
    case '18:00':
      return 7;
      break;
    case '19:40':
      return 8;
      break;
    default:
      return null;
  }
}
