function displayMessageForm(element) {
	try	{
		messageDiv = element.parentNode.parentNode;
		if(messageDiv.getAttribute("messageForm")) {
			if (messageDiv.lastChild.style.display == "none")
				messageDiv.lastChild.style.display = "block";
			else 
				messageDiv.lastChild.style.display = "none";
		} else {
			messageDiv.appendChild(createMessageForm());
			messageDiv.setAttribute("messageForm", "true");
		}
	} catch (e) {
		alert("Exception in TSL Extension function displayMessageForm: " + e);
	}
}

function createMessageForm(div) {
	var messageFormXML = 
		<div class="replyForm">
			<form id="message" onsubmit="return(countClick());" action="javascript:submitMessage(document.getElementById('message'));" method="post" name="message">
				<div class="row">
					<span class="label">Subject:</span>
					<span class="formw">
						<input type="text" onkeypress="if(window.event.keyCode == 13) { return(false); }" maxlength="80" name="subject" class="inputtype"/>
					</span>
				</div>
				<div class="row">
					<span class="label">Message:</span>
					<span class="formw">
						<input type="textarea" class="inputtype" name="message" rows="10" cols="70" wrap="hard"/>
					</span>
				</div>
				<div class="row">
					<span class="label">Email all replies to your address?:</span>
					<span class="formw">
						<input type="checkbox" value="0" name="email_reply"/>
					</span>
				</div>
				<div class="row">
					<span class="label">URL Title:</span>
					<span class="formw">
						<input type="text" onkeypress="if(window.event.keyCode == 13) { return(false); }" maxlength="80" name="web_link_title" class="inputtype"/>
					</span>
				</div>
				<div class="row">
					<span class="label">URL Link:</span>
					<span class="formw">
						<input type="text" onkeypress="if(window.event.keyCode == 13) { return(false); }" maxlength="150" name="web_link" class="inputtype"/>
					</span>
				</div>
				<div class="row">
					<span class="label">Image URL:</span>
					<span class="formw">
						<input type="text" onkeypress="if(window.event.keyCode == 13) { return(false); }" maxlength="150" name="img_link" class="inputtype"/>
					</span>
				</div>
				<div class="row">
					<span class="formw">
						<input type="submit" value="Submit Message" name="submitmessage"/>
					</span>
				</div>
				<input type="hidden" value="2457447" name="parent_id" class=""/>
				<input type="hidden" value="football" name="board" class=""/>
			</form>
		</div>
	
	var dummyDiv = document.createElement("div");
	dummyDiv.innerHTML = messageFormXML.toXMLString();
	return dummyDiv.firstChild;
}

function submitMessage(form) {
	try {
		//this is the target of the POST request
		var linkURL = "/cgi-bin/message_board/post.cgi";
		var refererURL = form.parentNode.parentNode.parentNode.previousSibling.firstChild.nextSibling.getAttribute("href");

		//isolate the strings for username and password
		formFields = form.getElementsByTagName("input");
		subject = formFields[0].value;
		message = formFields[1].value;
		email_reply = formFields[2].value;
		web_link_title = formFields[3].value;
		web_link = formFields[4].value;
		img_link = formFields[5].value;
		parent_id = refererURL.substring(refererURL.lastIndexOf('/')+1, refererURL.lastIndexOf('.'));
		board = refererURL.substring(15, refererURL.indexOf('/', 15));
		
		//format the post data for the request
		var postData = "email_link=" + 0 + "&subject=" + subject
					 + "&message=" + message + "&email_reply=" + email_reply
					 + "&web_link_title=" + web_link_title + "&web_link="
					 + web_link + "&img_link=" + img_link + "&parent_id="
					 + parent_id + "&board=" + board;

		//make the rquest
		var httpRequest = new XMLHttpRequest();
		if (httpRequest.overrideMimeType)
			httpRequest.overrideMimeType('text/xml');
		httpRequest.onreadystatechange = function() { messageSubmitStatus(httpRequest, form); };
		httpRequest.open('POST', linkURL, true);
		httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		httpRequest.send(postData);	
	} catch (e) {
		alert("Exception in TSL Extension function loginRequest: " + e);
	}	
}

function messageSubmitStatus(httpRequest, form) {
	try {
		if (httpRequest.readyState == 4) {
			if (httpRequest.status == 200) {
				alert("success");
			}
		}
	} catch (e) {
		alert("Exception in TSL Extension function loginRequest: " + e);
	}	
	
}

function fetchMessage(event) {
	try {
		var linkURL = document.location.href.substr(0,27)+event.currentTarget.getAttribute("href"); 
		var httpRequest;
		var currentDiv = event.currentTarget.parentNode.parentNode;

		//display the subposts before loading the message
		currentDiv.lastChild.style.display = "block";

		if ((null != currentDiv.lastChild.firstChild) && currentDiv.lastChild.firstChild.getAttribute("ismessagetext")) {
			if (currentDiv.lastChild.firstChild.style.display == "none") {
				currentDiv.lastChild.firstChild.style.display = "block";
				if ((null != lastDisplayedMessage) && (displaySingleMessage)) lastDisplayedMessage.style.display = "none";
				lastDisplayedMessage = currentDiv.lastChild.firstChild;
			}
			else {
				currentDiv.lastChild.firstChild.style.display = "none";
				lastDisplayedMessage = null;
			}
		}
		else {
			httpRequest = new XMLHttpRequest();
			if (httpRequest.overrideMimeType)
				httpRequest.overrideMimeType('text/xml');
			httpRequest.onreadystatechange = function() { displayMessage(httpRequest, currentDiv, linkURL); };
			httpRequest.open('GET', linkURL, true);
			httpRequest.send(null);
		}
		event.preventDefault();
	} catch (e) {
		alert("Exception in TSL Extension function fetchMessage: " + e);
	}
}

function displayMessage(httpRequest, currentDiv, linkURL) {
	try {

		if (httpRequest.readyState == 4) {
			if (httpRequest.status == 200) {

				//this is the skeleton HTML for the message that is being loaded
				var messageDiv = createMessageElement();
				
				//set the post link URL
				messageDivLinkElements = messageDiv.getElementsByTagName("a");
				messageDivLinkElements[messageDivLinkElements.length-1].href = linkURL;

				//convert the plain text response into an HTMLDocument object for easy parsing				
				var responseDoc = document.createElement("doc");
				responseDoc.innerHTML = httpRequest.responseText;
		
				//find the table containing the content of the post, it will have a width of 600 pixels
				tableElements = responseDoc.getElementsByTagName("table");
				var i=10;
				while (tableElements[i].width != 600) i++;

				try { //skip isolation if there is a problem, this fixes abnormal posts by moderators
				//isolate the message text
					fontElement = tableElements[i].getElementsByTagName("font")[2];
					fontElement.removeChild(fontElement.getElementsByTagName("b")[0]);
					fontElement.removeChild(fontElement.getElementsByTagName("p")[0]);
					fontElement.removeChild(fontElement.getElementsByTagName("p")[0]);
				} catch (e) {}				
				//insert the message text
				messageDiv.getElementsByTagName("div")[0].innerHTML = fontElement.innerHTML

				//if there is a link the length of anchorElements will be > 0
				anchorElements = tableElements[i].getElementsByTagName("a");

				//insert the link if one exists
				if (anchorElements.length != 0) {
					var linkParent = messageDiv.getElementsByTagName("div")[1];
					anchorElements[anchorElements.length-1].setAttribute("target", "_blank");
					linkParent.appendChild(anchorElements[anchorElements.length-1]);
					linkParent.style.display = "block";
				}
				
				//if there is an image the length of imgElements will be > 0
				imgElements = tableElements[i].getElementsByTagName("img");
				
				//insert the image if one exists
				if (imgElements.length != 0) {
					var imageParent = messageDiv.getElementsByTagName("div")[2];
					imageParent.appendChild(imgElements[0]);
					imageParent.style.display = "block";
				}
				//put the message div in the document
				currentDiv.lastChild.insertBefore(messageDiv, currentDiv.lastChild.firstChild);
				if ((null != lastDisplayedMessage) && (displaySingleMessage)) lastDisplayedMessage.style.display = "none";
				lastDisplayedMessage = messageDiv;
				
			} else {
				alert('There was a problem with the request.');
			}
		}
	} catch (e) {
		alert("Exception in TSL Extension function displayMessage: " + e);
	}
}

function createMessageElement() {
	var messageXML =
		<div class="message" ismessagetext="true" width="600">
			<div class="messageContent">
				<!-- insert message text here -->
			</div>
			<div class="messageContent" style="display:none;">
				<!-- insert link here -->
			</div>
			<div class="messageContent" style="display:none;">
				<!-- insert image here -->
			</div>
			<div class="messageContent">
				<a href="" target="_blank">
					<img src="chrome://tsl/content/images/view.post.png" class="messageLinkImage" />
				</a>
				<img onclick="javascript:displayMessageForm(this);" src="chrome://tsl/content/images/reply.png" class="messageLinkImage" />
			</div>
		</div>
		
		//e4x still doesn't play well with the DOM, need to create a dummy div to 
		//insert the XML, the XML can then be referenced from the dummy as a DOM tree
		var dummyDiv = document.createElement("div");
		dummyDiv.innerHTML = messageXML.toXMLString();
		return dummyDiv.firstChild;
}

function toggleCollapse(event) {
	try {		
		subPostContainer = event.currentTarget.nextSibling.nextSibling.nextSibling;
		if (subPostContainer.style.display == "none")
			subPostContainer.style.display = "block";
		else
			subPostContainer.style.display = "none";		
	} catch (e) {
		alert("Exception in TSL Extension function toggleCollapse: " + e);
	}
}