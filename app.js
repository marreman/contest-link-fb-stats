var logfmt = require("logfmt")
  , express = require("express")
  , getStats = require("./stats");

(function () {
  var app = express()
    , port = Number(process.env.PORT || 5000);
  
  app.use(logfmt.requestLogger());
  app.get('/', function(req, res) {
    getStats(req.query.id, function (stats) {
      res.set('Content-Type', 'application/json');
      res.send(stats);
    });
  });
  app.listen(port);
}());



var contestKey = 'ahFlfmFtYXppbmctY29udGVzdHIUCxIHQ29udGVzdCIHbjlkOW1rYQw';



