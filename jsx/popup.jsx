/** @jsx React.DOM */
/*jshint ignore:start */



var Popup = React.createClass({
  mixins: [Draggable],
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