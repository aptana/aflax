// Copyright (c) 2005-2006 Paul Colton - Please see http://www.aflax.org

AFLAX.Canvas.Canvas=function(elementID,width,height,background,rootCallbackName)
{this._firstX;this._firstY;this._lastX;this._lastY;this._fill="0x000";this._canvas;this._id;this._stroke=false;this._callbackName=rootCallbackName;try{var parentNode=document.getElementById(elementID);var canvas=document.createElement("canvas");this._id=canvas.id="AFLAX.Canvas.Canvas_"+Math.floor(Math.random()*9999);canvas.width=parseInt(width.substring(0,width.indexOf("px")));canvas.height=parseInt(height.substring(0,width.indexOf("px")));canvas.style.width=width;canvas.style.height=height;canvas.style.backgroundColor=background;while(parentNode.firstChild)
parentNode.removeChild(parentNode.firstChild);parentNode.appendChild(canvas);}
catch(e)
{var s="";for(i in e)
s+=i+" "+e[i]+"\n";alert(s);}
this._canvas=new PathRenderer(new CanvasBridge(this._id));setTimeout(this._callbackName+"()",100);return this._canvas;}