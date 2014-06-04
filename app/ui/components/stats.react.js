/** @jsx React.DOM */

var React = require('react');

var keys = ['likes', 'comments', 'shares', 'clicks', 'total'];

var StatsTable = React.createClass({
  
  render: function () {
      var data = this.props.data;
      var rows = keys.map(function (key) {
        return (
          <tr>
            <td><strong>{key}</strong></td>
            <td className="fs-text-right">{data[key]}</td>
          </tr>
        );
      });
    return (
      <div className="fs-stats-table">
        <h1>{this.props.label}</h1>
        <table className="fs-result-table pure-table pure-table-horizontal">
          {rows}
        </table>
      </div>
    );
  }
});

module.exports = StatsTable;