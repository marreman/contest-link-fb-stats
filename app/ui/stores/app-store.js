var EventEmitter = require('events').EventEmitter
  , merge = require('react/lib/merge')
  , Dispatcher = require('../shared/dispatcher')
  , Constants = require('../shared/constants');

var LOADING_EVENT = 'loading';

var api = merge(EventEmitter.prototype, {
  isLoading: false,
  onLoadingChange: function (callback) {
    this.on(LOADING_EVENT, callback);
  }
});

Dispatcher.register(function (payload) {
  
  switch (payload.actionType) {
    case Constants.STATS_FETCH:
      api.isLoading = true;
      api.emit(LOADING_EVENT);
      break;
    case Constants.STATS_FETCHED:
      api.isLoading = false;
      api.emit(LOADING_EVENT);
      break;
  }
  
});

module.exports = api;