var t;

function draw()
{
	// make a 100-pixel grid movieclip at depth 1
	var grid = new AFLAX.MovieClip(aflax);
	grid.lineStyle(1, 0xcccccc, 100);
	grid.moveTo(0, 0);
	grid.lineTo(500, 0);
	grid.lineTo(500, 200);
	grid.lineTo(0, 200);
	grid.lineTo(0, 0);
	grid.moveTo(100, 0);
	grid.lineTo(100, 200);
	grid.moveTo(200, 0);
	grid.lineTo(200, 200);
	grid.moveTo(300, 0);
	grid.lineTo(300, 200);
	grid.moveTo(400, 0);
	grid.lineTo(400, 200);
	grid.moveTo(0, 100);
	grid.lineTo(500, 100);
	
	// create a movieclip of two rectangles at depth 2
	// create a variable r to reference this movieclip
	// (which we can do because createEmptyMovieClip returns a 
	//  reference to itself)
	var r = new AFLAX.MovieClip(aflax);
	r.beginFill(0xcc00cc, 100);
	r.moveTo(20, 20);
	r.lineTo(140, 20);
	r.lineTo(140, 140);
	r.lineTo(20, 140);
	// notice that the shape will be filled automatically
	// without having to draw the last line
	r.endFill();
	// start a new rectangle of a different color in the same clip
	r.beginFill(0x0000cc, 50);
	r.lineStyle(1, 0x000033, 100);
	r.moveTo(80, 80);
	r.lineTo(180, 80);
	r.lineTo(180, 180);
	r.lineTo(80, 180);
	r.endFill();
	
	// create a triangle movieclip at centered on 0,0. then move it so
	// it's centered at 300, 100 by referencing its _x and _y properties.
	// then make it rotate every frame using the onEnterFrame method.
	t = new AFLAX.MovieClip(aflax);
	t.beginFill(0x000099);
	t.lineStyle(2, 0x000033, 100);
	t.moveTo(-50, 50);
	t.lineTo(0, -50);
	t.lineTo(50, 50);
	t.endFill();
	t.set_x(300);
	t.set_y(100);

	setInterval("rotate()", 100);
	
	// make a circle movieclip c, centered at 400, 100 with radius=80
	// apply a radial gradient fill to the circle
	var c = new AFLAX.MovieClip(aflax);
	// center point and radius of circle
	var r = 80;
	var x = 400;
	var y = 100;
	// constant used in calculation
	var A = Math.tan(22.5 * Math.PI/180);
	// variables for each of 8 segments
	var endx;
	var endy;
	var cx;
	var cy;
	
	var colors = aflax.createFlashArray([0x0000cc, 0xcc00cc]);
	var alphas = aflax.createFlashArray([80, 100]);
	var ratios = aflax.createFlashArray([128, 255]);
	var matrix = new AFLAX.FlashObject(aflax, "flash.geom.Matrix");
	
	matrix.callFunction("createGradientBox", 430, 150, 0, 0, 0);

	c.callFunction("beginGradientFill", "radial", colors, alphas, ratios, matrix);
	c.moveTo(x+r, y);

	for (var angle = 45; angle<=360; angle += 45) {
	   // endpoint
	   endx = r*Math.cos(angle*Math.PI/180);
	   endy = r*Math.sin(angle*Math.PI/180);
	   // control:
	   // (angle-90 is used to give the correct sign)
	   cx =endx + r* A *Math.cos((angle-90)*Math.PI/180);
	   cy =endy + r* A *Math.sin((angle-90)*Math.PI/180);
	   c.curveTo(cx+x, cy+y, endx+x, endy+y);
	}

	c.endFill();
}

function rotate()
{
   t.set_rotation(t.get_rotation() + 5);
}
