
/**
 * Boot.
 */

var boot = module.exports = require('./boot')
  , server = require('express')()
  , app = boot(server);


/**
 * Export app.
 */
 module.exports = app;


/**
 * Load app directly if no parent is set.
 */

if (!module.parent) {

  process.addListener('uncaughtException', function(err){
    console.error('Uncaught exception!');
    console.error(err.stack || err);
    app.report(err, 'Uncaught exception');
  });

  app.listen(app.set('port'), function(){
    console.error('\x1b[32mFCIP Demo\x1b[0m running on port %d', app.get('port'));
  });

}

