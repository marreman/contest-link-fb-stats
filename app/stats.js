var request = require("request")
  , parseString = require("xml2js").parseString
  , q = require('q')
  , urls =  {
      fb: "https://api.facebook.com/restserver.php?method=links.getStats&urls=%urls",
      contest: "http://contest.theamazingsociety.com/_fa/contest/%contestKey",
      getEntries: "http://contest.theamazingsociety.com/_fa/contest_entries?filter=contest_key.eq(%contestKey)",
      entry: "http://contest.theamazingsociety.com/%contestKey/contributions/%entryKey"
  };

function assert(expression) {
  if (!expression) {
    throw new Error('Assertion failed.');
  }
}

function copy(obj) {
  return JSON.parse(JSON.stringify(obj));
}


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
  
  assert(contest.hasOwnProperty('key'));

  console.log('getEntries', contest.key);

  request(urls.getEntries.replace('%contestKey', contest.key), function(error, response, body) {
    var url = urls.entry.replace('%contestKey', contest.key_name)
      , entries = JSON.parse(body)
      , result;
    
    assert(entries instanceof Array, 'entries is not an array');

    result = entries.map(function (entry) {
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
    , partialResultTpl = { likes: 0, comments: 0, shares: 0, clicks: 0, total: 0 }
    , result = { contest: copy(partialResultTpl), entries: copy(partialResultTpl) }
    , deferred = q.defer();
  
  function getDataFromStat() {
    var _this = this
      , stats = Array.prototype.slice.call(arguments);

    stats.forEach(function (stat) {
      _this.likes += parseInt(stat.like_count.pop(), 10);
      _this.comments += parseInt(stat.comment_count.pop(), 10);
      _this.shares += parseInt(stat.share_count.pop(), 10);
      _this.clicks += parseInt(stat.click_count.pop(), 10);
      _this.total += parseInt(stat.total_count.pop(), 10);
    });
  }
  
  getDataFromStat.apply(result.contest, [stats.pop(), stats.pop()]);
  getDataFromStat.apply(result.entries, stats);

  deferred.resolve(result);

  return deferred.promise;
}

module.exports = function (contestUrl, callback) {
  var partialContestUrl = contestUrl.match(/(.*)\?/)[1],
      contestKey = contestUrl.match(/com\/(.*)\?/)[1];
  
  getContest(contestKey)
    .then(getEntries)
    .then(function (entryUrls) {
      var deferred = q.defer();
      
      entryUrls.push(contestUrl, partialContestUrl);
      deferred.resolve(entryUrls);

      return deferred.promise;
    })
    .then(getLinkDataFromFacebook)
    .then(xml2json)
    .then(summarize)
    .then(callback);
};