/** @jsx React.DOM */
/*jshint ignore:start */

var Popup = React.createClass({
  getInitialState: function()
  {
    return {hide: false};
  },
  close: function()
  {
   this.setState({hide: true});
  },
  render: function()
  {
    return(
      <div className="popup">
        <button className="popup-close" onClick={this.close}>X</button>
        <div className="popup-content">{this.props.content}</div>
      </div>
    );
  }
});