// Copyright (c) 2005-2006 Paul Colton - Please see http://www.aflax.org

if(typeof AFLAX=="undefined")alert(" AFLAX.Canvas requires 'aflax.js'. ");AFLAX.Canvas=function(elementID,onReadyCallback,rendererType)
{this.elementID=elementID;if(onReadyCallback)
{this.onReadyCallback=onReadyCallback;}
var type=AFLAX.Canvas.RENDERER_BEST;if(rendererType)
{type=rendererType;}
this.initRenderer(type);}
AFLAX.Canvas.RENDERER_BEST=0;AFLAX.Canvas.RENDERER_FLASH=1;AFLAX.Canvas.RENDERER_CANVAS=2;AFLAX.Canvas.RENDERER_DIV=3;AFLAX.Canvas.prototype._canvas=null;AFLAX.Canvas.prototype.elementID=null;AFLAX.Canvas.prototype.onReadyCallback=null;AFLAX.Canvas.prototype.initRenderer=function(rendererType)
{var width=document.getElementById(this.elementID).style.width;var height=document.getElementById(this.elementID).style.height;var background=document.getElementById(this.elementID).style.backgroundColor;var me=this;var callbackName="_readyEvent"+Math.floor(Math.random()*9999);AFLAX.Canvas[callbackName]=function()
{me.onReady();}
callbackName="AFLAX.Canvas."+callbackName;switch(rendererType)
{case AFLAX.Canvas.RENDERER_BEST:if(FlashBridge.isSupported()){this._canvas=new AFLAX.Canvas.Flash("lib/AFLAX/aflax.swf",this.elementID,width,height,background,callbackName);}
else if(CanvasBridge.isSupported()){this._canvas=new AFLAX.Canvas.Canvas(this.elementID,width,height,background,callbackName);}
else if(DivBridge.isSupported()){this._canvas=new AFLAX.Canvas.Div(this.elementID,callbackName);}
else
document.getElementById(this.elementID).innerHTML="<b>No renderers available.</b>"
break;case AFLAX.Canvas.RENDERER_FLASH:if(FlashBridge.isSupported())
this._canvas=new AFLAX.Canvas.Flash("lib/AFLAX/aflax.swf",this.elementID,width,height,background,callbackName);else
document.getElementById(this.elementID).innerHTML="<b>Flash 8 ExternalInterface not supported.</b>"
break;case AFLAX.Canvas.RENDERER_CANVAS:if(CanvasBridge.isSupported())
this._canvas=new AFLAX.Canvas.Canvas(this.elementID,width,height,background,callbackName);else
document.getElementById(this.elementID).innerHTML="<b>Canvas not supported.</b>"
break;case AFLAX.Canvas.RENDERER_DIV:if(DivBridge.isSupported())
this._canvas=new AFLAX.Canvas.Div(this.elementID,callbackName);else
document.getElementById(this.elementID).innerHTML="<b>DIV rendering is not supported.</b>"
break;}}
AFLAX.Canvas.prototype.onReady=function()
{if(this.onReadyCallback!=null)
this.onReadyCallback(this._canvas);}