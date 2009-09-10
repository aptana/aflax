/**
 * Original author: Joel May 
 * www.connectedpixel.com 
 * All original source code listed here is licensed under a Creative Commons License. 
 */

//////////////////////////////////////////////////////////////////////////
// Renders a wood texture to a bitmap.  Uses perlin noise and the folumula
// pixval = fraction(nTreeRings * perlin(x,y))
//////////////////////////////////////////////////////////////////////////

var _baseX           = 400;
var _baseY           = 120;	
var _nOctaves        = 1; 
var _randomSeed      = 128;
var _bTile           = false;	
var _bFractalNoise   = false;
var _nGrainLayers    = 15;
var _blurX           = 5;
var _blurY           = 5;
    
var _rgb0 = 0xaa5522;
var _rgb1 = 0xee9922;

var _identityMatrix;
var _identityColorTrans;

var _woodColorFilter;
var _blurFilter;
var _woodBitmap;
    
function invalidateWoodColorFilter()
{
    //delete _woodColorFilter;
    _woodColorFilter = undefined;	
}	
function invalidateBlurFilter()
{
    //delete _blurFilter;
    _blurFilter = undefined;	
}

//////////////////////////////////////////////////////////////////////
// Properties.

function set_perlinBaseX(bx) { 
    if (isNaN(bx)) return;
    if (bx < 3) bx = 3;
    if (bx > 1000) bx = 1000;
    _baseX = bx; 
}

function get_perlinBaseX() { return _baseX; }

function set_perlinBaseY(by) { 
    if (isNaN(by)) return;
    if (by < 3) by = 3;
    if (by > 1000) by = 1000;
    _baseY = by; 
}
function get_perlinBaseY() { return _baseY; }
 
function set_octaves(nOct) { _nOctaves = nOct; }
function get_octaves() { return _nOctaves; }

function set_grainLayers(nLayers) { _nGrainLayers = nLayers; }
function get_grainLayers() { return _nGrainLayers; }

function set_rgb0(rgb) { 
    _rgb0 = rgb; invalidateWoodColorFilter();
}
function get_rgb0() { return _rgb0; }

function set_rgb1(rgb) { 
    _rgb1 = rgb; invalidateWoodColorFilter();
}
function get_rgb1() { return _rgb1; }

function set_seed(s) { _randomSeed = s; }
function get_seed() { return _randomSeed; }

function set_tileable(bTile) { _bTile = bTile; }
function get_tileable() { return _bTile; }

function set_fractalNoise(bFractal) { _bFractalNoise = bFractal; }
function get_fractalNoise() { return _bFractalNoise; }
    
function wood()
{
	_identityMatrix = new AFLAX.FlashObject(aflax, "flash.geom.Matrix");
	_identityColorTrans = new AFLAX.FlashObject(aflax, "flash.geom.ColorTransform");
	
	_woodBitmap = createBitmap(480,100);
	aflax.getRoot().attachBitmap(_woodBitmap, 0);
		aflax.getRoot().applyFilter(
		new AFLAX.FlashObject(aflax, "flash.filters.BevelFilter", [3, 45, 0xeeeeee, 1, 0x000000, 1, 3, 3, 3, 1, "inner"])); 
	
}

function update()
{
	var w = _woodBitmap.getWidth();
	var h = _woodBitmap.getHeight();
	var rect = new AFLAX.FlashObject(aflax, "flash.geom.Rectangle",  [0, 0, w, h]);
	_woodBitmap.callFunction("fillRect", rect, 0);
	render(_woodBitmap);
}
		

////////////////////////////////////////////////////////////////////////
// Convenience function.  Returns a bitmap of the desired
// size using the current wood settings.
///////////////////////////////////////////////////////////////////////

function createBitmap(w,h)
{
	var wood_bmp = new AFLAX.FlashObject(aflax, "flash.display.BitmapData",  [w, h, false, 0]);
	wood_bmp.exposeProperty("width", wood_bmp);
	wood_bmp.exposeProperty("height", wood_bmp);
    render(wood_bmp);
    return wood_bmp;
}

////////////////////////////////////////////////////////////////////////
//  Render the wood grain onto the bitmap using the current property 
//  values.  
//  buffer0_bmp and buffer1_bmp are optional.  If they are not supplied
//  temporary bitmaps will be created.  They MUST have the same 
//  width and height as the destination bmp.
///////////////////////////////////////////////////////////////////////

function render(bmp, buffer0_bmp, buffer1_bmp)
{
    var w = bmp.getWidth();
    var h = bmp.getHeight();
    
    // Will hold perlin noise.
    var srcNoise_bmp = (buffer0_bmp != undefined) ?  buffer0_bmp : 
								    new AFLAX.FlashObject(aflax, "flash.display.BitmapData",  [w, h, false, 0xffffffff]);
    
    var tmp_bmp = (buffer1_bmp != undefined) ?  buffer1_bmp :
							    new AFLAX.FlashObject(aflax, "flash.display.BitmapData",  [w, h, false, 0xffffffff]); 
    
    // channelOptions - 1 - Red only
    // grayscale - false
    srcNoise_bmp.callFunction("perlinNoise", _baseX,_baseY,_nOctaves,_randomSeed,_bTile,_bFractalNoise,1,false);
    
    // Needed in some of the following flash api calls.		
    var rect = new AFLAX.FlashObject(aflax, "flash.geom.Rectangle", [0,0,w,h]);	
    var origin = new AFLAX.FlashObject(aflax, "flash.geom.Point", [0,0]);
    
    // For each tree ring.
    for (var iLayer = 0 ; iLayer < _nGrainLayers ; iLayer++){
        
        // After multiplying, the signal needs to be shifted into the
        // 0 to 255 range.	
        var offset = - iLayer * 256;	
        
        // Amplify and shift the pixels.
        var matrix = aflax.createFlashArray([_nGrainLayers, 0, 0, 0, offset,
        				               0, 0, 0, 0,      0, 
        				               0, 0, 0, 0,      0, 
        				               0, 0, 0, 1,      0 ]);
        
        var filter = new AFLAX.FlashObject(aflax, "flash.filters.ColorMatrixFilter", [matrix]);
        tmp_bmp.callFunction("applyFilter",srcNoise_bmp,rect,origin,filter);			
        
        // Set the brightest to be black. Following layers will write
        // only on the black.
        tmp_bmp.callFunction("threshold", tmp_bmp, rect, origin, "==", 0x00ff0000, 0xff000000, 0x00ff0000, false);
        
        // Copy the tmp on to the dest bitmap.
        var blend = 5; //lighten
        bmp.callFunction("draw", tmp_bmp, _identityMatrix, _identityColorTrans, blend);
    }
    
    // Don't need the temporary bitmaps anymore
    if (buffer1_bmp == undefined){
        tmp_bmp.callFunction("dispose");
    }
    if (buffer0_bmp == undefined){
        srcNoise_bmp.callFunction("dispose");
    }
    
    // Change it from black and red to the desired colors.
    bmp.callFunction("applyFilter", bmp,rect, origin, getWoodColorFilter());		
    
    // Blur it to remove the jaggies.	
    bmp.callFunction("applyFilter", bmp,rect,origin,getBlurFilter());
}	

///////////////////////////////////////////////////////////////////////
// Create a filter that will lessen the jaggies.  The threshold() call
// creates jaggies that are pretty bad.  This basically solves the 
// problem.
///////////////////////////////////////////////////////////////////////

function getBlurFilter()
{
    if (_blurFilter != undefined){
        return _blurFilter;
    }
    _blurFilter = new AFLAX.FlashObject(aflax, "flash.filters.BlurFilter",  [_blurX,_blurY,1]);
    return _blurFilter;
}

///////////////////////////////////////////////////////////////////////
// Map the black to red colors to the desired wood colors.
///////////////////////////////////////////////////////////////////////

function getWoodColorFilter()
{
    if (_woodColorFilter != undefined){
        return _woodColorFilter; 
    }	
    // Apply the desired colors to the bitmap.
    var r0 = (_rgb0 >> 16) & 0xff;
    var g0 = (_rgb0 >> 8 ) & 0xff;
    var b0 = _rgb0 & 0xff;
    var r1 = (_rgb1 >> 16) & 0xff;
    var g1 = (_rgb1 >> 8 ) & 0xff;
    var b1 = _rgb1 & 0xff;
    
    var woodColor = aflax.createFlashArray([(r1-r0)/255, 0, 0, 0, r0,
                           (g1-g0)/255, 0, 0, 0, g0,
                           (b1-b0)/255, 0, 0, 0, b0,
                           0   , 0, 0, 1,    0 ]);
                           
    _woodColorFilter= new AFLAX.FlashObject(aflax, "flash.filters.ColorMatrixFilter", [woodColor]);
    
    return _woodColorFilter;
}	




























