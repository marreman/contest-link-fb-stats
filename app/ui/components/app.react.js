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
      view = <Stats data={this.state.stats} />;
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