// tell the package system what classes get defined here
dojo.provide("dojo.widget.VideoPlayer");

// load dependencies
dojo.require("dojo.widget.HtmlWidget");

// make it a tag
dojo.widget.tags.addParseTreeHandler("dojo:VideoPlayer");

// define the widget class
dojo.widget.VideoPlayer = function()
{
    dojo.widget.HtmlWidget.call(this);

    this.widgetType = "VideoPlayer";
    this.templatePath = dojo.uri.dojoUri("src/widget/templates/VideoPlayer.html");
    this.templateCssPath = dojo.uri.dojoUri("src/widget/templates/VideoPlayer.css");

    this.width = 300;
    this.height = 225;
    this.onCueEvent = "";
    this.videoFile = "";
    this.videoContainer = null;
    this.aflaxRef = "";
    
    this.fillInTemplate = function()
    {
    	if(this.aflaxRef == "")
    	{
    		alert("Error: Required 'aflaxRef' property not set.");
    		return;
    	}
    	
    	with(this.videoContainer.style)
    	{
    		width = this.width + "px";
    		height = this.height + "px";
    	}

    	var width = this.width;
    	var height = this.height;
		var file = this.videoFile;
		var onCueEvent = this.onCueEvent;
		var aflaxRef = this.aflaxRef = window[this.aflaxRef];

    	dojo.widget.VideoPlayer["onReady" + aflaxRef.id] = function()
    	{
    		dojo.widget.VideoPlayer["videoClip" + aflaxRef.id] = 
    			new AFLAX.VideoClip(aflaxRef, null, file, 
    				onCueEvent == "" ? null : "dojo.widget.VideoPlayer.onCue" + aflaxRef.id, 
    				"dojo.widget.VideoPlayer.onLoad" + aflaxRef.id);;
    	}
    	
    	dojo.widget.VideoPlayer["onLoad" + aflaxRef.id] = function(status)
    	{
			if(AFLAX.VideoClip.GetStatusValue(status, "code") == AFLAX.VideoClip.NetStream_Play_Start)
			{
				var video = dojo.widget.VideoPlayer["videoClip" + aflaxRef.id];
				video.netStream.callFunction("pause", true);
				video.netStream.callFunction("seek", 0);
				video.set_width(parseInt(width));
				video.set_height(parseInt(height));		
			}
    	}
    	
    	dojo.widget.VideoPlayer["onCue" + aflaxRef.id] = function(status)
    	{
    		if(onCue != "")
    		{
	    		var val = AFLAX.VideoClip.GetStatusValue(status, "name"); 
    			window[onCueEvent](val);
    		}
    	}
    	
    	this.videoContainer.innerHTML = 
    		aflaxRef.getHTML(this.width, this.height, "#FFFFFF", "dojo.widget.VideoPlayer.onReady" + aflaxRef.id, false);
	}
	
	this.rewindButton = null;
	this.startStopButton = null;
	this.stopped = true;
	
	this.togglePaused = function(){
        if(this.stopped){
            this.stopped = false;
        	var video = dojo.widget.VideoPlayer["videoClip" + this.aflaxRef.id];
        	video.netStream.callFunction("pause", this.stopped);
            this.startStopButton.value= "Pause";
        }else{
            this.stopped = true;
        	var video = dojo.widget.VideoPlayer["videoClip" + this.aflaxRef.id];
        	video.netStream.callFunction("pause", this.stopped);
            this.startStopButton.value= "Play";
        }
    }
    
    this.rewindVideo = function()
    {
    	var video = dojo.widget.VideoPlayer["videoClip" + this.aflaxRef.id];
    	video.netStream.callFunction("seek", 0);
    }
}

// complete the inheritance process
dojo.inherits(dojo.widget.VideoPlayer, dojo.widget.HtmlWidget);
