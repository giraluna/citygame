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
    var data = this.props.data;
    var textSpan = this.props.text && Object.keys(this.props.data).length > 0 ?
      [React.DOM.span(null, this.props.text), React.DOM.br(null)] :
      null;

    var timeSpan = null;
    if (data.time)
    {
      var timeString = "invalid time";
      if (data.time.approximate === true)
      {
        timeString = "~" + data.time.amount + " days";
      }
      else if (data.time.approximate === false)
      {
        timeString = "" + data.time.amount + " days";
      }
      timeSpan = [React.DOM.span(null, timeString), React.DOM.br(null)];
    }

    var costSpan = null;
    if (data.cost)
    {
      var costString = "invalid cost";
      if (data.cost.approximate === true)
      {
        costString = "~" + data.cost.amount + "$";
      }
      else if (data.cost.approximate === false)
      {
        costString = "" + data.cost.amount + "$";
      }
      costSpan = [React.DOM.span(null, costString), React.DOM.br(null)];
    }

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