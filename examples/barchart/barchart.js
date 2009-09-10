/*****************
 * barChart class
 *****************/

 /**
 * Fields
 */
barChart.ID = 0;
barChart.prototype.id = null;
barChart.prototype.flash = null;
barChart.prototype.aflax = null;
barChart.prototype.bars = null;
barChart.prototype.tooltip = null;
barChart.prototype.tooltext = null;
barChart.prototype.textformat = null;

/**
 * Constructor
 */
function barChart()
{
	this.id = barChart.ID++;
}

/**
 * Methods
 */
barChart.prototype.start = function(aflaxRef)
{
	this.aflax = aflaxRef;
	this.flash = this.aflax.getFlash();
	this.bars = new Array();
	this.createGrid();
	this.createClips();
	this.randomize();
}

barChart.prototype.createGrid = function()
{
	var root = this.aflax.getRoot();
	
	root.lineStyle(2, 0xcccccc, 100);
	root.moveTo(5, 5);
	root.lineTo(5, 220);
	root.lineTo(420, 220);

	root.lineStyle(1, 0xdddddd, 100);

	for(var y=220;y>5;y-=20)
	{
		root.moveTo(5, y);
		root.lineTo(420, y);
	}
	
}

barChart.prototype.createClips = function()
{
	var height = 200;
	var barTemplate = this.createBar(height);

	for(var x=0;x<40;x++)
	{
		this.bars[x] = barTemplate.clone();

		this.bars[x].addEventHandler("onRollOver", "barChart.barChart_onRollOver" + this.id + "()");
		this.bars[x].addEventHandler("onRollOut", "barChart.barChart_onRollOut" + this.id + "()");

		this.bars[x].set_x(15 + x*10);
		this.bars[x].set_y(220);
	}

	this.createTooltip();

	var thisRef = this;

	barChart["barChart_onRollOver" + this.id] = function()
	{
		var parentRef = thisRef;
		
		var root = parentRef.aflax.getRoot();
		var x = root.get_xmouse();
		var y = root.get_ymouse();		

		parentRef.tooltip.set_x(x);
		parentRef.tooltip.set_y(y-31);
		
		var index = Math.floor((x-15) / 10);

		var height = parentRef.bars[index].get_height();

		parentRef.tooltext.setText("Value: " + height);
	}

	barChart["barChart_onRollOut" + this.id] = function()
	{
		var parentRef = thisRef;
		parentRef.tooltip.set_x(-200);	
	}
	
	barChart["animateBars_bars" + this.id] = function()
	{
		var b = thisRef.bars;
		var f = thisRef.aflax.getFlash();
	
		for(var x=0;x<40;x++)
		{
			var delta = b[x].targetHeight / 12;
			var height = b[x].get_height();
			b[x].set_height(height + delta);
		}

		var stopAnimating = true;
		
		for(var x=0;x<40;x++)
		{
			if(b[x].get_height() < b[x].targetHeight)
			{
				stopAnimating = false;
			}
		}
		
		if(stopAnimating)
		{
			clearInterval(barChart["animateBars_bars" + thisRef.id].timerID);
			barChart["animateBars_bars" + thisRef.id].timerID = 0;
		}
	}
}

barChart.prototype.cleanup = function()
{
	var b = barChart["animateBars_bars" + this.id];

	if(b != null && b.timerID != undefined)
	{
		if(barChart["animateBars_bars" + this.id].timerID != 0)
			clearInterval(barChart["animateBars_bars" + this.id].timerID);
	}
}

barChart.prototype.createTooltip = function()
{
	this.tooltip = new AFLAX.MovieClip(this.aflax);
	this.tooltip.set_x(-100);
	this.tooltip.set_alpha(50);

	var baloon = new AFLAX.MovieClip(this.aflax, this.tooltip.id);
	baloon.loadMovie("tooltip.swf");

	var tf = this.tooltip.createTextField(12, 6, 95, 45);

	this.tooltext = new AFLAX.TextField(this.aflax, tf);
}

barChart.prototype.randomize = function()
{
	this.cleanup();
	
	var height = 200;
	
	for(var x=0;x<40;x++)
	{
		this.bars[x].set_height(5);
		this.bars[x].targetHeight = height * Math.random();
	}

	barChart["animateBars_bars" + this.id].timerID = 
		setInterval("barChart.animateBars_bars" + this.id + "()", 10);
}


barChart.prototype.createBar = function(maxHeight)
{
	var x = 0;
	var y = 0;
	var height = maxHeight;
	
	var mc = new AFLAX.MovieClip(this.aflax);

	mc.moveTo(x, y);
	mc.beginFill(0xaaaacc, 100);
	mc.lineTo(x+6, y);
	mc.lineTo(x+6, y-height);
	mc.lineTo(x, y-height);
	mc.lineTo(x, y);
	mc.endFill();

	mc.lineStyle(1, 0xaaaaaa, 100);
	mc.moveTo(x+6, y);
	mc.lineTo(x+6, y-height+2);
	
	return mc;
}

