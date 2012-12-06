

exports.escapeRegExp = function(str){
  return str.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
};