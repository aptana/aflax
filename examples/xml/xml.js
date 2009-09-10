
function renderXML(id)
{
	var xmlElement = document.getElementById(id);
	var xml = xmlElement.innerHTML.split("&gt;").join(">").split("&lt;").join("<");

	//instantiate a new XMLDoc object. Send any errors to the xmlError function
	var objDom = new XMLDoc(xml, xmlError)
	
	//get the root node
	var objDomTree = objDom.docNode;
	
	//get all of the elements
	var tag1Elements = objDomTree.getElements();

	for(var i=0;i<tag1Elements.length;i++)
	{
		var tag = tag1Elements[i];
		render(tag);	
	}

}
	
function xmlError(e)
{
	//there was an error, show the user
	alert(e);
}

function render(tag)
{
	switch(tag.tagName)
	{
		case "Line":
			var x1 = tag.getAttribute("X1");
			var x2 = tag.getAttribute("X2");
			var y1 = tag.getAttribute("Y1");
			var y2 = tag.getAttribute("Y2");
			var color = tag.getAttribute("Color");
			var stroke = tag.getAttribute("Stroke");

			aflax.getRoot().lineStyle(stroke, color, 100);
			aflax.getRoot().moveTo(x1, y1);
			aflax.getRoot().lineTo(x2, y2);
			break;

		case "Rectangle":
			var x1 = parseInt(tag.getAttribute("X"));
			var y1 = parseInt(tag.getAttribute("Y"));
			var w = parseInt(tag.getAttribute("Width"));
			var h = parseInt(tag.getAttribute("Height"));
			var color = tag.getAttribute("Color");
			var stroke = tag.getAttribute("Stroke");

			aflax.getRoot().lineStyle(stroke, color, 100);
			aflax.getRoot().moveTo(x1, y1);
			aflax.getRoot().lineTo(x1+w, y1);
			aflax.getRoot().lineTo(x1+w, y1+h);
			aflax.getRoot().lineTo(x1, y1+h);
			aflax.getRoot().lineTo(x1, y1);
			break;
			
		case "Circle":
			var x1 = parseInt(tag.getAttribute("X"));
			var y1 = parseInt(tag.getAttribute("Y"));
			var r = parseInt(tag.getAttribute("Radius"));
			var color = tag.getAttribute("Color");
			var stroke = tag.getAttribute("Stroke");
		
			aflax.getRoot().lineStyle(stroke, color, 100);
			aflax.getRoot().drawCircle(x1, y1, r);
			break;
			
	}

}