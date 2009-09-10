/**
  *  AFLAX(tm) is a JavaScript library for Macromedia's Flash(tm) Platform
  *
  *  AFLAX is a trademark of Paul Colton, all rights reserved.
  *
  *  The contents of this file are subject to the Mozilla Public License Version
  *  1.1 (the "License"); you may not use this file except in compliance with
  *  the License. You may obtain a copy of the License at
  *  http://www.mozilla.org/MPL/
  *
  *  Software distributed under the License is distributed on an "AS IS" basis,
  *  WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
  *  for the specific language governing rights and limitations under the
  *  License.
  *
  *  The Original Code is The AFLAX Library.
  *
  *  The Initial Developer of the Original Code is Paul Colton.
  *  Portions created by the Initial Developer are Copyright (C) 2005
  *  the Initial Developer. All Rights Reserved.
  *
  *  Contributor(s):
  *
  *  (End of contributor(s) list.)
  *
  *  Paul Colton can be contacted at paul at aflax dot org or write to
  *  Paul Colton, c/o AFLAX, 14677 Via Bettona, #110-111, San Diego, CA 92127
  * 
  *  For more information, updates and demos, visit http://www.aflax.org
  *
  *  @author			Paul Colton
  *  @version			0.40
  *
  **/
 
import flash.external.*;
import flash.display.*;

var objectCount:Number = 1;
var objectCache:Array = new Array();

function aflaxInit():Void
{
	Stage.align = "TL";
	Stage.scaleMode = "noScale";

	objectCache["_root"] = _root;
	objectCache["_stage"] = Stage;

	ExternalInterface.addCallback("aflaxUpdateAfterEvent", _root, updateAfterEvent);

	ExternalInterface.addCallback("aflaxCreateObject", _root, aflaxCreateObject);
	ExternalInterface.addCallback("aflaxGetProperty", _root, aflaxGetProperty);
	ExternalInterface.addCallback("aflaxSetProperty", _root, aflaxSetProperty);
	ExternalInterface.addCallback("aflaxCallFunction", _root, aflaxCallFunction);
	ExternalInterface.addCallback("aflaxBulkCallFunction", _root, aflaxBulkCallFunction);

	ExternalInterface.addCallback("aflaxCallStaticFunction", _root, aflaxCallStaticFunction);
	ExternalInterface.addCallback("aflaxGetStaticProperty", _root, aflaxGetStaticProperty);
	
	ExternalInterface.addCallback("aflaxAttachSocketEvents", _root, aflaxAttachSocketEvents);

	ExternalInterface.addCallback("aflaxAttachVideo", _root, aflaxAttachVideo);
	ExternalInterface.addCallback("aflaxAttachCuePointEvent", _root, aflaxAttachCuePointEvent);
	ExternalInterface.addCallback("aflaxAttachVideoStatusEvent", _root, aflaxAttachVideoStatusEvent);
	
	ExternalInterface.addCallback("aflaxCreateVideoClip", _root, aflaxCreateVideoClip);
	ExternalInterface.addCallback("aflaxLoadMovie", _root, aflaxLoadMovie);
	ExternalInterface.addCallback("aflaxAttachBitmap", _root, aflaxAttachBitmap);
	ExternalInterface.addCallback("aflaxApplyFilter", _root, aflaxApplyFilter);
	ExternalInterface.addCallback("aflaxAddEventHandler", _root, aflaxAddEventHandler);
	ExternalInterface.addCallback("aflaxCreateTextField", _root, aflaxCreateTextField);
	ExternalInterface.addCallback("aflaxCreateEmptyMovieClip", _root, aflaxCreateEmptyMovieClip);
	ExternalInterface.addCallback("aflaxDuplicateMovieClip", _root, aflaxDuplicateMovieClip);

	ExternalInterface.addCallback("aflaxStoreValue", _root, aflaxStoreValue);
	ExternalInterface.addCallback("aflaxGetValue", _root, aflaxGetValue);

	ExternalInterface.addCallback("aflaxGetCamera", _root, aflaxGetCamera);
	
	ExternalInterface.addCallback("aflaxAddEventListener", _root, aflaxAddEventListener);
	ExternalInterface.addCallback("aflaxAttachEventListener", _root, aflaxAttachEventListener);
	
	

	if(_root["callback"] != null)
	{
		ExternalInterface.call(_root["callback"]);
	}
	else
	{
		ExternalInterface.call("main");
	}
}

function aflaxStoreValue(args)
{
	var keyName = args[0];
	var keyValue = args[1];
	var onStatusEvent = args[2];
	
	var sharedObj:SharedObject = SharedObject.getLocal(keyName);

	if(onStatusEvent != undefined && onStatusEvent != null)
	{
		sharedObj.onStatus = function(infoObject)
		{
			if(infoObject.code == "SharedObject.Flush.Failed")
			{
				delete sharedObj.data.savedValue;
			}
	
			var report:String = "";
			

			for (var i in infoObject)
			{
				report += i + "=" + infoObject[i] + ";";
			}
	
			ExternalInterface.call(onStatusEvent, report);
		};
	}

	if(keyValue == "")
	{
		sharedObj.clear();
	}
	else
	{
		sharedObj.data.value = keyValue;
	}
	
	return sharedObj.flush();
}

function aflaxGetValue(args)
{
	var keyName = args[0];
	var sharedObj:SharedObject = SharedObject.getLocal(keyName);
	return sharedObj.data.value;
}


function aflaxAddEventListener(args)
{
	var objName = args[0];
	var eventName = args[1];
	var eventListener = args[2];
	
	var obj = objectCache[objName];
	
	var eventObj = new Object();
	eventObj.eventListener = function(evt) { ExternalInterface.call(eventListener); }

	//aflaxTrace(obj);

	if(obj.addEventListener != undefined)
		obj.addEventListener.apply(obj, eventName, eventObj.eventListener);
}
							  
function aflaxAttachEventListener(args)
{
	var objName = args[0];
	var eventName = args[1];
	var callbackName = args[2];

	var obj = objectCache[objName];

	var eventObj = new Object();
	eventObj[eventName] = function()
	{
		var s:String = "";
		
		for(var i=0;i<arguments.length;i++)
		{
			s += getValuesFromObject(arguments[i]);
		}

		ExternalInterface.call(callbackName, s);
	}

	obj.addListener(eventObj);
}

function getValuesFromObject(obj)
{
	if(typeof(obj) == "number")
	{
		var n:Number = obj;
		return "number: " + n + "!!";
	}
	
	var s:String = typeof(obj) + ": ";
	
	for (var item:String in obj)
	{
		s += item + "=" + obj[item] + ";";
	}
	s += "!!";
	return s;	
}

function aflaxAttachSocketEvents(args)
{
	var objName = args[0];
	var onConnectEvent = args[1];
	var onDataEvent = args[2];
	var onCloseEvent = args[3];
	
	var obj:XMLSocket = objectCache[objName];


	if(onConnectEvent != null)
	{
		obj.onConnect = function(success:Boolean)
		{
			ExternalInterface.call(onConnectEvent, success);
		}
	}
			
	if(onDataEvent != null)
	{
		obj.onXML = function(src)
		{
			ExternalInterface.call(onDataEvent, src.toString());
		}
	}

	if(onCloseEvent != null)
	{
		obj.onClose = function()
		{
			ExternalInterface.call(onCloseEvent);
		}
	}

}

function aflaxAttachVideo(args)
{
	var objName = args[0];
	var vidSource = args[1];
	
	var obj = objectCache[objName];
	var src = objectCache[vidSource];
	
	//aflaxTrace("aflaxAtachVideo: " + obj._video + " " + src);
	
	obj._video.attachVideo(src);
}

function aflaxAttachVideoStatusEvent(args)
{
	var netStream:NetStream = objectCache[args[0]];
	var callback = args[1];
	
	netStream.onStatus = function(infoObject:Object)
	{
		var s:String = "";

		for (var prop in infoObject) {
            s += prop+"="+infoObject[prop] + ";";
        }
		
		ExternalInterface.call(callback, s);
	}
}

function aflaxAttachCuePointEvent(args)
{
	var netStream:NetStream = objectCache[args[0]];
	var callback = args[1];
	
	netStream.onCuePoint = function(infoObject:Object)
	{
		var s:String = "";
		
		for (var propName:String in infoObject)
		{
			if (propName != "parameters")
			{
				s+= propName + "=" + infoObject[propName] + ";";
			}
			else
			{
				if (infoObject.parameters != undefined) {
                	for (var paramName:String in infoObject.parameters)
	                {
    	                s += paramName + "=" + infoObject.parameters[paramName] + ";";
        	        }
				}
			}
		}

//		aflaxTrace("aflaxAttachCuePointEvent: " + s);
	
		ExternalInterface.call(callback, s);
	}
}


function aflaxBulkCallFunction(funcs)
{
	//aflaxTrace("aflaxBulkCallFunction: " );

	var stamp = new Date().getTime();
	
	var funcArray:Array = funcs.split("\2");
	
	for(var i=0;i<funcArray.length;i++)
	{
		var args = funcArray[i].split("\1");
		aflaxCallFunction(args);
	}

	//aflaxTrace("aflaxBulkCallFunction: with " + funcs.length + " functions " + (new Date().getTime() - stamp));
}

/**
 * @param objName	The ID of the object that should be called on
 * @param functionName	The name of the function to call
 */
function aflaxCallFunction(args)
{
	//aflaxTrace("aflaxCallFunction() " + args.join());
	
	var objName = args[0];
	var functionName = args[1];
	
	var obj = objectCache[objName];
	var args2:Array = new Array();

	//aflaxTrace("aflaxCallFunction: " + obj);
	
	for(var i=2;i<args.length;i++)
	{
		var val = args[i];
	
		if(typeof(val) == "string")
		{
			if(val.substring(0,4) == "ref:")
			{
				var varPart:String = val.substring(4);
				var restPart:String = null;
				if(varPart.indexOf(".") != -1)
				{
					restPart = varPart.substring(varPart.indexOf(".") + 1);
					varPart = varPart.substring(0, varPart.indexOf("."));
				}
				
				val = objectCache[varPart];

				var subs:Array = restPart.split(".");
				for (var s = 0; s<subs.length; s++)
				{
					val = val[subs[s]];
				}
			}
		}

		if(val == "null") { val = null;}
		args2[i-2] = val;
	}
	
	obj[functionName].apply(obj, args2);
	
	return true;
}

function aflaxCallStaticFunction(args)
{
	var objectName = args[0];
	var functionName = args[1];
	
	var funcArgs:Array = extractArgs(args, 2);

	var obj = eval(objectName);
	
	for(var i=0;i<funcArgs.length;i++)
	{
		if(objectCache[funcArgs[i]] != null)
			funcArgs[i] = objectCache[funcArgs[i]];
	}
	
	return obj[functionName].apply(obj, funcArgs);
}

function aflaxGetStaticProperty(args)
{
	var className = args[0];
	var propertyName = args[1];

	var c = eval(className);

	var obj = c[propertyName];
	return obj;
}
 
function aflaxLoadMovie(args)
{
	//_root.getURL("javascript:alert('aflaxLoadMovie: " + args.join() + "');");
	
	var clipName = args[0];
	var url = args[1];
	var callback = args[2];
	
	var mc = objectCache[clipName];

	if(mc != undefined && mc != null)
	{
		if(callback == null || callback == undefined)
		{
			mc.loadMovie(url);
		}
		else
		{
			var listener = new Object();

			var loader = new MovieClipLoader();
			loader.addListener(listener);
			loader.loadClip(url, mc)
			
			listener.onLoadInit = function()
			{
				if(args.length > 3)
					ExternalInterface.call(callback, extractArgs(args, 3));
				else
					ExternalInterface.call(callback);
					
			}
			
		}
	}
}

function aflaxAttachBitmap(args)
{
	var clipName		= args[0];
	var bmpName			= args[1];
	var depth			= args[2];
	var pixelSnapping	= args[3];
	var smoothing		= args[4];
	
	var mc = objectCache[clipName];
	var bmp = objectCache[bmpName];

	if(pixelSnapping == null || pixelSnapping == undefined) pixelSnapping = "auto";
	if(smoothing == null || smoothing == undefined) smoothing = false;

	mc.attachBitmap(bmp, depth, pixelSnapping, smoothing);
}

function aflaxApplyFilter(args)
{
	var clipName	= args[0];
	var filterNames = extractArgs(args, 1);
	var fs:Array = new Array();

	var mc = objectCache[clipName];
	
	if(mc != undefined && mc != null)
	{
		for(var i=0; i < filterNames.length; i++)
		{
			var filter = objectCache[filterNames[i]];
			fs.push(filter);
		}

		mc.filters = fs;
	}
}

function aflaxAddEventHandler(args)
{
//	_root.getURL("javascript:alert('addEventHandler: " + args.join() + "');");

	var clipName	= args[0];
	var eventName	= args[1];
	var functionName= args[2];
	
	var mc = objectCache[clipName];

	if(mc != undefined && mc != null)
	{
		mc[eventName] = function()
		{
			ExternalInterface.call(functionName);
		}
	}
}

//
//
// 
//
//


function aflaxGetProperty(args)
{
	var	objectName		= args[0];
	var propertyName	= args[1];
	
	var instance = objectCache[objectName];
	
	var obj = instance[propertyName];
	
	if(typeof(obj) == "string")
	{
		var src:String = obj;
		var src2:String = src.split("\0").join("");
		src2 = src2.split("\r").join("\\r");
		src2 = src2.split("\n").join("\\n");
		obj = src2;
	}
	
	return obj;
}

function aflaxSetProperty(args)
{
	var	objectName		= args[0];
	var propertyName	= args[1];
	var propertyValue	= args[2];
	
	var instance = objectCache[objectName];
	
	instance[propertyName] = propertyValue;

	//aflaxTrace(instance + "." + propertyName + " = " + instance[propertyName]);
}

function aflaxTrace(msg)
{
	trace(msg);
	_root.getURL("javascript:AFLAX.trace('FLASH: " + msg + "');");
}

function aflaxCreateObject(args)
{
	var objectType	= args[0];
	var objectName	= "obj_" + objectType.split(".").join("_") + "_" + Math.floor(Math.random() * 99999);

	var obj = null;
	
	expandArgs(args);
	
	if(args.length == 1)
		var obj = new (eval(objectType))();
	else if(args.length == 2)
		var obj = new (eval(objectType))(args[1]);
	else if(args.length == 3)
		var obj = new (eval(objectType))(args[1], args[2]);
	else if(args.length == 4)
		var obj = new (eval(objectType))(args[1], args[2], args[3]);
	else if(args.length == 5)
		var obj = new (eval(objectType))(args[1], args[2], args[3], args[4]);
	else if(args.length == 6)
		var obj = new (eval(objectType))(args[1], args[2], args[3], args[4], args[5]);
	else if(args.length == 7)
		var obj = new (eval(objectType))(args[1], args[2], args[3], args[4], args[5], args[6]);
	else if(args.length == 8)
		var obj = new (eval(objectType))(args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
	else if(args.length == 9)
		var obj = new (eval(objectType))(args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8]);
	else if(args.length == 10)
		var obj = new (eval(objectType))(args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9]);
	else if(args.length == 11)
		var obj = new (eval(objectType))(args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10]);
	else if(args.length == 12)
		var obj = new (eval(objectType))(args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10], args[11]);
	else
		_root.getURL("javascript:alert('AFLAX: Too many arguments uses in createFlashObject()');");
	
	objectCache[objectName] = obj;
	
	//aflaxTrace("Create object: " + objectName + " " +  objectCache[objectName]);
	
	return objectName;
}

function aflaxCreateTextField(args)
{
	var parentClip			= args[0];
	var parent:MovieClip	= objectCache[parentClip];
	
	//_root.getURL("javascript:alert('parentClip: " + parentClip + "');");
	
	var args2:Array		= new Array();
	var depth:Number	= parent.getNextHighestDepth();
	var clipName:String	= "tf_" + depth + "_" + Math.floor(Math.random() * 99999);

	args2[0] = clipName;
	args2[1] = depth;
	
	for(var i=1;i<args.length;i++)
		args2[i+1] = args[i];
		
	objectCache[clipName] = parent.createTextField.apply(parent, args2);

	//aflaxTrace("aflaxCreateTextField: " + objectCache[clipName]);

	return clipName;
}

function aflaxCreateEmptyMovieClip(args)
{
	var parentClip			= args[0];
	var parent:MovieClip	= objectCache[parentClip];
	
	if(parent == null) parent = _root;
	
	var depth:Number = parent.getNextHighestDepth();
	var clipName:String = "mc_" + depth + "_" + Math.floor(Math.random() * 99999);
	var mc:MovieClip = parent.createEmptyMovieClip(clipName, depth);

	objectCache[clipName] = mc;
	
	return clipName;
}

/**
 * @param clipname	The name of the clip to duplicatge
 */
function aflaxDuplicateMovieClip(args)
{
	var currentClipName = args[0];
	
	var mc = objectCache[currentClipName];
	
	var depth:Number = _root.getNextHighestDepth();
	var clipName:String = "mc_" + depth + "_" + Math.floor(Math.random() * 99999);

	objectCache[clipName] = mc.duplicateMovieClip(clipName, depth);
	
	//_root.getURL("javascript:alert('aflaxDuplicateMovieClip: " + objectCache[clipName] + "');");
	
	return clipName;
}

/**
 * Private functions
 */

function extractArgs(args, startIndex)
{
	var newArgs = new Array();
	
	for(var i=startIndex;i<args.length;i++)
	{
		newArgs[i-startIndex] = args[i];
	}
	
	return newArgs;
}

function expandArgs(args)
{
	//trace("expandArgs: " + args.join());
	
	for(var i=0;i<args.length;i++)
	{
//		trace(args[i]);
		if(typeof(args[i]) == "string")
		{
			var s:String = args[i];
			if(s.substr(0, 4) == "ref:")
			{
				var n = s.substr(4);
				args[i] = objectCache[n];
				//trace("here: " + args[i]);
			}
		}
	}
}

function aflaxGetCamera(args)
{
	var cameraIndex:Number = -1;
	
	if(args.length > 0)
		cameraIndex = parseInt(args[0], 10);
		
	var cam:Camera;
	
	if(cameraIndex == -1)
		cam = Camera.get();
	else
		cam = Camera.get(cameraIndex);
		
	var id:String = "cam_" + Math.floor((Math.random()*99999));		
	
	objectCache[id] = cam;
	
	return id;
}

function aflaxCreateVideoClip(args)
{
	var parentClip		= args[0];

	var id:String = "vid_" + Math.floor((Math.random()*99999));
	
	var parent:MovieClip = objectCache[parentClip];
	if(parent == null) parent = _root;
	
	var mc:MovieClip = parent.attachMovie("videoTemplate", id, parent.getNextHighestDepth());
	
	objectCache[id] = mc;

	//aflaxTrace("returning " + id);
	
	return id;
}

this.aflaxInit();
