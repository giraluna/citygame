/// <reference path="../lib/pixi.d.ts" />

/// <reference path="arraylogic.ts" />
/// <reference path="board.ts" />
/// <reference path="groundsprite.ts" />
/// <reference path="content.ts" />
/// <reference path="player.ts" />

module CityGame
{
  export interface neighborCells
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
  export class Cell
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
        [WORLD_WIDTH/2, SPRITE_HEIGHT]) );
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
    }): Cell[]
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
      var center = this.board.getCells(SelectionTypes.rectSelect(this.gridPos, centerEnd));

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
        this.setTubeConnections(1);
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

        buildArea = this.board.getCells( SelectionTypes.rectSelect(this.gridPos, [endX, endY]) );
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

        buildArea = this.board.getCells( SelectionTypes.rectSelect(this.gridPos, [endX, endY]) );
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
      this.setRoadConnections(1);
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

      if (this.landValue < this.baseLandValue * 0.8)
      {
        this.landValue = Math.round(this.baseLandValue * 0.8);
      }
    }
    forEachNeighborWithQualifier(target: Cell,
      qualifier: (toCheck: Cell) => boolean,
      operator: (toOperateOn: Cell, directions: string) => void,
      depth: number)
    {
      var connections = {};
      var dir = "";
      var neighbors = target.getNeighbors(false);
      for ( var direction in neighbors )
      {
        if (neighbors[direction] && qualifier(neighbors[direction]))
        {
          connections[direction] = true;
        }
      }

      if (depth > 0)
      {
        for (var connection in connections)
        {
          this.forEachNeighborWithQualifier( neighbors[connection], qualifier, operator, depth - 1 );
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
      if (qualifier(target))
      {
        operator(target, dir);
      }
    }

    setRoadConnections(depth: number)
    {
      var qualifierFN = function(toCheck: Cell)
      {
        return toCheck.content && toCheck.content.baseType === "road";
      }
      var operatorFN = function(toOperateOn: Cell, directions: string)
      {
        var finalRoad = cg["content"]["roads"]["road_" + directions];
        toOperateOn.changeContent(finalRoad, false);
      }
      this.forEachNeighborWithQualifier(this, qualifierFN, operatorFN, depth);
    }

    setTubeConnections(depth: number)
    {
      var qualifierFN = function(toCheck: Cell)
      {
        return toCheck.undergroundContent &&
          toCheck.undergroundContent.baseType === "tube"
      }
      var operatorFN = function(toOperateOn: Cell, directions: string)
      {
        var finalTube = cg["content"]["tubes"]["tube_" + directions];
        toOperateOn.changeUndergroundContent(finalTube, false);
      }

      this.forEachNeighborWithQualifier(this, qualifierFN, operatorFN, depth);
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
      gfx.position.y -= (this.sprite.height - SPRITE_HEIGHT);
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
}
