/** @jsx React.DOM */
/*jshint ignore:start */

var UIComponents = UIComponents || {};

UIComponents.CellInfo = React.createClass({
  render: function()
  {
    return(
      <div className="cellinfo">
        <span>{this.props.cell.type}</span>
        <br>
        <span>{this.props.cell.landValue}</span>
      </div>
    );
  }
});