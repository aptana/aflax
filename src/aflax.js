/**
  *  @projectDescription
  *  <p>AFLAX(tm) is a JavaScript library for the Macromedia Flash(tm) Platform</p>
  *
  *  <p>AFLAX is a trademark of Paul Colton. All Rights Reserved.</p>
  *
  *  <p>The contents of this file are subject to the Mozilla Public License Version
  *  1.1 (the "License"); you may not use this file except in compliance with
  *  the License. You may obtain a copy of the License at
  *  http://www.mozilla.org/MPL/</p>
  *
  *  <p>Software distributed under the License is distributed on an "AS IS" basis,
  *  WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
  *  for the specific language governing rights and limitations under the
  *  License.</p>
  *
  *  <p>The Original Code is The AFLAX Library.</p>
  *
  *  <p>The Initial Developer of the Original Code is Paul Colton.
  *  Portions created by the Initial Developer are Copyright (C) 2005
  *  the Initial Developer. All Rights Reserved.</p>
  *
  *  <p>Contributor(s):</p>
  *  <ul>
  *    <li>Rui Lopes <rgl at ruilopes.com></li>
  *  </ul>
  *
  *  <p>(End of contributor(s) list.)</p>
  *
  *  <p>Paul Colton can be contacted at paul at aflax dot org or write to
  *  Paul Colton, c/o AFLAX, 14677 Via Bettona, #110-111, San Diego, CA 92127</p>
  * 
  *  <p>For more information, updates and demos, visit http://www.aflax.org</p>
  *
  *  @author			Paul Colton
  *  @version			1.00
  *
  */

/**
 * This is the main AFLAX class.
 *
 * @constructor
 * @param {Boolean} trace Whether or not tracing should be turned on. Default is off.
 * @param {String} path The path to the aflax.swf file
 *
 * @return {AFLAX} A new AFLAX object.
 */
function AFLAX(path, trace, enableFlashSettings, localStoreReadyCallback)
{
	if(path != null) AFLAX.path = path;
	if(trace != null) AFLAX.tracing = trace;
	if(localStoreReadyCallback == undefined || localStoreReadyCallback == null) localStoreReadyCallback = "";
	
	this.id = "aflax_obj_" + AFLAX.count++;
	
	if(enableFlashSettings != undefined || enableFlashSettings == true)
	{
		if(document.getElementById("flashSettings") == null && arguments.length > 0)
		{
			var flashSettingsStyle = "width: 215px; height: 138px; position: absolute; z-index: 100;left: -500px; top: -500px";
			document.write('<div id="flashSettings" style="' + flashSettingsStyle + '"\>Flash Settings Dialog</div\>\n');
			AFLAX.settings = new AFLAX();
			AFLAX.settings.addFlashToElement("flashSettings", 215, 138, "#FFFFFF", localStoreReadyCallback, true);
		}
	}
}

/**
 * The version of the library.
 */
AFLAX.version = "0.41";
/**
 * Set whether or not tracing is on. Also can be set in the constructor of the AFLAX object (i.e. new AFLAX(true))
 */
AFLAX.tracing = false;
/**
 * @ignore 
 */
AFLAX.count = 0;
/**
 * @ignore 
 */
AFLAX.path = "aflax.swf";
/**
 * Reference to the AFLAX instance that is used for displaying the Flash settings dialog.
 */
AFLAX.settings = null;
/**
 * @ignore 
 */
AFLAX.prototype.id = null;
/**
 * @ignore 
 */
AFLAX.prototype.flash = null;
/**
 * @ignore 
 */
AFLAX.prototype.root = null;
/**
 * @ignore 
 */
AFLAX.prototype.stage = null;

/**
 * @ignore 
 */
AFLAX.prototype.getHTML = function(width, height, bgcolor, callback, transparent, absolutePosition)
{
	var requiredVersion = new com.deconcept.PlayerVersion([8,0,0]);
	var installedVersion = com.deconcept.FlashObjectUtil.getPlayerVersion();
	if(installedVersion.versionIsValid(requiredVersion) == false)
	{
		// TODO: this should set a CSS class, and not use a inline style.
		return "<div style='border:2px solid #FF0000'>To see this contents you need to install <a target='_blank' href='http://www.macromedia.com/go/getflashplayer'>Flash Player</a> version 8.0 or higher.</div>";
	}

	bgcolor = bgcolor || "#FFFFFF";
	callback = callback || "_none_";

	var content = '\
<object width="' + width + '" height="' + height + '" id="' + this.id + '" type="application/x-shockwave-flash" data="' + AFLAX.path + '?callback=' + callback + '"';

	if(absolutePosition)
		content += 'style="position: absolute"';

	content += '>\
<param name="allowScriptAccess" value="sameDomain" />\
<param name="bgcolor" value="' + bgcolor + '" />\
<param name="movie" value="' + AFLAX.path + '?callback=' + callback + '" />\
<param name="scale" value="noscale" />\
<param name="salign" value="lt" />\
';

	if(transparent)
		content += '<param name="wmode" value="transparent" />';

	content += '</object>';

	if(AFLAX.tracing)
		content += '<div style="border:1px solid #ddd;padding: 4px;background-color: #fafafa;font-size: 8pt;" id="aflaxlogger"></div>'; 

	return content;
}

/**
 * This method create the HTMLElement required to embed the Flash object into your page.
 * This method replaces the child nodes of a given node with the flash HTMLElement.
 *
 * @param {HTMLElement, String} parentElementOrId The parent HTMLElement (or its id).
 * @param {Number} width	The width of the Flash object.
 * @param {Number} height   The height of the Flash object.
 * @param {String} [bgcolor]    The background color of the Flash object as a hex RGB value (i.e. #FF00AA), default value is 0xFFFFFF. (optional)
 * @param {String} [callback]    The function to call when the Flash object is ready. No parameters are passed in. (optional)
 * @param {Boolean} [transparent]    If set to true, makes the Flash movie transparent and allows it to float over or under other divs. (optional)
 *
 * @return {HTMLElement} Returns the HTMLElement that contains the Flash object.
 */
AFLAX.prototype.addFlashToElement = function(parentElementOrId, width, height, bgcolor, callback, transparent)
{
	var parentNode =
		typeof parentElementOrId == "string"
			? document.getElementById(parentElementOrId)
			: parentElementOrId;

	var content = this.getHTML(width, height, bgcolor, callback, transparent);
	var container = document.createElement("div");
	container.innerHTML = content;
	var element = container.removeChild(container.firstChild);

	while(parentNode.firstChild)
		parentNode.removeChild(parentNode.firstChild);

	parentNode.appendChild(element);

	return element;
}	

/**
 * This method inserts the HTML required to embed the Flash object into your page.
 *
 * @param {Number} width	The width of the Flash object.
 * @param {Number} height   The height of the Flash object.
 * @param {String} [bgcolor]    The background color of the Flash object as a hex RGB value (i.e. #FF00AA), default value is 0xFFFFFF. (optional)
 * @param {String} [callback]    The function to call when the Flash object is ready. No parameters are passed in. (optional)
 * @param {Boolean} [transparent]    If set to true, makes the Flash movie transparent and allows it to float over or under other divs. (optional)
 * @param {Boolean} [absolutePosition]    If set to true, sets the position style of the object to absolute. (optional)
 *
 * @return {HTMLElement} Returns the HTMLElement that contains the Flash object.
 */
AFLAX.prototype.insertFlash = function(width, height, bgcolor, callback, transparent, absolutePosition)
{
	var content = this.getHTML(width, height, bgcolor, callback, transparent, absolutePosition);
	document.write(content);

	if(AFLAX.tracing)
		AFLAX.trace("AFLAX Logger initialized.");
		
	return document.getElementById(this.id);
}

/**
 * Returns reference to the Flash _root object.
 *
 * @return {MovieClip} Returns the '_root' MovieClip from the Flash object.
 */
AFLAX.prototype.getRoot = function()
{
	if(this.root == null)
	{
		this.root = new AFLAX.MovieClip(this, null, "_root");
	}
	
	return this.root;
}

/**
 * Returns reference to the Flash Stage object.
 *
 * @return {MovieClip} Returns the 'Stage' MovieClip from the Flash object.
 */
AFLAX.prototype.getStage = function()
{
	if(this.stage == null)
	{
		this.stage = new AFLAX.MovieClip(this, null, "_stage");
		this.stage.exposeProperty("width", this.stage);
		this.stage.exposeProperty("height", this.stage);
		this.stage.exposeProperty("scaleMode", this.stage);
		this.stage.exposeProperty("showMenu", this.stage);
		this.stage.exposeProperty("align", this.stage);
	}
	
	return this.stage;
}

/**
 * Returns reference to the embedded Flash object.
 *
 * @return {HTMLElement} Returns the HTMLElement that represents the embedded Flash object.
 */
AFLAX.prototype.getFlash = function()
{
	if(this.flash == null)
	{
		this.flash = document[this.id];
	}
	
	return this.flash;
}

AFLAX.returnsHash = {
		"true" : true,
		"false" : false,
		"undefined" : undefined,	
		"null" : null,
		"NaN" : NaN
};

/**
 * Call a Flash function directly.
 * 
 * @param {Object} name The name of the function to call
 * @return {Object,String,Number} Return value of function call
 */
AFLAX.prototype.callFunction = function(name)
{ 
    var ret = this.getFlash().CallFunction("<invoke name=\"" +
    	name + "\" returntype=\"javascript\">" + 
    	__flash__argumentsToXML(arguments, 1) + "</invoke>");
    
	if(AFLAX.returnsHash.hasOwnProperty(ret))
	{
		ret = AFLAX.returnsHash[ret];
	}	
    else if(ret.charAt(0) == '"')
    {
    	if(ret.charAt(ret.length-1) == '"')
    		ret = ret.substring(1, ret.length-1);
	}
	else
	{
		// convert to number	
		ret = ret - 0;
	}
		
	return ret;
}

/**
 * Store a value into the Flash persistent data store.
 * @param {String} key The key name of the data
 * @param {Object} value The actual value of the data
 * @param {String} statusCallback A callback function for the status of the storing
 * @param {Boolean} serialize Whether or not to serialize (JSON) the inbound value
 * @return {Object} Returns the result of the call 
 */
AFLAX.prototype.storeValue = function(key, value, statusCallback, serialize)
{
	if(serialize == true)
		value = "[JSON]" + JSON.stringify(value);
	
	if(statusCallback == undefined || statusCallback == null)
		return this.callFunction("aflaxStoreValue", [key, value]);
	else
		return this.callFunction("aflaxStoreValue", [key, value, statusCallback]);
}

/**
 * Gets the value from the Flash persistent data store
 * @param {Object} key The key name of the data
 * @return {Object} The stored value
 */
AFLAX.prototype.getStoredValue = function(key)
{
	var value = this.callFunction("aflaxGetValue", [key]);
	
	value = value.split('\\"').join('"');
	value = value.split("\\'").join("'");
	
	alert(value);
	
	if(value.substring(0,6) == "[JSON]")
		return JSON.parse(value.substring(6));
	else
		return value;
}

/**
 * Hides the Flash settings dialog
 * @static
 */
AFLAX.hideFlashSettings = function()
{
    var flashDiv = document.getElementById("flashSettings");
    flashDiv.style.left = -500 + "px";
    flashDiv.style.top = -500 + "px";
}

/**
 * Show the Flash settings dialog
 * @static
 * @param {Object} [x] The X position of the dialog
 * @param {Object} [y] The Y position of the dialog
 * @param {Object} [mode] The mode to start the dialog in (see Flash docs)
 */
AFLAX.showFlashSettings = function(x, y, mode)
{
	if(x == undefined) x = 100;
	if(y == undefined) y = 100;
	if(mode == undefined) mode = 1;

    var flashDiv = document.getElementById("flashSettings");
	
    // set the centered position
    flashDiv.style.left = x + "px";
    flashDiv.style.top = y + "px";

	AFLAX.settings.callStaticFunction("System", "showSettings", mode);
}

/**
 * Call a static Flash function (i.e. Mouse.hide()).
 *
 * @param {String} objectName	The name of the object whos static method you will be calling.
 * @param {String} func			The name of the static method you want to call.
 * @return {Object} Returns whatever the static method returns, which might be nothing.
 */
AFLAX.prototype.callStaticFunction = function(objectName, func)
{
	var args = new Array();

	args[0] = objectName;
	args[1] = func;

	for(var i=2;i<arguments.length;i++)
	{
		args[i] = arguments[i];
	}

	return this.callFunction("aflaxCallStaticFunction", args);
}

/**
 * Get the value of a static property from Flash
 * @param {String} objectName
 * @param {String} property
 * @return {Object} The value of the static property
 */
AFLAX.prototype.getStaticProperty = function(objectName, property)
{
	return this.callFunction("aflaxGetStaticProperty", [objectName, property]);
}

/**
 * Attach and event listener to an object
 * @param {String} obj
 * @param {String} event
 * @param {String} handler
 */
AFLAX.prototype.attachEventListener = function(obj, event, handler)
{
	var id = obj;
	
	if(obj.id != undefined)
		id = obj.id;
		
	this.callFunction("aflaxAttachEventListener", [id, event, handler]);	
}	


/**
 * Allow for the calling of many commands at once.
 * @param {Array} funcs The list of functions to call with the paramers
 */
AFLAX.prototype.callBulkFunctions = function(funcs)
{
	var s = new Array(funcs.length);
	
	for(var i=0, j=funcs.length;i<j;i++)
	{
		var func = funcs[i];
		s[i] = func.join("\1");
	}
	
	var commands = s.join("\2");
	
	this.callFunction("aflaxBulkCallFunction", commands);
}

/**
 * Calls the Flash UpdateAfterEvent function, which refreshes the screen for
 * smoother performance.
 */
AFLAX.prototype.updateAfterEvent = function()
{
	this.callFunction("aflaxUpdateAfterEvent");
}

/**
 * Creates an Array that lives in the Flash domain
 *
 * @param {Array} elements An Array of initialization elements (optional)
 * @return {AFLAX.FlashObject} The object that represents the Flash array
 */
AFLAX.prototype.createFlashArray = function(elements)
{
	var _array = new AFLAX.FlashObject(this, "Array")

	_array.exposeFunction("push", _array);
	_array.exposeFunction("reverse", _array);
	_array.exposeProperty("length", _array);
	
	var len = elements.length;
	
	for(var i=0;i<len;i++)
		_array.push(elements[i]);
	
	return _array;
}

/**
 * Extends an object to inherit from the passed base class.
 * 
 * @static
 * @param {Function} baseClass	The base 'class' to extend
 * @param {Function} newClass	The new 'class'
 * @return {Object} Reference to newClass
 */
AFLAX.extend = function(baseClass, newClass)
{
	var pseudo = function() {};

	pseudo.prototype = baseClass.prototype;
	newClass.prototype = new pseudo();
	
	newClass.prototype.baseConstructor = baseClass;
	newClass.prototype.superClass = baseClass.prototype;
	newClass.prototype._prototype = newClass.prototype;

	if (baseClass.prototype.superClass == undefined) {
		baseClass.prototype.superClass = Object.prototype;
	}
	
	return newClass;
}

/**
 * Extracts a subset of an Array from a passed in Array.
 *
 * @static
 * @param {Array} args			The array in which you want to extract from.
 * @param {Number} startIndex	The start index from where to start extracting.
 * @return {Array} Returns a new Array which contains the subset of the passed in Array.
 */
AFLAX.extractArgs = function(args, startIndex)
{
	var newArgs = new Array();
	
	for(var i=startIndex;i<args.length;i++)
	{
		newArgs[i-startIndex] = args[i];
	}
	
	return newArgs;
}

/**********************************************************************************/
/* FlashObject Class                                                              */
/**********************************************************************************/

/**
 * Construct a new FlashObject.
 *
 * @constructor
 * @param {AFLAX} aflaxRef	The AFLAX object that new Flash objects will be created against.
 * @param {String} flashObjectName	The name of the Flash object to create. Can be fully qualified (i.e. 'flash.geom.ColorTransform').
 * @param {Array} [objectArgs]	The arguments to send to the newly created object (optional)
 * @param {String} [objectID]	Specify the ID of this object manually. (optional)
 * @return {AFLAX.FlashObject} A new AFLAX.FlashObject object.
 */
AFLAX.FlashObject = function(aflaxRef, flashObjectName, objectArgs, objectID)
{
	if(arguments.length == 0) return;
	
	this.aflax = aflaxRef;
	this.flash = this.aflax.getFlash();
	this._prototype = AFLAX.FlashObject.prototype;
	
	if(objectArgs == null || objectArgs == undefined)
		objectArgs = new Array();
		
	if(flashObjectName != null && flashObjectName != undefined)
	{
		var args = new Array();
		args[0] = flashObjectName;
	
		for(i = 0;i<objectArgs.length;i++)
		{
			var a = objectArgs[i];
	
			//TODO: handle complex object references (i.e. object.subObject)
			if(a.id != undefined)
			{
				a = "ref:" + a.id;
			}
	
			args[i+1] = a;
		}
		

		this.id = this.aflax.callFunction("aflaxCreateObject", args);
	}
	else
	{	
		if(objectID != null && objectID != undefined)
		{
			this.id = objectID;
//			AFLAX.trace(this.id);
		}
	}
	
	if(this.bound == false)
	{
		// TODO:		
	}
}

/**
 * @ignore 
 */
AFLAX.FlashObject.prototype.bound = false;
/**
 * @ignore 
 */
AFLAX.FlashObject.prototype.id = null;
/**
 * @ignore 
 */
AFLAX.FlashObject.prototype._prototype = null;
/**
 * @ignore 
 */
AFLAX.FlashObject.prototype.aflax = null;
/**
 * @ignore 
 */
AFLAX.FlashObject.prototype.flash = null;

/**
 * Calls an arbitrary function on a FlashObject.
 *
 * @param {String} functionName	The function to call on the object.
 * @return {Object} May or may not return something based on the function called.
 */
AFLAX.FlashObject.prototype.callFunction = function(functionName)
{
	var args = new Array();
	
	args[0] = this.id;
	args[1] = functionName;

	for(i = 1;i<arguments.length;i++)
	{
		var val = arguments[i];

		// Expand out val if it is null of a ref type
		if(val == null)
		{
			val = "null";
		}

		if(typeof(val) == "string")
		{
			if(val.substring(0,4) == "ref:")
			{
				var varPart = val.substring(4);
				var restPart = null;
				if(varPart.indexOf(".") != -1)
				{
					restPart = varPart.substring(varPart.indexOf("."));
					varPart = varPart.substring(0, varPart.indexOf("."));
				}

				val = "ref:" + eval(varPart).id;
				
				if(restPart != null)
					val += restPart;
			}
		}

		if(val.id != undefined)
		{
			val = "ref:" + val.id;
		}

		args[i+1] = val;
	}
	
	var retval = this.aflax.callFunction("aflaxCallFunction", args);

	//AFLAX.trace(functionName + "(" + args.join() + ") = " + retval);
	
	return retval;
}

/**
 * Takes a list of Flash object properties and functions and creates JavaScript wrappers
 * on the calling object.
 * 
 * @param {Array} properties	An Array of property names to expose.
 * @param {Array} functions		An Array of function names to expose.
 * @param {Array} mappings		An Array of function names to map.
 * 
 */
AFLAX.FlashObject.prototype.bind = function(properties, functions, mappings)
{
	if(properties != null && properties != undefined)
	{
		for(var pn=0; pn < properties.length; pn++)
		{
			this.exposeProperty(properties[pn]);
		}
	}
	
	if(functions != null && functions != undefined)
	{
		for(var fn=0; fn < functions.length; fn++)
		{
			this.exposeFunction(functions[fn]);
		}
	}
	
	if(mappings != null && mappings != undefined)
	{
		for(var mn=0; mn < mappings.length; mn++)
		{
			this.mapFunction(mappings[mn]);
		}
	}
}

/**
 *
 * Exposes a Flash property to JavaScript. This method exposes both a setter
 * and a getter for the named property.
 *
 * @param {String} propertyName	The name of the Flash property that you want to expose.
 * @param {String} [targetPrototype] The prototype to assign the function to. (optional)
 *
 */
AFLAX.FlashObject.prototype.exposeProperty = function(propertyName, targetPrototype)
{
	var methodSuffix = propertyName.substring(0,1).toUpperCase() + propertyName.substring(1);

	var target = this._prototype;
	
	if(targetPrototype != null)
		target = targetPrototype;

	target["get" + methodSuffix] = function()
	{
		var r = this.aflax.callFunction("aflaxGetProperty", [this.id, propertyName]);

		if(r == null) return null;
		if(r == undefined) return;

		if(typeof(r) == "string")
			return r.split("\\r").join("\r").split("\\n").join("\n");
		else
			return r;
	}

	target["set" + methodSuffix] = function(val)
	{
		this.aflax.callFunction("aflaxSetProperty", [this.id, propertyName, val]);
	}
}

/**
 *
 * Exposes a Flash function to JavaScript.
 *
 * @param {String} functionName	The name of the Flash function that you want to expose.
 * @param {String} [targetPrototype] The prototype to assign the function to. (optional)
 *
 */
AFLAX.FlashObject.prototype.exposeFunction = function(functionName, targetPrototype)
{
	var target = this._prototype;

	if(targetPrototype != null)
		target = targetPrototype;
	
	target[functionName] = function()
	{
		var args = new Array();

		args[0] = this.id;
		args[1] = functionName;
		
		for(var i=0;i<arguments.length;i++)
			args[i+2] = arguments[i];
		
		return this.aflax.callFunction("aflaxCallFunction", args);
	}
}

/**
 * Maps custom AFLAX Flash functions to JavaScript.
 *
 * @param {String} functionName	The name of the Flash function that you want to map.
 * @param {String} targetPrototype The prototype to assign the function to. (optional)
 */
AFLAX.FlashObject.prototype.mapFunction = function(functionName, targetPrototype)
{
	var target = this._prototype;

	if(targetPrototype != null)
		target = targetPrototype;

	target[functionName] = function()
	{
		var args = new Array();

		args[0] = this.id;
		
		for(var i=0;i<arguments.length;i++)
		{
			var a = arguments[i];
			if(a.id != undefined) a = a.id;
			args[i+1] = a;
		}
		
		var fName = "aflax" + functionName.substring(0,1).toUpperCase() + functionName.substring(1);
		
		//AFLAX.trace("Calling " + fName + "(" + args.join() + ")");
		
		return this.aflax.callFunction(fName, args);
	}
}

/**********************************************************************************/
/* MovieCLip Class                                                                */
/**********************************************************************************/

/**
 * Construct a new MovieClip.
 *
 * @constructor
 * @extend AFLAX.FlashObject
 * @param {AFLAX} aflaxRef	The AFLAX object that new Flash objects will be created against.
 * @param {String} [parentClipID]	The ID of the parent clip. (optional)
 * @param {String} [clipID]	Specify the ID of this object manually. (optional)
 * @return {AFLAX.MovieClip} A new AFLAX.MovieClip object.
 */
AFLAX.MovieClip = function(aflaxRef, parentClipID, clipID)
{
	if(arguments.length == 0) return;

	// Start by calling the base class constructor
	arguments.callee.prototype.baseConstructor.call(this, aflaxRef, null, null, clipID);

	if(clipID == undefined || clipID == null)
	{
		if(parentClipID != undefined && parentClipID != null && 
				this.flash.aflaxCreateEmptyMovieClip != undefined && this.flash.aflaxCreateEmptyMovieClip != null)
			this.id = this.aflax.callFunction("aflaxCreateEmptyMovieClip", [parentClipID]);
		else
			this.id = this.aflax.callFunction("aflaxCreateEmptyMovieClip", ["_root"]);
			
	}

	if(AFLAX.MovieClip.bound == false) 
	{
		this.bind(AFLAX.MovieClip.movieClipProperties, AFLAX.MovieClip.movieClipFunctions, AFLAX.MovieClip.movieClipMappings);
		AFLAX.MovieClip.bound = true;
	}
	
	//AFLAX.trace("MovieClip created. id: " + this.id )
}

/**
 * @ignore
 */
AFLAX.extend(AFLAX.FlashObject, AFLAX.MovieClip);

/**
 * Draw a circle
 * @param {Object} x
 * @param {Object} y
 * @param {Object} radius
 */
AFLAX.MovieClip.prototype.drawCircle = function(x,y,radius)
{
	var r = radius;
	var degToRad = Math.PI/180;
	var n= 8;
	
	var theta = 45*degToRad;
	var cr = radius/Math.cos(theta/2);
	var angle = 0;
	var cangle = angle-theta/2;

	var commands = new Array(n+1);
	var commandIndex = 0;
	
	commands[commandIndex++] = [ this.id, "moveTo", x+r, y ];
	
	for (var i=0;i < n;i++) 
	{
		angle += theta;
		cangle += theta;
		var endX = r*Math.cos (angle);
		var endY = r*Math.sin (angle);
		var cX = cr*Math.cos (cangle);
		var cY = cr*Math.sin (cangle);
		commands[commandIndex++] = [ this.id, "curveTo", x+cX,y+cY, x+endX,y+endY ];
	}

	this.aflax.callBulkFunctions(commands);
}

/**
 * @ignore 
 */
AFLAX.MovieClip.bound = false;
/**
 * The properties to expose from Flash on the MovieClip object.
 */
AFLAX.MovieClip.movieClipProperties = [ 
	"_x", 
	"_y", 
	"_height", 
	"_width", 
	"_rotation", 
	"_xmouse",
	"_ymouse", 
	"_xscale", 
	"_yscale", 
	"_alpha", 
	"blendMode",
	"_visible", 
	"cacheAsBitmap" 
	];
/**
 * The functions to expose from Flash on the MovieClip object.
 */
AFLAX.MovieClip.movieClipFunctions = [ 
	"moveTo", 
	"lineTo",
	"curveTo", 
	"lineStyle", 
	"beginFill", 
	"endFill", 
	"clear", 
	"getURL", 
	"removeMovieClip" 
	];
/**
 * The functions to map from the AFLAX Flash file to the MovieClip object.
 */
AFLAX.MovieClip.movieClipMappings  = [ 
	"attachVideo", 
	"createTextField",
	"addEventHandler", 
	"attachBitmap", 
	"applyFilter", 
	"loadMovie" 
	];

/**
 * Clones the movieclip
 *
 * @return {AFLAX.MovieClip} The cloned MovieClip
 */
AFLAX.MovieClip.prototype.clone = function()
{
	var newClip = this.aflax.callFunction("aflaxDuplicateMovieClip", [this.id]);
	var mc = new AFLAX.MovieClip(this.aflax, null, newClip);
	return mc;
}


/**********************************************************************************/
/* CameraClip Class                                                                */
/**********************************************************************************/

/**
 * The CameraClip class
 * 
 * @constructor
 * @param {Object} aflaxRef
 * @param {Object} parentClipID
 */
AFLAX.CameraClip = function(aflaxRef, parentClipID)
{
	if(arguments.length == 0) return;
	
	arguments.callee.prototype.baseConstructor.call(this, aflaxRef, parentClipID, null);
	
	if(parentClipID == undefined || parentClipID == null)
	{
		parentClipID = "_root";
	}
		
	this.id = this.aflax.callFunction("aflaxCreateVideoClip", [parentClipID]);

	var cam = this.aflax.callFunction("aflaxGetCamera");
	
	// Attach the Camera to our MovieClip
	this.attachVideo(cam);
}

/**
 * Returns the list of cameras available.
 * @param {Object} aflaxRef A reference to an AFLAX object
 * @return {String} The list of cameras
 */
AFLAX.CameraClip.GetCameras = function(aflaxRef)
{
	return aflaxRef.getFlash().aflaxGetStaticProperty(["Camera", "names"]);
}

/**
 * @ignore
 */
AFLAX.extend(AFLAX.MovieClip, AFLAX.CameraClip);

/**********************************************************************************/
/* VideoClip Class                                                                */
/**********************************************************************************/

/**
 * Construct a new VideoClip.
 *
 * @constructor
 * @extend AFLAX.MovieClip
 * @param {AFLAX} aflaxRef	The AFLAX object that new Flash objects will be created against.
 * @param {String} parentClipID	The ID of the parent clip.
 * @param {String} url	The URL of the video to play
 * @param {String} [cueCallback]	Callback for cues encountered in video (i.e. "onCue") (optional)
 * @param {String} [loadCallback]	Callback for when video is loaded (i.e. "onLoad") (optional)
 * @return {AFLAX.VideoClip} A new AFLAX.VideoClip object.
 */
AFLAX.VideoClip = function(aflaxRef, parentClipID, url, cueCallback, loadCallback)
{
	if(arguments.length == 0) return;
	
	arguments.callee.prototype.baseConstructor.call(this, aflaxRef, parentClipID, null);
	
	if(parentClipID == undefined || parentClipID == null)
	{
		parentClipID = "_root";
	}
		
	this.id = this.aflax.callFunction("aflaxCreateVideoClip", [parentClipID]);

	// Create NetConnection and call connect(null) on it
	var nc = new AFLAX.FlashObject(this.aflax, "NetConnection");
	nc.callFunction("connect", null);

	// Create the NetStream that will load the video for us
	var ns = new AFLAX.FlashObject(this.aflax, "NetStream", [nc]);
	ns.exposeProperty("time", ns);
	this.netStream = ns;

	// Attach the NetStream to our MovieClip
	this.attachVideo(ns);

	if(loadCallback != null && loadCallback != undefined)
		this.aflax.flash.aflaxAttachVideoStatusEvent([ns.id, loadCallback]);

	if(cueCallback != null && cueCallback != undefined)
		this.aflax.flash.aflaxAttachCuePointEvent([ns.id, cueCallback]);
			
	// Set the buffer time and play the video
	ns.callFunction("setBufferTime", 0);
	ns.callFunction("play", url);
}


/**
 * @ignore
 */
AFLAX.extend(AFLAX.MovieClip, AFLAX.VideoClip);

/**
 * The NetStream object of the video. Allows you to play, stop, seek
 * and get the current postition.
 */
AFLAX.VideoClip.prototype.netStream = null;

/**
 * Given a string that was returned by either the Status event or Cue event,
 * return the value for a given name.
 *
 * @static
 * @param {String} statusString The string that was sent to your event handler.
 * @param {String} valueName The name of the value you want to receive
 * @return {String} The value.
 */
AFLAX.VideoClip.GetStatusValue = function(statusString, valueName)
{
	var s = statusString;
	
	var args = s.split(";");
	var params = new Array();

	for(var i=0;i<args.length;i++)
	{
		var n = args[i].split("=");
		if(n[0] != "")
		{
			params[n[0]] = n[1];
		}
	}
	
	return params[valueName];
}

/**
 * Data is not being received quickly enough to fill the buffer. Data flow will be interrupted until the buffer refills, at which time a NetStream.Buffer.Full message will be sent and the stream will begin playing again.
 */   
AFLAX.VideoClip.NetStream_Buffer_Empty = "NetStream.Buffer.Empty";
 
/**
 *  The buffer is full and the stream will begin playing.
 */
AFLAX.VideoClip.NetStream_Buffer_Full = "NetStream.Buffer.Full";

/**
 *  Data has finished streaming, and the remaining buffer will be emptied.
 */ 
AFLAX.VideoClip.NetStream_Buffer_Flush = "NetStream.Buffer.Flush";
 
/**
 *  Playback has started.
 */
AFLAX.VideoClip.NetStream_Play_Start = "NetStream.Play.Start";
 
/**
 * Playback has stopped.
 */
AFLAX.VideoClip.NetStream_Play_Stop = "NetStream.Play.Stop";
 
/**
 * The FLV passed to the play() method can't be found.
 */
AFLAX.VideoClip.NetStream_Play_StreamNotFound = "NetStream.Play.StreamNotFound";
 
/**
 * For video downloaded with progressive download, the user has tried to seek or play past the end of the video data that has downloaded thus far, or past the end of the video once the entire file has downloaded. The message.details property contains a time code that indicates the last valid position to which the user can seek.
 */
AFLAX.VideoClip.NetStream_Seek_InvalidTime = "NetStream.Seek.InvalidTime";
 
/**
 * The seek operation is complete.
 */
AFLAX.VideoClip.NetStream_Seek_Notify = "NetStream.Seek.Notify";


/*********************************************************************************/
/* TextField Class                                                                */
/*********************************************************************************/

/**
 * Construct a new TextField.
 *
 * @constructor
 * @extend AFLAX.MovieClip
 * @param {AFLAX} aflaxRef	The AFLAX object that new Flash objects will be created against.
 * @param {String} clipID	The ID of the this clip.
 * @return {AFLAX.TextField} A new AFLAX.TextField object.
 */
AFLAX.TextField = function(aflaxRef, clipID)
{
	if(arguments.length == 0) return;
	
	// Start by calling the base class constructor
	arguments.callee.prototype.baseConstructor.call(this, aflaxRef, null, clipID);

	if(AFLAX.TextField.bound == false)
	{
		this.bind(AFLAX.TextField.textFieldProperties, AFLAX.TextField.textFieldFunctions);
		AFLAX.TextField.bound = true;
	}
}

/**
 * @ignore
 */
AFLAX.extend(AFLAX.MovieClip, AFLAX.TextField);

/**
 * @ignore
 */
AFLAX.TextField.bound = false;
/**
 * The properties to expose from Flash on the TextField object.
 */
AFLAX.TextField.textFieldProperties = [ 
	"type", 
	"multiline", 
	"wordWrap", 
	"text",
	"htmlText",
	"embedFonts"
	];
/**
 * The functions to expose from Flash on the TextField object.
 */
AFLAX.TextField.textFieldFunctions = [ 
	"setTextFormat" 
	];

/*
 * Tracing Functions
 */

if(AFLAX.tracing == true)
{
	window.onerror = AFLAX.windowError;
}

/**
 * @ignore 
 */
AFLAX.windowError = function(message, url, line) {
	AFLAX.trace('Error on line ' + line + ' of document ' + url + ': ' + message);
	return true;
}

/**
 * Tracing function. Output is generated with AFLAX.trace is set to true.
 */
AFLAX.trace = function(message)
{
	if(AFLAX.tracing == true)
	{
		var div = document.getElementById("aflaxlogger");
	
		if(div != null)
		{
			var p = document.createElement('p');
			p.style.margin = 0;
			p.style.padding = 0;
			p.style.textAlign = "left";
			var text = document.createTextNode(message);
			p.appendChild(text);
			div.appendChild(p);
		}
	}
}

/*********************************************************************************/
/* Socket Wrapper Class                                                                */
/*********************************************************************************/

/**
 * Socket class
 *
 * @param {AFLAX} aflax The AFLAX reference to create objects against
 * @param {String} host The host to connect to
 * @param {String} port The port to connect to
 * @param {String} [onConnectEvent] The function to call when a connection is made (or errors out) (optional)
 * @param {String} onDataEvent The function to call when data is recived
 * @param {String} onCloseEvent The function to call when the connection is closed
 * @return {AFLAX.FlashObject} Returns an AFLAX.FlashObject of the XMLSocket, not an AFLAX.Socket :-)
 */
AFLAX.Socket = function(aflax, host, port, onConnectEvent, onDataEvent, onCloseEvent)
{
	var flash = aflax.getFlash();
	var connection = new AFLAX.FlashObject(aflax, "XMLSocket");
	flash.aflaxAttachSocketEvents([connection.id, onConnectEvent, onDataEvent, onCloseEvent]);
	connection.exposeFunction("connect", connection);
	connection.exposeFunction("close", connection);
	connection.exposeFunction("send", connection);
	connection.connect(host, port);
	return connection;
}

/*
 * FlashObject v1.2.3: Flash detection code - http://blog.deconcept.com/flashobject/
 *
 * FlashObject is (c) 2005 Geoff Stearns and is released under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */

if(typeof com == "undefined")
{
	/**
	 * @ignore
	 */
	var com;
	com = new Object();	
}
if(typeof com.deconcept == "undefined") com.deconcept = new Object();
if(typeof com.deconcept.util == "undefined") com.deconcept.util = new Object();
if(typeof com.deconcept.FlashObjectUtil == "undefined") com.deconcept.FlashObjectUtil = new Object();

/**
 * @ignore 
 */
com.deconcept.FlashObjectUtil.getPlayerVersion = function(){
   var PlayerVersion = new com.deconcept.PlayerVersion(0,0,0);
	if(navigator.plugins && navigator.mimeTypes.length){
		var x = navigator.plugins["Shockwave Flash"];
		if(x && x.description) {
			PlayerVersion = new com.deconcept.PlayerVersion(x.description.replace(/([a-z]|[A-Z]|\s)+/, "").replace(/(\s+r|\s+b[0-9]+)/, ".").split("."));
		}
	}else if (window.ActiveXObject){
	   try {
   	   var axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
   		PlayerVersion = new com.deconcept.PlayerVersion(axo.GetVariable("$version").split(" ")[1].split(","));
	   } catch (e) {}
	}
	return PlayerVersion;
}
/**
 * @ignore 
 */
com.deconcept.PlayerVersion = function(arrVersion){
	this.major = parseInt(arrVersion[0]) || 0;
	this.minor = parseInt(arrVersion[1]) || 0;
	this.rev = parseInt(arrVersion[2]) || 0;
}
/**
 * @ignore 
 */
com.deconcept.PlayerVersion.prototype.versionIsValid = function(fv){
	if(this.major < fv.major) return false;
	if(this.major > fv.major) return true;
	if(this.minor < fv.minor) return false;
	if(this.minor > fv.minor) return true;
	if(this.rev < fv.rev) return false;
	return true;
}
/* ---- end of detection functions ---- */

/* ---- JSON functions - Copyright (c) 2005 JSON.org ---- */
Array.prototype.______array='______array';var JSON={org:'http://www.JSON.org',copyright:'(c)2005 JSON.org',license:'http://www.crockford.com/JSON/license.html',stringify:function(arg){var c,i,l,s='',v;switch(typeof arg){case'object':if(arg){if(arg.______array=='______array'){for(i=0;i<arg.length;++i){v=this.stringify(arg[i]);if(s){s+=',';}
s+=v;}
return'['+s+']';}else if(typeof arg.toString!='undefined'){for(i in arg){v=arg[i];if(typeof v!='undefined'&&typeof v!='function'){v=this.stringify(v);if(s){s+=',';}
s+=this.stringify(i)+':'+v;}}
return'{'+s+'}';}}
return'null';case'number':return isFinite(arg)?String(arg):'null';case'string':l=arg.length;s='"';for(i=0;i<l;i+=1){c=arg.charAt(i);if(c>=' '){if(c=='\\'||c=='"'){s+='\\';}
s+=c;}else{switch(c){case'\b':s+='\\b';break;case'\f':s+='\\f';break;case'\n':s+='\\n';break;case'\r':s+='\\r';break;case'\t':s+='\\t';break;default:c=c.charCodeAt();s+='\\u00'+Math.floor(c/16).toString(16)+
(c%16).toString(16);}}}
return s+'"';case'boolean':return String(arg);default:return'null';}},parse:function(text){var at=0;var ch=' ';function error(m){throw{name:'JSONError',message:m,at:at-1,text:text};}
function next(){ch=text.charAt(at);at+=1;return ch;}
function white(){while(ch!=''&&ch<=' '){next();}}
function str(){var i,s='',t,u;if(ch=='"'){outer:while(next()){if(ch=='"'){next();return s;}else if(ch=='\\'){switch(next()){case'b':s+='\b';break;case'f':s+='\f';break;case'n':s+='\n';break;case'r':s+='\r';break;case't':s+='\t';break;case'u':u=0;for(i=0;i<4;i+=1){t=parseInt(next(),16);if(!isFinite(t)){break outer;}
u=u*16+t;}
s+=String.fromCharCode(u);break;default:s+=ch;}}else{s+=ch;}}}
error("Bad string");}
function arr(){var a=[];if(ch=='['){next();white();if(ch==']'){next();return a;}
while(ch){a.push(val());white();if(ch==']'){next();return a;}else if(ch!=','){break;}
next();white();}}
error("Bad array");}
function obj(){var k,o={};if(ch=='{'){next();white();if(ch=='}'){next();return o;}
while(ch){k=str();white();if(ch!=':'){break;}
next();o[k]=val();white();if(ch=='}'){next();return o;}else if(ch!=','){break;}
next();white();}}
error("Bad object");}
function num(){var n='',v;if(ch=='-'){n='-';next();}
while(ch>='0'&&ch<='9'){n+=ch;next();}
if(ch=='.'){n+='.';while(next()&&ch>='0'&&ch<='9'){n+=ch;}}
if(ch=='e'||ch=='E'){n+='e';next();if(ch=='-'||ch=='+'){n+=ch;next();}
while(ch>='0'&&ch<='9'){n+=ch;next();}}
v=+n;if(!isFinite(v)){error("Bad number");}else{return v;}}
function word(){switch(ch){case't':if(next()=='r'&&next()=='u'&&next()=='e'){next();return true;}
break;case'f':if(next()=='a'&&next()=='l'&&next()=='s'&&next()=='e'){next();return false;}
break;case'n':if(next()=='u'&&next()=='l'&&next()=='l'){next();return null;}
break;}
error("Syntax error");}
function val(){white();switch(ch){case'{':return obj();case'[':return arr();case'"':return str();case'-':return num();default:return ch>='0'&&ch<='9'?num():word();}}
return val();}};
/* ---- end of JSON functions ---- */