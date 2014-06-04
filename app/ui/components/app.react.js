/** @jsx React.DOM */

var React = require('react')
  , StatsStore = require('../stores/stats-store')
  , AppStore = require('../stores/app-store')
  , Form = require('./form.react')
  , Stats = require('./stats.react')
  , Loader = require('./loader.react')
  , Actions = require('../shared/actions');

var StatsApp = React.createClass({
  
  getInitialState: function () {
    return { stats: null }
  },
  
  componentDidMount: function () {
    StatsStore.addChangeListener(this._onChange);
    AppStore.onLoadingChange(this._onLoadingChange);
  },
  
  componentDidUnmount: function () {
    StatsStore.removeChangeListener(this._onChange);
  },
  
  render: function () {
    var view
      , stats;
    if (AppStore.isLoading) {
      view = <Loader />;
    } else if (StatsStore.hasStats()) {
      stats = this.state.stats;
      view = (
        <div className="pure-g">
          <div className="pure-u-1-2">
            <Stats label="Contest" data={stats.contest} /> 
          </div>
          <div className="pure-u-1-2">
            <Stats label="Entries" data={stats.entries} /> 
          </div>
          <button onClick={this._onReset} className="fs-btn pure-button pure-button-primary">Enter new link</button>
        </div>
      );
    } else {
      view = <Form />
    }
      
    return (
      <div className="app">
        {view}
      </div>
    );
  },
    
  _onLoadingChange: function () {
    this.setState({
      loading: AppStore.isLoading
    });
  },
  
  _onReset: function () {
    Actions.resetStats(); 
    this._onChange();
  },
        
  _onChange: function () {
    this.setState({
      stats: StatsStore.getStats()
    })
  }
});

module.exports = StatsApp;