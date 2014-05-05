/// <reference path="../lib/pixi.d.ts" />
/// <reference path="../lib/tween.js.d.ts" />
/// 
/// <reference path="reactui/js/reactui.d.ts" />
/// <reference path="../data/js/cg.d.ts" />
/// 
/// <reference path="js/ui.d.ts" />
/// <reference path="js/loader.d.ts" />
/// 
/// <reference path="js/player.d.ts" />
/// <reference path="js/systems.d.ts" />
/// <reference path="js/eventlistener.d.ts" />
/// <reference path="js/spritehighlighter.d.ts" />
/// <reference path="js/keyboardinput.d.ts" />
/// 
/// <reference path="js/utility.d.ts" />
/// <reference path="js/arraylogic.d.ts" />


var SCREEN_WIDTH = 720,
    SCREEN_HEIGHT = 480,
    TILE_WIDTH = 64,
    TILE_HEIGHT = 32,
    TILES = 32,
    WORLD_WIDTH = TILES * TILE_WIDTH,
    WORLD_HEIGHT = TILES * TILE_HEIGHT,
    ZOOM_LEVELS = [1];

var idGenerator = idGenerator || {};
idGenerator.content = 0;
idGenerator.player = 0;


class Sprite extends PIXI.Sprite
{
  type: string;
  content: Content;

  constructor( template )
  {
    var _texture = PIXI.Texture.fromFrame(
      template.frame);
    super(_texture); //pixi caches and reuses the texture as needed
    
    this.type    = template.type;
    this.anchor = arrayToPoint(template.anchor);

    if (template.interactive === true)
    {
      this.interactive = true;
      this.hitArea = arrayToPolygon(template.hitArea);
    }
  }
}

class GroundSprite extends Sprite
{
  cell: Cell;

  constructor(type, cell)
  {
    this.cell = cell;
    super(type);
  }
}

class ContentSprite extends Sprite
{
  content: Content;

  constructor(type, content)
  {
    this.content = content;
    super(type);
  }
}

class Content
{
  type: any;
  baseType: string;
  categoryType: string;
  id: number;
  sprite: Sprite;
  cell: Cell;
  flags: string[];

  baseProfit: number = 0;
  multiplier: number = 1;
  modifiedProfit: number = 0;
  modifiers: any = {};
  player: Player;

  constructor( cell: Cell, type: any, player?: Player)
  {
    this.cell = cell;
    this.type = type;
    this.baseType = type["baseType"] || undefined;
    this.categoryType = type["categoryType"] || undefined;
    this.flags = type["flags"] ? type["flags"].slice(0) : [];
    this.flags.push(this.baseType, this.categoryType);

    if (player)
    {
      this.baseProfit = type.baseProfit;
      // TODO
      this.modifiedProfit = this.baseProfit;
      this.player = player;
      player.addContent(this);
    }

    this.init( type );
  }
  init( type )
  {
    var _s = this.sprite = new ContentSprite( type, this );
    var cellSprite = this.cell.sprite;
    var gridPos = this.cell.gridPos;
    _s.position = this.cell.sprite.position.clone();
    game.layers["content"]._addChildAt(_s, gridPos[0] + gridPos[1]);
  }
}


interface neighborCells
{
  n: Cell;
  e: Cell;
  s: Cell;
  w: Cell;
  ne: Cell;
  nw: Cell;
  se: Cell;
  sw: Cell;
}
class Cell
{
  type: string;
  sprite: Sprite;
  content: Content;
  landValue: number;
  gridPos: number[];
  flags: string[];
  modifiers: any = {};

  constructor( gridPos, type )
  {
    this.gridPos = gridPos;
    this.type = type;
    this.landValue = randInt(40, 50);

    this.init(type);
  }
  init( type:string )
  {
    var _s = this.sprite = new GroundSprite( type, this );
    this.flags = type["flags"].slice(0);
  }
  getScreenPos(container)
  {
    var wt = container.worldTransform;
    var zoom = wt.a;
    var offset = [wt.tx + WORLD_WIDTH/2 * zoom, wt.ty + TILE_HEIGHT/2 * zoom];
    
    return getIsoCoord(this.gridPos[0], this.gridPos[1], TILE_WIDTH * zoom, TILE_HEIGHT * zoom, offset)
  }
  getNeighbors(diagonal:boolean = false): neighborCells
  {
    var neighbors: neighborCells =
    {
      n: undefined,
      e: undefined,
      s: undefined,
      w: undefined,
      ne: undefined,
      nw: undefined,
      se: undefined,
      sw: undefined
    };
    var hasNeighbor =
    {
      n: undefined,
      e: undefined,
      s: undefined,
      w: undefined
    };
    var cells = game.board.cells;
    var size = game.board.width;
    var x = this.gridPos[0];
    var y = this.gridPos[1];


    hasNeighbor.s = (y+1 < size) ? true : false;
    hasNeighbor.e = (x+1 < size) ? true : false;
    hasNeighbor.n = (y-1 >= 0)   ? true : false;
    hasNeighbor.w = (x-1 >= 0)   ? true : false;


    neighbors.s = hasNeighbor["s"] ? cells[x]  [y+1] : undefined;
    neighbors.e = hasNeighbor["e"] ? cells[x+1][y]   : undefined;
    neighbors.n = hasNeighbor["n"] ? cells[x]  [y-1] : undefined;
    neighbors.w = hasNeighbor["w"] ? cells[x-1][y]   : undefined;

    if (diagonal === true)
    {
      neighbors.ne = (hasNeighbor["n"] && hasNeighbor["e"]) ?
        cells[x+1][y-1] : undefined;
      neighbors.nw = (hasNeighbor["n"] && hasNeighbor["w"]) ?
        cells[x-1][y-1] : undefined;
      neighbors.se = (hasNeighbor["s"] && hasNeighbor["e"]) ?
        cells[x+1][y+1] : undefined;
      neighbors.sw = (hasNeighbor["s"] && hasNeighbor["w"]) ?
        cells[x-1][y+1] : undefined;
    }

    return neighbors; 
  }
  getArea(size: number, anchor:string="center")
  {
    var gridPos = this.gridPos;

    var start = [gridPos[0], gridPos[1]];
    var end = [gridPos[0], gridPos[1]];
    var boardSize = game.board.width;

    var adjust = [[0,0], [0,0]];

    if (anchor === "center")
    {
      adjust = [[-1, -1], [1, 1]];
    };
    if (anchor === "ne")    
    {
      adjust[1] = [-1, 1];
    };
    if (anchor === "se")    
    {
      adjust[1] = [-1, -1];
    };
    if (anchor === "sw")    
    {
      adjust[1] = [1, -1];
    };
    if (anchor === "nw")    
    {
      adjust[1] = [1, 1];
    };

    for (var i = 0; i < size; i++)
    {
      start[0] += adjust[0][0];
      start[1] += adjust[0][1];
      end[0] += adjust[1][0];
      end[1] += adjust[1][1];
    }
    var rect = rectSelect(start, end);
    return game.board.getCells(rect);
  }
  replace( type:string ) //change base type of tile
  {
    var _texture = type["frame"];
    this.sprite.setTexture( PIXI.Texture.fromFrame( _texture ));
    this.sprite.type = this.type = type;
    this.flags = type["flags"].slice(0);
    if (this.content && this.content.baseType === "plant")
    {
      this.addPlant();
    }
    else if(this.content)
    {
      if ( !this.checkBuildable(this.content.type, false) )
      {
        this.changeContent("none");
      }
      else
      {
        this.changeContent( this.content.type );
      }
    }
  }
  changeContent( type:string, update:boolean=true, player?: Player)
  {
    var buildable = this.checkBuildable(type);
    var toAdd: boolean = ( type !== "none" && buildable !== false );
    var toRemove: boolean = ( type === "none" || toAdd );

    if ( toRemove )
    {
      this.removeContent();
    }

    if ( toAdd )
    {
      this.addContent( type, player);
    }
    if (update)
    {
      this.updateCell();
    }
  }
  checkBuildable( type: any, checkContent: boolean = true )
  {
    if (type === "none") return true;


    // implicitly true
    var canBuild = true;

    // check invalid
    if (type.canNotBuildOn)
    {
      // check if any flags in cell conflict with type.canNotBuildOn
      canBuild = arrayLogic.not(this.flags, type.canNotBuildOn);
      // same with content
      if (checkContent && canBuild !== false && this.content)
      {
        canBuild = arrayLogic.not(this.content.flags, type.canNotBuildOn);
      }
    }

    if (canBuild === false)
    {
      return false
    }
    // if there are no conflicts, finally check if it's valid
    else
    {
      var valid = true;

      if (type.canBuildOn)
      {
        valid = arrayLogic.or(this.flags, type.canBuildOn);
        if (checkContent && !valid && this.content)
        {
          valid = arrayLogic.or(this.content.flags, type.canBuildOn);
        }
      }
      return valid;
    }

  }
  addPlant()
  {
    var type = this.type["type"];
    var plants = cg["content"]["plants"][type];

    this.changeContent( getRandomProperty( plants ) );
  }
  updateCell()
  {
    getRoadConnections(this, 1);
  }
  addContent( type: any, player?: Player )
  {
    this.content = new Content( this, type, player);

    if (type.effect)
    {
      this.propagateModifier(type.translatedEffect);
    }
    
    return this.content;
  }
  removeContent()
  {
    if (this.content === undefined)
    {
      return;
    }
    if (this.content.player)
    {
      this.content.player.removeContent(this.content);
    }
    if (this.content.type.effect)
    {
      this.removePropagatedModifier(this.content.type.translatedEffect);
    }
    game.layers["content"]._removeChildAt(this.content.sprite,
      this.gridPos[0] + this.gridPos[1]);

    this.content = undefined;
  }
  addModifier(modifier)
  {
    if (!this.modifiers[modifier.type])
    {
      this.modifiers[modifier.type] = Object.create(modifier);
    }
    else
    {
      this.modifiers[modifier.type].strength += modifier.strength;
    };

    if (arrayLogic.or(modifier.targets, this.flags)
      || (this.content && arrayLogic.or(modifier.targets, this.content.flags) ))
    {
      this.applyModifiersToContent()
    }
  }
  removeModifier(modifier)
  {
    if (!this.modifiers[modifier.type]) return;
    this.modifiers[modifier.type].strength -= modifier.strength;
    if (this.modifiers[modifier.type].strength <= 0)
    {
      delete this.modifiers[modifier.type];
    }
    this.applyModifiersToContent();
  }
  propagateModifier(modifier)
  {
    var effectedCells = this.getArea(modifier.range);
    for (var cell in effectedCells)
    {
      effectedCells[cell].addModifier(modifier);
    }
  }
  removePropagatedModifier(modifier)
  {
    var effectedCells = this.getArea(modifier.range);
    for (var cell in effectedCells)
    {
      effectedCells[cell].removeModifier(modifier);
    }
  }
  applyModifiersToContent()
  {
    if (!this.content) return;
    for (var modifierType in this.modifiers)
    {
      var modifier = this.modifiers[modifierType];

      if (this.content && arrayLogic.or(modifier.targets, this.flags)
        || (this.content && arrayLogic.or(modifier.targets, this.content.flags) ))
      {
        for (var prop in modifier.effect)
        {
          this.content[prop] += ( 1 + Math.log(modifier.strength) ) * modifier.effect[prop];
        }
      }
    }
  }

}

class Board
{
  width: number;
  height: number;
  cells: Cell[][];
  constructor(width= TILES, height= TILES)
  {
    this.width = width;
    this.height = height
    this.cells = [];

    this.init();
  }
  init()
  {
    for (var i=0; i<this.width; i++)
    {
      this.cells[i] = [];
    }
  }
  /*makeEmptyMap()
  {
    for (var i = 0; i < this.width; i++)
    {
      for (var j = 0; j < this.height; j++)
      {
        var cellType = "grass";
        var cell = this.cells[i][j] = new Cell([i, j], cellType);
        var sprite = cell.sprite;
        sprite.position = arrayToPoint( getIsoCoord(i, j,
          TILE_WIDTH, TILE_HEIGHT,
          [WORLD_WIDTH/2, TILE_HEIGHT]) );
        game.layers["ground"].addChild(sprite);
      }
    }
  }*/
  makeMap( data? )
  {
    for (var i = 0; i < this.width; i++)
    {
      for (var j = 0; j < this.height; j++)
      {
        if (data)
        {
          var dataCell = data[i][j] || undefined;
        }
        var cellType = dataCell ? dataCell["type"] : cg["terrain"]["grass"];
        var cell = this.cells[i][j] = new Cell([i, j], cellType);
        cell.flags = dataCell ? dataCell.flags : cellType["flags"];

        var sprite = cell.sprite;
        sprite.position = arrayToPoint( getIsoCoord(i, j,
          TILE_WIDTH, TILE_HEIGHT,
          [WORLD_WIDTH/2, TILE_HEIGHT]) );
        game.layers["ground"].addChild(sprite);
        if (data && dataCell.content)
        {
          cell.changeContent(dataCell.content.type);
        }
      }
    }
  }
  
  getCell(arr: number[]): Cell
  {
    return this.cells[arr[0]][arr[1]];
  }
  getCells(arr:number[]): Cell[]
  {
    return getFrom2dArray(this.cells, arr);
  }
}

class WorldRenderer
{
  layers: any = {};
  renderTexture: PIXI.RenderTexture;
  worldSprite: PIXI.Sprite;
  zoomLevel: number = ZOOM_LEVELS[0];
  
  constructor(width, height)
  {
    this.initContainers(width, height);
    this.initLayers();
    this.addEventListeners();
  }

  addEventListeners()
  {
    var self = this;
    eventManager.addEventListener("changeZoomLevel", function(event)
    {
      self.changeZoomLevel(event.content.zoomLevel);
    });
    eventManager.addEventListener("updateWorld", function(event)
    {
      self.render(event.content.clear);
    });
  }
  initContainers(width, height)
  {
    this.renderTexture = new PIXI.RenderTexture(width, height, game.renderer, PIXI.scaleModes.NEAREST);
    
    var _ws = this.worldSprite = new PIXI.Sprite(this.renderTexture);

    _ws.hitArea = arrayToPolygon(rectToIso(_ws.width, _ws.height));
    _ws.interactive = true;


    for (var i = 0; i < ZOOM_LEVELS.length; i++)
    {
      var zoomStr = "zoom" + ZOOM_LEVELS[i];
      var zoomLayer = this.layers[zoomStr] = {};

      var main = zoomLayer["main"] = new PIXI.DisplayObjectContainer();
    }

    // TEMPORARY
    var self = this;
    _ws.mousedown = _ws.touchstart = function(event)
    {
      game.mouseEventHandler.mouseDown(event, "world");
    }
    _ws.mousemove = _ws.touchmove = function(event)
    {
      game.mouseEventHandler.mouseMove(event, "world");
    }

    _ws.mouseup = _ws.touchend = function(event)
    {
      game.mouseEventHandler.mouseUp(event, "world");
    }
    _ws.mouseupoutside = _ws.touchendoutside = function(event)
    {
      game.mouseEventHandler.mouseUp(event, "world");
    }
  }
  initLayers()
  {
    for (var i = 0; i < ZOOM_LEVELS.length; i++)
    {
      var zoomStr = "zoom" + ZOOM_LEVELS[i];
      var zoomLayer = this.layers[zoomStr];
      var main = zoomLayer["main"];

      var ground  = zoomLayer["ground"]  = new PIXI.DisplayObjectContainer();
      var content = zoomLayer["content"] = new SortedDisplayObjectContainer(TILES * 2);

      main.addChild(ground);
      main.addChild(content);
    }
  }
  clearLayers()
  {
    for (var i = 0; i < ZOOM_LEVELS.length; i++)
    {
      var zoomStr = "zoom" + ZOOM_LEVELS[i];
      var zoomLayer = this.layers[zoomStr];
      var main = zoomLayer["main"];

      if(main.children.length > 0) main.removeChildren();
    }
  }
  changeZoomLevel(level)
  {
    this.zoomLevel = level;
    this.render();
  }
  render(clear: boolean = true)
  {
    var zoomStr = "zoom" + this.zoomLevel;
    var activeMainLayer = this.layers[zoomStr]["main"]
    this.renderTexture.render(activeMainLayer, null, clear);
  }
}

class Game
{
  board: Board;
  tools: any = {};
  activeTool: Tool;
  mouseEventHandler: MouseEventHandler;
  keyboardEventHandler: KeyboardEventHandler;
  highlighter: Highlighter;
  stage: PIXI.Stage;
  renderer: any;
  layers: any = {};
  uiDrawer: UIDrawer;
  reactUI: ReactUI;
  systemsManager: SystemsManager;
  worldRenderer: WorldRenderer;
  players: {[id: string]: Player;} = {};

  frameImages: {[id: string]: HTMLImageElement;};
  constructor()
  {
  }
  init()
  {
    this.resize();

    this.initContainers();
    this.initTools();
    this.changeTool("grass");
    this.bindElements();

    this.board = new Board(TILES, TILES);
    this.board.makeMap();

    this.highlighter = new Highlighter();

    this.mouseEventHandler = new MouseEventHandler();
    this.mouseEventHandler.scroller = new Scroller(this.layers["main"], 0.5);

    this.keyboardEventHandler = new KeyboardEventHandler();

    this.uiDrawer = new UIDrawer();

    this.systemsManager = new SystemsManager(1000);
    var player = new Player(idGenerator.player++);
    player.addMoney(100);
    this.reactUI = new ReactUI(player);
    this.players[player.id] = player;
    var apartmentProfitSystem = new ProfitSystem(1, this.systemsManager, this.players, "apartment");
    this.systemsManager.addSystem("apartmentProfit", apartmentProfitSystem);
    this.systemsManager.addSystem("delayedAction", new DelayedActionSystem(1, this.systemsManager));

    var dateSystem = new DateSystem(1, this.systemsManager,
      document.getElementById("date") );
    this.systemsManager.addSystem("date", dateSystem);

    this.resize();
    this.render();
    this.updateWorld();

    // TEMPORARY
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
      );
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

      this.initLayers();

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
    initLayers()
    {
      this.layers["ground"] = this.worldRenderer.layers["zoom1"]["ground"];
      this.layers["content"] = this.worldRenderer.layers["zoom1"]["content"];
    }
    initTools()
    {
      this.tools.water = new WaterTool();
      this.tools.grass = new GrassTool();
      this.tools.sand = new SandTool();
      this.tools.snow = new SnowTool();
      this.tools.remove = new RemoveTool();
      this.tools.plant = new PlantTool();
      this.tools.house = new HouseTool();
      this.tools.road = new RoadTool();
      this.tools.buy = new BuyTool();
      this.tools.build = new BuildTool(); 
    }

    bindElements()
    {
      var self = this;

      //zoom
      var zoomBtn = document.getElementById("zoomBtn");
      addClickAndTouchEventListener(zoomBtn, function()
        {
          var zoomAmount = document.getElementById("zoom-amount")["value"];
          game.mouseEventHandler.scroller.zoom( zoomAmount );
        });
      //tools
      for (var tool in this.tools)
      {
        var btn = document.getElementById( ""+tool+"Btn" );
        (function addBtnFn(btn, tool)
        {
          addClickAndTouchEventListener(btn, function()
          {
            self.changeTool([tool]);
          });
        })(btn, tool);
      }
      //save & load
      var saveBtn = document.getElementById("saveBtn");
      var loadBtn = document.getElementById("loadBtn");
      addClickAndTouchEventListener(saveBtn, function()
      {
        self.save();
      });
      addClickAndTouchEventListener(loadBtn, function()
      {
        self.load();
      });

      //recruit
      var recruitBtn = document.getElementById("recruitBtn");

      addClickAndTouchEventListener(recruitBtn, function()
      {
        if ( Object.keys(self.players["player0"].employees).length < 1 )
        {
          // TODO
          if ( false) //self.players["player0"].usedInitialRecruit)
          {
            eventManager.dispatchEvent({type: "makeInfoPopup", content:
              {
                text: ["Already used initial recruitment.",
                "Wait 5 seconds (todo)"]
              }
            });
          }
          else
          {
            self.players["player0"].usedInitialRecruit = true;
            eventManager.dispatchEvent({type: "makeRecruitCompletePopup", content:
              {
                player: self.players["player0"],
                employees: makeNewEmployees(randInt(4, 6), 2)
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
      });

      //info
      addClickAndTouchEventListener(
      document.getElementById("show-info"), function()
      {
        document.getElementById("info-container").style.display="flex";
      });
      addClickAndTouchEventListener(
      document.getElementById("close-info"), function()
      {
        document.getElementById("info-container").style.display="none";
      });

      //renderer
      this.bindRenderer();

      //resize
      window.addEventListener('resize', game.resize, false);
  }
  bindRenderer()
  {
    var _canvas = document.getElementById("pixi-container");
    _canvas.appendChild(this.renderer.view);
  }
  updateWorld(clear?: boolean)
  {
    eventManager.dispatchEvent({type: "updateWorld", content:{clear: clear}});
  }
  resize()
  {
    var container = window.getComputedStyle(
      document.getElementById("pixi-container"), null );
    SCREEN_WIDTH = parseInt(container.width) / window.devicePixelRatio;
    SCREEN_HEIGHT = parseInt(container.height) / window.devicePixelRatio;
    if (game.renderer)
    {
      game.renderer.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
    }
  }

  changeTool( tool )
  {
    this.activeTool = this.tools[tool];
  }
  save()
  {
    this.saveBoard();
    this.savePlayer();
  }
  load()
  {
    this.loadBoard();
    this.loadPlayer();
  }
  saveBoard()
  {
    var data = JSON.stringify(this.board,
      function replacerFN(key, value)
      {
        var replaced= {};
        if (typeof(value) === "object")
        {
          switch (key)
          {
            case "content":
              replaced =
              {
                "type": this.content.type,
                "id": this.content.id
              };
              return replaced;

            case "sprite":
              return this.sprite.type;
              
            default:
              return value;
          }
        }
        return value;
      });
    localStorage.setItem("board", data);
  }
  loadBoard()
  {
    this.resetLayers();
    var parsed = JSON.parse( localStorage.getItem("board") );
    var board = this.board = new Board(parsed["width"], parsed["height"]);
    board.makeMap( parsed["cells"] );
    eventManager.dispatchEvent({type: "updateWorld", content:{clear: true}});
  }
  // TODO
  savePlayer()
  {
    var player = this.players["player0"];
    var toSave = JSON.stringify(player,
      function replacerFN(key, value)
      {
        switch (key)
        {
          case "moneySpan":
          case "incomeSpan":
            return undefined;

          
            
          default:
            return value;
        }
      });
    localStorage.setItem("player", toSave);
  }
  loadPlayer()
  {
    var data = JSON.parse(localStorage.getItem("player"));
    for (var employee in data.employees)
    {
      data.employees[employee] = new Employee(TEMPNAMES, data.employees[employee]);
    }
    var newPlayer = new Player(data.id);
    for (var prop in data)
    {
      if (data[prop] !== undefined)
      {
        newPlayer[prop] = data[prop];
      }

    }
    this.players["player0"] = newPlayer;
  }
  render()
  {
    this.renderer.render(this.stage);

    TWEEN.update();

    this.systemsManager.update();
    requestAnimFrame( this.render.bind(this) );
  }
  resetLayers()
  {
    this.worldRenderer.clearLayers();
    this.worldRenderer.initLayers();
    this.initLayers();
    this.worldRenderer.render();
  }
}

class SortedDisplayObjectContainer extends PIXI.DisplayObjectContainer
{
  container: PIXI.DisplayObjectContainer;
  _sortingIndexes: number[];
  // arr[1] = index 1
  // when adding new displayobject increment following indexes
  
  constructor( layers:number)
  {
    this._sortingIndexes = new Array(layers);
    super();
    this.init();
  }
  
  init()
  {
    for (var i = 0; i < this._sortingIndexes.length; i++)
    {
      this._sortingIndexes[i] = 0;
    };
  }
  incrementIndexes(start:number)
  {
    for (var i = start + 1; i < this._sortingIndexes.length; i++)
    {
      this._sortingIndexes[i]++
    }
  }
  decrementIndexes(start:number)
  {
    for (var i = start + 1; i < this._sortingIndexes.length; i++)
    {
      this._sortingIndexes[i]--
    }
  }

  
  _addChildAt(element:PIXI.DisplayObject, index:number)
  {
    super.addChildAt( element, this._sortingIndexes[index] );
    this.incrementIndexes(index);
  }
  _removeChildAt(element:PIXI.DisplayObject, index:number)
  {
    super.removeChild(element);
    this.decrementIndexes(index);
  }
}

class Scroller
{
  container: PIXI.DisplayObjectContainer;
  width: number
  height: number
  bounds: any = {};
  startPos: number[];
  startClick: number[];
  currZoom: number = 1;
  zoomField: any;

  constructor( container:PIXI.DisplayObjectContainer, bound)
  {
    this.container = container;
    this.bounds.min = bound;  // sets clamp limit to percentage of screen from 0.0 to 1.0
    this.bounds.max = Number( (1 - bound).toFixed(1) );
    this.setBounds();
    this.zoomField = document.getElementById("zoom-amount");
  }
  startScroll( mousePos )
  {
    this.setBounds();
    this.startClick = mousePos;
    this.startPos = [this.container.position.x, this.container.position.y];
  }
  end()
  {
    this.startPos = undefined;
  }
  setBounds()
  {
    var rect = this.container.getLocalBounds();
    this.width = SCREEN_WIDTH;
    this.height = SCREEN_HEIGHT;
    this.bounds =
    {
      xMin: (this.width  * this.bounds.min) - rect.width * this.container.scale.x,
      xMax: (this.width  * this.bounds.max),
      yMin: (this.height * this.bounds.min) - rect.height * this.container.scale.y,
      yMax: (this.height * this.bounds.max),
      min: this.bounds.min,
      max: this.bounds.max
    }
  }
  getDelta( currPos )
  {
    var x = this.startClick[0] - currPos[0];
    var y = this.startClick[1] - currPos[1];
    return [-x, -y];
  }
  move( currPos )
  {
    var delta = this.getDelta(currPos);
    this.container.position.x = this.startPos[0] + delta[0];
    this.container.position.y = this.startPos[1] + delta[1];
    this.clampEdges();
  }
  zoom( zoomAmount: number)
  {
    if (zoomAmount > 1)
    {
      //zoomAmount = 1;
    }

    var container = this.container;
    var oldZoom = this.currZoom;
    var zoomDelta = oldZoom - zoomAmount;
    var rect = container.getLocalBounds();
    //var centerX = SCREEN_WIDTH / 2 - rect.width / 2 * zoomAmount;
    //var centerY = SCREEN_HEIGHT / 2 - rect.height / 2 * zoomAmount;

    //these 2 get position of screen center in relation to the container
    //0: far left 1: far right
    var xRatio = 1 - ((container.x - SCREEN_WIDTH/2) / rect.width / oldZoom + 1);
    var yRatio = 1 - ((container.y - SCREEN_HEIGHT/2) / rect.height / oldZoom + 1);

    var xDelta = rect.width * xRatio * zoomDelta;
    var yDelta = rect.height * yRatio * zoomDelta;
    container.position.x += xDelta;
    container.position.y += yDelta;
    container.scale.set(zoomAmount, zoomAmount);
    this.zoomField.value = this.currZoom = zoomAmount;
  }
  deltaZoom( delta, scale )
  {
    if (delta === 0)
    {
      return;
    }
    //var scaledDelta = absDelta + scale / absDelta;
    var direction = delta < 0 ? "out" : "in";
    var adjDelta = 1 + Math.abs(delta) * scale
    if (direction === "out")
    {
      this.zoom(this.currZoom / adjDelta);
    }
    else
    {
      this.zoom(this.currZoom * adjDelta);
    }
  }
  clampEdges()
  {
    var x = this.container.position.x;
    var y = this.container.position.y;

    //horizontal
    //left edge
    if ( x < this.bounds.xMin)
    {
      x = this.bounds.xMin;
    }
    //right edge
    else if ( x > this.bounds.xMax)
    {
      x = this.bounds.xMax;
    }

    //vertical
    //top
    if ( y < this.bounds.yMin )
    {
      y = this.bounds.yMin;
    }
    //bottom
    else if ( y > this.bounds.yMax )
    {
      y = this.bounds.yMax;
    }

    

    this.container.position.set(x, y)
  }
}

class MouseEventHandler
{
  startPoint: number[];
  currPoint: number[];

  startCell: number[];
  currCell: number[];
  hoverCell: number[];

  currAction: string;

  scroller: Scroller
  constructor()
  {
    this.currAction = undefined;
    window.oncontextmenu = function(event)
    {
      var eventTarget = <HTMLElement> event.target;
      if (eventTarget.localName !== "canvas") return;
      event.preventDefault();
      event.stopPropagation();
    };
  }
  mouseDown(event, targetType: string)
  {
    game.uiDrawer.removeActive();
    if (event.originalEvent.button === 2 &&
      this.currAction !== undefined)
    {
      this.currAction = undefined;
      this.startPoint = undefined;
      this.scroller.end();
      game.highlighter.clearSprites();
      game.updateWorld();
    }
    else if (event.originalEvent.ctrlKey ||
      event.originalEvent.metaKey ||
      event.originalEvent.button === 2)
    {
      this.startScroll(event);
    }
    else if (event.originalEvent.shiftKey)
    {
      this.startZoom(event);
    }
    else if (targetType === "world")
    {
      this.startCellAction(event);
    }
  }

  mouseMove(event, targetType: string)
  {
    if (targetType === "stage" &&
      (this.currAction === "zoom" || this.currAction === "scroll"))
    {
      this.stageMove(event);
    }
    else if (targetType === "world" && this.currAction === "cellAction")
    {
      this.worldMove(event);
    }
    else if (targetType === "world" && this.currAction === undefined)
    {
      this.hover(event);
    }
  }
  mouseUp(event, targetType: string)
  {
    if (this.currAction === undefined) return;
    else if (targetType === "stage" &&
      (this.currAction === "zoom" || this.currAction === "scroll"))
    {
      this.stageEnd(event);
    }
    else if (targetType === "world" && this.currAction === "cellAction")
    {
      this.worldEnd(event);
    }

  }

  startScroll(event)
  {
    this.currAction = "scroll";
    this.startPoint = [event.global.x, event.global.y];
    this.scroller.startScroll(this.startPoint);
  }
  startZoom(event)
  {
    this.currAction = "zoom";
    this.startPoint = this.currPoint = [event.global.x, event.global.y];
  }
  stageMove(event)
  {
    if (this.currAction === "scroll")
    {
      this.scroller.move([event.global.x, event.global.y]);
    }
    else if (this.currAction === "zoom")
    {
      var delta = event.global.x + this.currPoint[1] -
        this.currPoint[0] - event.global.y;
      this.scroller.deltaZoom(delta, 0.005);
      this.currPoint = [event.global.x, event.global.y];
    }
  }
  stageEnd(event)
  {
    if (this.currAction === "scroll")
    {
      this.scroller.end();
      this.startPoint = undefined;
      this.currAction = undefined;
    }
    if (this.currAction === "zoom")
    {
      this.startPoint = undefined;
      this.currAction = undefined;
    }
  }
  // need to switch to the click event being transferred to
  // rendertexture parent DOC and checked against individual sprites
  // (that have hit masks) to support slopes / variable height
  startCellAction(event)
  {
    var pos = event.getLocalPosition(event.target);
    var gridPos = getOrthoCoord([pos.x, pos.y], [TILE_WIDTH, TILE_HEIGHT], [TILES, TILES]);

    this.currAction = "cellAction";
    this.startCell = gridPos;

    game.highlighter.clearSprites();
    game.highlighter.tintCells([game.board.getCell(gridPos)], game.activeTool.tintColor);
    game.updateWorld();
  }
  worldMove(event)
  {
    var pos = event.getLocalPosition(event.target);
    var gridPos = getOrthoCoord([pos.x, pos.y], [TILE_WIDTH, TILE_HEIGHT], [TILES, TILES]);

    if ( !this.currCell || gridPos[0] !== this.currCell[0] || gridPos[1] !== this.currCell[1] )
    {
      this.currCell = gridPos;
      var selectedCells = game.board.getCells(
          game.activeTool.selectType(this.startCell, this.currCell));

      game.highlighter.clearSprites();
      game.highlighter.tintCells(selectedCells, game.activeTool.tintColor);
      game.updateWorld();
   }
  }
  worldEnd(event)
  {
    var pos = event.getLocalPosition(event.target);
    var gridPos = getOrthoCoord([pos.x, pos.y], [TILE_WIDTH, TILE_HEIGHT], [TILES, TILES]);

    this.currCell = gridPos;
    var selectedCells = game.board.getCells(
        game.activeTool.selectType(this.startCell, this.currCell));

    game.activeTool.activate(selectedCells);

    game.highlighter.clearSprites();
    this.currAction = undefined;
    game.updateWorld(true);
    /* TEMPORARY
    var cell = game.board.getCell(this.currCell);
    var neighs = cell.getNeighbors()
    game.uiDrawer.makeCellPopup(cell, event.target);
    for (var neigh in neighs)
    {
      if (neighs[neigh])
      {
        game.uiDrawer.makeCellPopup(neighs[neigh], event.target);
      }
    }
    */
  }
  hover(event)
  {
    var pos = event.getLocalPosition(event.target);
    var gridPos = getOrthoCoord([pos.x, pos.y], [TILE_WIDTH, TILE_HEIGHT], [TILES, TILES]);
    // TEMPORARY
    if (!gridPos) return;
    if (gridPos[0] >= TILES || gridPos[1] >= TILES) return;
    else if (gridPos[0] < 0 || gridPos[1] < 0) return;

    if (!this.hoverCell) this.hoverCell = gridPos;
    if (gridPos[0] !== this.hoverCell[0] || gridPos[1] !== this.hoverCell[1])
    {
      this.hoverCell = gridPos;
      game.uiDrawer.removeActive();
      game.uiDrawer.makeCellTooltip(event, game.board.getCell(gridPos), event.target);
    }
  }

}

class UIDrawer
{
  layer: PIXI.DisplayObjectContainer;
  fonts: any = {};
  styles: any = {};
  active: UIObject;

  constructor()
  {
    this.layer = game.layers["tooltips"];
    this.init();
  }
  init()
  {
    this.fonts =
    {
      base:
      {
        font: "18px Arial",
        fill: "#444444",
        align: "left"
      },
      black:
      {
        font: "bold 20pt Arial",
        fill: "000000",
        align: "left"
      }
    }
    this.styles["base"] =
    {
      lineStyle:
      {
        width: 2,
        color: 0x587982,
        alpha: 1
      },
      fillStyle:
      {
        color: 0xE8FBFF,
        alpha: 0.8
      }
    };

  }
  removeActive()
  {
    if (this.active)
    {
      this.active.remove();
      this.active = undefined;
    }
  }

  makeCellTooltip( event, cell: Cell, container: PIXI.DisplayObjectContainer )
  {
    var screenPos = cell.getScreenPos(container);
    var cellX = screenPos[0];
    var cellY = screenPos[1];

    var screenX = event.global.x;
    var screenY = event.global.y;

    var text = cell.modifiers["testModifier"] ? cell.modifiers["testModifier"].strength : "none";
    var font = this.fonts["base"];

    var textObject = new PIXI.Text(text, font);

    var tipDir, tipPos;

    // change slant of the tip based on screen position
    // 100 pix buffer is arbitrary for now
    if (screenX + textObject.width + 100 > SCREEN_WIDTH)
    {
      tipDir = "left"; tipPos = 0.75;
    }
    else
    {
      tipDir = "right"; tipPos = 0.25;
    }
    // same for vertical pos
    var pointing = (screenY - textObject.height - 100 < 0) ? "up" : "down";

    var x = cellX;
    var y = (cell.content && pointing === "down")
      ? cellY - cell.content.sprite.height * cell.content.sprite.worldTransform.a / 2
      : cellY;

    var uiObj = this.active = new UIObject(this.layer)
    .delay( 500 )
    .lifeTime( -1 );

    var toolTip = makeToolTip(
      {
        style: this.styles["base"],
        autoSize: true,
        tipPos: tipPos,
        tipWidth: 10,
        tipHeight: 20,
        tipDir: tipDir,
        pointing: pointing,
        padding: [10, 10]
      }, 
      textObject
      );
    uiObj.position.set(x, y);

    uiObj.addChild(toolTip);
    uiObj.start();

    return uiObj;
  }
  makeCellPopup(cell: Cell, text: string, container: PIXI.DisplayObjectContainer)
  {
    var pos = cell.getScreenPos(container);
    var content = new PIXI.Text(text, this.fonts["black"]);

    this.makeFadeyPopup([pos[0], pos[1]], [0, -20], 2000, content);
  }
  makeFadeyPopup(pos: number[], drift: number[], lifeTime: number, content,
    easing = TWEEN.Easing.Linear.None)
  {
    var tween = new TWEEN.Tween(
      {
        alpha: 1,
        x: pos[0],
        y: pos[1]
        });
    tween.easing(easing);
    

    var uiObj = new UIObject(this.layer)
    .lifeTime(lifeTime)
    .onAdded(function()
    {
      tween.start();
      })
    .onComplete(function()
    {
      TWEEN.remove(tween);
      });

    tween.to(
      {
        alpha: 0,
        x: pos[0] + drift[0],
        y: pos[1] + drift[1]
      }
        , lifeTime)
    .onUpdate(function()
    {
      uiObj.alpha = this.alpha;
      uiObj.position.set(this.x, this.y);
      });

    uiObj.position.set(pos[0], pos[1]);

    if (content.width)
    {
      content.position.x -= content.width / 2;
      content.position.y -= content.height / 2;
    }

    uiObj.addChild(content);

    uiObj.start();
  }

  clearLayer()
  {
    for (var i = this.layer.children.length - 1; i >= 0; i--)
    {
      this.layer.removeChild(this.layer.children[i]);
    }
  }
}

/*
interface Tool
{
  selectType: any;
  tintColor: number;
  activateCost: number;

  activate(target:Cell[]);
}
*/

class Tool
{
  selectType: any;//
  tintColor: number;
  activateCost: number;

  activate(target:Cell[])
  {
    for (var i = 0; i < target.length; i++)
    {
      this.onActivate(target[i]);
    }
  }
  onActivate(target:Cell){}
}


class WaterTool extends Tool
{
  constructor()
  {
    super();
    this.selectType = manhattanSelect;
    this.tintColor = 0x4444FF;
  } 
  onActivate(target: Cell)
  {
    target.replace( cg["terrain"]["water"] );
  }
}

class GrassTool extends Tool
{
  constructor()
  {
    super();
    this.selectType = rectSelect;
    this.tintColor = 0x617A4E;
  } 
  onActivate(target: Cell)
  {
    target.replace( cg["terrain"]["grass"] );
  }
}

class SandTool extends Tool
{
  constructor()
  {
    super();
    this.selectType = rectSelect;
    this.tintColor = 0xE2BF93;
  } 
  onActivate(target: Cell)
  {
    target.replace( cg["terrain"]["sand"] );
  }
}

class SnowTool extends Tool
{
  constructor()
  {
    super();
    this.selectType = rectSelect;
    this.tintColor = 0xBBDFD7;
  } 
  onActivate(target: Cell)
  {
    target.replace( cg["terrain"]["snow"] );
  }
}
class RemoveTool extends Tool
{
  constructor()
  {
    super();
    this.selectType = rectSelect;
    this.tintColor = 0xFF5555;
  } 
  onActivate(target: Cell)
  {
    target.changeContent("none");
  }
}

class PlantTool extends Tool
{
  constructor()
  {
    super();
    this.selectType = rectSelect;
    this.tintColor = 0x338833;
  } 
  onActivate(target: Cell)
  {
    target.addPlant();
  }
}

class HouseTool extends Tool
{
  constructor()
  {
    super();
    this.selectType = rectSelect;
    this.tintColor = 0x696969;
  } 
  onActivate(target: Cell)
  {
    target.changeContent(
      getRandomProperty(cg["content"]["buildings"]) );
  }
}
class RoadTool extends Tool
{
  constructor()
  {
    super();
    this.selectType = manhattanSelect;
    this.tintColor = 0x696969;
  } 
  onActivate(target: Cell)
  {
    target.changeContent( cg["content"]["roads"]["road_nesw"] );
  }
}

class BuyTool extends Tool
{
  constructor()
  {
    super();
    this.selectType = singleSelect;
    this.tintColor = 0x22EE22;
  }
  onActivate(target: Cell)
  {
    eventManager.dispatchEvent({type: "makeCellBuyPopup", content:
      {
        player: game.players["player0"],
        cell: target
      }
    });
  }
}

class BuildTool extends Tool
{
  constructor()
  {
    super();
    this.selectType = singleSelect;
    this.tintColor = 0x696969;
  }
  onActivate(target: Cell)
  {
    eventManager.dispatchEvent({type: "makeBuildingSelectPopup", content:
      {
        player: game.players["player0"],
        cell: target
      }
    });
  }
}


function getRoadConnections(target: Cell, depth:number)
{
  var connections = {};
  var dir = "";
  var neighbors = target.getNeighbors(false);
  for ( var cell in neighbors )
  {
    if (neighbors[cell] && neighbors[cell].content
      && neighbors[cell].content.baseType === "road")
    {
      connections[cell] = true;
    }
  }

  if (depth > 0)
  {
    for (var connection in connections)
    {
      getRoadConnections( neighbors[connection], depth - 1 );
    }
  }

  for (var connection in connections)
  {
    dir += connection;
  }
  if (dir === "")
  {
    return null;
  }
  else if (dir === "n" || dir === "s" || dir === "ns")
  {
    dir = "v";
  }
  else if (dir === "e" || dir === "w" || dir === "ew")
  {
    dir = "h";
  }
  if (target.content && target.content.baseType === "road")
  {
    var finalRoad = cg["content"]["roads"]["road_" + dir];
    target.changeContent(finalRoad, false);
  }
}

function singleSelect(a:number[], b: number[])
{
  return [a];
}

function rectSelect(a:number[], b:number[]): number[]
{
  var cells = [];
  var xLen = Math.abs(a[0] - b[0]);
  var yLen = Math.abs(a[1] - b[1]);
  var xDir = (b[0] < a[0]) ? -1 : 1;
  var yDir = (b[1] < a[1]) ? -1 : 1;
  var x,y;
  for (var i = 0; i <= xLen; i++)
  {
    x = a[0] + i * xDir;
    for (var j = 0; j <= yLen; j++)
    {
      y = a[1] + j * yDir;
      cells.push([x,y]);
    }
  }
  return cells;
}

function manhattanSelect(a, b) : number[]
{
  var xLen = Math.abs(a[0] - b[0]);
  var yLen = Math.abs(a[1] - b[1]);
  var xDir = (b[0] < a[0]) ? -1 : 1;
  var yDir = (b[1] < a[1]) ? -1 : 1;
  var y, x;
  var cells = [];
  if (xLen >= yLen)
  {
    for (var i = 0; i <= xLen; i++)
    {
      x = a[0] + i * xDir;
      cells.push([x, a[1]]);
    }
    for (var j = 1; j <= yLen; j++)
    {
      y = a[1] + j * yDir;
      cells.push([b[0], y]);
    }
  }
  else
  {
    for (var j = 0; j <= yLen; j++)
    {
      y = a[1] + j * yDir;
      cells.push([a[0], y]);
    }
    for (var i = 1; i <= xLen; i++)
    {
      x = a[0] + i * xDir;
      cells.push([x, b[1]]);
    }
  }
  return cells;
}
function arrayToPolygon(points)
{
  var _points = [];
  for (var i = 0; i < points.length; i++)
  {
    _points.push( new PIXI.Point(points[i][0], points[i][1]) );
  }
  return new PIXI.Polygon(_points);
}

function arrayToPoint(point)
{
  return new PIXI.Point(point[0], point[1]);
}


function pineapple()
{
  cg["content"]["buildings"]["pineapple"] =
  {
    "type": "pineapple",
    "baseType": "building",
    "width": 64,
    "height": 128,
    "anchor": [0.5, 1.25],
    "frame": "pineapple2.png"
  };
}

var game = new Game();
var loader = new Loader(game);
