var aflax = new AFLAX("../../lib/AFLAX/aflax.swf");
	
var displaceFilter;
var blurFilter;
var mergeMap;
var m;
var tempMap;
var displaceMap;
var logo, logo2, logo3;
var zero;
var skyBaseMap;
var sky;
var padding;

var bevel1 = 4;
var angle1 = 10;
var base1 = 0;
var displace1 = 10;

var smooth1 = 4;
var angle2 = 10;
var base2 = 0;
var fuzzy1 = 2;

function aquaDemo_start()
{
	skyBaseMap = new AFLAX.FlashObject(aflax, "flash.display.BitmapData", [500, 500, false, 0x00FFFFFF]);
	
	sky = new AFLAX.MovieClip(aflax);
	sky.loadMovie("sky.jpg", "aquaDemo_drawInto");
}

function aquaDemo_drawInto()
{
	skyBaseMap.callFunction("draw", sky);		
	sky.attachBitmap(skyBaseMap, 0);	
	
	logo = new AFLAX.MovieClip(aflax);
	logo.loadMovie("q.swf", "aquaDemo_onQLoaded");
}

function aquaDemo_onQLoaded()
{
	logo.set_alpha(70);
	
	padding = 10;
	var logo_width = 160;
	var logo_height = 160;
	
	m = new AFLAX.FlashObject(aflax, "flash.geom.Matrix",  [1, 0, 0, 1, padding / 2, padding / 2]);
	tempMap = new AFLAX.FlashObject(aflax, "flash.display.BitmapData",  [logo_width + padding, logo_height + padding, true, 0x00808080]);
	tempMap.exposeProperty("width", tempMap);
	tempMap.exposeProperty("height", tempMap);

	displaceMap = new AFLAX.FlashObject(aflax, "flash.display.BitmapData", [logo_width + padding, logo_height + padding, false, 0x808080]);
	mergeMap = new AFLAX.FlashObject(aflax, "flash.display.BitmapData", [tempMap.getWidth(), tempMap.getHeight(), true, 0x00808080]);

	blurFilter = new AFLAX.FlashObject(aflax, "flash.filters.BlurFilter", [2, 2, 2]);
	zero = new AFLAX.FlashObject(aflax, "flash.geom.Point", [0, 0]);

	aquaDemo_makeGlass();
	
	logo2 = new AFLAX.MovieClip(aflax);
	logo2.attachBitmap(mergeMap, 0);
	logo2.applyFilter(
		new AFLAX.FlashObject(aflax, "flash.filters.DropShadowFilter", [4, 45, 0x000000, 2, 8, 8, 0.3, 3, false, false, false])
	);

	logo3 = new AFLAX.MovieClip(aflax);
	logo3.loadMovie("q.swf", "aquaDemo_onQLoaded2");
}

function aquaDemo_onQLoaded2()
{
	logo3.setBlendMode("add");
	logo3.applyFilter(
		new AFLAX.FlashObject(aflax, "flash.filters.BevelFilter", [10, 0, 0x000000, 1, 0x000000, 1, 18, 18, 3, 1, "inner"]), 
		new AFLAX.FlashObject(aflax, "flash.filters.BlurFilter", [10, 10, 2])
	);
	
	setInterval("aquaDemo_onEnterFrame()", 25);
}


function aquaDemo_makeGlass()
{
	displaceFilter = new AFLAX.FlashObject(aflax, "flash.filters.DisplacementMapFilter", [displaceMap, zero, 1, 2, displace1, displace1, "wrap"]);
	var bevel = new AFLAX.FlashObject(aflax, "flash.filters.BevelFilter", [bevel1, angle1, 0xffffff, 1, 0x000000, 1, smooth1, smooth1, 3, 1, "inner"]);
	logo.applyFilter(bevel);

	tempMap.callFunction("fillRect", "ref:tempMap.rectangle", 0x00808080);
	tempMap.callFunction("draw", logo, m, 
		new AFLAX.FlashObject(aflax, "flash.geom.ColorTransform", [1, 0, 0, 1, base1, 0, 0, 0]), "normal", null,true);
	
	bevel.exposeProperty("angle", bevel);
	bevel.setAngle(angle2);
	
	logo.applyFilter(bevel);
	
	tempMap.callFunction("draw", logo, m, 
		new AFLAX.FlashObject(aflax, "flash.geom.ColorTransform", [0, 1, 0, 1, 0, base2, 0, 0]),
		"add",null,true);

	tempMap.callFunction("applyFilter",tempMap,"ref:tempMap.rectangle",zero,blurFilter);

	displaceMap.callFunction("draw", tempMap);
}

function aquaDemo_onEnterFrame()
{
	var x = aflax.getRoot().get_xmouse();
	var y = aflax.getRoot().get_ymouse();

	if(y > 450)
	{
		x = 250;
		y = 250;
	}
	
	logo2.set_x(Math.round (0.9 * logo2.get_x() + 0.1 * (x - logo.get_width() / 2)));
	logo2.set_y(Math.round (0.9 * logo2.get_y() + 0.1 * (y - logo.get_height() / 2)));
	
	logo.set_x( logo2.get_x() + padding / 2 );
	logo.set_y( logo2.get_y() + padding / 2 );
	
	logo3.set_x( logo2.get_x() + 8);
	logo3.set_y( logo2.get_y() + 8);

	var rect = new AFLAX.FlashObject(aflax, "flash.geom.Rectangle", [logo2.get_x(), logo2.get_y(), logo.get_width() + padding, logo.get_height() + padding]);
	
	mergeMap.callFunction("copyPixels", skyBaseMap, rect, zero);
	
	rect.exposeProperty("x", rect);
	rect.exposeProperty("y", rect);

	rect.setX(0);
	rect.setY(0);
	
	mergeMap.callFunction("applyFilter", mergeMap, rect, zero, 
		new AFLAX.FlashObject(aflax, "flash.filters.BlurFilter", [fuzzy1, fuzzy1, 2]));
	mergeMap.callFunction("applyFilter", mergeMap, rect, zero, displaceFilter);
	mergeMap.callFunction("copyChannel", tempMap, "ref:tempMap.rectangle", zero, 8, 8);
}

