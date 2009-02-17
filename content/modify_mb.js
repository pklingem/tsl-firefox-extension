//globals
var divRoot = null;
var lastDisplayedMessage = null;
var displaySingleMessage = true;

tslMain();

function tslMain() {
	try {
		var tables = document.getElementsByTagName("table");

		//change the function of the login link
		modifyLogin(tables[7]);
		if (document.location.href.substr(0,document.location.href.lastIndexOf('/')+1) == "http://www.techsideline.com/message_board/america/") {
			currentTable = tables[10];
		} else {
			//table 12 is where the posts begin (including ads)
			i = 12;
			//clean up the layout by removing explicit width declarations
			tables[i].parentNode.removeAttribute("width");
			tables[i].parentNode.parentNode.parentNode.parentNode.removeAttribute("width");
			while (tables[i].getElementsByTagName("span").length == 0) {
				tables[i].removeAttribute("width");
				i++;
			}
			tables[i].removeAttribute("width");
			//set currentTable to the first real post on the page
	        var currentTable = tables[i+1];
		}				

		//create a root for the thread heirarchy, place it before the first post in the DOM,
		//now divRoot.nextSibling will always return the first post that has not been added
		//to the thread heirarchy.
        divRoot = document.createElement("div");
        divRoot.setAttribute("level", 0);
        divRoot.setAttribute("class", "root");
//
font = document.createElement("font");
font.style.display = "none";
font.appendChild(document.createElement("font")).innerHTML = 0;
font.appendChild(document.createElement("font"));
divRoot.appendChild(font);
// 
        currentTable.parentNode.insertBefore(divRoot, currentTable);

		//main function call to reorganize the threads into a heirarchical structure
		traverseTables(divRoot);

		//unhide the reordered threads
		divRoot.lastChild.style.display = "block";
	} catch (e) {
		console.log("Exception in TSL Extension function tslMain: " + e);
	}
}

function traverseTablesLoop(currentDiv) {
	try {
		while (divRoot.nextSibling.tagName == 'TABLE') {
			nextDiv = replaceTableWithDiv(divRoot.nextSibling);
	    	if ( parseInt(currentDiv.getAttribute("level")) < parseInt(nextDiv.getAttribute("level")) )
	    		formatSubPost(currentDiv, nextDiv);
	    	else if ( parseInt(currentDiv.getAttribute("level")) == parseInt(nextDiv.getAttribute("level")) )
	    		formatSiblingPost(currentDiv, nextDiv);
	    	else
				formatAncestorPost(currentDiv, nextDiv);
    		currentDiv = nextDiv;
		}
		
		//fix up the last post (dammit, this function used to be so pretty)
		div = currentDiv.appendChild(document.createElement("div"));
		div.setAttribute("level", parseInt(currentDiv.getAttribute("level"))+1);
		div.setAttribute("class", "post");
		toChicagoMaroon(currentDiv);

	} catch (e) {
		console.log("Exception in TSL Extension function traverseTablesLoop: " + e);
	}
}

function traverseTables(currentDiv) {
	try {		
		if (divRoot.nextSibling.tagName != 'TABLE') return;
		var nextDiv = replaceTableWithDiv(divRoot.nextSibling);

    	if ( parseInt(currentDiv.getAttribute("level")) < parseInt(nextDiv.getAttribute("level")) ) {
			traverseTables(formatSubPost(currentDiv, nextDiv));
//
    		parentRepliesFont = currentDiv.lastChild.lastChild.previousSibling;
    		childRepliesFont = nextDiv.lastChild.lastChild.previousSibling;
    		parentRepliesFont.innerHTML = parseInt(parentRepliesFont.innerHTML) + parseInt(childRepliesFont.innerHTML);
//
    		return; 
    	} else if ( parseInt(currentDiv.getAttribute("level")) == parseInt(nextDiv.getAttribute("level")) ) {
    		traverseTables(formatSiblingPost(currentDiv, nextDiv));
//
    		repliesFont = currentDiv.parentNode.parentNode.lastChild.lastChild.previousSibling;
    		repliesFont.innerHTML = parseInt(repliesFont.innerHTML)+1;
//
			return;
    	} else {
			parentDiv = traverseTables(formatAncestorPost(currentDiv, nextDiv));
    		repliesFont = parentDiv.parentNode.parentNode.lastChild.lastChild.previousSibling;
    		repliesFont.innerHTML = parseInt(repliesFont.innerHTML)+1;
			return;
    	}
	} catch (e) {
		console.log("Exception in TSL Extension function traverseTables: " + e);
	}
}

function getLevel(tableElement) {
	try {
		//get the object containing the whitespace
		var textObject = tableElement.firstChild.firstChild.firstChild.firstChild;
		var len;

		//determine the post level
		if (textObject.length == undefined)
			len = 1;
		else
			len = (textObject.length/4)+1;
			
		//clear the whitespace so the indention can be done in css
		//should I remove the object completely? doing so removes the img
		// element that follows the text object for some reason, this will do for now
		textObject.data = "";
		return len;
	} catch (e) {
		console.log("Exception in TSL Extension function getLevel: " + e);
	}
}

function replaceTableWithDiv(table) {
	try {
		var div = document.createElement("div");
		div.setAttribute("level", getLevel(table));
		div.innerHTML = table.firstChild.firstChild.firstChild.innerHTML;
		div.getElementsByTagName("a")[0].addEventListener("click", function (event) { fetchMessage(event); }, true);
		if (parseInt(div.getAttribute("level")) > 0)
			div.setAttribute("class", "post");
//
repliesDiv = document.createElement("font");
repliesDiv.setAttribute("class", "replies");
repliesDiv.innerHTML = 0;
div.lastChild.insertBefore(repliesDiv, div.lastChild.lastChild);
//
		table.parentNode.replaceChild(div, table);
		return div;
	} catch (e) {
		console.log("Exception in TSL Extension function replaceTableWithDiv: " + e);
	}
}

function formatSubPost(current, next) {
	try {
		toBurntOrange(current);
		var subPostContainerDiv = next.cloneNode(false);
		subPostContainerDiv.style.display = "none";
		subPostContainerDiv.appendChild(next);
		current.appendChild(subPostContainerDiv);
		return next;
	} catch (e) {
		console.log("Exception in TSL Extension function formatSubPost: " + e);
	}
}

function formatSiblingPost(current, next) {
	try {
		toChicagoMaroon(current);
		var subPostContainerDiv = document.createElement("div");
		current.appendChild(subPostContainerDiv).setAttribute("level", parseInt(current.getAttribute("level"))+1);
		subPostContainerDiv.setAttribute("class", "post");
		return current.parentNode.appendChild(next);
	} catch (e) {
		console.log("Exception in TSL Extension function formatSiblingPost: " + e);
	}
}

function formatAncestorPost(current, next) {
	try {
		toChicagoMaroon(current);
		var subPostContainerDiv = document.createElement("div");
		current.appendChild(subPostContainerDiv).setAttribute("level", parseInt(current.getAttribute("level"))+1);

	    var parentDiv = current.parentNode;
	    var levelDifference = current.getAttribute("level") - next.getAttribute("level");
	    for (i=0; i<levelDifference; i++) parentDiv = parentDiv.parentNode.parentNode;

		return parentDiv.appendChild(next);
	} catch (e) {
		console.log("Exception in TSL Extension function formatAncestorPost: " + e);
	}
}

function toChicagoMaroon(div) {
	try {		
		image = div.getElementsByTagName("img")[0];
		if (null != image) image.setAttribute("src", image.getAttribute("src").replace(/1/,"0"));
	} catch (e) {
		console.log("Exception in TSL Extension function toChicagoMaroon: " + e);
	}
}

function toBurntOrange(div) {
	try {		
		image = div.getElementsByTagName("img")[0];
		if (null != image) {
			image.setAttribute("src", image.getAttribute("src").replace(/0/,"1"));
			image.addEventListener("click", function (event) { toggleCollapse(event); }, true);
		}
	} catch (e) {
		console.log("Exception in TSL Extension function toBurntOrange: " + e);
	}
}
