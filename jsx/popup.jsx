/** @jsx React.DOM */
/*jshint ignore:start */

var UIComponents = UIComponents || {};

UIComponents.Popup = React.createClass({
  mixins: [Draggable],
  close: function()
  {
    destroyPopup(this.props.key);
  },
  handleOk: function()
  {

  },
  render: function()
  {
    return(
      <div className="popup">
        //<button className="popup-close" onClick={this.close}>X</button>
        {this.props.content}
        <div className="popup-buttons">
          <button onClick={this.handleOk}>{this.props.okText}</button>
          <button onClick={this.close}>{this.props.closeText}</button>
        </div>
      </div>
    );
  }
});