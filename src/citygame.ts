/// <reference path="../lib/pixi.d.ts" />
/// <reference path="../lib/tween.js.d.ts" />
/// 
/// <reference path="reactui/js/reactui.d.ts" />
/// <reference path="../data/js/cg.d.ts" />
/// <reference path="../data/js/names.d.ts" />
/// <reference path="../data/js/playermodifiers.d.ts" />
/// 
/// <reference path="js/ui.d.ts" />
/// <reference path="js/loader.d.ts" />
/// 
/// <reference path="js/sorteddisplaycontainer.d.ts" />
/// <reference path="js/player.d.ts" />F
/// <reference path="js/systems.d.ts" />
/// <reference path="js/eventlistener.d.ts" />
/// <reference path="js/spritehighlighter.d.ts" />
/// <reference path="js/keyboardinput.d.ts" />
/// <reference path="js/mapgeneration.d.ts" />
/// <reference path="js/board.d.ts" />
/// 
/// <reference path="js/landvalueoverlay.d.ts" />
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
    ZOOM_LEVELS = [1],
    AMT_OF_BOARDS = 1,
    DRAW_CLICK_POPUPS = true;

var idGenerator = idGenerator || {};
idGenerator.content = 0;
idGenerator.player = 0;

class Sprite extends PIXI.Sprite
{
  type: string;
  content: Content;

  constructor( template, frameIndex?: number )
  {
    var frame = isFinite(frameIndex) ? template.frame[frameIndex] : template.frame;

    var _texture = PIXI.Texture.fromFrame(frame);
    super(_texture); //pixi caches and reuses the texture as needed
    
    this.type   = template.type;
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

  constructor(type, content, frameIndex: number)
  {
    this.content = content;
    super(type, frameIndex);
  }
}

class Content
{
  type: any;
  baseType: string;
  categoryType: string;
  id: number;
  sprites: Sprite[] = [];
  cells: Cell[];
  baseCell: Cell;
  size: number[];
  flags: string[];

  baseProfit: number = 0;
  modifiers: any = {};
  modifiedProfit: number = 0;
  player: Player;

  constructor(props:
  {
    cells: Cell[];
    type: any;

    player?: Player;
    id?: number;

    layer?: string;
  })
  {
    this.cells = props.cells;

    var minX, minY;
    for (var i = 0; i < this.cells.length; i++)
    {
      var pos = this.cells[i].gridPos;

      if (minY === undefined || pos[1] <= minY)
      {
        minY = pos[1];

        if (minX === undefined || pos[0] < minX)
        {
          minX = pos[0];
        }
      }
    }

    // highest point arbitrarily assigned as root
    this.baseCell = this.cells[0].board.getCell([minX, minY]);
    this.size = props.type.size || [1,1];


    var type = this.type = props.type;
    this.id = props.id || idGenerator.content++;

    this.baseType = type["baseType"] || undefined;
    this.categoryType = type["categoryType"] || undefined;
    this.flags = type["flags"] ? type["flags"].slice(0) : [];
    this.flags.push(this.baseType, this.categoryType);

    this.baseProfit = type.baseProfit || undefined;
    
    if (props.player)
    {
      props.player.addContent(this);
    }
    this.init( type, props.layer );
  }
  init( type, layer: string = "content" )
  {
    for (var i = 0; i < this.cells.length; i++)
    {
      var _cell = this.cells[i];
      var _s = new ContentSprite( type, this, i );
      this.sprites.push(_s);

      _s.position = _cell.board.getCell(_cell.gridPos).sprite.position.clone();

      _cell.board.addSpriteToLayer(layer, _s, _cell.gridPos);
    }
  }
  applyModifiers()
  {
    var totals =
    {
      addedProfit: this.baseProfit,
      multiplier: 1
    };
    for (var _modifier in this.modifiers)
    {
      var modifier = this.modifiers[_modifier];
      if (!isFinite(modifier.strength) || modifier.strength <= 0)
      {
        this.modifiers[_modifier] = null;
        delete this.modifiers[_modifier];
      }
      else
      {
        for (var prop in modifier.effect)
        {
          totals[prop] += modifier.scaling(modifier.strength) * modifier.effect[prop];
        }
      }
    }
    this.modifiedProfit = totals.addedProfit * totals.multiplier;
  }
  remove()
  {
    if (this.player)
    {
      this.player.removeContent(this);
    }
    if (this.type.effects)
    {
      this.baseCell.removeAllPropagatedModifiers(this.type.translatedEffects);
    }


    for (var i = 0; i < this.cells.length; i++)
    {
      this.cells[i].content = undefined;
      this.cells[i].board.removeSpriteFromLayer("content", this.sprites[i], this.cells[i].gridPos);
    }
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
  type: any;
  board: Board;
  sprite: Sprite;
  content: Content;
  undergroundContent: Content;
  baseLandValue: number;
  landValue: number;
  gridPos: number[];
  flags: string[];
  modifiers: any = {};
  landValueModifiers: any = {};
  overlay: PIXI.Graphics = undefined;
  overlayColor: number;
  player: Player;
  neighbors: neighborCells;
  neighborsWithDiagonals: neighborCells;

  constructor( gridPos, type, board, autoInit:boolean = true)
  {
    this.gridPos = gridPos;
    this.type = type;
    var distanceFromXCenter = Math.abs((board.width-1)/2 - gridPos[0]);
    var distanceFromYCenter = Math.abs((board.height-1)/2 - gridPos[1]);
    var meanDistance = (distanceFromYCenter + distanceFromXCenter) / 2;
    var maxDist = (board.width-1 + board.height-1) / 2;

    var relativeInverseDist = 1 - (meanDistance / maxDist);

    var baseVal = board.population / 4;

    this.baseLandValue = this.landValue =
      Math.round(baseVal + baseVal * relativeInverseDist * 0.5);
      
    this.board = board;
    this.flags = this.type["flags"].slice(0);

    if (autoInit) this.init();
  }
  init()
  {
    var _s = this.sprite = new GroundSprite( this.type, this );
    _s.position = arrayToPoint( getIsoCoord(this.gridPos[0], this.gridPos[1],
      TILE_WIDTH, TILE_HEIGHT,
      [WORLD_WIDTH/2, TILE_HEIGHT]) );
    this.board.addSpriteToLayer("ground", _s);

    if (this.type.effects)
    {
      this.propagateAllModifiers(this.type.translatedEffects);
    }
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
    if (diagonal)
    {
      if (!this.neighborsWithDiagonals)
      {
        this.neighborsWithDiagonals = getNeighbors(this.board.cells, this.gridPos, diagonal);
      }
      return this.neighborsWithDiagonals;
    }
    else
    {
      if (!this.neighbors)
      {
        this.neighbors = getNeighbors(this.board.cells, this.gridPos, diagonal);
      }
      return this.neighbors;
    }
  }
  getArea(_props:
  {
    size:number;
    centerSize?:number[];
    anchor?:string;
    excludeStart?: boolean;
  })
  {
    var props = Object.create(_props);

    props.targetArray = this.board.cells;
    props.start = this.gridPos;

    return getArea(props);
  }
  getDistances(radius: number, centerSize: number[] = [1,1])
  {
    var centerEnd = [this.gridPos[0] + centerSize[0]-1,
      this.gridPos[1] + centerSize[1]-1]
    var center = this.board.getCells(rectSelect(this.gridPos, centerEnd));

    return getDistanceFromCell(this.board.cells, center, radius, true);
  }
  replace( type ) //change base type of tile
  {
    var _oldType = this.type;
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
      if ( !this.checkBuildable(this.content.type, null, false) )
      {
        this.changeContent("none");
      }
      else
      {
        this.changeContent( this.content.type, false, this.content.player );
      }
    }

    if (_oldType.effects)
    {
      this.removeAllPropagatedModifiers(_oldType.translatedEffects);
    }
    if (type.effects)
    {
      this.propagateAllModifiers(type.translatedEffects);
    }
  }
  changeUndergroundContent( type?: string, update: boolean = true)
  {
    if (this.undergroundContent)
    {
      this.board.removeSpriteFromLayer("undergroundContent", this.undergroundContent.sprites[0],
        this.gridPos);
      this.undergroundContent = undefined;
    }

    if (type)
    {
      this.undergroundContent = new Content(
      {
        cells: [this],
        type: type,
        layer: "undergroundContent"
      });
    }
    
    if (update)
    {
      getTubeConnections(this, 1);
    }
  }
  changeContent( type, update:boolean=true, player?: Player, checkPlayer:boolean = true)
  {
    var coversMultipleTiles = (type.size && (type.size[0] > 1 || type.size[1] > 1) );

    var buildArea;
    if (coversMultipleTiles)
    {
      var endX = this.gridPos[0] + type.size[0]-1;
      var endY = this.gridPos[1] + type.size[1]-1;

      buildArea = this.board.getCells( rectSelect(this.gridPos, [endX, endY]) );
    }
    else
    {
      buildArea = [this];
    }
    /*
    var buildable = true; //this.checkBuildable(type);
    for (var i = 0; i < buildArea.length; i++)
    {
      if ( !buildArea[i].checkBuildable(type) )
      {
        buildable = false;
        break;
      }
    }*/

    var _checkPlayer = checkPlayer ? player : null;
    var buildable = this.checkBuildable(type, _checkPlayer);


    if (coversMultipleTiles &&
      buildArea.length !== type.size[0] * type.size[1]) buildable = false;

    var toAdd: boolean = ( type !== "none" && buildable !== false );
    var toRemove: boolean = ( type === "none" || toAdd );

    if ( toRemove )
    {
      for (var i = 0; i < buildArea.length; i++)
      {
        buildArea[i].removeContent();
      }
    }

    if ( toAdd )
    {
      this.addContent( type, buildArea, player);
    }
    if (update)
    {
      for (var i = 0; i < buildArea.length; i++)
      {
        buildArea[i].updateCell();
      }
    }
  }
  checkBuildable( type: any, player?: Player, checkContent: boolean = true )
  {
    if (type === "none") return true;

    var buildArea;

    if (type.size && (type.size[0] > 1 || type.size[1] > 1) )
    {
      var endX = this.gridPos[0] + type.size[0]-1;
      var endY = this.gridPos[1] + type.size[1]-1;

      if (endX >= this.board.width || endY >= this.board.height) return false;

      buildArea = this.board.getCells( rectSelect(this.gridPos, [endX, endY]) );
    }
    else
    {
      buildArea = [this];
    }

    var buildAreaIsValid = true;
    for (var i = 0; i < buildArea.length; i++)
    {
      var a = checkCell(buildArea[i], type, player);
      if (!a)
      {
        buildAreaIsValid = false;
        break;
      }
    }
    return buildAreaIsValid;

    function checkCell(cell: Cell, type, player?: Player)
    {
      // implicitly true
      var canBuild = true;

      // check ownership if needed
      if (player)
      {
        if (!cell.player || cell.player.id !== player.id)
        {
          return false;
        }
      }

      // check invalid
      if (type.canNotBuildOn)
      {
        // check if any flags in cell conflict with type.canNotBuildOn
        canBuild = arrayLogic.not(cell.flags, type.canNotBuildOn);
        // same with content
        if (checkContent && canBuild !== false && cell.content)
        {
          canBuild = arrayLogic.not(cell.content.flags, type.canNotBuildOn);
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
          valid = arrayLogic.or(cell.flags, type.canBuildOn);
          if (checkContent && !valid && cell.content)
          {
            valid = arrayLogic.or(cell.content.flags, type.canBuildOn);
          }
        }
        return valid;
      }
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
  addContent( type: any, cells: Cell[], player?: Player )
  {
    var _c = new Content(
    {
      cells: cells,
      type: type,
      player: player
    });
    for (var i = 0; i < cells.length; i++)
    {
      cells[i].content = _c;
      cells[i].applyModifiersToContent();
    }

    if (type.effects)
    {
      this.propagateAllModifiers(type.translatedEffects);
    }
    // todo
    if (type.underground)
    {
      for (var i = 0; i < cells.length; i++)
      {
        cells[i].changeUndergroundContent(cg.content.tubes[type.underground]);
      }
    }
    
    return this.content;
  }
  removeContent()
  {
    if (this.content === undefined)
    {
      return;
    }
    else this.content.remove();
  }
  checkIfModifierApplies(modifier)
  {
    if (this.content &&
        (
          arrayLogic.or(modifier.targets, this.flags)
          || (this.content && arrayLogic.or(modifier.targets, this.content.flags))
        )
      )
    {
      return true;
    }
    else
    {
      return false;
    }
  }
  getModifierPolarity(modifier)
  {
    if (!this.content) return null;


    if (arrayLogic.or(modifier.targets, this.content.flags))
    {
      var firstProp = modifier.effect[Object.keys(modifier.effect)[0]];
      return firstProp > 0;
    }

    return null;
  }
  addModifier(modifier, source)
  {
    if (!this.modifiers[modifier.type])
    {
      this.modifiers[modifier.type] = Object.create(modifier);
      this.modifiers[modifier.type].sources = [];
    }
    else
    {
      this.modifiers[modifier.type].strength += modifier.strength;
    };
    this.modifiers[modifier.type].sources.push(source);
    // check to see if modifiers need to be updated
    if (this.checkIfModifierApplies)
    {
      this.applyModifiersToContent();
    }
  }
  removeModifier(modifier, source)
  {
    if (!this.modifiers[modifier.type]) return;
    this.modifiers[modifier.type].strength -= modifier.strength;
    this.modifiers[modifier.type].sources =
      this.modifiers[modifier.type].sources.filter(function(_source)
    {
      return _source !== source;
    });
    if (this.modifiers[modifier.type].strength <= 0)
    {
      delete this.modifiers[modifier.type];
    }

    if (this.checkIfModifierApplies)
    {
      this.applyModifiersToContent();
    }
  }
  propagateModifier(modifier)
  {
    var effectedCells = this.getArea(
    {
      size: modifier.range,
      centerSize: modifier.center,
      excludeStart: true
    });

    for (var cell in effectedCells)
    {
      if (effectedCells[cell] !== this)
      {
        effectedCells[cell].addModifier(modifier, this);
      }
    }
    if (modifier.landValue) this.propagateLandValueModifier(modifier);
  }
  propagateAllModifiers(modifiers: any[])
  {
    for (var i = 0; i < modifiers.length; i++)
    {
      this.propagateModifier(modifiers[i]);
    }
  }
  removePropagatedModifier(modifier)
  {
    var effectedCells = this.getArea(
    {
      size: modifier.range,
      centerSize: modifier.center,
      excludeStart: true
    });
    
    for (var cell in effectedCells)
    {
      effectedCells[cell].removeModifier(modifier, this);
    }
    if (modifier.landValue) this.removePropagatedLandValueModifier(modifier);
  }
  removeAllPropagatedModifiers(modifiers: any[])
  {
    for (var i = 0; i < modifiers.length; i++)
    {
      this.removePropagatedModifier(modifiers[i]);
    }
  }
  // todo: rework later to only update modifiers that have changed
  getValidModifiers(contentType = this.content.type)
  {
    if (!contentType) return;
    var flags = [contentType.baseType, contentType.categoryType];

    var validModifiers: any = {};
    for (var modifierType in this.modifiers)
    {
      var modifier = this.modifiers[modifierType];
      if (arrayLogic.or(modifier.targets, this.flags)
        || (arrayLogic.or(modifier.targets, flags) ))
      {
        validModifiers[modifierType] = modifier;
      }
    }

    return validModifiers;
  }
  applyModifiersToContent()
  {
    if (!this.content) return;

    
    var modifiersToApply = this.getValidModifiers();
    
    this.content.modifiers = this.content.modifiers || {};
    for (var _mod in modifiersToApply)
    {
      var modifier = modifiersToApply[_mod];

      if (!this.content.modifiers[_mod] ||
       this.content.modifiers[_mod].strength < modifier.strength)
      {
        this.content.modifiers[_mod] = modifier;
      }
    }

    this.content.applyModifiers();
  }
  propagateLandValueModifier(modifier)
  {
    var effectedCells = this.getDistances(modifier.landValue.radius, modifier.center);

    var strengthIndexes: any = {};

    for (var _cell in effectedCells)
    {
      var invertedDistance = effectedCells[_cell].invertedDistance;
      var distance = effectedCells[_cell].distance;
      var strength;
      if (modifier.landValue.falloffFN) 
      {
        if (!strengthIndexes[distance])
        {
          strengthIndexes[distance] =
            modifier.landValue.falloffFN(distance, invertedDistance,
            effectedCells[_cell].invertedDistanceRatio);
        }
        strength = strengthIndexes[distance];
      }
      else strength = invertedDistance;


      var cell = effectedCells[_cell].item;


      if (cell.landValueModifiers[modifier.type] === undefined)
      {
        cell.landValueModifiers[modifier.type] = {};

        cell.landValueModifiers[modifier.type].strength = 0;
        if (modifier.landValue.scalingFN)
        {
          cell.landValueModifiers[modifier.type].scalingFN = modifier.landValue.scalingFN;
        }
        cell.landValueModifiers[modifier.type].effect = {};
        if (modifier.landValue.multiplier)
        {
          cell.landValueModifiers[modifier.type].effect.multiplier = modifier.landValue.multiplier;
        }
        if (modifier.landValue.addedValue)
        {
          cell.landValueModifiers[modifier.type].effect.addedValue = modifier.landValue.addedValue;
        }
      }

      cell.landValueModifiers[modifier.type].strength += strength;

      cell.updateLandValue();
    }
    if (game.activeBoard && game.activeBoard.id === this.board.id)
    {
      eventManager.dispatchEvent({type:"updateLandValueMapmode", content:""});
    }
  }
  removePropagatedLandValueModifier(modifier)
  {
    var effectedCells = this.getDistances(modifier.landValue.radius, modifier.center);

    var strengthIndexes: any = {};

    for (var _cell in effectedCells)
    {
      var cell = effectedCells[_cell].item;

      if (!cell.landValueModifiers[modifier.type]) continue;

      var invertedDistance = effectedCells[_cell].invertedDistance;
      var distance = effectedCells[_cell].distance;
      var strength;
      if (modifier.landValue.falloffFN) 
      {
        if (!strengthIndexes[invertedDistance])
        {
          strengthIndexes[invertedDistance] =
            modifier.landValue.falloffFN(distance, invertedDistance,
            effectedCells[_cell].invertedDistanceRatio);
        }
        strength = strengthIndexes[invertedDistance];
      }
      else strength = invertedDistance;


      cell.landValueModifiers[modifier.type].strength -= strength;

      if (cell.landValueModifiers[modifier.type].strength <= 0)
      {
        delete cell.landValueModifiers[modifier.type];
      }

      cell.updateLandValue();
    }
    if (game.activeBoard && game.activeBoard.id === this.board.id)
    {
      eventManager.dispatchEvent({type:"updateLandValueMapmode", content:""});
    }
  }
  updateLandValue()
  {
    if (this.type.type === "water") {this.landValue = 0; return;};
    var totals =
    {
      addedValue: 0,
      multiplier: 1
    };
    for (var _modifier in this.landValueModifiers)
    {
      var modifier = this.landValueModifiers[_modifier];

      var strength;
      if (modifier.scalingFN)
      {
        strength = modifier.scalingFN(modifier.strength);
      }
      else
      {
        strength = modifier.strength;
      }

      for (var prop in modifier.effect)
      {
        totals[prop] += modifier.effect[prop] * strength;
      }
    }

    
    this.landValue = Math.round(
      (this.baseLandValue + totals.addedValue) * totals.multiplier );

    if (this.landValue < this.baseLandValue * 0.33)
    {
      this.landValue = Math.round(this.baseLandValue * 0.33);
    }
  }
  addOverlay(color, depth:number = 1)
  {
    if (this.overlay)
    {
      this.board.removeSpriteFromLayer("cellOverlay", this.overlay, this.gridPos);
    }

    var neighbors = this.getNeighbors();
    var hitArea = this.type.hitArea;
    var linesToDraw =
    {
      n: true,
      e: true,
      s: true,
      w: true
    }
    for (var _dir in neighbors)
    {
      var neighborCell = neighbors[_dir];
      if (neighborCell !== undefined)
      {
        if ( neighborCell.overlay && neighborCell.overlayColor === color)
        {
          linesToDraw[_dir] = false;
        }
      }
    }

    var poly = this.type.hitArea;
    // loop back
    poly.push(poly[0]);

    var gfx = new PIXI.Graphics();
    gfx.lineStyle(3, color, 0.6);

    gfx.moveTo(poly[0][0], poly[0][1]);
    var nextIndex = 1;

    for (var _dir in linesToDraw)
    {
      var nextPoint = poly[nextIndex];

      if (linesToDraw[_dir] === true)
      {
        gfx.lineTo(nextPoint[0], nextPoint[1]);
      }
      else
      {
        gfx.moveTo(nextPoint[0], nextPoint[1]);
      }

      nextIndex++
    }

    gfx.position = this.sprite.position.clone();
    this.board.addSpriteToLayer("cellOverlay", gfx, this.gridPos);

    this.overlay = gfx;
    this.overlayColor = color;

    var willUpdateNeighbors = false;

    if (depth > 0)
    {
      for (var _dir in linesToDraw)
      {
        if (linesToDraw[_dir] === false)
        {
          willUpdateNeighbors = true;
          neighbors[_dir].addOverlay(color, depth - 1);
        }
      }
    }

    if (willUpdateNeighbors === false)
    {
      game.updateWorld();
    }
  }
  removeOverlay()
  {
    this.board.removeSpriteFromLayer("cellOverlay", this.overlay, this.gridPos);
    this.overlay = null;
    this.overlayColor = null;

    var neighs = this.getNeighbors();
    for (var neigh in neighs)
    {
      if (neighs[neigh] && neighs[neigh].overlay)
      {
        neighs[neigh].addOverlay(neighs[neigh].overlayColor);
      }
    }
  }
}

class WorldRenderer
{
  layers: any = {};
  renderTexture: PIXI.RenderTexture;
  worldSprite: PIXI.Sprite;
  zoomLevel: number = ZOOM_LEVELS[0];
  mapmodes =
  {
    default:
    {
      layers:
      [
        {type: "ground"},
        {type: "cellOverlay"},
        {type: "content"}
      ]
    },
    landValue:
    {
      layers:
      [
        {type: "ground"},
        {type: "landValueOverlay", alpha: 0.7},
        {type: "cellOverlay"},
        {type: "content"}
      ]
    },
    underground:
    {
      layers:
      [
        {type: "underground"},
        {type: "undergroundContent"},
        {type: "ground", alpha: 0.15}
      ],
      properties:
      {
        offsetY: 32
      }
    }
  };
  currentMapmode: string = "default";
  
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

    var mapmodeSelect = <HTMLInputElement> document.getElementById("mapmode-select");
    mapmodeSelect.addEventListener("change", function(event)
    {
      self.setMapmode(mapmodeSelect.value);
    });

    eventManager.addEventListener("changeMapmode", function(event)
    {
      self.setMapmode(event.content);
      mapmodeSelect.value = event.content;
    });
    eventManager.addEventListener("updateLandValueMapmode", function (event)
    {
      if (self.currentMapmode !== "landValue") return;

      var zoomLayer = self.layers["zoom" + self.zoomLevel];
      zoomLayer.landValueOverlay = makeLandValueOverlay(game.activeBoard);
      self.changeMapmode("landValue");
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
      this.mapmodes[zoomStr] = {};

      var main = zoomLayer["main"] = new PIXI.DisplayObjectContainer();
    }

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

      zoomLayer["underground"] = new PIXI.DisplayObjectContainer();
      zoomLayer["undergroundContent"] = new PIXI.DisplayObjectContainer();
      zoomLayer["ground"]  = new PIXI.DisplayObjectContainer();
      zoomLayer["landValueOverlay"] = new PIXI.DisplayObjectContainer();
      zoomLayer["cellOverlay"] = new PIXI.DisplayObjectContainer();
      zoomLayer["content"] = new PIXI.DisplayObjectContainer();
    }

  }
  clearLayers()
  {
    for (var i = 0; i < ZOOM_LEVELS.length; i++)
    {
      var zoomStr = "zoom" + ZOOM_LEVELS[i];
      var zoomLayer = this.layers[zoomStr];
      var main = zoomLayer["main"];

      for (var layer in zoomLayer)
      {
        if (zoomLayer[layer].children.length > 0)
        {
          zoomLayer[layer].removeChildren();
        }
      }
      
      if(main.children.length > 0) main.removeChildren();
    }
    //this.currentMapmode = undefined;
  }
  setBoard(board: Board)
  {
    this.clearLayers();

    for (var zoomLevel in board.layers)
    {
      for (var layer in board.layers[zoomLevel])
      {
        this.layers[zoomLevel][layer].addChild(board.layers[zoomLevel][layer]);
      }
    }

    this.setMapmode(this.currentMapmode);
  }
  changeZoomLevel(level)
  {
    this.zoomLevel = level;
    this.render();
  }
  setMapmode(newMapmode: string)
  {
    var zoomLayer = this.layers["zoom" + this.zoomLevel];
    switch (newMapmode)
    {
      case "default":
      case "terrain":
      {
        this.changeMapmode("default");
        return;
      }
      case "landValue":
      {
        zoomLayer.landValueOverlay = makeLandValueOverlay(game.activeBoard);

        this.changeMapmode("landValue");
        return;
      }
      case "underground":
      {
        if (zoomLayer.underground.children <= 0)
        {
          for (var i = 0; i < zoomLayer.ground.children[0].children.length; i++)
          {
            var currSprite = zoomLayer.ground.children[0].children[i];

            var _s = PIXI.Sprite.fromFrame("underground.png");
            _s.position = currSprite.position.clone();
            _s.anchor = currSprite.anchor.clone();
            zoomLayer.underground.addChild(_s);
          }
        }
        this.changeMapmode("underground");
        return;
      }
    }
  }
  changeMapmode(newMapmode: string)
  {
    var zoomStr = "zoom" + this.zoomLevel;
    var zoomLayer = this.layers[zoomStr];

    if (zoomLayer.main.children.length > 0)
    {
      zoomLayer.main.removeChildren();
    }
    
    for (var i = 0; i < this.mapmodes[newMapmode].layers.length; i++)
    {
      var layerToAdd = this.mapmodes[newMapmode].layers[i];
      zoomLayer.main.addChild(zoomLayer[layerToAdd.type]);

      zoomLayer[layerToAdd.type].alpha = layerToAdd.alpha || 1;
    }

    var props = this.mapmodes[newMapmode].properties || {};
    
    this.worldSprite.y = props.offsetY || 0;
    
    this.currentMapmode = newMapmode;
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
  boards: Board[] = [];
  activeBoard: Board;
  indexOfActiveBoard: number;
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

    for (var i = 0; i < AMT_OF_BOARDS; i++)
    {
      this.boards.push(new Board({width: TILES}));
    }
    this.changeActiveBoard(0);
    this.updateBoardSelect();

    this.highlighter = new Highlighter();

    this.mouseEventHandler = new MouseEventHandler();
    this.mouseEventHandler.scroller = new Scroller(this.layers["main"], 0.5);

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
    this.systemsManager.addSystem("autosave", new AutosaveSystem(120, this.systemsManager));

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
          game.mouseEventHandler.scroller.zoom( zoomAmount );
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
                  self.players["player0"].modifierEffects.recruitQuality)
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
        if (e.content.continuous === false)
        {
          self.tools[e.content.type].continuous = false;
        }
        else self.tools[e.content.type].continuous = true;
      });

      //info
      addClickAndTouchEventListener(
      document.getElementById("show-info"), function()
      {
        var _elStyle = document.getElementById("info-container").style;
        if (_elStyle.display === "flex")
        {
          _elStyle.display = "none";
        }
        else
        {
          _elStyle.display = "flex";
        }
      });
      addClickAndTouchEventListener(
      document.getElementById("close-info"), function()
      {
        document.getElementById("info-container").style.display="none";
      });
      //stats
      addClickAndTouchEventListener(
      document.getElementById("show-stats"), function()
      {
        eventManager.dispatchEvent({type:"toggleStats", content: ""});
      });

      //renderer
      this.bindRenderer();

      //resize
      window.addEventListener("resize", game.resize, false);

      eventManager.addEventListener("autosave", this.autosave.bind(this));

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
        self.mouseEventHandler.scroller.zoom( event.content );
      });

      // prestige
      eventManager.addEventListener("prestigeReset", function(event)
      {
        self.prestigeReset(event.content);
      });

      // options todo
      var popupToggle = <HTMLInputElement> document.getElementById("draw-click-popups");
      popupToggle.addEventListener("change", function(e)
      {
        DRAW_CLICK_POPUPS = popupToggle.checked;
      });
      
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
    SCREEN_WIDTH = parseInt(container.width) / window.devicePixelRatio;
    SCREEN_HEIGHT = parseInt(container.height) / window.devicePixelRatio;
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
      gameDate: this.systemsManager.systems.date.getDate()
    }
    localStorage.setItem(name, JSON.stringify(toSave));
  }
  autosave()
  {
    // TODO
    var AUTOSAVELIMIT = 3;

    var autosaves = [];
    for (var saveGame in localStorage)
    {
      if (saveGame.match(/autosave/))
      {
        autosaves.push(saveGame);
      }
    }
    autosaves.sort();
    autosaves = autosaves.slice(0, AUTOSAVELIMIT - 1)
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
    this.loadPlayer(parsed.player);
    this.loadBoards(parsed);

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
        if (prop !== "player")
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

    this.systemsManager.update();

    requestAnimFrame( this.render.bind(this) );
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
    /*
    if (oldZoom <= 0.5 && zoomAmount > 0.5)
    {

    }
    else if ( oldZoom <= 1.5 && oldZoom >= 0.5)
    {
      if (zoomAmount < 0.5) 
      else if (zoomAmount > 1.5)
    }
    else if (oldZoom >= 1.5 && zoomAmount < 1.5)
    {
    }*/
    

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

    eventManager.dispatchEvent({type:"updateZoomValue", content: this.currZoom});
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
  stashedAction: string;
  selectedCells: Cell[];

  preventingGhost: boolean = false;

  scroller: Scroller
  constructor()
  {
    var self = this;

    this.currAction = undefined;
    window.oncontextmenu = function(event)
    {
      var eventTarget = <HTMLElement> event.target;
      if (eventTarget.localName !== "canvas") return;
      event.preventDefault();
      event.stopPropagation();
    };

    var _canvas = document.getElementById("pixi-container");
    _canvas.addEventListener("DOMMouseScroll", function(e: any)
    {
      if (e.target.localName !== "canvas") return;
      self.scroller.deltaZoom(-e.detail, 0.05);
    });
    _canvas.addEventListener("mousewheel", function(e: any)
    {
      if (e.target.localName !== "canvas") return;
      self.scroller.deltaZoom(e.wheelDelta / 40, 0.05);
    });
    _canvas.addEventListener("mouseout", function(e: any)
    {
      if (e.target.localName !== "canvas") return;
      game.uiDrawer.removeActive();
    });
  }
  preventGhost(delay: number)
  {
    this.preventingGhost = true;
    var self = this;
    var timeout = window.setTimeout(function()
    {
      self.preventingGhost = false;
      window.clearTimeout(timeout);
    }, delay);
  }
  mouseDown(event, targetType: string)
  {
    game.uiDrawer.removeActive();
    if (event.originalEvent.button === 2 &&
      this.currAction !== undefined &&
      targetType === "stage")
    {
      if (game.activeTool.onFinish)
      {
        game.activeTool.onFinish()
      }

      this.currAction = undefined;
      this.stashedAction = undefined;
      this.startPoint = undefined;
      this.scroller.end();
      game.uiDrawer.clearAllObjects();
      game.highlighter.clearSprites();
      game.updateWorld();
    }
    else if (event.originalEvent.ctrlKey ||
      event.originalEvent.metaKey ||
      (event.originalEvent.button === 1 ||
      event.originalEvent.button === 2) )
    {
      this.startScroll(event);
    }
    /*
    else if (event.originalEvent.shiftKey)
    {
      this.startZoom(event);
    }*/
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
      this.preventGhost(15);
    }
    else if (targetType === "world" && this.currAction === "cellAction"
      && event.originalEvent.button !== 2  && event.originalEvent.button !== 3)
    {
      if (!this.preventingGhost) this.worldEnd(event);
    }

  }

  startScroll(event)
  {
    if (this.currAction === "cellAction") this.stashedAction = "cellAction";
    this.currAction = "scroll";
    this.startPoint = [event.global.x, event.global.y];
    this.scroller.startScroll(this.startPoint);
  }
  startZoom(event)
  {
    if (this.currAction === "cellAction") this.stashedAction = "cellAction";
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
      this.currAction = this.stashedAction;
      this.stashedAction = undefined;
    }
    if (this.currAction === "zoom")
    {
      this.startPoint = undefined;
      this.currAction = this.stashedAction;
      this.stashedAction = undefined;
    }
  }
  // need to switch to the click event being transferred to
  // rendertexture parent DOC and checked against individual sprites
  // (that have hit masks) to support slopes / variable height
  startCellAction(event)
  {
    var pos = event.getLocalPosition(event.target);
    var gridPos = getOrthoCoord([pos.x, pos.y], [TILE_WIDTH, TILE_HEIGHT], [TILES, TILES]);

    if (event.originalEvent.shiftKey)
    {
      game.activeTool.tempContinuous = true;
    }
    else game.activeTool.tempContinuous = false;

    this.currAction = "cellAction";
    this.startCell = gridPos;
    this.currCell = gridPos;

    //this.selectedCells = [game.activeBoard.getCell(gridPos)];
    this.selectedCells = game.activeBoard.getCells(
        game.activeTool.selectType(this.startCell, this.currCell));

    game.highlighter.clearSprites();
    if (game.activeTool.tintColor !== null)
    {
      game.highlighter.tintCells(this.selectedCells, game.activeTool.tintColor);
    }
    if (game.activeTool.onHover)
    {
      game.uiDrawer.clearAllObjects();
      game.activeTool.onHover(this.selectedCells)
    }
    game.updateWorld();
  }
  worldMove(event)
  {
    var pos = event.getLocalPosition(event.target);
    var gridPos = getOrthoCoord([pos.x, pos.y], [TILE_WIDTH, TILE_HEIGHT], [TILES, TILES]);

    if ( !this.currCell || gridPos[0] !== this.currCell[0] || gridPos[1] !== this.currCell[1] )
    {
      this.currCell = gridPos;
      
      this.selectedCells = game.activeBoard.getCells(
          game.activeTool.selectType(this.startCell, this.currCell));
      /*
      this.selectedCells = game.activeBoard.getCell(this.currCell).getArea(
      {
        size: 1,
        centerSize: [4, 5],
        excludeStart: true
      });*/
      game.highlighter.clearSprites();
      if (game.activeTool.onHover)
      {
        game.uiDrawer.clearAllObjects();
        game.activeTool.onHover(this.selectedCells)
      }
      if (game.activeTool.tintColor !== null)
      {
        game.highlighter.tintCells(this.selectedCells, game.activeTool.tintColor);
      }
      game.updateWorld();
   }
  }
  worldEnd(event)
  {
    game.activeTool.activate(this.selectedCells);

    if (game.activeTool.onFinish)
    {
      game.activeTool.onFinish()
    }

    game.uiDrawer.clearAllObjects();
    game.highlighter.clearSprites();
    this.currAction = undefined;
    this.startCell = undefined;
    this.currCell = undefined;
    this.selectedCells = undefined;

    game.updateWorld(true);
  }
  hover(event)
  {
    var pos = event.getLocalPosition(event.target);
    var gridPos = getOrthoCoord([pos.x, pos.y], [TILE_WIDTH, TILE_HEIGHT], [TILES, TILES]);
    // TEMPORARY
    if ( (!gridPos) ||
      (gridPos[0] >= TILES || gridPos[1] >= TILES) || 
      (gridPos[0] < 0 || gridPos[1] < 0) )
    {
      game.uiDrawer.removeActive();
      return;
    }

    if (!this.hoverCell) this.hoverCell = gridPos;
    if (gridPos[0] !== this.hoverCell[0] || gridPos[1] !== this.hoverCell[1])
    {
      this.hoverCell = gridPos;
      game.uiDrawer.removeActive();
      game.uiDrawer.makeCellTooltip(event, game.activeBoard.getCell(gridPos), event.target);
    }
  }

}

class UIDrawer
{
  layer: PIXI.DisplayObjectContainer;
  fonts: any = {};
  styles: any = {};
  textureCache: any = {};
  active: UIObject;
  permanentUIObjects: UIObject[] = [];

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
        font: "16px Arial",
        fill: "#444444",
        align: "left"
      },
      black:
      {
        font: "bold 20pt Arial",
        fill: "#000000",
        align: "left"
      },
      green:
      {
        font: "bold 20pt Arial",
        fill: "#00FF00",
        stroke: "#005500",
        strokeThickness: 2,
        align: "left"
      },
      red:
      {
        font: "bold 20pt Arial",
        fill: "#FF0000",
        stroke: "#550000",
        strokeThickness: 2,
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

    this.textureCache =
    {
      buildingPlacement:
      {
        positive1: PIXI.Texture.fromCanvas(
          new PIXI.Text("+", this.fonts["green"]).canvas),
        negative1: PIXI.Texture.fromCanvas(
          new PIXI.Text("-", this.fonts["red"]).canvas)
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
  clearAllObjects()
  {
    for (var i = 0; i < this.permanentUIObjects.length; i++)
    {
      this.permanentUIObjects[i].remove();

    }
    this.permanentUIObjects = [];

    this.removeActive();
  }

  makeCellTooltip( event, cell: Cell, container: PIXI.DisplayObjectContainer )
  {
    var screenPos = cell.getScreenPos(container);
    var cellX = screenPos[0];
    var cellY = screenPos[1];

    var screenX = event.global.x;
    var screenY = event.global.y;

    var text = cell.content ? cell.content.type.title || cell.content.type.type : cell.type["type"];

    if (game.worldRenderer.currentMapmode === "landValue")
    {
      text += "\nLand value: " + cell.landValue;
      text += "\nApproximate cost: " + parseInt(game.players.player0.getCellBuyCost(cell));
    }
    /*
    else
    {
      for (var modifier in cell.modifiers)
      {
        var _mod = cell.modifiers[modifier];
        text += "\n--------------\n";
        text += "Modifier: " + _mod.title + "\n";
        text += "Strength: " + _mod.strength + "\n";
        text += "Adj strength: " + _mod.scaling(_mod.strength).toFixed(3);
      }
    }*/

    if (cell.content && cell.content.player && cell.content.baseProfit)
    {
      var finalAmount = game.players.player0.getIndexedProfit(
        cell.content.type.categoryType, cell.content.modifiedProfit).toFixed(2);
      text += "\n--------------\n";
      text += "Base profit: " + cell.content.baseProfit.toFixed(2) + "/d" + "\n";
      text += "-------\n";
      for (var modifier in cell.content.modifiers)
      {
        var _mod = cell.content.modifiers[modifier];
        text += "Modifier: " + _mod.title +" "+ _mod.scaling(_mod.strength).toFixed(2) + "\n";
      }
      if (Object.keys(cell.content.modifiers).length > 0) text += "-------\n";
      text += "Final profit: " + finalAmount + "/d";
    }

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
      ? cellY - cell.content.sprites[0].height * cell.content.sprites[0].worldTransform.a / 2
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
    uiObj.position.set(Math.round(x), Math.round(y));

    uiObj.addChild(toolTip);
    uiObj.start();

    return uiObj;
  }
  makeCellPopup(cell: Cell, text: string, container: PIXI.DisplayObjectContainer,
    fontName:string = "black")
  {
    var pos = cell.getScreenPos(container);
    var content = new PIXI.Text(text, this.fonts[fontName]);

    this.makeFadeyPopup([pos[0], pos[1]], [0, -20], 2000, content);
  }
  makeBuildingPlacementTip(cell: Cell, type: string, container: PIXI.DisplayObjectContainer)
  {
    var pos = cell.getScreenPos(container);
    var content = new PIXI.Sprite(this.textureCache.buildingPlacement[type]);

    var uiObj = new UIObject(this.layer, false);
    uiObj.position.set(pos[0], pos[1] - 10);

    uiObj.addChild(content);
    if (content.width)
    {
      content.position.x -= content.width / 2;
      content.position.y -= content.height / 2;
    }

    uiObj.start();

    this.permanentUIObjects.push(uiObj);
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
    return uiObj;
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
  type: string;
  selectType: any;
  tintColor: number;
  activateCost: number;
  mapmode: string = "default";
  continuous: boolean = true;
  tempContinuous: boolean = true;
  button: HTMLInputElement;

  activate(target:Cell[])
  {
    for (var i = 0; i < target.length; i++)
    {
      this.onActivate(target[i]);
    }
  }
  onActivate(target:Cell){}
  onHover(targets:Cell[]){}
  onFinish(){}
}


class WaterTool extends Tool
{
  constructor()
  {
    super();
    this.type = "water";
    this.selectType = rectSelect;
    this.tintColor = 0x4444FF;
    this.mapmode = undefined;
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
    this.type = "grass";
    this.selectType = rectSelect;
    this.tintColor = 0x617A4E;
    this.mapmode = undefined;
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
    this.type = "sand";
    this.selectType = rectSelect;
    this.tintColor = 0xE2BF93;
    this.mapmode = undefined;
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
    this.type = "snow";
    this.selectType = rectSelect;
    this.tintColor = 0xBBDFD7;
    this.mapmode = undefined;
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
    this.type = "remove";
    this.selectType = rectSelect;
    this.tintColor = 0xFF5555;
    this.mapmode = undefined;
  } 
  onActivate(target: Cell)
  {
    if (game.worldRenderer.currentMapmode !== "underground")
    {
      target.changeContent("none");
    }
    else
    {
      target.changeUndergroundContent();
    }
  }
}

class SellTool extends Tool
{
  constructor()
  {
    super();
    this.type = "remove";
    this.selectType = rectSelect;
    this.tintColor = 0xFF5555;
    this.mapmode = undefined;
    this.button = null;
  } 
  onActivate(target: Cell)
  {
    var playerOwnsCell = (target.player && target.player.id === game.players.player0.id);
    if (target.content && playerOwnsCell)
    {
      game.players.player0.sellContent(target.content);
      target.changeContent("none");
    }
    else if (playerOwnsCell)
    {
      game.players.player0.sellCell(target);
    }

    if (!this.continuous && !this.tempContinuous)
    {
      eventManager.dispatchEvent(
      {
        type: "clickHotkey",
        content: ""
      });
    }
  }
}

class PlantTool extends Tool
{
  constructor()
  {
    super();
    this.type = "plant";
    this.selectType = rectSelect;
    this.tintColor = 0x338833;
    this.mapmode = undefined;
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
    this.type = "house";
    this.selectType = rectSelect;
    this.tintColor = 0x696969;
    this.mapmode = undefined;
  } 
  onActivate(target: Cell)
  {
    // TODO
    var toChange;
    while (true)
    {
      toChange = getRandomProperty(cg["content"]["buildings"]);
      //toChange = cg.content.buildings.bigoffice;
      if (toChange.categoryType && toChange.categoryType === "apartment")
      {
        break;
      }
    }

    target.changeContent( toChange );
  }
}
class RoadTool extends Tool
{
  constructor()
  {
    super();
    this.type = "road";
    this.selectType = manhattanSelect;
    this.tintColor = 0x696969;
  } 
  onActivate(target: Cell)
  {
    target.changeContent( cg["content"]["roads"]["road_nesw"] );
  }
}
class SubwayTool extends Tool
{
  constructor()
  {
    super();
    this.type = "subway";
    this.selectType = manhattanSelect;
    this.tintColor = 0x696969;
    this.mapmode = "underground";
  }
  onActivate(target: Cell)
  {
    target.changeUndergroundContent( cg["content"]["tubes"]["tube_nesw"] );
  }
}

class BuyTool extends Tool
{
  constructor()
  {
    super();
    this.type = "buy";
    this.selectType = singleSelect;
    this.tintColor = 0x22EE22;
    this.mapmode = undefined;
  }
  onActivate(target: Cell)
  {
    eventManager.dispatchEvent({type: "makeCellBuyPopup", content:
      {
        player: game.players["player0"],
        cell: target
      }
    });
    if (!this.continuous && !this.tempContinuous)
    {
      eventManager.dispatchEvent(
      {
        type: "clickHotkey",
        content: ""
      });
    }
  }
}

class BuildTool extends Tool
{
  selectedBuildingType: any;
  canBuild: boolean;
  mainCell: Cell;
  continuous: boolean;
  timesTriedToBuiltOnNonOwnedPlot: number = 0;
  ghostSprites:
  {
    sprite: PIXI.Sprite;
    pos: number[];
  }[] = [];

  constructor()
  {
    super();
    this.type = "build";
    this.mapmode = undefined;
    this.button = null;

    this.setDefaults();
  }
  setDefaults()
  {
    this.selectedBuildingType = undefined;
    this.selectType = singleSelect;
    this.tintColor = 0xFFFFFF;
    this.canBuild = false;
    this.mainCell = undefined;
    this.continuous = false;
    eventManager.dispatchEvent(
    {
      type: "clickHotkey",
      content: ""
    });
  }
  changeBuilding(buildingType, continuous:boolean = false)
  {
    this.continuous = continuous;
    if (this.selectedBuildingType === buildingType) return;

    this.selectedBuildingType = buildingType;
    var size = buildingType.size || [1,1];

    this.selectType = function(a, b)
    {
      var start = game.activeBoard.getCell(b);

      if (!start) return b;
      else
      {
        this.mainCell = start;
      }

      var buildable = start.checkBuildable(
        this.selectedBuildingType, game.players.player0);

      if (buildable)
      {
        this.tintColor = 0x338833;
        this.canBuild = true;
      }
      else
      {
        this.tintColor = 0xFF5555;
        this.canBuild = false;
      }
      return rectSelect(b, [b[0]+size[0]-1,b[1]+size[1]-1]);
    }.bind(this);
  }

  activate(selectedCells: any[])
  {
    if (this.canBuild === true)
    {
      var cost = game.players.player0.getBuildCost(this.selectedBuildingType);
      if (game.players.player0.money >= cost)
      {
        eventManager.dispatchEvent(
        {
          type: "makeBuildingConstructPopup",
          content:
          {
            player: game.players.player0,
            buildingTemplate: this.selectedBuildingType,
            cell: this.mainCell,
            onOk: ( this.continuous || this.tempContinuous ?
              function(){return;} : this.setDefaults.bind(this) )
          }
        });
      }
      else
      {
        eventManager.dispatchEvent(
        {
          type: "makeInfoPopup",
          content:
          {
            text: "Not enough funds"
          }
        })
      };
    }
    else if ( !selectedCells[0].player ||
      selectedCells[0].player.id !== game.players.player0.id)
    {
      /*
      this.timesTriedToBuiltOnNonOwnedPlot++;
      if (this.timesTriedToBuiltOnNonOwnedPlot <= 3 )
      {
        eventManager.dispatchEvent(
        {
          type: "makeInfoPopup",
          content:
          {
            text: "You need to purchase that plot first"
          }
        })
      }
      */
      for (var i = 0; i < selectedCells.length; i++)
      {
        eventManager.dispatchEvent({type: "makeCellBuyPopup", content:
          {
            player: game.players["player0"],
            cell: selectedCells[i],
            onOk: ( this.continuous || this.tempContinuous ?
              function(){return;} : this.setDefaults.bind(this) )
          }
        });
      }
    }

    this.onFinish();
  }
  onHover(targets: Cell[])
  {
    var baseCell = targets[0];
    if (!baseCell) return;

    var _b = baseCell.gridPos
    var size = this.selectedBuildingType.size || [1,1];
    var buildArea = baseCell.board.getCells(
      rectSelect(_b, [_b[0]+size[0]-1,_b[1]+size[1]-1]));
    var belowBuildArea = getArea(
    {
      targetArray: baseCell.board.cells,
      start: _b,
      centerSize: size,
      size: 2,
      anchor: "nw"
    });

    this.clearEffects();

    for (var i = 0; i < belowBuildArea.length; i++)
    {
      game.highlighter.alphaBuildings(belowBuildArea, 0.4);
    }

    if (!baseCell.content)
    {
      for (var i = 0; i < buildArea.length; i++)
      {
        var _cell = buildArea[i];
        if (_cell.content)
        {
          this.clearGhostBuilding();
          break;
        }
        var _s = new Sprite( this.selectedBuildingType, i );
        _s.alpha = 0.6;
        this.ghostSprites.push(
        {
          sprite: _s,
          pos: _cell.gridPos
        });

        _s.position = _cell.board.getCell(_cell.gridPos).sprite.position.clone();

        _cell.board.addSpriteToLayer("content", _s, _cell.gridPos);
      }
    }


    var effects: any =
    {
      positive: [],
      negative: []
    };

    for (var i = 0; i < this.selectedBuildingType.translatedEffects.length; i++)
    {
      var modifier = this.selectedBuildingType.translatedEffects[i];
      var categoryType = this.selectedBuildingType.categoryType
      var effectedCells = baseCell.getArea(
      {
        size: modifier.range,
        centerSize: modifier.center,
        excludeStart: true
      });

      for (var _cell in effectedCells)
      {
        var cell = effectedCells[_cell];

        var polarity = cell.getModifierPolarity(modifier);

        if (polarity === null) continue;
        else
        {
          var type = (polarity === true ? "positive1" : "negative1");
          var cells = cell.content ? cell.content.cells : cell;
          for (var j = 0; j < cells.length; j++)
          {
            game.uiDrawer.makeBuildingPlacementTip(cells[j], type,
              game.worldRenderer.worldSprite);
          }
        }
      }
    }

    for (var i = 0; i < buildArea.length; i++)
    {
      var currentModifiers = buildArea[i].getValidModifiers(this.selectedBuildingType);

      for (var _mod in currentModifiers)
      {
        var sources = currentModifiers[_mod].sources;
        var _polarity = currentModifiers[_mod].effect[
          Object.keys(currentModifiers[_mod].effect)[0]] > 0;

        var type = (_polarity === true ? "positive1" : "negative1");

        for (var i = 0; i < sources.length; i++)
        {
          game.uiDrawer.makeBuildingPlacementTip(sources[i], type,
            game.worldRenderer.worldSprite);
        }
      }
    }
  }
  onFinish()
  {
    this.clearEffects();
    this.mainCell = undefined;
  }
  clearEffects()
  {
    game.highlighter.clearAlpha();
    this.clearGhostBuilding();
  }
  clearGhostBuilding()
  {
    for (var i = 0; i < this.ghostSprites.length; i++)
    {
      var _s = this.ghostSprites[i].sprite;
      var _pos = this.ghostSprites[i].pos;
      this.mainCell.board.removeSpriteFromLayer("content", _s, _pos);
    }
    this.ghostSprites = [];
  }
}

class ClickTool extends Tool
{
  constructor()
  {
    super();
    this.type = "click";
    this.selectType = singleSelect;
    this.tintColor = null;
    this.mapmode = undefined;
    this.button = null;
  }
  onActivate(target: Cell)
  {
    var player = game.players.player0;
    var baseAmount = 0;

    if (target.content && target.content.player &&
      target.content.player.id === player.id)
    {
      baseAmount += player.getIndexedProfitWithoutGlobals(
        target.content.type.categoryType, target.content.modifiedProfit) * 0.25;
    }

    var finalAmount = player.addMoney(baseAmount, "click");
    player.addClicks(1);

    if (DRAW_CLICK_POPUPS)
    {
      game.uiDrawer.makeCellPopup(target, "" +
        finalAmount.toFixed(3), game.worldRenderer.worldSprite);
    }
  }
}

class NothingTool extends Tool
{
  constructor()
  {
    super();
    this.type = "nothing";
    this.selectType = singleSelect;
    this.tintColor = null;
    this.mapmode = undefined;
    this.button = null;
  }
  onActivate(target: Cell)
  {
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

function getTubeConnections(target: Cell, depth:number)
{
  var connections = {};
  var dir = "";
  var neighbors = target.getNeighbors(false);
  for ( var cell in neighbors )
  {
    if (neighbors[cell] && neighbors[cell].undergroundContent
      && neighbors[cell].undergroundContent.baseType === "tube")
    {
      connections[cell] = true;
    }
  }

  if (depth > 0)
  {
    for (var connection in connections)
    {
      getTubeConnections( neighbors[connection], depth - 1 );
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
  if (target.undergroundContent && target.undergroundContent.baseType === "tube")
  {
    var finalTube = cg["content"]["tubes"]["tube_" + dir];
    target.changeUndergroundContent(finalTube, false);
  }
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
