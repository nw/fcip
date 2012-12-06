var up = require('up')
  , uphook = require('up-hook')
  , master = require('http').createServer()
  , proxy = up(master, __dirname + '/app', {
      numWorkers: 2
    , workerTimeout: '100ms'
  });

  
proxy.use(
  uphook('/deploy-fcip-repo', {
    branch: 'master'
  , cmd: 'make deploy'
  , cwd: __dirname
}));


master.listen(1206, function(err){
  console.log('something bad happened, ', err);
});