/** @jsx React.DOM */

var React = require('react')
  , Table = require('./table.react')
  , Actions = require('../shared/actions');


function totalStats(contest, entries) {
  var total = {}
    , keys = Object.keys(contest);

  keys.forEach(function (key) {
    total[key] = contest[key] + entries[key];
  });

  return total;
}

var Stats = React.createClass({

  render: function () {
    var stats = this.props.data
      , total = totalStats(stats.contest, stats.entries);

    return (
      <div className="app">
        <div className="pure-g">
          <div className="pure-u-1-3">
            <Table label="Contest" data={stats.contest} /> 
          </div>
          <div className="pure-u-1-3">
            <Table label="Entries" data={stats.entries} /> 
          </div>
          <div className="pure-u-1-3">
            <Table label="Total" data={total} /> 
          </div>
          <button onClick={this._onReset} className="fs-btn pure-button pure-button-primary">Enter new link</button>
        </div>
      </div>
    );
  },

  _onReset: function () {
    Actions.resetStats(); 
  }

});

module.exports = Stats;
