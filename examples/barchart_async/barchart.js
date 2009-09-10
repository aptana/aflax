/**
 * barChartAsync class
 * @author Paul Colton (paul@aflax.org)
 */

/**
 * Fields
 */
barChartAsync.ID = 0;
barChartAsync.request = null;
barChartAsync.currentChart = null;

barChartAsync.prototype.id = null;
barChartAsync.prototype.aflax = null;
barChartAsync.prototype.bars = null;
barChartAsync.prototype.tooltip = null;
barChartAsync.prototype.tooltext = null;
barChartAsync.prototype.textformat = null;

/**
 * Constructor
 */
function barChartAsync(aflaxRef)
{
	this.aflax = aflaxRef;
	this.id = barChartAsync.ID++;
	this.bars = new Array();

	barChartAsync.request = barChartAsync.createXMLHttpRequest();
}

/**
 * Methods
 */
barChartAsync.prototype.init = function()
{
	this.createGrid();
	this.createClips();
}

barChartAsync.prototype.start = function(aflaxRef)
{
	barChartAsync.currentChart = this;
	barChartAsync.request.open("get", "data.txt");
	barChartAsync.request.onreadystatechange = barChartAsync.handleResponse;
	barChartAsync.request.send(null);
}

barChartAsync.handleResponse = function()
{
    if(barChartAsync.request.readyState == 4)
    {
		var response = barChartAsync.request.responseText;
    }
    else
    {
	    return;
	}

	barChartAsync.currentChart.cleanup();
	
	var result = response.split(",");
	var height = 200;
	
	for(var x=0;x<result.length;x++)
	{
		barChartAsync.currentChart.bars[x].set_height(5);
		barChartAsync.currentChart.bars[x].targetHeight = parseInt(result[x]);
	}

	barChartAsync["animateBars_bars" + barChartAsync.currentChart.id].timerID = 
		setInterval("barChartAsync.animateBars_bars" + barChartAsync.currentChart.id + "()", 10);
}

barChartAsync.createXMLHttpRequest = function()
{	
    var ua;
	
    if(window.XMLHttpRequest) {
        try {
            ua = new XMLHttpRequest();
        } catch(e) {
            ua = false;
        }
      } else if(window.ActiveXObject) {
        try {
           ua = new ActiveXObject("Microsoft.XMLHTTP");
        } catch(e) {
           ua = false;
        }
    }
    return ua;
}

barChartAsync.prototype.createGrid = function()
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

barChartAsync.prototype.createClips = function()
{
	var height = 200;
	var barTemplate = this.createBar(height);

	for(var x=0;x<40;x++)
	{
		this.bars[x] = barTemplate.clone();

		this.bars[x].addEventHandler("onRollOver", "barChartAsync.barChart_onRollOver" + this.id + "()");
		this.bars[x].addEventHandler("onRollOut", "barChartAsync.barChart_onRollOut" + this.id + "()");

		this.bars[x].set_x(15 + x*10);
		this.bars[x].set_y(220);
		
		this.bars[x].set_height(5);
	}

	this.createTooltip();

	var thisRef = this;

	barChartAsync["barChart_onRollOver" + this.id] = function()
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

	barChartAsync["barChart_onRollOut" + this.id] = function()
	{
		var parentRef = thisRef;
		parentRef.tooltip.set_x(-200);	
	}
	
	barChartAsync["animateBars_bars" + this.id] = function()
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
			clearInterval(barChartAsync["animateBars_bars" + thisRef.id].timerID);
			barChartAsync["animateBars_bars" + thisRef.id].timerID = 0;
		}
	}
}

barChartAsync.prototype.cleanup = function()
{
	var b = barChartAsync["animateBars_bars" + this.id];

	if(b != null && b.timerID != undefined)
	{
		if(barChartAsync["animateBars_bars" + this.id].timerID != 0)
			clearInterval(barChartAsync["animateBars_bars" + this.id].timerID);
	}
}

barChartAsync.prototype.createTooltip = function()
{
	this.tooltip = new AFLAX.MovieClip(this.aflax);
	this.tooltip.set_x(-100);
	this.tooltip.set_alpha(50);

	var baloon = new AFLAX.MovieClip(this.aflax, this.tooltip.id);
	baloon.loadMovie("tooltip.swf");

	var tf = this.tooltip.createTextField(12, 6, 95, 45);

	this.tooltext = new AFLAX.TextField(this.aflax, tf);
}

barChartAsync.prototype.createBar = function(maxHeight)
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

