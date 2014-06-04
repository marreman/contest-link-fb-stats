/** @jsx React.DOM */

var React = require('react')
  , StatsActions = require('../shared/actions');

var Form = React.createClass({
  
  getInitialState: function () {
    return {
      link: ''
    }
  },
  
  render: function () {
    return (
      <form onSubmit={this._onSubmit} className="fs-form pure-form" action="/stats" method="get">
        <h1>Get number of likes, comments and shares <br/>via this incredibly convenient tool.</h1>
        <input onChange={this._onChange} className="fs-input pure-input" type="text" name="link" placeholder="Paste contest link here…"/>
        <br />
        <button type="submit" className="fs-btn pure-button pure-button-primary">Get stats</button>
      </form>
    );
  },
  
  _onSubmit: function (event) {
    event.preventDefault();
    StatsActions.fetchStats(this.state.link);
  },
  
  _onChange: function(event) {
    this.setState({
      link: event.target.value || ''
    });
  },
  
});

module.exports = Form;