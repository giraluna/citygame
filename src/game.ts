/// <reference path="../lib/pixi.d.ts" />

/// <reference path="board.ts" />
/// <reference path="mouseeventhandler.ts" />
/// <reference path="keyboardeventhandler.ts" />
/// <reference path="spritehighlighter.ts" />
/// <reference path="uidrawer.ts" />
/// <reference path="reactui/reactui.ts" />
/// <reference path="systemsmanager.ts" />
/// <reference path="board.ts" />
/// <reference path="board.ts" />
/// <reference path="board.ts" />

module CityGame
{
  export class Game
  {
    boards: Board[] = [];
    activeBoard: Board;
    indexOfActiveBoard: number;
    tools: any = {};
    activeTool: Tool;
    mouseEventHandler: MouseEventHandler;
    keyboardEventHandler: KeyboardEventHandler;
    spriteHighlighter: SpriteHighlighter;
    stage: PIXI.Stage;
    renderer: any;
    layers: any = {};
    uiDrawer: UIDrawer;
    reactUI: ReactUI;
    systemsManager: SystemsManager;
    worldRenderer: WorldRenderer;
    players: {[id: string]: Player;} = {};
    toolCache: any = {};
    editModes: string[] = [];
    currentMode: string;

    frameImages: {[id: string]: HTMLImageElement;};
    constructor()
    {
    }
    init()
    {
      this.resize();

      this.initContainers();
      this.initTools();
      this.bindElements();
      this.loadOptions();

      for (var i = 0; i < AMT_OF_BOARDS; i++)
      {
        this.boards.push(new Board({width: TILES}));
      }
      this.changeActiveBoard(0);
      this.updateBoardSelect();

      this.spriteHighlighter = new SpriteHighlighter();

      this.mouseEventHandler = new MouseEventHandler();
      this.mouseEventHandler.camera = new Camera(this.layers["main"], 0.5);

      this.keyboardEventHandler = new KeyboardEventHandler();

      this.uiDrawer = new UIDrawer();

      this.systemsManager = new SystemsManager(1000);
      var id = "player" + (idGenerator.player++);
      var player = new Player(id);
      //player.addMoney(100, "initial");
      this.reactUI = new ReactUI(player, this.frameImages);
      this.players[player.id] = player;
      
      // TODO have content types register themselves
      var dailyProfitSystem = new ProfitSystem(1, this.systemsManager, this.players,
        ["fastfood", "shopping", "parking", "factory", "hotel", "apartment", "office"]);
      this.systemsManager.addSystem("dailyProfitSystem", dailyProfitSystem);

      /*
      var monthlyProfitSystem = new ProfitSystem(30, this.systemsManager, this.players,
        ["apartment"]);
      var quarterlyProfitSystem = new ProfitSystem(90, this.systemsManager, this.players,
        ["office"]);
      this.systemsManager.addSystem("monthlyProfitSystem", monthlyProfitSystem);
      this.systemsManager.addSystem("quarterlyProfitSystem", quarterlyProfitSystem);
      */

      this.systemsManager.addSystem("delayedAction", new DelayedActionSystem(1, this.systemsManager));
      this.systemsManager.addSystem("autosave", new AutosaveSystem(60, this.systemsManager));

      var dateSystem = new DateSystem(1, this.systemsManager,
        document.getElementById("date") );
      this.systemsManager.addSystem("date", dateSystem);

      this.editModes = ["play", "edit-world"];
      this.switchEditingMode("play");

      eventManager.dispatchEvent({type:"changeMapmode",
        content:"landValue"});

      this.resize();
      this.render();
      this.updateWorld();

      window.setInterval(this.updateSystems.bind(this), 1000);

      /*
      game.uiDrawer.makeFadeyPopup(
        [SCREEN_WIDTH / 2, SCREEN_HEIGHT/2],
        [0, 0],
        5000,
        new PIXI.Text("ctrl+click to scroll\nshift+click to zoom",{
          font: "bold 50px Arial",
          fill: "#222222",
          align: "center"
        }),
        TWEEN.Easing.Quartic.In
      );*/
      }
      initContainers()
      {
        var _stage = this.stage = new PIXI.Stage(0xFFFFFF);
        var _renderer = this.renderer =
          PIXI.autoDetectRenderer(SCREEN_WIDTH, SCREEN_HEIGHT, null, false, true);
          
        var _main = this.layers["main"] = new PIXI.DisplayObjectContainer();
        _main.position.set(SCREEN_WIDTH / 2 - WORLD_WIDTH/2,
          SCREEN_HEIGHT / 2 - WORLD_HEIGHT/2);
        _stage.addChild(_main);

        var _tooltips = this.layers["tooltips"] = new PIXI.DisplayObjectContainer();
        _stage.addChild(_tooltips);

        this.worldRenderer = new WorldRenderer(WORLD_WIDTH, WORLD_HEIGHT);
        _main.addChild(this.worldRenderer.worldSprite);

        var _game = this;

        _stage.mousedown = _stage.touchstart = function(event)
        {
          _game.mouseEventHandler.mouseDown(event, "stage");
        }
        _stage.mousemove = _stage.touchmove = function(event)
        {
          _game.mouseEventHandler.mouseMove(event, "stage");
        }
        _stage.mouseup = _stage.touchend = function(event)
        {
          _game.mouseEventHandler.mouseUp(event, "stage");
        }
        _stage.mouseupoutside = _stage.touchendoutside = function(event)
        {
          game.mouseEventHandler.mouseUp(event, "stage");
        }

      }
      initTools()
      {
        this.tools.nothing = new NothingTool();

        this.tools.water = new WaterTool();
        this.tools.grass = new GrassTool();
        this.tools.sand = new SandTool();
        this.tools.snow = new SnowTool();
        this.tools.remove = new RemoveTool();
        this.tools.plant = new PlantTool();
        this.tools.house = new HouseTool();
        this.tools.road = new RoadTool();
        this.tools.subway = new SubwayTool();

        this.tools.click = new ClickTool();
        this.tools.buy = new BuyTool();
        this.tools.build = new BuildTool();
        this.tools.sell = new SellTool();
      }

      bindElements()
      {
        var self = this;

        //zoom
        var zoomBtn = document.getElementById("zoomBtn");
        addClickAndTouchEventListener(zoomBtn, function()
          {
            var zoomAmount = document.getElementById("zoom-amount")["value"];
            game.mouseEventHandler.camera.zoom( zoomAmount );
          });
        //tools
        for (var toolName in this.tools)
        {
          var btn = document.getElementById( ""+toolName+"Btn" );
          (function addBtnFn(btn, toolName)
          {
            var tool = self.tools[toolName];
            var type = tool.type;

            if (tool.button === null)
            {
              // added for toggling button, but can't be used to select tool
              if (btn) tool.button = btn;
              return;
            }

            else tool.button = btn;

            addClickAndTouchEventListener(btn, function()
            {
              self.changeTool([type]);
            });
          })(btn, toolName);
        }
        //save & load
        var saveBtn = document.getElementById("saveBtn");
        var loadBtn = document.getElementById("loadBtn");

        var saveFN = function()
        {
          eventManager.dispatchEvent(
          {
            type: "makeSavePopup", content: ""
          });
        };
        var loadFN = function()
        {
          eventManager.dispatchEvent(
          {
            type: "makeLoadPopup", content: ""
          });
        };
        addClickAndTouchEventListener(saveBtn, saveFN);
        addClickAndTouchEventListener(loadBtn, loadFN);

        eventManager.addEventListener("saveGame", function(event)
        {
          self.save(event.content);
        });
        eventManager.addEventListener("loadGame", function(event)
        {
          self.load(event.content);
        });

        //recruit
        var recruitBtn = document.getElementById("recruitBtn");
        
        var recruitFN = function()
        {
          if ( Object.keys(self.players["player0"].employees).length < 1 )
          {
            // TODO
            if (false)
            {
              eventManager.dispatchEvent({type: "makeInfoPopup", content:
                {
                  text: ["Already used initial recruitment.",
                  "Wait 5 seconds and try again (todo)"]
                }
              });
            }
            else
            {
              self.players["player0"].usedInitialRecruit = true;
              eventManager.dispatchEvent({type: "makeRecruitCompletePopup", content:
                {
                  player: self.players["player0"],
                  employees: makeNewEmployees(randInt(4, 6), 2 *
                    self.players["player0"].modifierEffects.recruitQuality),
                  delay: 0
                }
              });
              window.setTimeout(function()
                {
                  self.players["player0"].usedInitialRecruit = false;
                }, 5 * 1000)
            }
          }
          else
          {
            eventManager.dispatchEvent({type: "makeRecruitPopup", content:
              {
                player: self.players["player0"]
              }
            });
          }
        }

        addClickAndTouchEventListener(recruitBtn, recruitFN);

        eventManager.addEventListener("recruit", recruitFN);

        //build
        var buildBtn = document.getElementById("buildBtn");

        var onBuildingSelect = function(selected, continuous: boolean)
        {
          self.tools.build.changeBuilding(selected, continuous);
          self.changeTool("build");
        }

        addClickAndTouchEventListener(buildBtn, function()
        {
          eventManager.dispatchEvent({type: "makeBuildingSelectPopup", content:
            {
              player: self.players["player0"],
              onOk: onBuildingSelect
            }
          });
        });

        eventManager.addEventListener("changeBuildingType", function(e)
        {
          onBuildingSelect(e.content.building, e.content.continuous);
        });

        eventManager.addEventListener("changeTool", function(e)
        {
          self.changeTool(e.content.type);
          var continuous;

          if (Options.autoSwitchTools)
          {
            continuous = e.content.continuous;
          }
          else
          {
            continuous = !e.content.continuous;
          }

          self.tools[e.content.type].continuous = continuous;
        });

        //renderer
        this.bindRenderer();

        //resize
        window.addEventListener("resize", game.resize, false);

        eventManager.addEventListener("autosave", function(e)
        {
          self.autosave();
        });

        //edit mode select
        var editmodeSelect = <HTMLInputElement> document.getElementById("editmode-select");
        editmodeSelect.addEventListener("change", function(event)
        {
          self.switchEditingMode(editmodeSelect.value);
        });

        //regen world
        addClickAndTouchEventListener(
        document.getElementById("regen-world"), function()
        {
          var oldMapmode = game.worldRenderer.currentMapmode;
          self.resetLayers();
          self.activeBoard.destroy();
          self.boards[self.indexOfActiveBoard] = new Board({width: TILES});

          self.changeActiveBoard(self.indexOfActiveBoard);
          
          eventManager.dispatchEvent(
          {
            type: "changeMapmode",
            content: oldMapmode
          });
          eventManager.dispatchEvent(
          {
            type: "updateWorld",
            content: ""
          });
          self.updateBoardSelect();
        });
        // board select
        var boardSelect = <HTMLInputElement> document.getElementById("board-select");
        boardSelect.addEventListener("change", function(event)
        {
          self.changeActiveBoard( parseInt(boardSelect.value) );
        });


        // react side menu stuff
        eventManager.addEventListener("changeZoom", function(event)
        {
          self.mouseEventHandler.camera.zoom( event.content );
        });

        // prestige
        eventManager.addEventListener("prestigeReset", function(event)
        {
          self.prestigeReset(event.content);
        });

        //info
        // under loader.ts
        
        //stats
        addClickAndTouchEventListener(
        document.getElementById("show-stats"), function()
        {
          eventManager.dispatchEvent({type:"toggleFullScreenPopup", content: "stats"});
        });

        // changelog
        addClickAndTouchEventListener(
        document.getElementById("show-changelog"), function()
        {
          eventManager.dispatchEvent({type:"toggleFullScreenPopup", content: "changelog"});
        });

        // options
        addClickAndTouchEventListener(
        document.getElementById("show-options"), function()
        {
          eventManager.dispatchEvent({type:"toggleFullScreenPopup", content: "options"});
        });

        eventManager.addEventListener("saveOptions", self.saveOptions);
        
    }
    bindRenderer()
    {
      var _canvas = document.getElementById("pixi-container");
      _canvas.appendChild(this.renderer.view);
      this.renderer.view.setAttribute("id", "pixi-canvas");
    }
    updateBoardSelect()
    {
      var boardSelect = <HTMLSelectElement> document.getElementById("board-select");
      var oldValue = boardSelect.value || "0";
      while (boardSelect.children.length > 0)
      {
        boardSelect.remove(0);
      }
      for (var i = 0; i < this.boards.length; i++)
      {
        var opt = document.createElement("option");
        opt.value = "" + i;
        opt.text = this.boards[i].name;

        boardSelect.add(opt);
      }
      boardSelect.value = oldValue;
    }
    updateWorld(clear?: boolean)
    {
      eventManager.dispatchEvent({type: "updateWorld", content:{clear: clear}});
    }
    resize()
    {
      var container = window.getComputedStyle(
        document.getElementById("pixi-container"), null );
      SCREEN_WIDTH = parseInt(container.width);
      SCREEN_HEIGHT = parseInt(container.height);
      if (game.renderer)
      {
        game.renderer.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
      }
      if (window.innerWidth <= 600)
      {
        eventManager.dispatchEvent({type: "resizeSmaller", content:""});
      }
      else if (window.innerWidth > 600)
      {
        eventManager.dispatchEvent({type: "resizeBigger", content:""});
      }
    }

    changeTool( tool )
    {
      var oldTool = this.activeTool;
      this.activeTool = this.tools[tool];

      if (oldTool && oldTool.button)
      {
        oldTool.button.classList.toggle("selected-tool");
      }
      if (this.activeTool.button)
      {
        this.activeTool.button.classList.toggle("selected-tool");
      }
      if (this.activeTool.onChange)
      {
        this.activeTool.onChange();
      }

      if (this.activeTool.mapmode)
      {
        eventManager.dispatchEvent(
        {
          type: "changeMapmode",
          content: this.activeTool.mapmode
        });
      }
    }
    changeActiveBoard(index: number)
    {
      var oldBoard = this.activeBoard;

      this.activeBoard = this.boards[index];
      this.indexOfActiveBoard = index;

      this.worldRenderer.setBoard(this.activeBoard);
    }
    destroyAllBoards()
    {
      for (var i = 0; i < this.boards.length; i++)
      {
        this.boards[i].destroy();
      }
    }
    getCell(props:
    {
      gridPos: number[];
      boardId: number;
    })
    {
      var boardIndex = undefined;
      for (var i = 0; i < this.boards.length; i++)
      {
        if (this.boards[i].id == props.boardId)
        {
          boardIndex = i;
          break;
        }
      }
      if (boardIndex === undefined) throw new Error("No board found with id" +
        props.boardId)
      else
      {
        return this.boards[boardIndex].getCell(props.gridPos);
      }
    }
    save(name: string)
    {
      var toSave =
      {
        player: this.savePlayer(this.players["player0"]),
        boards: this.saveBoards(this.boards),
        date: new Date(),
        gameDate: this.systemsManager.systems.date.getDate(),
        gameTick: this.systemsManager.tickNumber,
        pendingActions: this.saveActions(this.systemsManager.systems.delayedAction)
      }
      localStorage.setItem(name, JSON.stringify(toSave));
    }
    autosave()
    {
      // TODO
      var autosaveLimit = Options.autosaveLimit;
      var autosaves = [];
      for (var saveGame in localStorage)
      {
        if (saveGame.match(/autosave/))
        {
          autosaves.push(saveGame);
        }
      }
      autosaves.sort();
      autosaves = autosaves.slice(0, autosaveLimit - 1)
      for (var i = autosaves.length - 1; i >= 0; i--)
      {
        localStorage.setItem("autosave" + (i + 2),
          localStorage.getItem(autosaves[i]));
      }
      this.save("autosave");
    }
    load(name: string)
    {
      var parsed = JSON.parse(localStorage.getItem(name));
      this.activeBoard = null;
      this.loadPlayer(parsed.player);
      this.loadBoards(parsed);
      this.loadActions(parsed.pendingActions);

      if (parsed.gameTick) this.systemsManager.tickNumber = parsed.gameTick;

      eventManager.dispatchEvent({type: "clearReact", content:""});

      // legacy
      if (parsed.gameDate) this.systemsManager.systems.date.setDate(parsed.gameDate);
    }
    saveBoards(boardsToSave: Board[])
    {
      var savedBoards = [];
      for (var k = 0; k < boardsToSave.length; k++)
      {
        var data: any = {};
        var board = boardsToSave[k];

        data.width = board.width;
        data.height = board.height;
        data.population = board.population;
        data.name = board.name;
        data.cells = [];
        data.id = board.id;

        var typeToKey: any = {};
        var keyGen = 0;

        for (var i = 0; i < board.cells.length; i++)
        {
          data.cells[i] = [];
          for (var j = 0; j < board.cells[i].length; j++)
          {
            var boardCell = board.cells[i][j];
            var cell: any = data.cells[i][j] = {};

            if (!typeToKey[boardCell.type.type])
            {
              typeToKey[boardCell.type.type] = ++keyGen;
            }
            cell.type = typeToKey[boardCell.type.type];

            if (boardCell.player)
            {
              cell.player = boardCell.player.id;
            }
            if (boardCell.content && boardCell.content.baseCell === boardCell)
            {
              var contentToAdd = boardCell.content.type.type;
              if (boardCell.content.type.baseType === "road")
              {
                contentToAdd = "road_nesw";
              }

              if (!typeToKey[contentToAdd])
              {
                typeToKey[contentToAdd] = ++keyGen;
              }
              cell.content =
              {
                type: typeToKey[contentToAdd],
                player: boardCell.content.player ?
                  boardCell.content.player.id : null
              }
            }
            if (boardCell.undergroundContent)
            {
              cell.undergroundContent = true;
            }
          }
        }
        data.key = (function()
        {
          var reverseIndex:any = {};
          for (var i = 0; i < Object.keys(typeToKey).length; i++)
          {
            var prop = Object.keys(typeToKey)[i];
            reverseIndex[typeToKey[prop]] = prop;
          }
          return reverseIndex;
        })();
      }
      savedBoards.push(data);

      return savedBoards;
    }
    loadBoards(data: any)
    {
      this.resetLayers();
      this.destroyAllBoards();

      var boardsToLoad = [];
      var newBoards = [];
      var cachedBoardIndex = data.cachedBoardIndex || 0;

      // legacy
      if (data.board)
      {
        boardsToLoad.push(data.board);
      }

      else
      {
        boardsToLoad = data.boards;
      }
      if (boardsToLoad.length === 0) throw new Error("No boards to load");



      for (var k = 0; k < boardsToLoad.length; k++)
      {
        var currToLoad = boardsToLoad[k];
        var key = currToLoad.key;

        //legacy
        if (!key)
        {
          for (var i = 0; i < currToLoad.cells.length; i++)
          { 
            for (var j = 0; j < currToLoad.cells[i].length; j++)
            {
              var cell = currToLoad.cells[i][j];
              if (cell.player)
              {
                cell.player = this.players[cell.player];
                if (cell.content)
                {
                  cell.content.player = this.players[cell.content.player];
                }
              }
            }
          }
        }
        else
        {
          for (var i = 0; i < currToLoad.cells.length; i++)
          { 
            for (var j = 0; j < currToLoad.cells[i].length; j++)
            {
              var cell = currToLoad.cells[i][j];

              cell.type = key[cell.type];

              if (cell.content)
              {
                cell.content.type = key[cell.content.type];
              }
              if (cell.player)
              {
                cell.player = this.players[cell.player];
                if (cell.content)
                {
                  cell.content.player = this.players[cell.content.player];
                }
              }
            }
          }
        }

        var board = new Board(
        {
          width: currToLoad.width,
          height: currToLoad.height,
          savedCells: currToLoad.cells,
          population: currToLoad.population
        });

        board.name = currToLoad.name || board.name;
        board.id = currToLoad.id || board.id;

        newBoards.push(board);
      }
      
      game.boards = newBoards;
      game.changeActiveBoard(cachedBoardIndex);

      eventManager.dispatchEvent({type: "updateWorld", content:{clear: true}});
      this.updateBoardSelect();
    }

    savePlayer(player: Player)
    {
      var data: any = {};
      data.id = player.id;
      data.money = player.money;
      data.clicks = player.clicks;
      data.experience = player.experience;


      data.employees = {};
      for (var _e in player.employees)
      {
        data.employees[_e] = {};
        for (var prop in player.employees[_e])
        {
          if (prop === "trait")
          {
            if (player.employees[_e].trait)
            {
              data.employees[_e].trait = player.employees[_e].trait.type;
            }
          }
          else if (prop !== "player")
          {
            data.employees[_e][prop] = player.employees[_e][prop]
          }
        }
      }
      data.modifiers = [];
      for (var _mod in player.modifiers)
      {
        data.modifiers.push(player.modifiers[_mod].type);
      }
      data.levelUpModifiers = [];
      for (var _mod in player.levelUpModifiers)
      {
        data.levelUpModifiers.push(player.levelUpModifiers[_mod].type);
      }
      data.levelsAlreadyPicked = player.levelsAlreadyPicked;

      data.prestige =
      {
        prestige: player.prestige,
        timesReset: player.timesReset,
        permanentLevelupUpgrades: player.permanentLevelupUpgrades,
        totalResetExperience: player.totalResetExperience
      }

      data.stats =
      {
        incomePerType: player.incomePerType
      }

      return data;
    }
    loadPlayer(data: any)
    {
      var player = new Player(data.id);
      
      player.money = data.money;

      player.experience = data.experience || 0;
      player.clicks = data.clicks || 0;

      if (data.stats)
      {
        player.incomePerDate = data.stats.incomePerDate || {};
        player.incomePerType = data.stats.incomePerType || {};
      }

      for (var _mod in data.modifiers)
      {
        player.addModifier(
          playerModifiers[data.modifiers[_mod]], "modifiers", false);
      }
      for (var _mod in data.levelUpModifiers)
      {
        player.addLevelUpModifier(levelUpModifiers[data.levelUpModifiers[_mod]], false, false);
      }
      player.levelsAlreadyPicked = data.levelsAlreadyPicked || {};

      for (var employee in data.employees)
      {
        data.employees[employee] = new Employee(names, data.employees[employee]);

        player.addEmployee(data.employees[employee]);
      }

      if (data.prestige)
      {
        for (var prop in data.prestige)
        {
          player[prop] = data.prestige[prop];
        }
      }

      player.setInitialAvailableModifiers();
      player.applyPermedModifiers();
      player.applyPrestige();

      this.players["player0"] = player;
      this.reactUI.player = player;
      player.addExperience(0); // refresh
      player.updateElements();
    }
    saveOptions()
    {
      localStorage.setItem("options", JSON.stringify(Options));
    }
    loadOptions()
    {
      var parsed = JSON.parse(localStorage.getItem("options"));

      for (var _prop in parsed)
      {
        Options[_prop] = parsed[_prop];
      }
    }
    saveActions(system: DelayedActionSystem)
    {
      var toSave = [];

      for (var _tick in system.callbacks)
      {
        var _actions = system.callbacks[_tick];
        for (var i = 0; i < _actions.length; i++)
        {
          toSave.push({type: _actions[i].type,
            data: _actions[i].data});
        }
      }

      return toSave;
    }
    loadActions(toLoad: any[])
    {
      game.systemsManager.systems.delayedAction.reset();
      if (!toLoad || toLoad.length < 1) return;
      for (var i = 0; i < toLoad.length; i++)
      {
        var currAction = toLoad[i];

        actions[currAction.type].call(null, currAction.data);
      }
    }
    prestigeReset(onReset)
    {
      var player = this.players["player0"];

      if (player.level < 100) return;

      var resetWithSelectedModifier = function(toPerm)
      {
        var newPlayer = new Player(player.id);

        newPlayer.incomePerDate = Object.create(player.incomePerDate);
        newPlayer.incomePerType = Object.create(player.incomePerType);

        newPlayer.timesReset = player.timesReset + 1;
        newPlayer.totalResetExperience = player.totalResetExperience + player.experience;
        newPlayer.permanentLevelupUpgrades = player.permanentLevelupUpgrades.slice(0);
        if (toPerm) newPlayer.permanentLevelupUpgrades.push(toPerm.data.modifier.type);

        newPlayer.applyPermedModifiers();
        newPlayer.applyPrestige();

        newPlayer.setInitialAvailableModifiers();

        this.players[player.id] = newPlayer;
        this.reactUI.player = newPlayer;
        newPlayer.addExperience(0); // refresh
        newPlayer.updateElements();

        this.resetLayers();
        this.destroyAllBoards();

        var newBoards = [new Board({width: TILES})];

        this.boards = newBoards;
        this.changeActiveBoard(0);

        eventManager.dispatchEvent({type: "updateWorld", content:{clear: true}});
        eventManager.dispatchEvent({type: "clearReact", content:""});
        this.updateBoardSelect();

        if (onReset) onReset.call();
        return true;
      }.bind(this);

      var modifiersAvailableToPerm = [];
      for (var _mod in player.levelUpModifiers)
      {
        var modifier = player.levelUpModifiers[_mod];
        if (player.permanentLevelupUpgrades.indexOf(modifier.type) < 0)
        {
          modifiersAvailableToPerm.push(modifier);
        }
      }
      var currPrestige = player.getPrestige(player.totalResetExperience);
      var newPrestige = player.getPrestige(player.experience + player.totalResetExperience);
      var prestigeGained = newPrestige - currPrestige;

      eventManager.dispatchEvent({type:"makeModifierPopup",
        content:
        {
          player: player,
          text:
          [
            "Congratulations on reaching level 100!",
            "You can start over from scratch in a new city",
            "",
            "You would gain an additional " + prestigeGained.toFixed(1) + " prestige",
            "for a total of " + newPrestige.toFixed(1) + " prestige",
            "You can also permanently unlock one of the following upgrades:"
          ],
          modifierList: modifiersAvailableToPerm,
          onOk: resetWithSelectedModifier,
          okBtnText: "Reset",
          excludeCost: true
        }
      });

    }
    render()
    {
      this.renderer.render(this.stage);

      TWEEN.update();

      requestAnimFrame( this.render.bind(this) );
    }
    updateSystems()
    {
      this.systemsManager.update();
    }
    resetLayers()
    {
      this.worldRenderer.clearLayers();
      this.worldRenderer.initLayers();
      this.worldRenderer.render();
    }
    switchEditingMode(newMode: string)
    {
      if (newMode === this.currentMode) return;

      this.toolCache[this.currentMode] = this.activeTool ?
        this.activeTool.type : "nothing";

      if (!this.toolCache[newMode])
      {
        this.changeTool("nothing");
      }
      else
      {
        this.changeTool(this.toolCache[newMode]);
      }
      for (var j = 0; j < this.editModes.length; j++)
      {
        var editMode = this.editModes[j];

        if (newMode !== editMode)
        {
          var toToggle = <any> document.getElementsByClassName(editMode);
          for (var i = 0; i < toToggle.length; i++)
          {
            toToggle[i].classList.add("hidden");
          }
        }
        else
        {
          var toToggle = <any> document.getElementsByClassName(editMode);
          for (var i = 0; i < toToggle.length; i++)
          {
            toToggle[i].classList.remove("hidden");
          }
        }
      }
      this.currentMode = newMode;
      var el = <HTMLInputElement> document.getElementById("editmode-select")
      el.value = newMode;
    }
  }
}
