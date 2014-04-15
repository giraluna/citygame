/// <reference path="../../lib/react.d.ts" />

module UIComponents
{

/**
 * props:
 * text
 * approx action time
 * approx cost
 * 
 */
export var ActionInfo = React.createClass({
  render: function()
  {
    return(
      React.DOM.div( {className:"action-info"}, 
        React.DOM.span(null, this.props.text || null),
        React.DOM.br(null),
        React.DOM.span(null, this.props.data.approxTime || null + " days"),
        React.DOM.br(null),
        React.DOM.span(null, this.props.data.approxCost || null + "$")
      )
    );
  }
});

}