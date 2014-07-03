var Dispatcher = require('./dispatcher')
  , Constants = require('./constants');

module.exports = {

  fetchStats: function (link) {
    Dispatcher.dispatch({
      actionType: Constants.STATS_FETCH,
      link: link
    });
  },

  resetStats: function () {
    Dispatcher.dispatch({
      actionType: Constants.STATS_RESET
    });
  },

  statsFetched: function () {
    Dispatcher.dispatch({
      actionType: Constants.STATS_FETCHED
    });
  }

};
