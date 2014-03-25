"use strict";

function arrayLogic(logic, array1, array2)
{
  var regexes =
  {
    and: /(and)|&/i,
    not: /(not)|!/i,
    or: /(or)|\^/i
  };

  var mode;
  for (var re in regexes)
  {
    if ( regexes[re].test(logic) ) mode = re;
  }
  if (!mode) throw new Error("faulty parameter: " + logic);
  switch (mode)
  {
    case "and":
    {
      return arrayLogic.and(array1, array2);
    }
    case "not":
    {
      return arrayLogic.not(array1, array2);
    }
    case "or":
    {
      return arrayLogic.or(array1, array2);
    }
  }
}

arrayLogic.and = function(array1, array2)
{
  if ( !arrayLogic.inputIsValid(array1, array2) )
  {
    return undefined;
  }
  var matchFound;
  for (var i = 0; i < array1.length; i++)
  {
    matchFound = false;
    for (var j = 0; j < array2.length; j++)
    {
      if (array1[i] === array2[j])
      {
        matchFound = true;
        break;
      }
    }
  }
  return matchFound;
};

arrayLogic.not = function(array1, array2)
{
  if ( !arrayLogic.inputIsValid(array1, array2) )
  {
    return undefined;
  }

  for (var i = 0; i < array1.length; i++)
  {
    for (var j = 0; j < array2.length; j++)
    {
      if (array1[i] === array2[j])
      {
        return false;
      }
    }
  }
  return true;
};

arrayLogic.or = function(array1, array2)
{
  if ( !arrayLogic.inputIsValid(array1, array2) )
  {
    return undefined;
  }
  for (var i = 0; i < array1.length; i++)
  {
    for (var j = 0; j < array2.length; j++)
    {
      if (array1[i] === array2[j])
      {
        return true;
      }
    }
  }
  return false;
};

arrayLogic.inputIsValid = function(array1, array2)
{
  for (var i = 0; i < arguments.length; i++)
  {
    
    if (!arguments[i] ||
      !arguments[i] instanceof Array ||
      arguments[i].length === 0)
    {
      return false;
    }
  }

  return true;
};