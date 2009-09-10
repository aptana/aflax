/**
 * Some information for setting up mime type for flv files on your server:
 * http://livedocs.macromedia.com/flash/mx2004/main_7_2/00001107.html
 */
 
var videoTextSet = {
	  point1: 
	  	"<font size='+1'>The autocross has started, I punch the gas and get going...</font>",
	  point2: 
	  	"<font size='+1'>I round the first turn and ready myself for the next turn...</font>",
	  point3: 
	  	"<font size='+1'>I have to slow way down here as this is a very tight turn...</font>",
	  point4: 
	  	"<font size='+1'>Now comes the fast straight, if you listen closely, you can here the engine whining loudly...</font>",
	  point5: 
	  	"<font size='+1'>This video clip is over. Notice how I was able to change this text based on cue point events! This was done all in JavaScript using AFLAX!</font>"
	}

videoSample.timeClip = null;

videoSample.prototype.aflax = null;
videoSample.prototype.flash = null;

videoSample.prototype.video = null;
videoSample.prototype.paused = false;

function videoSample(aflaxRef, cueCallback, loadCallback, file)
{
	this.aflax = aflaxRef;
	this.flash = this.aflax.getFlash();
	this.play(cueCallback, loadCallback, file);
}

videoSample.prototype.pause = function()
{
	this.paused = !this.paused;
	this.video.netStream.callFunction("pause", this.paused);
}

videoSample.prototype.stop = function()
{
	this.paused = true;
	this.video.netStream.callFunction("pause", this.paused);
}

videoSample.prototype.seek = function(time)
{
	this.video.netStream.callFunction("seek", time);
}

videoSample.prototype.time = function()
{
	if(this.video.netStream == null) 
		return 0;
	else
		return this.video.netStream.getTime();
}

videoSample.prototype.play = function(cueCallback, loadCallback, file)
{
	this.video = new AFLAX.VideoClip(this.aflax, null, 
		file, cueCallback, loadCallback);
}
