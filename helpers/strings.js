'use strict'

String.prototype.toTitleCase = function() {
  return this.replace(/([^\W_]+[^\s-]*) */g, function(txt){
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

String.prototype.toId = function() {
  return this.replace(/[&\/\\#,+()$~%.='":*?<>{}]/g, '');
}
