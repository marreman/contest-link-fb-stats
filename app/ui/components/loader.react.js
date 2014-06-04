/** @jsx React.DOM */

var React = require('react');

var Loader = React.createClass({
  render: function () {
    return (
      <div className="spinner"></div>
    );
  }
});

module.exports = Loader;