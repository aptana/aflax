var mc;
var my_txt;
var my_fmt;
var currentFont;
var currentText;

function font_test(aflax)
{
	mc = new AFLAX.MovieClip(aflax);
	createText();
}

createText = function(input)
{
	if(my_txt != null) 	my_txt.callFunction("removeMovieClip");
	my_txt = new AFLAX.TextField(aflax, mc.createTextField(0, 10, 600, 250));
	
	my_txt.setMultiline(true);
	my_txt.setWordWrap(true);
	my_txt.setType("input");
	my_txt.setEmbedFonts(false);
	
	my_fmt = new AFLAX.FlashObject(aflax, "TextFormat");
	my_fmt.exposeProperty("size", my_fmt);
	my_fmt.exposeProperty("color", my_fmt);
	my_fmt.exposeProperty("font", my_fmt);
	my_fmt.exposeProperty("align", my_fmt);

	my_fmt.setColor(0x000000);
	my_fmt.setSize(25);

	if(input == null)
	{
		input = "Example of loading a font dynamically.\n\n" +
			"Click on one of the font names below to load and change this font.\n\n" + 
			"(You can also edit this text.)";
	}
	
	my_txt.setText(input);
	my_txt.callFunction("setTextFormat", my_fmt);
}

changeFont = function(font)
{
	if(font == "null")
	{
		my_txt.setEmbedFonts(false);
		my_txt.callFunction("setTextFormat", my_fmt);
	}
	else
	{
		currentText = my_txt.getText();
	 	currentFont = font;
		mc.loadMovie(currentFont + "_font.swf", "fontLoaded");
	}
}

fontLoaded = function()
{
	createText(currentText);
	my_txt.setEmbedFonts(true);
	my_fmt.setFont("_" + currentFont);
	my_txt.callFunction("setTextFormat", my_fmt);	
}

