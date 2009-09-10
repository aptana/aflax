// Copyright (c) 2005-2006 Paul Colton - Please see http://www.aflax.org

function AFLAX(path,trace,enableFlashSettings,localStoreReadyCallback)
{if(path!=null)AFLAX.path=path;if(trace!=null)AFLAX.tracing=trace;if(localStoreReadyCallback==undefined||localStoreReadyCallback==null)localStoreReadyCallback="";this.id="aflax_obj_"+AFLAX.count++;if(enableFlashSettings!=undefined||enableFlashSettings==true)
{if(document.getElementById("flashSettings")==null&&arguments.length>0)
{var flashSettingsStyle="width: 215px; height: 138px; position: absolute; z-index: 100;left: -500px; top: -500px";document.write('<div id="flashSettings" style="'+flashSettingsStyle+'"\>Flash Settings Dialog</div\>\n');AFLAX.settings=new AFLAX();AFLAX.settings.addFlashToElement("flashSettings",215,138,"#FFFFFF",localStoreReadyCallback,true);}}}
AFLAX.version="0.41";AFLAX.tracing=false;AFLAX.count=0;AFLAX.path="aflax.swf";AFLAX.settings=null;AFLAX.prototype.id=null;AFLAX.prototype.flash=null;AFLAX.prototype.root=null;AFLAX.prototype.stage=null;AFLAX.prototype.getHTML=function(width,height,bgcolor,callback,transparent,absolutePosition)
{var requiredVersion=new com.deconcept.PlayerVersion([8,0,0]);var installedVersion=com.deconcept.FlashObjectUtil.getPlayerVersion();if(installedVersion.versionIsValid(requiredVersion)==false)
{return"<div style='border:2px solid #FF0000'>To see this contents you need to install <a target='_blank' href='http://www.macromedia.com/go/getflashplayer'>Flash Player</a> version 8.0 or higher.</div>";}
bgcolor=bgcolor||"#FFFFFF";callback=callback||"_none_";var content='\
<object width="'+width+'" height="'+height+'" id="'+this.id+'" type="application/x-shockwave-flash" data="'+AFLAX.path+'?callback='+callback+'"';if(absolutePosition)
content+='style="position: absolute"';content+='>\
<param name="allowScriptAccess" value="sameDomain" />\
<param name="bgcolor" value="'+bgcolor+'" />\
<param name="movie" value="'+AFLAX.path+'?callback='+callback+'" />\
<param name="scale" value="noscale" />\
<param name="salign" value="lt" />\
';if(transparent)
content+='<param name="wmode" value="transparent" />';content+='</object>';if(AFLAX.tracing)
content+='<div style="border:1px solid #ddd;padding: 4px;background-color: #fafafa;font-size: 8pt;" id="aflaxlogger"></div>';return content;}
AFLAX.prototype.addFlashToElement=function(parentElementOrId,width,height,bgcolor,callback,transparent)
{var parentNode=typeof parentElementOrId=="string"?document.getElementById(parentElementOrId):parentElementOrId;var content=this.getHTML(width,height,bgcolor,callback,transparent);var container=document.createElement("div");container.innerHTML=content;var element=container.removeChild(container.firstChild);while(parentNode.firstChild)
parentNode.removeChild(parentNode.firstChild);parentNode.appendChild(element);return element;}
AFLAX.prototype.insertFlash=function(width,height,bgcolor,callback,transparent,absolutePosition)
{var content=this.getHTML(width,height,bgcolor,callback,transparent,absolutePosition);document.write(content);if(AFLAX.tracing)
AFLAX.trace("AFLAX Logger initialized.");return document.getElementById(this.id);}
AFLAX.prototype.getRoot=function()
{if(this.root==null)
{this.root=new AFLAX.MovieClip(this,null,"_root");}
return this.root;}
AFLAX.prototype.getStage=function()
{if(this.stage==null)
{this.stage=new AFLAX.MovieClip(this,null,"_stage");this.stage.exposeProperty("width",this.stage);this.stage.exposeProperty("height",this.stage);this.stage.exposeProperty("scaleMode",this.stage);this.stage.exposeProperty("showMenu",this.stage);this.stage.exposeProperty("align",this.stage);}
return this.stage;}
AFLAX.prototype.getFlash=function()
{if(this.flash==null)
{this.flash=document[this.id];}
return this.flash;}
AFLAX.returnsHash={"true":true,"false":false,"undefined":undefined,"null":null,"NaN":NaN};AFLAX.prototype.callFunction=function(name)
{var ret=this.getFlash().CallFunction("<invoke name=\""+
name+"\" returntype=\"javascript\">"+
__flash__argumentsToXML(arguments,1)+"</invoke>");if(AFLAX.returnsHash.hasOwnProperty(ret))
{ret=AFLAX.returnsHash[ret];}
else if(ret.charAt(0)=='"')
{if(ret.charAt(ret.length-1)=='"')
ret=ret.substring(1,ret.length-1);}
else
{ret=ret-0;}
return ret;}
AFLAX.prototype.storeValue=function(key,value,statusCallback,serialize)
{if(serialize==true)
value="[JSON]"+JSON.stringify(value);if(statusCallback==undefined||statusCallback==null)
return this.callFunction("aflaxStoreValue",[key,value]);else
return this.callFunction("aflaxStoreValue",[key,value,statusCallback]);}
AFLAX.prototype.getStoredValue=function(key)
{var value=this.callFunction("aflaxGetValue",[key]);value=value.split('\\"').join('"');value=value.split("\\'").join("'");alert(value);if(value.substring(0,6)=="[JSON]")
return JSON.parse(value.substring(6));else
return value;}
AFLAX.hideFlashSettings=function()
{var flashDiv=document.getElementById("flashSettings");flashDiv.style.left=-500+"px";flashDiv.style.top=-500+"px";}
AFLAX.showFlashSettings=function(x,y,mode)
{if(x==undefined)x=100;if(y==undefined)y=100;if(mode==undefined)mode=1;var flashDiv=document.getElementById("flashSettings");flashDiv.style.left=x+"px";flashDiv.style.top=y+"px";AFLAX.settings.callStaticFunction("System","showSettings",mode);}
AFLAX.prototype.callStaticFunction=function(objectName,func)
{var args=new Array();args[0]=objectName;args[1]=func;for(var i=2;i<arguments.length;i++)
{args[i]=arguments[i];}
return this.callFunction("aflaxCallStaticFunction",args);}
AFLAX.prototype.getStaticProperty=function(objectName,property)
{return this.callFunction("aflaxGetStaticProperty",[objectName,property]);}
AFLAX.prototype.attachEventListener=function(obj,event,handler)
{var id=obj;if(obj.id!=undefined)
id=obj.id;this.callFunction("aflaxAttachEventListener",[id,event,handler]);}
AFLAX.prototype.callBulkFunctions=function(funcs)
{var s=new Array(funcs.length);for(var i=0,j=funcs.length;i<j;i++)
{var func=funcs[i];s[i]=func.join("\1");}
var commands=s.join("\2");this.callFunction("aflaxBulkCallFunction",commands);}
AFLAX.prototype.updateAfterEvent=function()
{this.callFunction("aflaxUpdateAfterEvent");}
AFLAX.prototype.createFlashArray=function(elements)
{var _array=new AFLAX.FlashObject(this,"Array")
_array.exposeFunction("push",_array);_array.exposeFunction("reverse",_array);_array.exposeProperty("length",_array);var len=elements.length;for(var i=0;i<len;i++)
_array.push(elements[i]);return _array;}
AFLAX.extend=function(baseClass,newClass)
{var pseudo=function(){};pseudo.prototype=baseClass.prototype;newClass.prototype=new pseudo();newClass.prototype.baseConstructor=baseClass;newClass.prototype.superClass=baseClass.prototype;newClass.prototype._prototype=newClass.prototype;if(baseClass.prototype.superClass==undefined){baseClass.prototype.superClass=Object.prototype;}
return newClass;}
AFLAX.extractArgs=function(args,startIndex)
{var newArgs=new Array();for(var i=startIndex;i<args.length;i++)
{newArgs[i-startIndex]=args[i];}
return newArgs;}
AFLAX.FlashObject=function(aflaxRef,flashObjectName,objectArgs,objectID)
{if(arguments.length==0)return;this.aflax=aflaxRef;this.flash=this.aflax.getFlash();this._prototype=AFLAX.FlashObject.prototype;if(objectArgs==null||objectArgs==undefined)
objectArgs=new Array();if(flashObjectName!=null&&flashObjectName!=undefined)
{var args=new Array();args[0]=flashObjectName;for(i=0;i<objectArgs.length;i++)
{var a=objectArgs[i];if(a.id!=undefined)
{a="ref:"+a.id;}
args[i+1]=a;}
this.id=this.aflax.callFunction("aflaxCreateObject",args);}
else
{if(objectID!=null&&objectID!=undefined)
{this.id=objectID;}}
if(this.bound==false)
{}}
AFLAX.FlashObject.prototype.bound=false;AFLAX.FlashObject.prototype.id=null;AFLAX.FlashObject.prototype._prototype=null;AFLAX.FlashObject.prototype.aflax=null;AFLAX.FlashObject.prototype.flash=null;AFLAX.FlashObject.prototype.callFunction=function(functionName)
{var args=new Array();args[0]=this.id;args[1]=functionName;for(i=1;i<arguments.length;i++)
{var val=arguments[i];if(val==null)
{val="null";}
if(typeof(val)=="string")
{if(val.substring(0,4)=="ref:")
{var varPart=val.substring(4);var restPart=null;if(varPart.indexOf(".")!=-1)
{restPart=varPart.substring(varPart.indexOf("."));varPart=varPart.substring(0,varPart.indexOf("."));}
val="ref:"+eval(varPart).id;if(restPart!=null)
val+=restPart;}}
if(val.id!=undefined)
{val="ref:"+val.id;}
args[i+1]=val;}
var retval=this.aflax.callFunction("aflaxCallFunction",args);return retval;}
AFLAX.FlashObject.prototype.bind=function(properties,functions,mappings)
{if(properties!=null&&properties!=undefined)
{for(var pn=0;pn<properties.length;pn++)
{this.exposeProperty(properties[pn]);}}
if(functions!=null&&functions!=undefined)
{for(var fn=0;fn<functions.length;fn++)
{this.exposeFunction(functions[fn]);}}
if(mappings!=null&&mappings!=undefined)
{for(var mn=0;mn<mappings.length;mn++)
{this.mapFunction(mappings[mn]);}}}
AFLAX.FlashObject.prototype.exposeProperty=function(propertyName,targetPrototype)
{var methodSuffix=propertyName.substring(0,1).toUpperCase()+propertyName.substring(1);var target=this._prototype;if(targetPrototype!=null)
target=targetPrototype;target["get"+methodSuffix]=function()
{var r=this.aflax.callFunction("aflaxGetProperty",[this.id,propertyName]);if(r==null)return null;if(r==undefined)return;if(typeof(r)=="string")
return r.split("\\r").join("\r").split("\\n").join("\n");else
return r;}
target["set"+methodSuffix]=function(val)
{this.aflax.callFunction("aflaxSetProperty",[this.id,propertyName,val]);}}
AFLAX.FlashObject.prototype.exposeFunction=function(functionName,targetPrototype)
{var target=this._prototype;if(targetPrototype!=null)
target=targetPrototype;target[functionName]=function()
{var args=new Array();args[0]=this.id;args[1]=functionName;for(var i=0;i<arguments.length;i++)
args[i+2]=arguments[i];return this.aflax.callFunction("aflaxCallFunction",args);}}
AFLAX.FlashObject.prototype.mapFunction=function(functionName,targetPrototype)
{var target=this._prototype;if(targetPrototype!=null)
target=targetPrototype;target[functionName]=function()
{var args=new Array();args[0]=this.id;for(var i=0;i<arguments.length;i++)
{var a=arguments[i];if(a.id!=undefined)a=a.id;args[i+1]=a;}
var fName="aflax"+functionName.substring(0,1).toUpperCase()+functionName.substring(1);return this.aflax.callFunction(fName,args);}}
AFLAX.MovieClip=function(aflaxRef,parentClipID,clipID)
{if(arguments.length==0)return;arguments.callee.prototype.baseConstructor.call(this,aflaxRef,null,null,clipID);if(clipID==undefined||clipID==null)
{if(parentClipID!=undefined&&parentClipID!=null&&this.flash.aflaxCreateEmptyMovieClip!=undefined&&this.flash.aflaxCreateEmptyMovieClip!=null)
this.id=this.aflax.callFunction("aflaxCreateEmptyMovieClip",[parentClipID]);else
this.id=this.aflax.callFunction("aflaxCreateEmptyMovieClip",["_root"]);}
if(AFLAX.MovieClip.bound==false)
{this.bind(AFLAX.MovieClip.movieClipProperties,AFLAX.MovieClip.movieClipFunctions,AFLAX.MovieClip.movieClipMappings);AFLAX.MovieClip.bound=true;}}
AFLAX.extend(AFLAX.FlashObject,AFLAX.MovieClip);AFLAX.MovieClip.prototype.drawCircle=function(x,y,radius)
{var r=radius;var degToRad=Math.PI/180;var n=8;var theta=45*degToRad;var cr=radius/Math.cos(theta/2);var angle=0;var cangle=angle-theta/2;var commands=new Array(n+1);var commandIndex=0;commands[commandIndex++]=[this.id,"moveTo",x+r,y];for(var i=0;i<n;i++)
{angle+=theta;cangle+=theta;var endX=r*Math.cos(angle);var endY=r*Math.sin(angle);var cX=cr*Math.cos(cangle);var cY=cr*Math.sin(cangle);commands[commandIndex++]=[this.id,"curveTo",x+cX,y+cY,x+endX,y+endY];}
this.aflax.callBulkFunctions(commands);}
AFLAX.MovieClip.bound=false;AFLAX.MovieClip.movieClipProperties=["_x","_y","_height","_width","_rotation","_xmouse","_ymouse","_xscale","_yscale","_alpha","blendMode","_visible","cacheAsBitmap"];AFLAX.MovieClip.movieClipFunctions=["moveTo","lineTo","curveTo","lineStyle","beginFill","endFill","clear","getURL","removeMovieClip"];AFLAX.MovieClip.movieClipMappings=["attachVideo","createTextField","addEventHandler","attachBitmap","applyFilter","loadMovie"];AFLAX.MovieClip.prototype.clone=function()
{var newClip=this.aflax.callFunction("aflaxDuplicateMovieClip",[this.id]);var mc=new AFLAX.MovieClip(this.aflax,null,newClip);return mc;}
AFLAX.CameraClip=function(aflaxRef,parentClipID)
{if(arguments.length==0)return;arguments.callee.prototype.baseConstructor.call(this,aflaxRef,parentClipID,null);if(parentClipID==undefined||parentClipID==null)
{parentClipID="_root";}
this.id=this.aflax.callFunction("aflaxCreateVideoClip",[parentClipID]);var cam=this.aflax.callFunction("aflaxGetCamera");this.attachVideo(cam);}
AFLAX.CameraClip.GetCameras=function(aflaxRef)
{return aflaxRef.getFlash().aflaxGetStaticProperty(["Camera","names"]);}
AFLAX.extend(AFLAX.MovieClip,AFLAX.CameraClip);AFLAX.VideoClip=function(aflaxRef,parentClipID,url,cueCallback,loadCallback)
{if(arguments.length==0)return;arguments.callee.prototype.baseConstructor.call(this,aflaxRef,parentClipID,null);if(parentClipID==undefined||parentClipID==null)
{parentClipID="_root";}
this.id=this.aflax.callFunction("aflaxCreateVideoClip",[parentClipID]);var nc=new AFLAX.FlashObject(this.aflax,"NetConnection");nc.callFunction("connect",null);var ns=new AFLAX.FlashObject(this.aflax,"NetStream",[nc]);ns.exposeProperty("time",ns);this.netStream=ns;this.attachVideo(ns);if(loadCallback!=null&&loadCallback!=undefined)
this.aflax.flash.aflaxAttachVideoStatusEvent([ns.id,loadCallback]);if(cueCallback!=null&&cueCallback!=undefined)
this.aflax.flash.aflaxAttachCuePointEvent([ns.id,cueCallback]);ns.callFunction("setBufferTime",0);ns.callFunction("play",url);}
AFLAX.extend(AFLAX.MovieClip,AFLAX.VideoClip);AFLAX.VideoClip.prototype.netStream=null;AFLAX.VideoClip.GetStatusValue=function(statusString,valueName)
{var s=statusString;var args=s.split(";");var params=new Array();for(var i=0;i<args.length;i++)
{var n=args[i].split("=");if(n[0]!="")
{params[n[0]]=n[1];}}
return params[valueName];}
AFLAX.VideoClip.NetStream_Buffer_Empty="NetStream.Buffer.Empty";AFLAX.VideoClip.NetStream_Buffer_Full="NetStream.Buffer.Full";AFLAX.VideoClip.NetStream_Buffer_Flush="NetStream.Buffer.Flush";AFLAX.VideoClip.NetStream_Play_Start="NetStream.Play.Start";AFLAX.VideoClip.NetStream_Play_Stop="NetStream.Play.Stop";AFLAX.VideoClip.NetStream_Play_StreamNotFound="NetStream.Play.StreamNotFound";AFLAX.VideoClip.NetStream_Seek_InvalidTime="NetStream.Seek.InvalidTime";AFLAX.VideoClip.NetStream_Seek_Notify="NetStream.Seek.Notify";AFLAX.TextField=function(aflaxRef,clipID)
{if(arguments.length==0)return;arguments.callee.prototype.baseConstructor.call(this,aflaxRef,null,clipID);if(AFLAX.TextField.bound==false)
{this.bind(AFLAX.TextField.textFieldProperties,AFLAX.TextField.textFieldFunctions);AFLAX.TextField.bound=true;}}
AFLAX.extend(AFLAX.MovieClip,AFLAX.TextField);AFLAX.TextField.bound=false;AFLAX.TextField.textFieldProperties=["type","multiline","wordWrap","text","htmlText","embedFonts"];AFLAX.TextField.textFieldFunctions=["setTextFormat"];if(AFLAX.tracing==true)
{window.onerror=AFLAX.windowError;}
AFLAX.windowError=function(message,url,line){AFLAX.trace('Error on line '+line+' of document '+url+': '+message);return true;}
AFLAX.trace=function(message)
{if(AFLAX.tracing==true)
{var div=document.getElementById("aflaxlogger");if(div!=null)
{var p=document.createElement('p');p.style.margin=0;p.style.padding=0;p.style.textAlign="left";var text=document.createTextNode(message);p.appendChild(text);div.appendChild(p);}}}
AFLAX.Socket=function(aflax,host,port,onConnectEvent,onDataEvent,onCloseEvent)
{var flash=aflax.getFlash();var connection=new AFLAX.FlashObject(aflax,"XMLSocket");flash.aflaxAttachSocketEvents([connection.id,onConnectEvent,onDataEvent,onCloseEvent]);connection.exposeFunction("connect",connection);connection.exposeFunction("close",connection);connection.exposeFunction("send",connection);connection.connect(host,port);return connection;}
if(typeof com=="undefined")
{var com;com=new Object();}
if(typeof com.deconcept=="undefined")com.deconcept=new Object();if(typeof com.deconcept.util=="undefined")com.deconcept.util=new Object();if(typeof com.deconcept.FlashObjectUtil=="undefined")com.deconcept.FlashObjectUtil=new Object();com.deconcept.FlashObjectUtil.getPlayerVersion=function(){var PlayerVersion=new com.deconcept.PlayerVersion(0,0,0);if(navigator.plugins&&navigator.mimeTypes.length){var x=navigator.plugins["Shockwave Flash"];if(x&&x.description){PlayerVersion=new com.deconcept.PlayerVersion(x.description.replace(/([a-z]|[A-Z]|\s)+/,"").replace(/(\s+r|\s+b[0-9]+)/,".").split("."));}}else if(window.ActiveXObject){try{var axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");PlayerVersion=new com.deconcept.PlayerVersion(axo.GetVariable("$version").split(" ")[1].split(","));}catch(e){}}
return PlayerVersion;}
com.deconcept.PlayerVersion=function(arrVersion){this.major=parseInt(arrVersion[0])||0;this.minor=parseInt(arrVersion[1])||0;this.rev=parseInt(arrVersion[2])||0;}
com.deconcept.PlayerVersion.prototype.versionIsValid=function(fv){if(this.major<fv.major)return false;if(this.major>fv.major)return true;if(this.minor<fv.minor)return false;if(this.minor>fv.minor)return true;if(this.rev<fv.rev)return false;return true;}
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