var fire, mask, bmp, mask2, noise, blur, glow, noiseLine, noisePoint, bmpPoint, dark, matrix, textGlow;

function text_burning()
{
}

text_burning.prototype.start = function(aflax)
{
	var w = 640;
	var h = 125;

	fire = new AFLAX.MovieClip(aflax);

	textGlow = new AFLAX.FlashObject(aflax, "flash.filters.GlowFilter",  [0xFF9900, 1, 2, 2, 3, 1, false, false]);
	fire.applyFilter(textGlow);
	
	this.createText(fire);
	
	bmp = new AFLAX.FlashObject(aflax, "flash.display.BitmapData",  [w, h, false, 0]);
	matrix = new AFLAX.FlashObject(aflax, "flash.geom.Matrix",  [1, 0, 0, 1, 0, -2]);
	mask = new AFLAX.FlashObject(aflax, "flash.display.BitmapData",  [w, h, true, 0]);
	mask2 = new AFLAX.FlashObject(aflax, "flash.display.BitmapData",  [w, h, true, 0]);
	noise = new AFLAX.FlashObject(aflax, "flash.display.BitmapData",  [w, h, false, 0]);
	blur = new AFLAX.FlashObject(aflax, "flash.filters.BlurFilter",  [2, 2, 1]);
	glow = new AFLAX.FlashObject(aflax, "flash.filters.GlowFilter",  [0xFFFFFF, 1, 2, 2, 3, 1, true, true]);
	noiseLine = new AFLAX.FlashObject(aflax, "flash.geom.Rectangle",  [0, 0, w, 1]);
	noisePoint = new AFLAX.FlashObject(aflax, "flash.geom.Point",  [0, h-1]);
	bmpPoint = new AFLAX.FlashObject(aflax, "flash.geom.Point",  [0, 0]);
	dark = new AFLAX.FlashObject(aflax, "flash.geom.ColorTransform",  [0.99, 0.93, 0, 1, 0, 0, 0, 0]);

	var mc = new AFLAX.MovieClip(aflax);
	mc.attachBitmap(bmp, 1, "always", true);
	mc.set_x(0);
	mc.set_y(0);
	mc.set_xscale(100);
	mc.set_yscale(100);
	mc.setBlendMode(8);
	
	setInterval("text_burning_tick()", 1000);
	setInterval("text_burning_fireItUp()", 25);
}

var my_txt;
var my_fmt;

text_burning.prototype.createText = function(clip)
{
	my_txt = new AFLAX.TextField(aflax, clip.createTextField(2, 13, 635, 105));

	my_txt.setMultiline(true);
	my_txt.setWordWrap(true);
	my_txt.setType("input");
	
	my_fmt = new AFLAX.FlashObject(aflax, "TextFormat");
	my_fmt.exposeProperty("size", my_fmt);
	my_fmt.exposeProperty("color", my_fmt);
	my_fmt.exposeProperty("font", my_fmt);
	my_fmt.exposeProperty("align", my_fmt);

	my_fmt.setColor(0xFF0000);
	my_fmt.setSize(40);
	my_fmt.setFont("Arial");
	my_fmt.setAlign("center");
	
	text_burning_tick();
}

text_burning_tick = function()
{
	var Stamp = new Date();
	
	var Hours;
	var Mins;
	var Secs;
	var Time;
	Hours = Stamp.getHours();

	if (Hours >= 12) {
		Time = " PM";
	}
	else 
	{
		Time = " AM";
	}
	
	if (Hours > 12) {
		Hours -= 12;
	}
	
	if (Hours == 0) {
	Hours = 12;
	}
	
	Mins = Stamp.getMinutes();
	
	if (Mins < 10) {
		Mins = "0" + Mins;
	}
	
	Secs = Stamp.getSeconds();
	
	if (Secs < 10) {
		Secs = "0" + Secs;
	}
		
	my_txt.setText("AFLAX Rules!\n" + Hours + ":" + Mins + ":" + Secs + Time);
	my_txt.callFunction("setTextFormat", "ref:my_fmt");	
}

text_burning_fireItUp = function()
{
	mask.callFunction("fillRect", "ref:mask.rectangle", 0);
	mask2.callFunction("fillRect", "ref:mask2.rectangle", 0);		

	mask.callFunction("draw", fire, matrix);
	mask2.callFunction("applyFilter", mask, "ref:mask.rectangle", bmpPoint, glow);

	noise.callFunction("noise", Math.random()*10000, 50, 255, 0, true);
	
	bmp.callFunction("scroll", 0, -1);
	
	bmp.callFunction("copyPixels", noise, noiseLine, noisePoint);
	bmp.callFunction("copyPixels", noise, "ref:noise.rectangle", bmpPoint, mask2, bmpPoint, true);
	bmp.callFunction("colorTransform", "ref:bmp.rectangle", dark);
	bmp.callFunction("applyFilter", bmp, "ref:bmp.rectangle", bmpPoint, blur);
}

