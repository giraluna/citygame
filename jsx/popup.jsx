/** @jsx React.DOM */
/*jshint ignore:start */


var ReactUI = ReactUI || {};
(function ()
{
  var Popup = React.createClass({
    close: function()
    {
      destroyPopup(this.props.key);
    },
    render: function()
    {
      return(
        <div className="popup">
          <button className="popup-close" onClick={this.close}>X</button>
          {this.props.key}
          <div className="popup-content">{this.props.content}</div>
        </div>
      );
    }
  });
})();
