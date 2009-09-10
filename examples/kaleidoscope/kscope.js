
var aflax = new AFLAX("../../lib/AFLAX/aflax.swf");
	
var hsize = 500;
var vsize = 500;
var diag = Math.sqrt(2*hsize*hsize)*0.62;
var map; //BitmapData
var mapHolder; //MovieClip
var code; //MovieClip
var image;
var imageClip;
var stampImage;

var rotate1 = false;
var rotate2 = true;
var rotate3 = false;
var flip = true;
var singleview = true;
var slice;
var slices = 6;
var angle = Math.PI/slices;
var nudge = 0.009;
var rotspeed1 = 0.007;
var rotspeed2 = -0.003;
var rotspeed3 = -0.005;
var sclfact = 0;
var rot = 0;
var r = 0;
var r2 = 0;
var sh1 = 0;
var sh2 = 0;
var scl = 1;
var m;

function kscope_start()
{
	map = new AFLAX.FlashObject(aflax, "flash.display.BitmapData", [hsize, vsize, true, 0x00000000]);
	mapHolder = new AFLAX.MovieClip(aflax);
	mapHolder.attachBitmap(map, 0);

	slice = new AFLAX.MovieClip(aflax);
	slice.set_visible(false);

	m = new AFLAX.FlashObject(aflax, "flash.geom.Matrix");
	m.exposeProperty("b", m);
	m.exposeProperty("c", m);
	
	imageClip = new AFLAX.MovieClip(aflax);
	imageClip.loadMovie("kscope.jpg", "image_loaded");

}

function image_loaded()
{
	var width = imageClip.get_width();
	var height = imageClip.get_height();
	
	// Place the loaded image into a BitmapData
	image = new AFLAX.FlashObject(aflax, "flash.display.BitmapData", [width, height, false, 0x00FFFFFF]);
	image.callFunction("draw", imageClip);
	imageClip.callFunction("removeMovieClip");

	stampImage  = new AFLAX.FlashObject(aflax, "flash.display.BitmapData", [width, height, false]);
	stampImage.callFunction("draw", image, new AFLAX.FlashObject(aflax, "flash.geom.Matrix", [0.5, 0, 0, 0.5, 0, 0]), null, "normal", null, true);
	stampImage.callFunction("draw", image, new AFLAX.FlashObject(aflax, "flash.geom.Matrix", [-0.5, 0, 0, 0.5, width, 0]), null, "normal", null, true);
	stampImage.callFunction("draw", image, new AFLAX.FlashObject(aflax, "flash.geom.Matrix", [0.5, 0, 0, -0.5, 0, height]), null, "normal", null, true);
	stampImage.callFunction("draw", image, new AFLAX.FlashObject(aflax, "flash.geom.Matrix", [-0.5, 0, 0, -0.5, width, height]), null, "normal", null, true);
	image.callFunction("dispose");

	aflax.getRoot().addEventHandler("onKeyDown", "onKeyDown");
	aflax.callStaticFunction("Key", "addListener", "_root");
	
	setInterval("onEnterFrame()", 25);
}

function onKeyDown()
{
	var key = parseInt(aflax.callStaticFunction("Key", "getCode"));
	
	switch (key) {
	case 38: //Key.UP :
		scl *= 1.03;
		break;
	case 40: //Key.DOWN :
		scl *= 0.96;
		break;
	case 37: //Key.LEFT :
		r -= 0.01;
		break;
	case 39: //Key.RIGHT :
		r += 0.01;
		break;
	case 187 :
		//+
		slices += 2;
		angle = Math.PI/slices;
		break;
	case 189 :
		//-
		if (slices>4) {
			slices -= 2;
			angle = Math.PI/slices;
		}
		break;
	case 49 :
		//1
		rotate1 = !rotate1;
		break;
	case 50 :
		//2
		rotate2 = !rotate2;
		break;
	case 51 :
		//3
		rotate3 = !rotate3;
		break;
	case 52 :
		//4
		flip = !flip;
		break;
	case 53 :
		//5
		sh1 += 0.04;
		break;
	case 54 :
		//6
		sh1 -= 0.04;
		break;
	case 55 :
		//7
		sh2 += 0.04;
		break;
	case 56 :
		//8
		sh2 -= 0.04;
		break;
	case 78 :
		//n
		sclfact += 0.01;
		break;
	case 77 :
		//m
		sclfact -= 0.01;
		break;
	case 48 :
		sclfact = 0;
		break;
	case 81 :
		//q
		rotspeed1 += 0.001;
		break;
	case 87 :
		//w
		rotspeed1 -= 0.001;
		break;
	case 65 :
		//a
		rotspeed2 += 0.001;
		break;
	case 89 :
		//q
		rotspeed3 += 0.001;
		break;
	case 88 :
		//w
		rotspeed3 -= 0.001;
		break;
	case 69 :
		rotspeed1 = 0;
		break;
	case 68 :
		rotspeed2 = 0;
		break;
	case 67 :
		rotspeed3 = 0;
		break;
	case 83 :
		//s
		rotspeed2 -= 0.001;
		break;
	}
}


function onEnterFrame() {
	if (rotate1) {
		r += rotspeed1;
	}
	if (rotate2) {
		r2 -= rotspeed2;
	}
	if (rotate3) {
		rot += rotspeed3;
	}
	
	
	for (var i = 0; i<slices; i++) {
		var funcs = new Array();
		var fi = 0;
	
		m.callFunction("identity");
		m.setB(m.getB() + sh1);
		m.setC(m.getC() + sh2);
		
		funcs[fi++] = [m.id, "rotate", r2];
		//m.callFunction("rotate", r2);
		funcs[fi++] = [m.id, "translate", 2*aflax.getRoot().get_xmouse()/scl, 2*aflax.getRoot().get_ymouse()/scl+i*sclfact*10];
		//m.callFunction("translate", 2*aflax.getRoot().get_xmouse()/scl, 2*aflax.getRoot().get_ymouse()/scl+i*sclfact*10);
		funcs[fi++] = [m.id, "rotate", r];
		//m.callFunction("rotate", r);
		funcs[fi++] = [m.id, "scale", scl, scl];
		//m.callFunction("scale", scl, scl);
		funcs[fi++] = [slice.id, "clear"];
		//slice.callFunction("clear");
		funcs[fi++] = [slice.id, "lineStyle"];
		//slice.callFunction("lineStyle");
		funcs[fi++] = [slice.id, "moveTo", 0, 0];
		//slice.moveTo(0, 0);
		aflax.callBulkFunctions(funcs);


		//funcs[fi++] = [slice.id, "beginBitmapFill", stampImage.id, m.id];
		slice.callFunction("beginBitmapFill", stampImage, m);

		funcs = new Array();
		fi = 0;
		
		funcs[fi++] = [slice.id, "lineTo", Math.cos((angle+nudge)-Math.PI/2)*diag, Math.sin((angle+nudge)-Math.PI/2)*diag];
		funcs[fi++] = [slice.id, "lineTo", Math.cos(-(angle+nudge)-Math.PI/2)*diag, Math.sin(-(angle+nudge)-Math.PI/2)*diag];
		funcs[fi++] = [slice.id, "lineTo", 0, 0];
		funcs[fi++] = [slice.id, "endFill"];
		
		funcs[fi++] = [m.id, "identity"];

		if (flip && i%2 == 1) {
			funcs[fi++] = [m.id, "scale", -1, 1];
		}
		funcs[fi++] = [m.id, "rotate", rot+i*angle*2];
		aflax.callBulkFunctions(funcs);

		m.callFunction("translate", hsize*0.5, vsize*0.5);

		map.callFunction("draw", slice, m, null, "normal", null, true);

		aflax.updateAfterEvent();
	}

	
}

