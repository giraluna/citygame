/// <reference path="../../lib/react.d.ts" />

module UIComponents
{
  
export var CellInfo = React.createClass({
  render: function()
  {
    return(
      React.DOM.div( {className:"cellinfo"}, 
        React.DOM.span(null, this.props.cell.type),
        React.DOM.br(null),
        React.DOM.span(null, this.props.cell.landValue)
      )
    );
  }
});

}