var request = require("request")
  , parseString = require("xml2js").parseString
  , q = require('q')
  , express = require("express")
  , urls =  {
      fb: "https://api.facebook.com/restserver.php?method=links.getStats&urls=%urls",
      contest: "http://contest.theamazingsociety.com/_fa/contest/%contestKey",
      getEntries: "http://contest.theamazingsociety.com/_fa/contest_entries?filter=contest_key.eq(%contestKey)",
      entry: "http://contest.theamazingsociety.com/%contestKey/contributions/%entryKey"
  };


function getContest(contestKey) {
  var deferred = q.defer();

  console.log('getContest', contestKey);

  request(urls.contest.replace('%contestKey', contestKey), function(error, response, body) {
    deferred.resolve(JSON.parse(body));
  });

  return deferred.promise;
}

function getEntries(contest) {
  var deferred = q.defer();

  console.log('getEntries', contest.key);

  request(urls.getEntries.replace('%contestKey', contest.key), function(error, response, body) {
    var url = urls.entry.replace('%contestKey', contest.key_name)
      , result;

    result = JSON.parse(body).map(function (entry) {
      return url.replace('%entryKey', entry.key_name);
    });

    deferred.resolve(result);
  });

  return deferred.promise;
}

function getLinkDataFromFacebook(entryUrls) {
  var deferred = q.defer();

  console.log('getLinkDataFromFacebook', entryUrls.length);

  request(urls.fb.replace('%urls', entryUrls.join(',')), function(error, response, body) {
    deferred.resolve(body);
  });

  return deferred.promise;
}

function xml2json(xml) {
  var deferred = q.defer();

  console.log('xml2json', xml.length);

  parseString(xml, function (err, json) {
    deferred.resolve(json);
  });

  return deferred.promise;
}

function summarize(result) {
  var stats = result.links_getStats_response.link_stat
    , result = { likes: 0, comments: 0, shares: 0, total: 0 }
    , deferred = q.defer();

  stats.forEach(function (stat) {
    result.likes += parseInt(stat.like_count.pop(), 10);
    result.comments += parseInt(stat.comment_count.pop(), 10);
    result.shares += parseInt(stat.share_count.pop(), 10);
    result.total += parseInt(stat.total_count.pop(), 10);
  });

  deferred.resolve(result);

  return deferred.promise;
}
var logfmt = require("logfmt");
var app = express();

app.use(logfmt.requestLogger());

app.get('/', function(req, res) {
  res.send('Hello World!');
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});


var contestKey = 'ahFlfmFtYXppbmctY29udGVzdHIUCxIHQ29udGVzdCIHbjlkOW1rYQw';

/*
getContest(contestKey)
  .then(getEntries)
  .then(getLinkDataFromFacebook)
  .then(xml2json)
  .then(summarize)
  .then(function (result) {
    console.log(result);
  });

*/
