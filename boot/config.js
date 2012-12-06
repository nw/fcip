var express = require('express')
  , mongoose = require('mongoose')
  , stylus = require('stylus')
  , path = require('path')
  , exec = require('child_process').exec
  , RedisSessionStore = require('connect-redis')(express)
  , nib = require('nib')
  , timeout = require('connect-timeout');

module.exports = function config(app){

    require('jadevu');
    require('express-mongoose');
    

    Error.stackTraceLimit = Infinity;

    exec('git --git-dir='+__dirname+'/../.git rev-parse HEAD', function(err, sha){
      if (!err) app.set("git sha", sha.substr(0, 8));
      else console.log('git sha error', err);
    });

    app.locals({app: app});

    // Development Config
    app.configure('development', function(){
      
      this
        .use(express.logger('\x1b[90m:remote-addr -\x1b[0m \x1b[33m:method\x1b[0m' +
              '\x1b[32m:url\x1b[0m :status \x1b[90m:response-time\x1b[0m'))
        .use(timeout({time: 8 * 1000})) // for debugging catches run away requests.
        .enable('dev')
        .enable('debug')
        .disable('compress')
        .set('machine name', 'dev')
        .set('port', 3333)
        .set('ENV', 'local');
    });
    
    // Production Config
    app.configure('production', function(){
      this
        .use(express.logger())
        .enable('prod')
        .enable('view cache')
        .disable('debug')
        .enable('compress')
        .set('machine name', 'prod')
        .set('port', 4000)
        .set('ENV', 'prod');
    });  

    // General Config
    app.configure(function(){
      this
        // Generic
        .set('root', path.normalize(__dirname + '/../'))
        .set('views', __dirname + '/../views')
        .set('view options', {layout: false})
        .set('view engine', 'jade')
        .set('default language', 'en_US')
        .set('error templates', true)
        .set('db name', 'fcip')
        .use(express.errorHandler({
          dumpExceptions: app.enabled('debug')
        , showStack: app.enabled('debug')}))
        // Shared Middle
        .use(express.responseTime())
        .use(express.cookieParser())
        .use(express.methodOverride())
        .use(express.bodyParser())
        // Views
        .use(stylus.middleware({
            force: app.enabled('debug')
          , debug: app.enabled('debug')
          , compress: app.enabled('compress')
          , src: app.set('root') + '/views'
          , dest: app.set('root') + '/public'
          , compile: function(str, path) {
              return stylus(str)
                .set('filename', path)
                .set('paths', ['/style'])
                .define('url', stylus.url({ paths: [app.set('root')  + '/public']}))
                .use(nib());
          }}))
        .use(express.static(__dirname + '/../public', {maxAge: app.enabled('debug') ? 0 : 31536000000 }))
        // Session
        .use(express.session({
          key: '_nw_'
        , secret: 'asjdfsfskgfdgljdsh53408dfds'
        , store: new RedisSessionStore }))
        .use(function(req, res, next){
          res.locals.session = req.session;
          next();
        });
    });
    
    
    app.mongoose = mongoose.connect('mongodb://localhost/'+ app.set('db name')); // create DB connection
    app.mongoose.plugin(require('../lib/mongoose-merge'));
    return app;
}