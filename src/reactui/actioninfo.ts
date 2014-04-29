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

    var textSpan = this.props.text && this.props.data.approxCost ?
      [React.DOM.span(null, this.props.text), React.DOM.br(null)] :
      null;
    var timeSpan = this.props.data.approxTime ?
      [React.DOM.span(null, "~" + this.props.data.approxTime + " days"), React.DOM.br(null)] :
      null;
    var costSpan = this.props.data.approxCost ?
      [React.DOM.span(null, "~" + this.props.data.approxCost + "$"), React.DOM.br(null)] :
      null;
    return(
      React.DOM.div( {className:"action-info"}, 
        textSpan,
        timeSpan,
        costSpan
      )
    );
  }
});

}