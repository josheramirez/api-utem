'use strict'

String.prototype.toTitleCase = function() {
  return this.replace(/([^\W_]+[^\s-]*) */g, function(txt){
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

String.prototype.toSentenceCase = function() {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

Number.prototype.toFixedNumber = function(x, base){
  var pow = Math.pow(base || 10, x);
  return + (Math.round(this*pow) / pow );
}
