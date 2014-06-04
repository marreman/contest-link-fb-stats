var logfmt = require("logfmt")
  , express = require("express")
  , renderFile = require('ejs').renderFile
  , getStats = require("./stats");

(function () {
  var app = express()
    , port = Number(process.env.PORT || 5000);
  
  app.engine('html', renderFile);
  
  app.set('view engine', 'html');
  app.set('views', __dirname + '/views');
  
  app.use(logfmt.requestLogger());
  
  app.use(express.static(__dirname + '/public'));
  
  app.get('/', function (req, res) {
    res.render('index.html');
  });
  
  app.get('/stats', function(req, res) {
    getStats(req.query.link, function (stats) {
      res.set('Content-Type', 'application/json');
      res.send(stats);
    });
  });
  
  app.listen(port);
}());