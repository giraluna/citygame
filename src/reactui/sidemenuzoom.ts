/// <reference path="../../lib/react.d.ts" />
/// 
/// <reference path="../js/eventlistener.d.ts" />

module UIComponents
{

export var SideMenuZoom = React.createClass(
{
  getInitialState: function()
  {
    return {zoom: 1};
  },
  handleZoomChange: function(event)
  {
    var target = <HTMLInputElement> event.target;

    this.setState({zoom: parseFloat(target.value)});
  },
  handleZoomSubmit: function(event)
  {
    event.preventDefault();
    eventManager.dispatchEvent({type: "changeZoom", content:this.state.zoom});
    return false;
  },
  render: function()
  {
    return(
      React.DOM.form( {
          id:"size-menu-zoom",
          className:"grid-row",
          onSubmit: this.handleZoomSubmit
        },
        React.DOM.input(
          {
            type:"number",
            className:"grid-row",
            id:"zoom-amount",
            defaultValue:"1",
            step:0.1,
            onChange: this.handleZoomChange
          }),
        React.DOM.button( {id:"zoomBtn", className:"grid-row"}, "zoom")
      )
    );
  }

});

}