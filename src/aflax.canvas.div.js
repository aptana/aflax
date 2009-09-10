// Copyright (c) 2005-2006 Paul Colton - Please see http://www.aflax.org

AFLAX.Canvas.Div=function(elementID,rootCallbackName)
{var r=new DivBridge(elementID);setTimeout(rootCallbackName+"()",100);return new PathRenderer(r);}