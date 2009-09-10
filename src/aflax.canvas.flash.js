// Copyright (c) 2005-2006 Paul Colton - Please see http://www.aflax.org

AFLAX.Canvas.Flash=function(swfLocation,elementID,width,height,background,rootCallbackName)
{this._canvas;this._aflax=new AFLAX(swfLocation);this._callbackName=rootCallbackName;var callbackName="_readyEvent"+Math.floor(Math.random()*9999);var me=this;AFLAX.Canvas.Flash[callbackName]=function()
{me.onReady();}
callbackName="AFLAX.Canvas.Flash."+callbackName;this._aflax.addFlashToElement(elementID,width,height,background,callbackName);this._canvas=new PathRenderer();return this._canvas;}
AFLAX.Canvas.Flash.prototype.onReady=function()
{this._canvas.bridge=new FlashBridge(this._aflax.getRoot());eval(this._callbackName+"()");}