function draw()
{
	var c = new AFLAX.MovieClip(aflax);

	var colors = aflax.createFlashArray([0xFF0000, 0x0000FF]);
	var alphas = aflax.createFlashArray([100, 100]);
	var ratios = aflax.createFlashArray([0, 255]);
	
	var matrix = new AFLAX.FlashObject(aflax, "flash.geom.Matrix");
	
	matrix.callFunction("createGradientBox", 100, 100, Math.PI, 0, 0);

	with(c)
	{
		callFunction("beginGradientFill", "radial", colors, alphas, ratios, matrix, "reflect", "linearRGB", 0.9 );
	
	    moveTo(0, 0);
	    lineTo(0, 300);
	    lineTo(300, 300);
	    lineTo(300, 0);
	    lineTo(0, 0);
	
		endFill();
	}
}
