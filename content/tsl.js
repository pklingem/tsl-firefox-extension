// ==UserScript==
// @name			TSL Thread Collapse
// @namespace
// @description			Collapse Threads
// @include			http://subscr.techsideline.com/message_board/tslpass_subscribers/*
// @include			http://subscr.techsideline.com/message_board/tslpass_recruiting/*
// @include			http://subscr.techsideline.com/message_board/tslpass_tickets/*
// @include			http://www.techsideline.com/message_board/football/*
// @include			http://www.techsideline.com/message_board/basketball/*
// @include			http://www.techsideline.com/message_board/womensbb/*
// @include			http://www.techsideline.com/message_board/olympic/*
// @include			http://www.techsideline.com/message_board/tickets/*
// @include			http://www.techsideline.com/message_board/coverage/*
// @include			http://www.techsideline.com/message_board/score/*
// ==/UserScript==
 
var tsldoc = null;

function main(doc) {
	tsldoc = doc;
	
	var tables = tsldoc.getElementsByTagName("table");
	var previousTableElement;
	
//	GM_addStyle('td.chicagoMaroonBackground { background-color:660000 ! important; }');

	for (var i=10; i<tables.length-2; i++) {
		setTopicLevel(tables[i]);
		hideIfSubTopic(tables[i]);
		formatImgElement(tables[i], previousTableElement);
		formatAnchorElement(tables[i]);
		previousTableElement = tables[i];
	}
}

function setTopicLevel(tableElement) {
	var tdElementPosition = 0;
	var topicLevel = 0;
	var tdElement = tableElement.getElementsByTagName("tr")[0].getElementsByTagName("td")[0];

	while (tdElement.innerHTML.substr(tdElementPosition,6) == "&nbsp;") {
		tdElementPosition+=6;
		topicLevel++;
	}

	topicLevel/=4;
	tableElement.setAttribute("level",topicLevel);
}
 
function hideIfSubTopic(tableElement) {
	if (parseInt(tableElement.getAttribute("level")) > 0) {
		tableElement.style.display = "none";
	}
}

function formatImgElement(currentTable, previousTable) {
	var previousImg, previousImgSrc;

	if (previousTable) {
		previousImg = previousTable.getElementsByTagName("img")[0];
		if (previousImg) {
			previousImgSrc = previousImg.getAttribute("src");
			if (previousTable.getAttribute("level") < currentTable.getAttribute("level")) {
				if (previousTable.getElementsByTagName("img")[0]) {
					previousImg.setAttribute("src", previousImgSrc.replace(/0/,"1"));
					previousImg.addEventListener("click", function (event) { toggleCollapse(event); }, true);
				}
			} else {
				if (previousTable.getElementsByTagName("img")[0]) {
					previousImg.setAttribute("src", previousImgSrc.replace(/1/,"0"));
				} //end if
			} //end else
		} //end if
	} //end if

}

function formatAnchorElement(tableElement) {
	var anchorElement = tableElement.getElementsByTagName("a")[0];
	if (anchorElement) {
		anchorElement.addEventListener("click", function (event) { loadMessage(event); }, true);
	}
}

function toggleCollapse(event) {
	var currentTableElement = event.currentTarget.parentNode.parentNode.parentNode.parentNode;
	var nextTableElement = currentTableElement.nextSibling;
	var ridiculousFlag = false;

	if (nextTableElement) {

		if ((nextTableElement.style.display == "none") && (nextTableElement.getAttribute("isMessageText") == "true") &&
			(nextTableElement.nextSibling.style.display == "block") && 
			(nextTableElement.nextSibling.getAttribute("level") > currentTableElement.getAttribute("level"))) {
				nextTableElement = nextTableElement.nextSibling;
		}
		if (nextTableElement.style.display == "none") {
			while (nextTableElement.getAttribute("level") > currentTableElement.getAttribute("level")) {
				if (nextTableElement.getAttribute("level") == parseInt(currentTableElement.getAttribute("level"))+1) {
					if (nextTableElement.getAttribute("isMessageText") != "true") {
						nextTableElement.style.display = "block";
					}
				}
				nextTableElement = nextTableElement.nextSibling;
			}
		} else if (nextTableElement.style.display == "block") {
			while (nextTableElement.getAttribute("level") > currentTableElement.getAttribute("level")) {
				nextTableElement.style.display = "none";
				nextTableElement = nextTableElement.nextSibling;
			}
		}			
	}

	event.preventDefault();
}

function loadMessage(event) {

	var linkURL = tsldoc.location.href.substr(0,27)+event.currentTarget.getAttribute("href"); 
	var currentTable = event.currentTarget.parentNode.parentNode.parentNode.parentNode.parentNode;
	var messageTableElement = tsldoc.createElement("table");

	if (currentTable.nextSibling) {

		try {	

			if ((currentTable.nextSibling.getAttribute("isMessageText") == "true") &&
				(currentTable.nextSibling.style.display == "block")) {
				currentTable.nextSibling.style.display = "none";
			} else if ((currentTable.nextSibling.getAttribute("isMessageText") == "true") &&
					   (currentTable.nextSibling.style.display == "none")) {
				currentTable.nextSibling.style.display = "block";
			} else {

				//build message table

				var postTable = tsldoc.createElement("table");
				postTable.setAttribute("isMessageText", "true");
				postTable.style.display = "block";
				postTable.setAttribute("width", "600");
				postTable.setAttribute("border", "0");
				var tbodyElement = tsldoc.createElement("tbody");
				postTable.setAttribute("level", parseInt(currentTable.getAttribute("level"))+1);

				var trElement = tsldoc.createElement("tr");
				var tdElement = tsldoc.createElement("td");
				var whiteSpace = "&nbsp;&nbsp;&nbsp;&nbsp;";
				for (i=0; i<currentTable.getAttribute("level"); i++) {
					whiteSpace += "&nbsp;&nbsp;&nbsp;&nbsp;";
				}
				tdElement.innerHTML = whiteSpace;

				postLink = tsldoc.createElement("a");
				postLink.setAttribute("href", linkURL);
				postLink.innerHTML = "View Post";

				postLinkFont = tsldoc.createElement("font");
				postLinkFont.setAttribute("face", "arial,helvetica");
				postLinkFont.setAttribute("size", "-1");
				postLinkFont.setAttribute("color", "ff6600");
				postLinkFont.appendChild(postLink);

				var tdElement2 = tsldoc.createElement("td");
				tdElement2.appendChild(messageTableElement);
				tdElement2.appendChild(postLinkFont);
				tdElement2.setAttribute("class", "chicagoMaroonBackground");

				trElement.appendChild(tdElement);
				trElement.appendChild(tdElement2);

				postTable.appendChild(trElement);

				var httpRequest;
				httpRequest = new XMLHttpRequest();
				if (httpRequest.overrideMimeType) {
					httpRequest.overrideMimeType('text/xml');
				}
				httpRequest.onreadystatechange = function() { alertContents(httpRequest, currentTable, messageTableElement, postTable); };
				httpRequest.open('GET', linkURL, true);
				httpRequest.send(null);
			}
		} catch (e) {
			alert("Exception: " + e);
		}
		event.preventDefault();
	}	
}

function alertContents(httpRequest, currentTable, messageTableElement, postTable) {

	if (httpRequest.readyState == 4) {
		if (httpRequest.status == 200) {
								var txt2;
								var txt = httpRequest.responseText;
								txt = txt.substr(txt.indexOf('<table width=600 border=0>'))
								txt = txt.substr(0, txt.indexOf('</table>')+8);
								txt = txt.substr(txt.indexOf('<b>Message:</b>')+33);
								txt2 = txt.substr(txt.indexOf('</tr>')+5);
								txt2 = txt2.substr(0, txt2.indexOf('</table>'));
								txt = txt.substr(0, txt.indexOf('<p>'));
	
								var messageTrElement = tsldoc.createElement("tr");
								var messageTdElement = tsldoc.createElement("td");
	
								var messageFontElement = tsldoc.createElement("font");
								messageFontElement.setAttribute("face", "arial,helvetica");
								messageFontElement.setAttribute("size", "-1");
								messageFontElement.setAttribute("color", "ff6600");
	
								messageFontElement.innerHTML = txt;
	
								messageTdElement.appendChild(messageFontElement);
	
								if(txt2.indexOf('<!--REPLACE_WEB_LINK_BLOCK-->') == -1) {
									var webLinkTr = tsldoc.createElement("tr");
									var webLinkTd = tsldoc.createElement("td");
									var webLinkA = tsldoc.createElement("a");
									var linkFontElement = tsldoc.createElement("font");
									linkFontElement.setAttribute("face", "arial,helvetica");
									linkFontElement.setAttribute("size", "-1");
									linkFontElement.setAttribute("color", "ff6600");
									var linkTitle = txt2.substring(txt2.indexOf('<b>')+3, txt2.indexOf('</b>'));
									webLinkA.setAttribute("href", txt2.substring(txt2.indexOf('href')+6, txt2.indexOf('target')-2));
									webLinkA.innerHTML = linkTitle;
									linkFontElement.appendChild(webLinkA);
									webLinkTd.appendChild(linkFontElement);
									webLinkTr.appendChild(webLinkTd);
									messageTdElement.appendChild(webLinkTr);
								}
								if(txt2.indexOf('<!--REPLACE_IMG_LINK_BLOCK-->') == -1) {
									var imgLinkTd = tsldoc.createElement("td");
									var imgLinkTr = tsldoc.createElement("tr");
									var imgLinkImg = tsldoc.createElement("img");
									txt2 = txt2.substr(txt2.indexOf('src')+5);
									imgLinkImg.setAttribute("src", txt2.substring(0, txt2.indexOf('><')-1)); 
									imgLinkTd.appendChild(imgLinkImg);
									imgLinkTr.appendChild(imgLinkTd);
									messageTdElement.appendChild(imgLinkTr);
								}
	
								messageTrElement.appendChild(messageTdElement);
								messageTableElement.appendChild(messageTrElement);
								currentTable.parentNode.insertBefore(postTable, currentTable.nextSibling);
		} else {
		alert('There was a problem with the request.');
		}
	}

}
