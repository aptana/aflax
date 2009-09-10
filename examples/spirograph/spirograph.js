// Spyrograph.js - Paul Colton
// Original Spyrograph.as - Jim Bumgardner

var SW = 400;
var SH = 400;
var CX = 200;
var CY = 200;
var kNumberTrails = 100;
var funcs = new Array(kNumberTrails*2);

var ringRad  = SW/2;
var discRadR = .81;
var penRadR = .7;
var speed = 0.6;
var lineThick = 4;
var showGuide = true;
var lastX = CX;
var lastY = CY;
var angle = 0;
var isTiger = false;
var guide_mc = null;
var dotArray;

// get initial pen position...
var discRad = ringRad*discRadR;
var penRad = discRad*penRadR;
var csx = CX+Math.cos(0)*(ringRad-discRad);
var csy = CX+Math.sin(0)*(ringRad-discRad);

function start()
{
	init();
	guide_mc = new AFLAX.MovieClip(aflax);
	setInterval("onEnterFrame()", 10);	
}

function init()
{
	lastX = csx+Math.cos(0)*penRad; // pen position
	lastY = csy+Math.sin(0)*penRad;
	
	dotArray = [];
	for (i = 0; i <= kNumberTrails; ++i) {
		var elem = [];
		elem.x = elem.cx = lastX;
		elem.y = elem.cy = lastY;
		elem.alpha = i < 20? i*100/20 : 100;
		dotArray[i] = elem;
	}

	adjustColor();
}

onEnterFrame = function()
{
  var discRad = ringRad*discRadR;
  var penRad = discRad*penRadR;
 
  guide_mc.clear();

  // Basic spyrograph math...

  // angle of disc
  //if (!_root.isAdjusting)
	  angle += discRadR*speed;
  
  // center of disc
  csx = CX+Math.cos(angle)*(ringRad-discRad);
  csy = CX+Math.sin(angle)*(ringRad-discRad);

  // angle of pen from center of disc
  //if (!_root.isAdjusting)
	  angPen = angle-angle*ringRad/discRad;
  
  // position of pen
  lastX = csx+Math.cos(angPen)*penRad;
  lastY = csy+Math.sin(angPen)*penRad;

  // compute point we're curving thru (cx,cy) for curveTo command
  var angle2 = (angle-(speed*discRadR)/2);
  var csx2 = CX+Math.cos(angle2)*(ringRad-discRad);
  var csy2 = CX+Math.sin(angle2)*(ringRad-discRad);
  var angPen2 = angle2-angle2*ringRad/discRad;
  var cRad = penRad/Math.cos(angPen-angPen2);
  var lcx = csx2+Math.cos(angPen2)*cRad;
  var lcy = csy2+Math.sin(angPen2)*cRad;
 
  if (showGuide) // || _root.isAdjusting) 
  {  
     var alphaScale = .2; //_root.isAdjusting? 1 : .2;
     guide_mc.lineStyle(4,0x888888,100*alphaScale);
     guide_mc.drawCircle(csx,csy,discRad);
     guide_mc.lineStyle(2,0x888888,100*alphaScale);
     guide_mc.moveTo(csx+Math.cos(angPen)*discRad, csy+Math.sin(angPen)*discRad);
     guide_mc.lineTo(csx-Math.cos(angPen)*discRad, csy-Math.sin(angPen)*discRad);
     guide_mc.lineStyle(4,0x888888,100*alphaScale);
     guide_mc.drawCircle(lastX,lastY,1+lineThick);
  }

  if (true) //!isAdjusting)
  {
	  for (var i = 0; i < kNumberTrails; i++)
	  {
		dotArray[i].x = dotArray[i+1].x;
		dotArray[i].y = dotArray[i+1].y;
		dotArray[i].cx = dotArray[i+1].cx;
		dotArray[i].cy = dotArray[i+1].cy;
	  }
	  dotArray[kNumberTrails].x = lastX;
	  dotArray[kNumberTrails].y = lastY;
	  dotArray[kNumberTrails].cx = lcx;
	  dotArray[kNumberTrails].cy = lcy;
  }

  var alphaScale = 1; //_root.isAdjusting? .1 : 1;
  guide_mc.moveTo(dotArray[0].x, dotArray[0].y);

  var index = 0;

  for (var i = 0; i <= kNumberTrails; i++) 
  {
  	funcs[index++] = [guide_mc.id, "lineStyle", lineThick,dotArray[i].clr, dotArray[i].alpha*alphaScale];
    funcs[index++] = [guide_mc.id, "curveTo", dotArray[i].cx,dotArray[i].cy, dotArray[i].x, dotArray[i].y];
  }

  aflax.callBulkFunctions(funcs);  
  aflax.updateAfterEvent();	
}


getRainbowColor = function(r) // r is 0 - 1  - returns a bright color
{
	var a = r*Math.PI*2;
	var r = 128+Math.cos(a)*127;
	var b = 128+Math.cos(a+2*Math.PI/3)*127;
	var g = 128+Math.cos(a+4*Math.PI/3)*127;
	return (r << 16) | (g << 8) | b;
}

getTigerColor = function(r) // r is 0 - 1  - returns a bright color
{
	var a = r*Math.PI*2*11;
	var r = 128+Math.cos(a)*127;
	var b = 64+Math.sin(a)*64;
	var g = 64+Math.cos(a)*64;
	return (r << 16) | (g << 8) | b;
}

function adjustColor()
{
	for (var i = 0; i <= kNumberTrails; ++i) 
	{
		if (isTiger)
			dotArray[i].clr = getTigerColor(i/kNumberTrails);
		else
			dotArray[i].clr = getRainbowColor(i/kNumberTrails);
	}
}


resetDots = function()
{
	for (var i = 0; i < kNumberTrails; ++i) 
	{
		dotArray[i].x = dotArray[kNumberTrails].x;
		dotArray[i].y = dotArray[kNumberTrails].y;
		dotArray[i].cx = dotArray[kNumberTrails].cx;
		dotArray[i].cy = dotArray[kNumberTrails].cy;
	}
}
