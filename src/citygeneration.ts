/// <reference path="../data/js/cg.d.ts" />
/// <reference path="js/utility.d.ts" />

module cityGeneration
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

  
}