/// <reference path="../../lib/react.d.ts" />
/// 
/// <reference path="js/draggable.d.ts" />
 
module UIComponents
{

export var Popup = React.createClass({
  mixins: [Draggable],
  render: function()
  {
    var text;
    if (Array.isArray(this.props.text))
    {
      text = []
      for (var i = 0; i < this.props.text.length; i++)
      {
        text.push(this.props.text[i]);
        text.push(React.DOM.br(null));
      }
    }
    else
    {
      text = this.props.text;
    }
    console.log("2");
    return(
      React.DOM.div( {className:"popup", style: this.props.initialStyle}, 
        React.DOM.p( {className:"popup-text"}, text ),
        this.props.content,
        React.DOM.div( {className:"popup-buttons"}, 
          this.props.buttons
        )
      )
    );
  }
});

}