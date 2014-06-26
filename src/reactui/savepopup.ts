/// <reference path="../../lib/react.d.ts" />
/// 
/// <reference path="../js/eventlistener.d.ts" />
///
/// <reference path="js/draggable.d.ts" />
/// <reference path="js/splitmultilinetext.d.ts" />
/// 
/// <reference path="js/list.d.ts" />

module UIComponents
{

  /**
   * props:
   *   games:
   *   [
   *     {
   *       name: string;
   *       date: date;
   *     }
   *   ]
   */
  
  // TODO merge stuff with load popups
  export var SavePopup = React.createClass({
    mixins: [Draggable, SplitMultilineText],

    componentDidMount: function()
    {
      var setValue = function()
      {
        this.refs.inputElement.getDOMNode().value =
          this.refs.savedGameList.state.selected.data.name;
      }.bind(this);

      window.setTimeout(setValue, 50);
      
    },

    handleOk: function(e)
    {
      var self = this;

      var toSaveAs = this.refs.inputElement.getDOMNode().value;
      var overwriting = false;
      for (var save in localStorage)
      {
        if (toSaveAs === save) overwriting = true;
      }

      if (!toSaveAs)
      {
        eventManager.dispatchEvent({
          type: "makeInfoPopup", content:{text: "Select a name to save as"}
        });
        return false;
      }

      if (overwriting)
      {
        eventManager.dispatchEvent(
        {
          type: "makeConfirmPopup",
          content:
          {
            text: ["Are you sure you want to overwrite this save?",
            toSaveAs],
            onOk: onOkFN
          }
        });
        return false;
      }

      function onOkFN()
      {
        var callbackSuccessful =
          self.props.onOk.call(null, toSaveAs);
        if (callbackSuccessful !== false)
        {
          self.handleClose();
        }
      }

      onOkFN();
    },
    handleClose: function()
    {
      this.props.onClose.call();
    },

    render: function()
    {
      var self = this;
      var savedGames = [];

      for (var savedGame in localStorage)
      {
        var parsed = JSON.parse(localStorage[savedGame]);
        var date = new Date(parsed.date);
        var prettyDate = 
        [
          [
            date.getDate(),
            date.getMonth() + 1,
            date.getFullYear().toString().slice(2,4)
          ].join("/"),
          [
            date.getHours(),
            date.getMinutes().toString().length < 2 ? "0" + date.getMinutes() : date.getMinutes().toString()
          ].join(":")
        ].join(" ");
        savedGames.push(
        {
          key: savedGame,
          data:
          {
            name: savedGame,
            date: prettyDate,
            accurateDate: date,
            del: React.DOM.a(
              {
                href: "#",
                onClick: function(name)
                {
                  eventManager.dispatchEvent(
                  {
                    type: "makeConfirmPopup",
                    content:
                    {
                      text: ["Are you sure you want to delete this save?",
                      name],
                      onOk: function()
                      {
                        localStorage.removeItem(name);
                      }
                    }
                  });
                }.bind(null, savedGame)
              }, "X")
          }
        });
      };

      var columns =
      [
        {
          label: "Name",
          key: "name"
        },
        {
          label: "Date",
          key: "date",
          defaultOrder: "desc",
          propToSortBy: "accurateDate"
        },
        {
          label: "Delete",
          key: "del",
          notSortable: true
        }
      ];

      var stopBubble = function(e){e.stopPropagation();};

      var okBtn = React.DOM.button(
      {
        ref: "okBtn",
        onClick: this.handleOk,
        onTouchStart: this.handleOk,
        draggable: true,
        onDrag: stopBubble
      }, this.props.okBtnText || "Save");

      var closeBtn = React.DOM.button(
      {
        onClick: this.handleClose,
        onTouchStart: this.handleClose,
        draggable: true,
        onDrag: stopBubble
      }, this.props.closeBtnText || "Cancel");

      var inputElement = React.DOM.input(
      {
        ref: "inputElement",
        type: "text"
      });

      return(

        React.DOM.div(
        {
          className:"popup",
          style: this.props.initialStyle,
          draggable: true,
          onDragStart: this.handleDragStart,
          onDrag: this.handleDrag,
          onDragEnd: this.handleDragEnd,
          onTouchStart: this.handleDragStart,
        },
          React.DOM.p( {className:"popup-text"}, "Select name to save as"),
          React.DOM.div( {className:"popup-content", draggable: true, onDrag: stopBubble},

            UIComponents.List(
            {
              // TODO fix declaration file and remove
              // typescript qq without these
              selected: null,
              columns: null,
              sortBy: null,
              initialColumn: columns[1],
              ref: "savedGameList",

              listItems: savedGames,
              initialColumns: columns,
              onRowChange: function(row)
              {
                self.refs.inputElement.getDOMNode().value = row.data.name;
              }
            }),
            React.DOM.br(null),
            inputElement
          ),
          React.DOM.div( {className:"popup-buttons"}, 
            okBtn,
            closeBtn
          )
          
        )
      );

    }
  });
}