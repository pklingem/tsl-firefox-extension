/* ***** BEGIN LICENSE BLOCK *****
 *   Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 * 
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is TSL 2.0.
 *
 * The Initial Developer of the Original Code is
 * Patrick Klingemann.
 * Portions created by the Initial Developer are Copyright (C) 2007
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 * 
 * ***** END LICENSE BLOCK ***** */

window.addEventListener("load", function() { tsl.init(); }, false);

var tsl = {
    init: function() {
        var appcontent = document.getElementById("appcontent");   // browser
        if(appcontent)
            appcontent.addEventListener("load", this.onPageLoad, true);
    },

    onPageLoad: function(aEvent) {
        var targetURLs = new Array();
        targetURLs['http://www.techsideline.com/message_board/tslpass_subscribers/'] = true;
        targetURLs['http://www.techsideline.com/message_board/tslpass_subscribers/post.php'] = false;
        targetURLs['http://www.techsideline.com/message_board/tslpass_subscribers/search.php'] = false;
        targetURLs['http://www.techsideline.com/message_board/tslpass_recruiting/'] = true;
        targetURLs['http://www.techsideline.com/message_board/tslpass_recruiting/post.php'] = false;
        targetURLs['http://www.techsideline.com/message_board/tslpass_recruiting/search.php'] = false;
        targetURLs['http://www.techsideline.com/message_board/tslpass_tickets/'] = true;
        targetURLs['http://www.techsideline.com/message_board/tslpass_tickets/post.php'] = false;
        targetURLs['http://www.techsideline.com/message_board/tslpass_tickets/search.php'] = false;
        targetURLs['http://www.techsideline.com/message_board/football/'] = true;
        targetURLs['http://www.techsideline.com/message_board/football/post.php'] = false;
        targetURLs['http://www.techsideline.com/message_board/football/search.php'] = false;
        targetURLs['http://www.techsideline.com/message_board/basketball/'] = true;
        targetURLs['http://www.techsideline.com/message_board/basketball/post.php'] = false;
        targetURLs['http://www.techsideline.com/message_board/basketball/search.php'] = false;
        targetURLs['http://www.techsideline.com/message_board/womensbb/'] = true;
        targetURLs['http://www.techsideline.com/message_board/womensbb/post.php'] = false;
        targetURLs['http://www.techsideline.com/message_board/womensbb/search.php'] = false;
        targetURLs['http://www.techsideline.com/message_board/olympic/'] = true;
        targetURLs['http://www.techsideline.com/message_board/olympic/post.php'] = false;
        targetURLs['http://www.techsideline.com/message_board/olympic/search.php'] = false;
        targetURLs['http://www.techsideline.com/message_board/tickets/'] = true;
        targetURLs['http://www.techsideline.com/message_board/tickets/post.php'] = false;
        targetURLs['http://www.techsideline.com/message_board/tickets/search.php'] = false;
        targetURLs['http://www.techsideline.com/message_board/studenttix/'] = true;
        targetURLs['http://www.techsideline.com/message_board/studenttix/post.php'] = false;
        targetURLs['http://www.techsideline.com/message_board/studenttix/search.php'] = false;
        targetURLs['http://www.techsideline.com/message_board/coverage/'] = true;
        targetURLs['http://www.techsideline.com/message_board/coverage/post.php'] = false;
        targetURLs['http://www.techsideline.com/message_board/coverage/search.php'] = false;
        targetURLs['http://www.techsideline.com/message_board/america/'] = true;
        targetURLs['http://www.techsideline.com/message_board/america/post.php'] = false;
        targetURLs['http://www.techsideline.com/message_board/america/search.php'] = false;
        targetURLs['http://www.techsideline.com/message_board/score/'] = true;
        targetURLs['http://www.techsideline.com/message_board/score/post.php'] = false;
        targetURLs['http://www.techsideline.com/message_board/score/search.php'] = false;

        var doc = aEvent.originalTarget; // doc is document that triggered "onload" event
        var url = doc.location.href;

try {

        if (targetURLs[url]) {
			//insert javascripts and stylesheets to the page
			tsl.insertStyleSheet(doc, 'chrome://tsl/skin/overlay.css');
			tsl.insertJavaScript(doc, 'chrome://tsl/content/login.js');
			tsl.insertJavaScript(doc, 'chrome://tsl/content/message.js');
			tsl.insertJavaScript(doc, 'chrome://tsl/content/modify_mb.js');
			tsl.insertJavaScript(doc, 'chrome://tsl/content/effects.js');
        }

} catch (e) {
	alert(e);
}
    },

    insertJavaScript: function(doc, scriptURL) {
    	scriptElement = doc.createElement('SCRIPT');
		scriptElement.setAttribute('LANGUAGE', 'JavaScript');
		scriptElement.setAttribute('type', 'text/javascript');
		scriptElement.setAttribute('src', scriptURL);
		doc.body.appendChild(scriptElement);
    },
    

	insertStyleSheet: function(doc, styleSheetURL) {
		//load stylesheet
		var link = doc.createElement("link");
		link.rel = "stylesheet";
		link.type = "text/css";
		link.href = styleSheetURL; 
		doc.getElementsByTagName('head')[0].appendChild(link);	
	}

}