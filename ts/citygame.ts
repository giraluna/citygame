/// <reference path="../js/lib/pixi.d.ts" />
/// <reference path="../js/lib/tween.js.d.ts" />
/// <reference path="../js/ui.d.ts" />

declare var LZString: any;
declare var cg:any;
declare var WebFont:any;
declare var WebFontConfig:any;


cg = JSON.parse(JSON.stringify(cg)); //dumb

var container;
var SCREEN_WIDTH, SCREEN_HEIGHT, TILE_WIDTH,TILE_HEIGHT,
TILES, WORLD_WIDTH, WORLD_HEIGHT;
SCREEN_WIDTH = 940
SCREEN_HEIGHT = 480
TILE_WIDTH = 64
TILE_HEIGHT = 32
TILES = 30
WORLD_WIDTH = TILES * TILE_WIDTH;
WORLD_HEIGHT = TILES * TILE_HEIGHT;




class Sprite extends PIXI.Sprite
{
  type: string;
  content: Content;

  constructor( template )
  {
    var _texture = PIXI.Texture.fromImage(
      template.texture, false, 1); //scale mode
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
  type: string;
  type2: string;
  id: number;
  sprite: Sprite;
  cell: Cell;

  constructor( cell: Cell, type, data?)
  {
    this.cell = cell;
    this.type = type;
    this.type2 = type["type2"] || undefined;

    this.init( type );

    if (data)
    {
      this.applyData(data);
    }

  }
  init( type )
  {
    var _s = this.sprite = new ContentSprite( type, this );
    var cellSprite = this.cell.sprite;
    var gridPos = this.cell.gridPos;
    _s.position = this.cell.sprite.position.clone();
    game.layers["content"].addChildAt(_s, gridPos[0] + gridPos[1]);
  }
  applyData( data )
  {
    for (var key in data)
    {
      this[key] = data[key];
    }
  }

}
interface neighborCells
{
  n: Cell;
  e: Cell;
  s: Cell;
  w: Cell;
}
class Cell
{
  type: string;
  sprite: Sprite;
  content: Content;
  gridPos: number[];
  buildable: boolean;

  constructor( gridPos, type )
  {
    this.gridPos = gridPos;
    this.type = type;

    this.init(type);
  }
  init( type:string )
  {
    var _s = this.sprite = new GroundSprite( type, this );
    this.buildable = type["buildable"];

    _s.mousedown = function(event)
    { 
      game.mouseEventHandler.cellDown(event);
    }
    _s.mouseover = function(event)
    {
      game.mouseEventHandler.cellOver(event);
    }
    _s.mouseup = function(event)
    {
      game.mouseEventHandler.cellUp(event);
    }
  }
  getNeighbors(): neighborCells
  {
    var neighbors: neighborCells =
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

    neighbors.s = (y+1 < size) ? cells[x]  [y+1] : undefined;
    neighbors.e = (x+1 < size) ? cells[x+1][y]   : undefined;
    neighbors.n = (-1 < y-1)   ? cells[x]  [y-1] : undefined;
    neighbors.w = (-1 < x-1)   ? cells[x-1][y]   : undefined; 

    return neighbors; 
  }
  replace( type:string ) //change base type of tile
  {
    var _texture = type["texture"];
    this.sprite.setTexture( PIXI.Texture.fromImage( _texture ));
    this.sprite.type = this.type = type;
    this.buildable = type["buildable"];
    if (this.content && this.content.type2 === "plant")
    {
      this.addPlant();
    }
    else if(this.content)
    {
      if ( !this.checkBuildable( this.content.type2 ) )
      {
        this.changeContent("none");
      }
      else
      {
        this.changeContent( this.content.type );
      }
    }
  }
  changeContent( type:string, update:boolean=true, data? )
  {
    var type2 = type["type2"] ? type["type2"] : "none";
    var buildable = this.checkBuildable(type2);
    var sameTypeExclusion = this.checkSameTypeExclusion( type2 );
    var toAdd: boolean = ( type !== "none" && buildable !== false && !sameTypeExclusion );
    var toRemove: boolean = ( type === "none" || 
      (!sameTypeExclusion && toAdd)
      );

    if ( toRemove )
    {
      this.removeContent();
    }

    if ( toAdd )
    {
      this.content = new Content( this, type, data );
    }
    if (update)
    {
      this.updateCell();
    }
  }
  checkSameTypeExclusion( type2: string)
  {
    var contentType2 = this.content ? this.content["type2"] : "none";
    if ( contentType2 == type2 && type2 === "building" )
    {
      return true;
    }
    else
    {
      return false;
    }
  }
  checkBuildable( type2: string )
  {
    if (this.buildable === false)
    {
      if (type2 == "plant" || type2 == "road")
      {
        return true;
      }
      else
      {
        return false;
      }
    }
    else
    {
      return true;
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
  removeContent()
  {
    if (this.content === undefined)
    {
      return;
    }
    game.layers["content"].removeChildAt(this.content.sprite,
      this.gridPos[0] + this.gridPos[1]);
    this.content = undefined;
  }
}

class Board
{
  width: number;
  height: number;
  cells: Cell[][];
  constructor(width, height)
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
        cell.buildable = dataCell ? dataCell.buildable : true;

        var sprite = cell.sprite;
        sprite.position = arrayToPoint( getIsoCoord(i, j,
          TILE_WIDTH, TILE_HEIGHT,
          [WORLD_WIDTH/2, TILE_HEIGHT]) );
        game.layers["ground"].addChild(sprite);
        if (data && dataCell.content)
        {
          cell.changeContent(dataCell.content.type, dataCell.content.data);
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

class Game
{
  board: Board;
  tools: any = {};
  activeTool: Tool;
  mouseEventHandler: MouseEventHandler;
  highlighter: Highlighter;
  stage: PIXI.Stage;
  renderer: any;
  layers: any = {};
  uiDrawer: UIDrawer;
  constructor()
  {
  }
  init()
  {
    this.initContainers();
    this.initTools();
    this.changeTool("grass");
    this.bindElements();

    this.board = new Board(TILES, TILES);
    this.board.makeMap();

    this.highlighter = new Highlighter();

    this.mouseEventHandler = new MouseEventHandler();
    this.mouseEventHandler.scroller = new Scroller(this.layers["main"],
      SCREEN_WIDTH, SCREEN_HEIGHT, 0.5);

    this.uiDrawer = new UIDrawer();

    this.render();
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
      this.initLayers();

      var _game = this;

      _stage.mousedown = function(event)
      {
        if (event.originalEvent.ctrlKey === true)
        {
          _game.mouseEventHandler.scrollStart(event);
        }
        if (event.originalEvent.shiftKey === true)
        {
          _game.mouseEventHandler.zoomStart(event);
        }
      }
      _stage.mousemove = function(event)
      {
        _game.mouseEventHandler.stageMove(event);
      }
      _stage.mouseup = function(event)
      {
        _game.mouseEventHandler.stageEnd(event);
      }
    }
    initLayers()
    {
      var _main = this.layers["main"];
      var _ground = this.layers["ground"] = new PIXI.DisplayObjectContainer();
      _ground.interactive = true;
      _main.addChild(_ground);
      var _content = this.layers["content"] = new SortedDisplayObjectContainer(TILES * 2);
      _main.addChild(_content);
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
    }

    bindElements()
    {
      var self = this;

      //zoom
      var zoomBtn = document.getElementById("zoomBtn");
      zoomBtn.addEventListener("click", function()
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
          btn.addEventListener("click", function()
          {
            self.changeTool([tool]);
          });
        })(btn, tool);
      }
      //save & load
      var saveBtn = document.getElementById("saveBtn");
      var loadBtn = document.getElementById("loadBtn");
      saveBtn.addEventListener("click", function()
      {
        self.saveBoard();
      });
      loadBtn.addEventListener("click", function()
      {
        self.loadBoard();
      });

      //renderer
      this.bindRenderer();
  }
  bindRenderer()
  {
    var _canvas = document.getElementById("pixi-container");
    _canvas.appendChild(this.renderer.view);
  }
  changeTool( tool )
  {
    this.activeTool = this.tools[tool];
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
    var compressed = LZString.compressToUTF16(data);
    localStorage.setItem("board", compressed);
  }
  loadBoard()
  {
    this.resetLayers();
    //var parsed = JSON.parse(this.savedBoard);
    var decompressed = LZString.decompressFromUTF16(localStorage.getItem("board"));
    var parsed = JSON.parse( decompressed );
    var board = this.board = new Board(parsed["width"], parsed["height"]);
    board.makeMap( parsed["cells"] );
  }
  render()
  {
    TWEEN.update();
    this.renderer.render(this.stage);
    requestAnimFrame( this.render.bind(this) );
  }
  resetLayers()
  {
    var main = this.layers["main"]
    for (var layer in this.layers)
    {
      if (layer !== "main" && layer !== "tooltips")
      {
        var _l = this.layers[layer];
        main.removeChild(_l);
        this.layers[layer] = undefined;
        this.initLayers();
      }
    }
  }
}

class SortedDisplayObjectContainer extends PIXI.DisplayObjectContainer
{
  container: PIXI.DisplayObjectContainer;
  indexes: number[];
  // arr[1] = index 1
  // when adding new displayobject increment following indexes
  
  constructor( layers:number)
  {
    this.indexes = new Array(layers);
    super();
    this.init();
  }
  
  init()
  {
    for (var i = 0; i < this.indexes.length; i++)
    {
      this.indexes[i] = 0;
    };
  }
  incrementIndexes(start:number)
  {
    for (var i = start + 1; i < this.indexes.length; i++)
    {
      this.indexes[i]++
    }
  }
  decrementIndexes(start:number)
  {
    for (var i = start + 1; i < this.indexes.length; i++)
    {
      this.indexes[i]--
    }
  }

  
  addChildAt(element:PIXI.DisplayObject, index:number)
  {
    super.addChildAt( element, this.indexes[index] );
    this.incrementIndexes(index);
  }
  removeChildAt(element:PIXI.DisplayObject, index:number)
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
  zoomField: any; //TEMP

  constructor( container:PIXI.DisplayObjectContainer, width, height, bound)
  {
    this.container = container;
    this.width = width;
    this.height = height;
    this.bounds.min = bound;  // sets clamp limit to percentage of screen from 0.0 to 1.0
    this.bounds.max = fround(1 - bound);
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

  currAction: string;

  scroller: Scroller
  constructor()
  {
    this.currAction = undefined;
  }
  mouseEventHelperFN(event)
  {
    if (event.originalEvent)
    {
      event.originalEvent.stopPropagation();
      event.originalEvent.preventDefault()
    }
    game.uiDrawer.removeActive();

  }
  scrollStart(event)
  {
    if (this.currAction === undefined)
    {
      this.mouseEventHelperFN(event);
      this.startPoint = [event.global.x, event.global.y];
      this.currAction = "scroll";
      this.scroller.startScroll(this.startPoint);
    }
  }
  zoomStart(event)
  {
    if (this.currAction === undefined)
    {
      this.mouseEventHelperFN(event);
      this.startPoint = this.currPoint = [event.global.x, event.global.y];
      this.currAction = "zoom";
    }
  }
  stageMove(event)
  {
    if (this.currAction === "scroll")
    {   
      this.mouseEventHelperFN(event);
      this.scroller.move([event.global.x, event.global.y]);
    }
    else if (this.currAction === "zoom")
    {
      this.mouseEventHelperFN(event);
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
      this.mouseEventHelperFN(event);
      this.scroller.end();
      this.startPoint = undefined;
      this.currAction = undefined;
    }
    if (this.currAction === "zoom")
    {
      this.mouseEventHelperFN(event);
      this.startPoint = undefined;
      this.currAction = undefined;
    }
  }
  cellDown(event)
  {
    this.mouseEventHelperFN(event);
    var cell = event.target["cell"]
    var pos = cell.gridPos;
    if (this.currAction === undefined)
    {
      this.currAction = "cellAction";
      this.startCell = pos;
    }
  }
  cellOver(event)
  {
    this.mouseEventHelperFN(event);
    var cell = event.target["cell"]
    var pos = cell.gridPos;
    if (this.currAction === "cellAction")
    {
      this.currCell = pos;
      var selectedCells = game.board.getCells(
        game.activeTool.selectType(this.startCell, this.currCell));

      game.highlighter.clearSprites();
      game.highlighter.tintCells(selectedCells, game.activeTool.tintColor);
    }
    else if (this.currAction === undefined)
    {
      game.uiDrawer.makeCellTooltip(event);
    }
  }
  cellUp(event)
  {
    this.mouseEventHelperFN(event);
    var cell = event.target["cell"]
    var pos = cell.gridPos;
    if (this.currAction === "cellAction")
    {
      this.currCell = pos;
      var selectedCells = game.board.getCells(
        game.activeTool.selectType(this.startCell, this.currCell));
      game.activeTool.activate(selectedCells);
      game.highlighter.clearSprites();
      this.currAction = undefined;
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
    this.fonts["base"] =
    {
      font: "18px Snippet",
      fill: "#444444",
      align: "left",
      size: 18
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

  makeCellTooltip( event )
  {
    var cell = event.target["cell"];
    var cellX = cell.sprite.worldTransform.tx;
    var cellY = cell.sprite.worldTransform.ty;

    var x = cellX;
    var y = cell.content ? cellY - cell.content.sprite.height
      : cellY - cell.sprite.height / 2;

    var screenX = event.global.x;
    var screenY = event.global.y;


    var text = cell.content ? cell.content.type["type"] : cell.type["type"];
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


    var toolTip = this.active = new ToolTip(
      this.layer, 500, -1,
      {
        style: this.styles["base"],
        autoSize: true,
        tipPos: tipPos,
        tipWidth: 10,
        tipHeight: 20,
        tipDir: tipDir,
        pointing: pointing,
        textObject: textObject,
        padding: [10, 10]
      }
      );
    toolTip.position.set(x, y);
    return toolTip;
  }

  clearLayer()
  {
    for (var i = this.layer.children.length - 1; i >= 0; i--)
    {
      this.layer.removeChild(this.layer.children[i]);
    }
  }
}

class Highlighter
{
  currHighlighted: Sprite[] = [];
  tintSprites(sprites: Sprite[], color: number)
  {
    for (var i = 0; i < sprites.length; i++)
    {
      var _sprite = sprites[i];
      _sprite.tint = color;
      this.currHighlighted.push( sprites[i] );
    }
  }
  clearSprites()
  {
    for (var i = 0; i < this.currHighlighted.length; i++)
    {
      var _sprite = this.currHighlighted[i];
      _sprite.tint = 0xFFFFFF;
    }
    this.currHighlighted = [];
  }
  tintCells(cells: Cell[], color: number)
  {
    var _sprites = [];
    for (var i = 0; i < cells.length; i++)
    {
      _sprites.push(cells[i].sprite);
      if (cells[i].content !== undefined)
      {
        _sprites.push(cells[i].content.sprite);
      }
    }
    this.tintSprites(_sprites, color);
  }
}

interface Tool
{
  selectType: any
  tintColor: number;

  activate(target:Cell[]);
}

class WaterTool implements Tool
{
  selectType: any;
  tintColor: number;
  constructor()
  {
    this.selectType = manhattanSelect;
    this.tintColor = 0x4444FF;
  }
  activate(target)
  {
    for (var i = 0; i < target.length; i++)
    {
      target[i].replace( cg["terrain"]["water"] );
    };
  }
}

class GrassTool implements Tool
{
  selectType: any
  tintColor: number;
  constructor()
  {
    this.selectType = rectSelect;
    this.tintColor = 0x617A4E;
  }
  activate(target)
  {
    for (var i = 0; i < target.length; i++)
    {
      target[i].replace( cg["terrain"]["grass"] );
    }
  }
}

class SandTool implements Tool
{
  selectType: any
  tintColor: number;
  constructor()
  {
    this.selectType = rectSelect;
    this.tintColor = 0xE2BF93;
  }
  activate(target)
  {
    for (var i = 0; i < target.length; i++)
    {
      target[i].replace( cg["terrain"]["sand"] );
    }
  }
}

class SnowTool implements Tool
{
  selectType: any
  tintColor: number;
  constructor()
  {
    this.selectType = rectSelect;
    this.tintColor = 0xBBDFD7;
  }
  activate(target)
  {
    for (var i = 0; i < target.length; i++)
    {
      target[i].replace( cg["terrain"]["snow"] );
    }
  }
}
class RemoveTool implements Tool
{
  selectType: any
  tintColor: number;
  constructor()
  {
    this.selectType = rectSelect;
    this.tintColor = 0xFF5555;
  }
  activate(target)
  {
    for (var i = 0; i < target.length; i++)
    {
      target[i].changeContent("none");
    }
  }
}

class PlantTool implements Tool
{
  selectType: any
  tintColor: number;
  constructor()
  {
    this.selectType = rectSelect;
    this.tintColor = 0x338833;
  }
  activate(target)
  {
    for (var i = 0; i < target.length; i++)
    {
      target[i].addPlant();
    }
  }
}

class HouseTool implements Tool
{
  selectType: any
  tintColor: number;
  constructor()
  {
    this.selectType = rectSelect;
    this.tintColor = 0x696969;
  }
  activate(target)
  {
    for (var i = 0; i < target.length; i++)
    {
      //target[i].changeContent("house");
      target[i].changeContent(
        getRandomProperty(cg["content"]["buildings"]) );
    }
  }
}
class RoadTool implements Tool
{
  selectType: any
  tintColor: number;
  constructor()
  {
    this.selectType = manhattanSelect;
    this.tintColor = 0x696969;
  }
  activate(target)
  {
    for (var i = 0; i < target.length; i++)
    {
      target[i].changeContent( cg["content"]["roads"]["road_nesw"] );
    }
  }
}
function getRoadConnections(target: Cell, depth:number)
{
  var connections = {};
  var dir = "";
  var neighbors = target.getNeighbors();
  for ( var cell in neighbors )
  {
    if (neighbors[cell] && neighbors[cell].content
      && neighbors[cell].content.type2 === "road")
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
  if (target.content && target.content.type2 === "road")
  {
    var finalRoad = cg["content"]["roads"]["road_" + dir];
    target.changeContent(finalRoad, false);
  }
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


function getFrom2dArray(target, arr: number[]): any
{
  var result = [];
  for (var i = 0; i < arr.length; i++)
  {
    result.push( target[arr[i][0]][arr[i][1]] );
  };
  return result;
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

function getIsoCoord(x: number, y: number,
  width: number, height: number,
  offset?: number[])
{
  var _w2 = width / 2;
  var _h2 = height / 2;
  var _isoX = (x - y) * _w2;
  var _isoY = (x + y) * _h2;
  if (offset)
  { 
    _isoX += offset[0];
    _isoY += offset[1];
  }
  return [_isoX, _isoY];
}

function fround(x)
{
  var f32 = new Float32Array(1);
  return f32[0] = x, f32[0];
}

function getRandomProperty( target )
{
  var _targetKeys = Object.keys(target);
  var _rnd = Math.floor(Math.random() * (_targetKeys.length));
  var _rndProp = target[ _targetKeys[_rnd] ];
  return _rndProp;
}

var game = new Game();


document.addEventListener('DOMContentLoaded', function()
{

  /* check center
  var stage = game.stage;
  var gfx = new PIXI.Graphics();
  gfx.beginFill();
  gfx.drawEllipse(SCREEN_WIDTH/2, SCREEN_HEIGHT/2, 3, 3);
  gfx.endFill();
  stage.addChild(gfx);
  */
 
  // temp
  // Load fonts
  WebFontConfig = {
    google: {
      families: [ 'Snippet', 'Arvo:700italic', 'Podkova:700' ]
    },

    active: function() {
      // do something
      game.init();
    }

  };
  (function() {
        var wf = document.createElement('script');
        wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
            '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
        wf.type = 'text/javascript';
        wf.async = true;
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(wf, s);
      })();

  // end temp
});

function pineapple()
{
  cg["content"]["buildings"]["pineapple"] =
  {
    "type": "pineapple",
    "type2": "building",
    "width": 64,
    "height": 128,
    "anchor": [0.5, 1.25],
    "texture": "img\/pineapple2.png"
  };
}