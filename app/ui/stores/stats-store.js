var EventEmitter = require('events').EventEmitter
  , merge = require('react/lib/merge')
  , $ = require('jquery')
  , Dispatcher = require('../shared/dispatcher')
  , Constants = require('../shared/constants')
  , Actions = require('../shared/actions');

var _stats = {};

var CHANGE_EVENT = 'change';

var api = merge(EventEmitter.prototype, {

  getStats: function () {
    return _stats;
  },

  hasStats: function () {
    return !!Object.keys(_stats).length;
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.off(CHANGE_EVENT, callback);
  }

});

function fetchStats(link) {
  $.get('/stats', { link: link }).success(function (stats) {
    _stats = stats;
    Actions.statsFetched();
  });
}

Dispatcher.register(function (payload) {

  switch (payload.actionType) {
    case Constants.STATS_FETCH:
      fetchStats(payload.link);
      break;
    case Constants.STATS_FETCHED:
      api.emit(CHANGE_EVENT);
      break;
    case Constants.STATS_RESET:
      _stats = {};
      api.emit(CHANGE_EVENT);
      break;
  }

});

module.exports = api;
