function modifyLogin(table) {
	try {
		links = table.getElementsByTagName("a");
		links[0].addEventListener("click", function (event) { displayLogin(event); }, true);
	} catch (e) {
		alert("Exception in TSL Extension function modifyLogin: " + e);
	}
}

function displayLogin(event) {
	try {
		row = event.currentTarget.parentNode.parentNode.parentNode.parentNode.parentNode;
		row.id = "loginInput";
		if (row.parentNode.childNodes.length == 2) {
			newRow = row.cloneNode(true);
			span = newRow.getElementsByTagName("span")[0];
			span.innerHTML = "";

			var loginXML = 
				<form action="javascript:loginRequest(document.getElementById('loginForm'));" name="loginForm" id="loginForm">
					<input type="text" size="15" value="" name="username" class="inputtype"/>
					<input type="password" size="15" value="" name="password" class="inputtype"/>
					<input type="submit" value="Login" name="submit"/>
				</form>
			var loginDiv = document.createElement("div");
			loginDiv.innerHTML = loginXML.toXMLString();	
			span.parentNode.insertBefore(loginDiv, span);
			row.parentNode.appendChild(newRow);
		}
		event.preventDefault();
	} catch (e) {
		alert("Exception in TSL Extension function displayLogin: " + e);
	}
}

function loginRequest(form) {
	try {
		//isolate the strings for username and password
		var username = form.firstChild.nextSibling.value;
		var password = form.firstChild.nextSibling.nextSibling.nextSibling.value;

		//format the post data for the request
		var postData = "username=" + username + "&password=" + password;
		
		//this is the target of the POST request
		var linkURL = "http://www.techsideline.com/account/login.php";

		//make the request
		var httpRequest = new XMLHttpRequest();
		if (httpRequest.overrideMimeType)
			httpRequest.overrideMimeType('text/xml');
		httpRequest.onreadystatechange = function() { login(httpRequest, form); };
		httpRequest.open('POST', linkURL, true);
		httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		httpRequest.send(postData);	
	} catch (e) {
		alert("Exception in TSL Extension function loginRequest: " + e);
	}
}

function login(httpRequest, form) {
	try {
		if (httpRequest.readyState == 4) {
			if (httpRequest.status == 200) {
				//convert the plain text response into an HTMLDocument object for easy parsing				
				var responseDoc = window.content.document.createElement("doc");
				responseDoc.innerHTML = httpRequest.responseText;

				//this isn't correct				
				var loginBannerTbody = form.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;

				//www.iloveuglyhacks.com
				if (responseDoc.getElementsByTagName("form")[0]) {
					alert("bad password");
				} else {
					//success
					var username = form.firstChild.nextSibling.value;
					loginBannerTbody.removeChild(loginBannerTbody.lastChild);
					var newLoginSpan = 
						<span class="loginfont">You are logged in as <b>{username}</b> | <a href="https://secure.techsideline.com/account/account.php">account info</a> | <a href="http://www.techsideline.com/account/logout.php">logout</a><br/></span>
					var dummyDiv = document.createElement("div");
					dummyDiv.innerHTML = newLoginSpan;
					loginSpan = loginBannerTbody.firstChild.firstChild.nextSibling.firstChild.nextSibling.firstChild.firstChild;
					loginSpan.parentNode.replaceChild(dummyDiv.firstChild, loginSpan)
				}

			} else {
				alert('There was a problem with the request.');
			}
		}
	} catch (e) {
		alert("Exception in TSL Extension function login: " + e);
	}
}
