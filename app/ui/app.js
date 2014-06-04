/** @jsx React.DOM */

var React = require('react')
  , App = require('./components/app.react');

React.renderComponent(
  <App/>,
  document.getElementById('app')
);