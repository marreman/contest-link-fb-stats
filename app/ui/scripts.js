/** @jsx React.DOM */

var React = require('react')
  , $ = require('jquery');

function getLinkData(link, callback) {
  var req = $.get('/stats', { link: link });
  req.success(renderResult);
}

function renderResult(stats) {
  React.renderComponent(
    <Stats likes={stats.likes}
           comments={stats.comments}
           shares={stats.shares}
           clicks={stats.clicks}
           total={stats.total} />,
    document.getElementById('app')
  );
}

var Stats = React.createClass({
  render: function () {
      var _this = this;
      var rows = ['likes', 'comments', 'shares', 'clicks', 'total'].map(function (key) {
        return (
          <tr>
            <td><strong>{key}</strong></td>
            <td className="fs-text-right">{_this.props[key]}</td>
          </tr>
        );
      });
    return (
      <div>
        <h1>Result</h1>
        <table className="fs-result-table pure-table pure-table-horizontal">
          {rows}
        </table>
      </div>
    );
  }
});

var SubmitButton = React.createClass({
  render: function () {
    return (
      <button type="submit" className="pure-button pure-button-primary">Get stats</button>
    );
  }
});

var Form = React.createClass({
  
  handleSubmit: function (event) {
    event.preventDefault();
    console.log(this.state.link);
    getLinkData(this.state.link);
  },
  
  _onChange: function(event) {
    this.setState({
      link: event.target.value || ''
    });
  },
  
  getInitialState: function () {
    return {
      link: ''
    }
  },
  
  render: function () {
    return (
      <form onSubmit={this.handleSubmit} className="fs-form pure-form" action="/stats" method="get">
        <h1>Get number of likes, comments and shares <br/>via this incredibly convinent tool.</h1>
        <input onChange={this._onChange} className="fs-input pure-input" type="text" name="link" placeholder="Paste contest link here…"/>
        <SubmitButton/>
      </form>
    );
  }
  
});

React.renderComponent(
  <Form />,
  document.getElementById('app')
);