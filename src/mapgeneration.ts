/// <reference path="../data/js/cg.d.ts" />
/// <reference path="js/utility.d.ts" />

/**
 * add base land value
 * 
 * 
 */

module mapGeneration
{

  var typeIndexes: any = {};
  function getIndexedType(typeName: string)
  {
    if (!typeIndexes[typeName])
    {
      typeIndexes[typeName] = findType(typeName);
    }

    return typeIndexes[typeName];
  }



  export function makeBlankCells(props:
  {
    width: number;
    height?: number;
  })
  {
    props.height = props.height || props.width;

    var cells: string[][] = [];

    for (var i = 0; i < props.width; i++)
    {
      cells[i] = [];
      for (var j = 0; j < props.height; j++)
      {
        cells[i][j] = "grass";
      }
    }

    return cells;
  }

  export function convertCells(cells: string[][], board)
  {
    // TODO circular refernce
    var _: any = window;
    var Cell = _.Cell;

    for (var i = 0; i < cells.length; i++)
    {
      for (var j = 0; j < cells[i].length; j++)
      {
        cells[i][j] = new Cell([i, j], getIndexedType(cells[i][j]), board);
      }
    }
  }

  export function readSavedMap(props:
  {
    board: any
    savedCells: any;
  })
  {
    var cells = props.board.cells;

    for (var i = 0; i < props.board.width; i++)
    {
      for (var j = 0; j < props.board.height; j++)
      {
        var cell = cells[i][j];
        var savedCell = props.savedCells[i][j];



        cell.replace(getIndexedType(savedCell.type));

        if (savedCell.content)
        {
          cell.changeContent(getIndexedType(savedCell.content.type), true,
            savedCell.player);
        }
        if (savedCell.undergroundContent)
        {
          cell.changeUndergroundContent( cg["content"]["tubes"]["tube_nesw"] );
        }
        if (savedCell.player)
        {
          savedCell.player.addCell(cell);
        }
      }
    }
  }

  export interface ICardinalDirections
  {
    n: any;
    e: any;
    s: any;
    w: any;
  }

  export function makeCoasts(props?:
  {
    mapWidth: number;
    mapHeight?: number;

    coasts?: any;

    amount?: number;
    amountWeights?: number[];

    depth?: number;
    variation?: number;
    falloff?: number;
    falloffType?: number;
    landThreshhold?: number;
  })
  {

    props.mapHeight = props.mapHeight || props.mapWidth;


    var coasts = (function getcoastDirectionsFN(props)
      {
        if (props.coasts)
        {
          return props.coasts;
        }


        else
        {
          var amountOfCoasts: number = props.amount;
          var directionOfCoasts: ICardinalDirections =
          {
            n: {hasCoast: false},
            e: {hasCoast: false},
            s: {hasCoast: false},
            w: {hasCoast: false}
          }

          if (amountOfCoasts === undefined)
          {
            var amountOfCoasts = 0;
            var amountWeights = props.amountWeights ||
             [1, 0.5, 0.5, 0];

            for (var i = 0; i < amountWeights.length; i++)
            {
              if (1 - Math.random() < amountWeights[i])
              {
                amountOfCoasts++;
              }
              else break;
            }
          }
          if (amountOfCoasts === 0)
          {
            for (var dir in directionOfCoasts)
            {
              directionOfCoasts[dir].hasCoast = false;
            }
          }
          else if (amountOfCoasts === 4)
          {
            for (var dir in directionOfCoasts)
            {
              directionOfCoasts[dir].hasCoast = true;
            }
          }
          else
          {
            var primaryCoast = getRandomKey(directionOfCoasts);
            directionOfCoasts[primaryCoast].hasCoast = true;

            var dirKeys = Object.keys(directionOfCoasts)

            var primaryIndex = dirKeys.indexOf(primaryCoast);

            var nextIndexOffset = Math.round(Math.random()) * 2 - 1; //-1 or 1

            for (var i = 1; i < amountOfCoasts; i++)
            {
              var nextIndex = (primaryIndex + nextIndexOffset) % dirKeys.length;
              if (nextIndex < 0) nextIndex += dirKeys.length;

              var nextKey = dirKeys[nextIndex];
              directionOfCoasts[nextKey].hasCoast = true;
              nextIndexOffset *= -1;
            }
          };

          return directionOfCoasts;
        }
      })(props);
    
    for (var _dir in coasts)
    {
      var dir = coasts[_dir];
      if (dir.hasCoast)
      {
        var isHorizontal = (_dir === "n" || _dir === "s");
        var x = isHorizontal ? props.mapWidth  : props.mapHeight;
        var y = isHorizontal ? props.mapHeight : props.mapWidth;


        dir.depth          = dir.depth          || props.depth          ||
          Math.floor(y / 4);
        dir.variation      = dir.variation      || props.variation      ||
          0.05;
        dir.falloff        = dir.falloff        || props.falloff        ||
          0.40;
        dir.falloffType    = dir.falloffType    || props.falloffType    ||
          "logarithmic";
        dir.landThreshhold = dir.landThreshhold || props.landThreshhold ||
          0.20;

      }

      var finalCoast: number[][] = dir.finalCoast = [];

      for (var i = 0; i < dir.depth; i++)
      {
        finalCoast[i] = [];

        var falloff: number;

        switch (dir.falloffType)
        {
          case "linear":
          {
            falloff = 1 - dir.falloff * i;
            break;
          }
          case "logarithmic":
          {
            falloff = 1 - Math.log( 1 + dir.falloff * i);
            break;
          }
        }
        for (var j = 0; j < x; j++)
        {
          var n = (Math.random() + randRange(-dir.variation, dir.variation)) * falloff;
          n = n > dir.landThreshhold ? 1 : 0;
          finalCoast[i][j] = n;
        }
      };
    };
    return coasts;
  }

  export function applyCoastsToCells(props:
  {
    cells: string[][];

    coasts?: any;
    coastProps?: any;
  })
  {
    props.coastProps = props.coastProps || {};
    props.coastProps.mapWidth = props.cells.length;
    props.coastProps.mapHeight = props.cells[0].length;
    var coasts = props.coasts || makeCoasts(props.coastProps);

    var alreadyPlaced: any = {};

    for (var _dir in coasts)
    {
      var coast = coasts[_dir];
      if (coast.hasCoast)
      {
        switch (_dir)
        {
          case "n":
          case "w":
          {
            coast.finalCoast = coast.finalCoast.reverse();
            break;
          }
        };

        switch (_dir)
        {
          case "e":
          case "w":
          {
            var rotated = [];
            for (var i = 0; i < coast.finalCoast.length; i++)
            {
              for (var j = 0; j < coast.finalCoast[i].length; j++)
              {
                if (!rotated[j]) rotated[j] = [];
                rotated[j][i] = coast.finalCoast[i][j];
              }
            }
            coast.finalCoast = rotated;
            break;
          }
        };
        switch (_dir)
        {
          case "w":
          {
            coast.startPoint = [0, 0];
            break;
          }
          case "n":
          {
            coast.startPoint = [0, 0];
            break;
          }
          case "e":
          {
            coast.startPoint = [props.cells.length - coast.depth, 0];
            break;
          }
          case "s":
          {
            //coast.startPoint = [0, 0];
            coast.startPoint = [0, props.cells.length - coast.depth];
            break;
          }
        }


        for (var i = 0; i < coast.finalCoast.length; i++)
        {
          for (var j = 0; j < coast.finalCoast[i].length; j++)
          {
            var x = coast.startPoint[0] + j;
            var y = coast.startPoint[1] + i;

            var type = (coast.finalCoast[i][j] === 1) ?
              "grass" :
              "water";

            if (alreadyPlaced[""+x+y]  && alreadyPlaced[""+x+y] === "water")
            {
              type = "water";
            }
            else
            {
              alreadyPlaced[""+x+y] = type;
            }

            props.cells[x][y] = type;
          }
        }
      }
    }
  }
  export function smoothCells(cells, minToChange: number = 0.4, times:number = 1)
  {
    var newCells = [];
    for (var i = 0; i < cells.length; i++)
    {
      newCells[i] = [];
      for (var j = 0; j < cells[i].length; j++)
      {
        var cell = cells[i][j];

        var neighbors = getNeighbors(cells, [i, j], true);
        var totalNeighborCount = 0;

        var neighborTypes: any = {};
        for (var _neigh in neighbors)
        {
          var neigh = neighbors[_neigh];
          if (neigh !== undefined)
          {
            if (!neighborTypes[neigh])
            {
              neighborTypes[neigh] = 0;
            }
            neighborTypes[neigh]++;
            totalNeighborCount++;
          }
        }

        var mostNeighborsType = undefined;
        var mostNeighborsCount = 0;
        for (var _type in neighborTypes)
        {
          if (neighborTypes[_type] > mostNeighborsCount)
          {
            mostNeighborsType = _type;
            mostNeighborsCount = neighborTypes[_type];
          }
        };
        if (mostNeighborsCount / totalNeighborCount >= minToChange)
        {
          newCells[i][j] = mostNeighborsType;
        }
        else
        {
          newCells[i][j] = cells[i][j];
        }
      }
    };

    times--;
    if (times > 0)
    {
      return smoothCells(newCells, minToChange, times);
    }
    else
    {
      return newCells;
    }
    
  }
}

function drawCoastInConsole(coast)
{
  for (var i = 0; i < coast.finalCoast.length; i++)
  {
    var line = "" + i;
    var args = [""];
    for (var j = 0; j < coast.finalCoast[i].length; j++)
    {
      var c = (coast.finalCoast[i][j] === 1) ? "#0F0" : "#00F";
      line += "%c    ";
      args.push("background: " + c);
    }
    args[0] = line;
    console.log.apply(console, args);
  };
}

function drawNeighbors(neighs, center)
{
  var dirs = [
    ["nw", "n", "ne"],
    ["w", "_c", "e"],
    ["sw", "s", "se"]
  ];

  neighs._c = center;

  for (var i = 0; i < dirs.length; i++)
  {
    var line = "" + i;
    var args = [""];
    for (var j = 0; j < dirs[i].length; j++)
    {
      var dir = dirs[i][j];

      if (!neighs[dir]) continue;

      var c = (neighs[dir] === "grass") ? "#0F0" : "#00F";
      line += "%c    ";
      args.push("background: " + c);
    }
  }
  args[0] = line;
  console.log.apply(console, args);
}
