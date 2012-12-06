
var config = require('./config')
  , models = require('../models')
  , routes = require('../routes');

module.exports = function boot(app){
  
  config(app);
  models(app);
  routes(app);
  
  return app;
}