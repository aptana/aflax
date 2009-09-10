var aflax = new AFLAX("../../lib/AFLAX/aflax.swf");
	
var root = null;
var ball = null;
var blur = null;
var shadow = null;
var topBall = null;

var x = 0;
var y = 0;
var lx = 0;
var ly = 0;

function showMouse()
{
	aflax.callStaticFunction("Mouse", "show");
}

function swfsample()
{
	root = aflax.getRoot();
	
	aflax.callStaticFunction("Mouse", "hide");

	blur = new AFLAX.FlashObject(aflax, "flash.filters.BlurFilter");
	blur.exposeProperty("blurX", blur);
		
	ball = new AFLAX.MovieClip(aflax);
	ballTop = new AFLAX.MovieClip(aflax);
	shadow = new AFLAX.MovieClip(aflax);

	ball.loadMovie("ball.swf", "ball1Loaded");

	x = root.get_xmouse();
	y = root.get_ymouse();
	lx = x;
	ly = y;
}

function ball1Loaded(args)
{
	ball.set_x(296);
	ball.set_y(34);

	ballTop.loadMovie("ball.swf", "ball2Loaded");
}

function ball2Loaded(args)
{
	ballTop.set_x(296);
	ballTop.set_y(34);

	shadow.loadMovie("shadow.swf", "ball3Loaded");
}

function ball3Loaded(args)
{
	shadow.set_x(296);
	shadow.set_y(350);
	
	
	root.addEventHandler("onMouseMove", "ballMove");
}

function ballMove()
{
	var newX = root.get_xmouse();
	var newY = root.get_ymouse();

	var ballX = ball.get_x();
	var ballY = ball.get_y();

    x += ((newX - x) * 0.5);
    y += ((Math.min(newY, 318) - y) * 0.5);

	var ballX = (x + lx) * 0.5;
	var ballY = (y + ly) * 0.5;

	ball.set_x(ballX);
	ball.set_y(ballY);

	ballTop.set_x(ballX);
    ballTop.set_y(ballY);

	// Set the shadow to sit directly below the ball
	shadow.set_x(ballX);
    
	var xDiff = x - lx;
    var yDiff = y - ly;

	// rotate the ball so that blur goes the opposite way of movement
    var degrees = (Math.atan2(yDiff, xDiff) * 180) / Math.PI;
    ball.set_rotation(-degrees);

	// Set the blur of the ball
    var diffRt = Math.sqrt((xDiff * xDiff) + (yDiff * yDiff));
	blur.setBlurX(Math.min(diffRt, 64));
	ball.applyFilter(blur);

	// Scale the shadow to shrink as the ball gets higher
    var shadowScale = Math.abs((ballY - 350) + 32);
    shadow.set_xscale(100 + shadowScale);
    shadow.set_yscale(25 + (0.25 * shadowScale));

	// make the shadow fade in opacity as the ball rises
	var alpha = 100 - (0.3 * shadowScale);
    shadow.set_alpha(alpha);

	ballTop.set_alpha(100 - diffRt);

	lx = x;
    ly = y;

	// Update the scene
	aflax.updateAfterEvent();
}
