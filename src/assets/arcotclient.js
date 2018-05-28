// arcotclient.js 
// version 6.0.2
// Enhanced Applet Support
// Arcot Systems, All Rights Reserved 2008


// Map { OS -> Map { Browser -> Array [ browser version, prefered client types, browser version, prefered client types, ... ] } }
// A browser version with the value * matches all versions
// Versions should be sorted from low to high
var CLIENT_TYPE_MATRIX = { "windows" : 
								{ "explorer" :
									[ "*", [ "flash", "applet" ] ],
								 "firefox":
									[ "*", [ "flash", "applet" ] ],
								 "default": // other browsers
									[ "*", [ "flash", "applet"] ]
								},
						   "mac" : 
						   		{ "default": // other browsers
								   [ "*", [ "flash", "applet"] ]
						   		},
					   	   "default" :
					   	   		{ "default": // other browsers
								   [ "*", [ "flash", "applet"] ]
					   	   		}
						  };

// For cases not covered by the above (should not happen if CLIENT_TYPE_MATRIX is well constructed)
var DEF_PREF_CLIENT = [ "flash", "applet" ];

// The required version of flash for our client
var FLASH_REQ_VERSION_MAJ = 8;
var FLASH_REQ_VERSION_MIN = 5;
var FLASH_REQ_VERSION_REV = 0;

// ActiveX specific
var ACTIVE_X_CLASS_ID = "CLSID:6D72E2C2-F8E6-11D1-8AFB-000000000000";
var ACTIVE_X_CAB = "arcotplugin_win32.cab";
var ACTIVE_X_MIN_VERSION = "5,0,0,0";

// Applet specific
var APPLET_SIGNED_NAME = "ArcotApplet";
var APPLET_RAW_NAME = "ArcotAppletRaw";
var APPLET_MAIN_CLASS = "com.arcot.applet.ClientApplet.class";

// Flash specific
var FLASH_MOVIE_NAME = "ArcotIDClient.swf";

// Netscape Plug-In specific for Mac/Windows
var MAC_NS_PLUGIN_NAME = "arcotplugin.dmg";
var WIN_NS_PLUGIN_NAME = "arcotplugin.xpi";


// Singleton used by the callbacks (we should get rid of this)
var _instance_ = null;

var _ARCOT_CLIENT_NAME = "ArcotIDClientModule";


// The ActiveX client does not notify us when it is ready, so we'll wait
// for the specified ammount of time and then check if it is ready
var ACTIVE_X_READY_WAIT_DELAY = 2; // In seconds
var ACTIVEX_CHECK_MAX_ATTEMPTS = 10;

// Netscape Plugin ready notification spawns another thread (using setTimeOut) where
// the actual callback functionality happens...Timeout value specified here:
var NP_CALLBACK_DELAY = 2; //ms

// AID lookup Modes
var USERNAME_ONLY_MODE = "USERNAME_ONLY";
var ALIAS_ONLY_MODE    = "ALIAS_ONLY";
var USERNAME_AND_ALIAS_MODE = "USERNAME_AND_ALIAS";

// public
function ArcotClient() {
	_instance_ = this;
	this.client = null;
	this.clientType = null;
	this.clientBaseURL = "";
	this.sharedFlashClientBaseURL = "";
	this.prefClientTypes = new Array();
	this.lastError = null;
	this.redirectURL = null;
	this.console = null;
	this.flashInstallURL = "http://www.macromedia.com/go/getflashplayer";
	this.flashUpgradeURL = "http://www.adobe.com/products/flash/about/";
	this.javaInstallURL = "http://www.java.com/en/download/";
	this.signedApplet = true;
	this.clientReadyCallback = null;
	this.clientErrorCallback = null;
	this.activeXMinVersion = ACTIVE_X_MIN_VERSION;
	this.extraParams = { };
	this.extraVars = { };
	if (navigator.plugins) {
	    navigator.plugins.refresh();
       }
}

// public. Returns -1 on error, 0 if clientType is not supported on
// browser, 1 if successful.
ArcotClient.prototype.setAttribute = function(key, value, value2) {
	if (key == null) {
		this.lastError = "setAttribute invalid argument: key is null";
		this.log(this.lastError);
		return -1;
	}
	if (key.toLowerCase() == "clienttype") {
		if (!this.isValidClientType(value)) {
			this.lastError = "setAttribute() called with invalid clientType '" + value  + "'";
			this.log(this.lastError);
			return -1;
		}
		if (! this.clientSupportedOnBrowser(value)) {
			return 0;
		} 
		this.prefClientTypes.push(value);
	} else if (key.toLowerCase() == "clientbaseurl") {
		if (value != null) {
			this.clientBaseURL = value;
			if (this.clientBaseURL.charAt(this.clientBaseURL.length - 1) != "/") {
			  this.clientBaseURL += "/";
        	}
		}
	} else if (key.toLowerCase() == "sharedflashclientbaseurl") {
		if (value != null) {
			this.sharedFlashClientBaseURL = value;
			if (this.sharedFlashClientBaseURL.charAt(this.sharedFlashClientBaseURL.length - 1) != "/") {
			  this.sharedFlashClientBaseURL += "/";
        	}
		}
	} else if (key.toLowerCase() == "clientreadycallback") {
		this.clientReadyCallback = value;
	} else if (key.toLowerCase() == "clienterrorcallback") {
		this.clientErrorCallback = value;
	} else if (key.toLowerCase() == "console") {
		if (value && value.log) {
		 	this.console = value;
		}
	} else if (key.toLowerCase() == "flashinstallurl") {
		if (value != null) {
			this.flashInstallURL = value;
		}
	} else if (key.toLowerCase() == "flashupdateurl") {
		if (value != null) {
			this.flashUpdateURL = value;
		}
	} else if (key.toLowerCase() == "javainstallurl") {
		if (value != null) {
			this.javaInstallURL = value;
		}
	} else if (key.toLowerCase() == "signedapplet") {
		if ((value != null) && (value.length > 0)) {
			var c = value.charAt(0);
			if ((c == "T") || (c == "t") || (c == "Y") || (c == "y") || (c == "1")) {
				this.signedApplet = true;
			} else {
				this.signedApplet = false;
			}
		}
	} else if (key.toLowerCase() == "activexminversion") {
		this.activeXMinVersion = value;
	} else if (key.toLowerCase() == "extraparam") {
		this.extraParams[value] = value2;
	} else if (key.toLowerCase() == "extravar") {
		this.extraVars[value] = value2;
	} else {
		this.lastError = "error, setAttribute() called with unkown attribute '" + key  + "'";
		this.log(this.lastError);
		return -1;
	}
	return 1;
} // function setAttribute()


// public
ArcotClient.prototype.write = function(divID) {
	var div = document.getElementById(divID);
	if (div == null) {
		this.lastError = "div with id '" + divID + "' not found in the page";
		this.log(this.lastError);
		return false;
	}
	this.clientType = this.findClientType();
	if (this.clientType == null) {
	   this.lastError = "no available client type";
	   this.log(this.lastError);
	   return false;
	}
	if (this.clientType.indexOf("redirect:") == 0) {
		document.location = this.clientType.substring(9);
		return false;
	}
	var nodeHTML = this.createClientHTML(this.clientType);
	// DEBUG
	// this.log("nodeHTML=" + nodeHTML);
	if (nodeHTML == null) {
		this.lastError = "failed to create node";
		this.log(this.lastError);
		return false;		
	}
	div.innerHTML = nodeHTML;
	if (this.clientType.toLowerCase() == "activex") {
		// Since ActiveX is not notifying us when it is ready,
		// we'll wait for few seconds and check for notify
		setTimeout("checkActiveXReady()", ACTIVE_X_READY_WAIT_DELAY * 1000);
	}
	if (this.clientType.toLowerCase() == "javascript") {
		_instance_.client = new ArcotJSClient();
		arcotClientReady_();
	}

	return true;
}


var numChecks = 0;
function checkActiveXReady() {
   var client = document.getElementById(_ARCOT_CLIENT_NAME);
   try {
       var axo = new ActiveXObject("Arcot.Client.2");
      // if that does not throw, then we are ready
      arcotClientReady_();
   } catch (e) {
      if (numChecks < ACTIVEX_CHECK_MAX_ATTEMPTS) {
           numChecks++;
	    setTimeout("checkActiveXReady()", ACTIVE_X_READY_WAIT_DELAY * 1000);
      } else {
	    _instance_.lastError = "ActiveX client cannot be accessed";
//	    _instance_.log(_instance_.lastError):
	    arcotClientError_();
     }
  }
} // checkActiveXReady()


var clientErrored_ = false;
function arcotClientReady_() {
	if (_instance_.clientType.toLowerCase() != "javascript")
	{
   		 _instance_.client = document.getElementById(_ARCOT_CLIENT_NAME);
   	}
	if (!clientErrored_ && (_instance_.clientReadyCallback != null)) {
		_instance_.clientReadyCallback();
	}
	
}


//callback function for Netscape Plugin
function arcotClientReadyNP_() {
    _instance_.client = window.document[_ARCOT_CLIENT_NAME];
	if (!clientErrored_ && (_instance_.clientReadyCallback != null)) {
		// do the actual callback functions from a thread...
		setTimeout("cbTempNP()", NP_CALLBACK_DELAY*1000);
	}	
}

// App specified callback is invoked here for Netscape Plugin
function cbTempNP() {
	_instance_.clientReadyCallback();
}


function arcotClientError_() {
	clientErrored_ = true;
	if (_instance_.clientErrorCallback != null) {
		_instance_.clientErrorCallback();
	}
}


// public
ArcotClient.prototype.toString = function() {
	return "ArcotClient type=" + this.clientType + " version=" + this.client.GetVersion();
}

// public
ArcotClient.prototype.getClient = function() {
	return this.client;
}

// public
ArcotClient.prototype.getClientType = function() {
	return this.clientType;
}

//
// Arcot Client API
//

// Return the version number of the client
ArcotClient.prototype.GetVersion = function() {
	return this.client.GetVersion();
}

// Return the full version number of the client
ArcotClient.prototype.GetVersionEx = function() {
	return this.client.GetVersionEx(); 
}

ArcotClient.prototype.SignChallenge = function(challenge) {
	if (this.clientType.toLowerCase() == "flash" || this.clientType.toLowerCase() == "applet") {
		this.lastError = "SignChallenge method not available with Flash client and Applet";
		this.log(this.lastError);
		return null;
	}
	return this.client.SignChallenge(challenge);
}

ArcotClient.prototype.SignChallengeNonBlocking = function(challenge, browser, onComplete, onFailure) {
	if (this.clientType.toLowerCase() == "flash" || this.clientType.toLowerCase() == "applet") {
		this.lastError = "SignChallengeNonBlocking method not available with Flash client and Applet";
		this.log(this.lastError);
		return null;
	}
	return this.client.SignChallengeNonBlocking(challenge, browser, onComplete, onFailure);	
}

function utf8encode(string) {
	string = string.replace(/\r\n/g,"\n");
	var utftext = "";

	for (var n = 0; n < string.length; n++) {

		var c = string.charCodeAt(n);

		if (c < 128) {
			utftext += String.fromCharCode(c);
		}
		else if((c > 127) && (c < 2048)) {
			utftext += String.fromCharCode((c >> 6) | 192);
			utftext += String.fromCharCode((c & 63) | 128);
		}
		else {
			utftext += String.fromCharCode((c >> 12) | 224);
			utftext += String.fromCharCode(((c >> 6) & 63) | 128);
			utftext += String.fromCharCode((c & 63) | 128);
		}

	}

	return utftext;
}

// v6.0 changes
// SignChallengeEx supports both the old-style API (when called without specifying orgName) and the 
// new style (when called with orgName)

ArcotClient.prototype.SignChallengeEx = function(challenge, walletName, cardName, pin, orgName) {
	if (this.clientType.toLowerCase() == "flash") {
		var utf8pin = utf8encode(pin);
		return this.client.SignChallengeEx(challenge, walletName, cardName, orgName, utf8pin);
	} else {
		return this.client.SignChallengeEx(challenge, walletName, cardName, orgName, pin);
	}
}

ArcotClient.prototype.SignChallengeEx2 = function(challenge, pin, walletNameOrAlias, appctx, orgName) {
	if (this.clientType.toLowerCase() == "flash") {
		var utf8pin = utf8encode(pin);
		return this.client.SignChallengeEx2(challenge, utf8pin, walletNameOrAlias, appctx, orgName);
	} else {
		return this.client.SignChallengeEx2(challenge, pin, walletNameOrAlias, appctx, orgName);
	}
}

ArcotClient.prototype.GetGlobalAttribute = function(attributeName) {
  var r = this.client.GetGlobalAttribute(attributeName); 
  /*if ((r != null) && (this.clientType.toLowerCase() == "flash")) {
     var re = /&quot;/g;
     r = r.replace(re, "\"");
  } */
  return r;
}

ArcotClient.prototype.isArcotIDAvailable = function(userName, orgName) 
{ 
	var ret=false; 
	if (parseInt(this.client.GetGlobalAttribute("walletn:count")) != 0) 
	{ 	
		var i; 
		var c = parseInt(this.client.GetGlobalAttribute("walletn:count")); 
		if (orgName == null)
		{
			for (i = 0; i < c; i++) 
			{ 
				var aidName = this.client.GetGlobalAttribute("walletn:" + i + ":name"); 
				if(aidName.toLowerCase() == userName.toLowerCase()) 
				{ 
					ret = true; 
					break; 
				} 
			} 
		}
		else
		{
			for (i = 0; i < c; i++) 
			{ 
				var aidName = this.client.GetGlobalAttribute("walletn:" + i + ":name"); 
				var org = this.client.GetGlobalAttribute("walletn:" + i + ":Org"); 
				if(aidName.toLowerCase() == userName.toLowerCase() &&
				orgName.toLowerCase() == org.toLowerCase()) 
				{ 
					ret = true; 
					break; 
				} 
			} 
		
		}
	} 
	return ret; 
}

// isArcotIDAvailableEx()
ArcotClient.prototype.isArcotIDAvailableEx = function(walletNameOrAlias, ctx, inOrgName) 
{ 
	var ret=false; 
	if (ctx == null || ctx.length == 0) {// app ctx cannot be null;
		return false;
	}
	if (inOrgName != null && inOrgName.length != 0) {
		if (parseInt(this.client.GetGlobalAttribute("alias:"+walletNameOrAlias+":appctx:"+ctx+":Org:"+inOrgName+":count")) > 0)
		{
			ret = true;
		}
	} else {
		if (parseInt(this.client.GetGlobalAttribute("alias:"+walletNameOrAlias+":appctx:"+ctx+":count")) > 0)
		{
			ret = true;
		}
	}

	return ret;
	
}

// ------------------------------------------------------------------
// May 12, 2008: standarize "StorageType" setting to make all clients
// respect the published values.
// ------------------------------------------------------------------
ArcotClient.prototype.SetAttribute = function(attributeName, attributeValue) {
	if (attributeName.toLowerCase() == "storagetype") {
		var lcAttributeValue = attributeValue.toLowerCase();
		if (this.clientType.toLowerCase() == "activex") {
			// - native client wants lower case values and "mem" instead of "memory"
			attributeValue = lcAttributeValue;
			if(attributeValue == "memory") {
				attributeValue = "mem";
			}
		} 
		else if (this.clientType.toLowerCase() == "flash") {
			// - flash client still uses "WalletInMemory" setting
			if (lcAttributeValue == "memory") {
				attributeName = "WalletInMemory";
				attributeValue = "true";
			} else if (lcAttributeValue == "hd") {
				attributeName = "WalletInMemory";
				attributeValue = "false";
			}
		}
	} // attributeName == storagetype

	return this.client.SetAttribute(attributeName, attributeValue);
}

ArcotClient.prototype.GetErrorCode = function() {
	return this.client.GetErrorCode();
}

ArcotClient.prototype.GetErrorMessage = function() {
	return this.client.GetErrorMessage();
}


// ------------------------------------------------------------------
// May 12, 2008: incorporate workaround to native client's truncation 
// of wallet name and flash client's not accepting "memory" as storage type
// Jan 12, 2009: force storage type for unsigned applet to "memory" since
// that is its only supported value.
// ------------------------------------------------------------------
ArcotClient.prototype.ImportArcotID = function(b64EncodedArcotID, storageType, userName) {

	if (userName != undefined && userName != "" &&
		this.clientType.toLowerCase() == "activex" && 
		this.client.GetVersion() < "5.1.2") 
	{
		if (!this.SetAttribute("StorageType", storageType)) {
		// NB. this.SetAttribute() is not same as this.setAttribute()
			return false;
		}
		if (!this.client.SetCurrentWalletFromEncoding(b64EncodedArcotID)) {
			return false;
		}
		if (!this.client.SetCurrentCardByIndex(0)) {
			return false;
		}

		var workaroundWalletName = userName + ".";
		return this.client.AddCurrentCardToWallet(workaroundWalletName);

	}
  
	if (this.clientType.toLowerCase() == "flash" &&
	    storageType.toLowerCase() == "memory")
	{
		storageType = "mem";
	}
	
	if (this.clientType.toLowerCase() == "applet" &&
	    ! this.signedApplet) 
	{
	    storageType = "memory";
	}

	try {
		return this.client.ImportArcotID(b64EncodedArcotID, storageType);
	} catch (e) {
	// Let's try the old API
	if (!this.SetAttribute("StorageType", storageType)) {
	// NB. this.SetAttribute() is not same as this.setAttribute()
		return false;
	}
	 if (!this.client.SetCurrentWalletFromEncoding(b64EncodedArcotID)) {
	 	return false;
	 }
	 if (!this.client.SetCurrentCardByIndex(0)) {
	 	return false;
	 }
	 if (!this.client.AddCurrentCardToWallet("ArcotID" + new Date())) {
		return false;
	 }
	 return true;
	}
}

// v6.0 changes
// RemoveArcotID supports both the old-style API (when called without specifying orgName) and the 
// new style (when called with orgName)

ArcotClient.prototype.RemoveArcotID = function(arcotIDName, storageType, orgName) {
	if (this.clientType.toLowerCase() == "flash" &&
	    storageType.toLowerCase() == "memory")
	{
		storageType = "mem";
	}
	return this.client.RemoveArcotID(arcotIDName, orgName, storageType);
}

ArcotClient.prototype.RemoveArcotIDEx = function(walletNameOrAlias, appctx, storageType, orgName) {

	if (this.clientType.toLowerCase() == "flash" &&
	    storageType.toLowerCase() == "memory")
	{
		storageType = "mem";
	}
	return this.client.RemoveArcotIDEx(walletNameOrAlias, appctx, orgName, storageType);
}
ArcotClient.prototype.RefreshArcotIDs = function() {
	return this.client.RefreshArcotIDs();
}

ArcotClient.prototype.RegisterCSPCertificates = function(arcotIDName) {
	if (this.clientType.toLowerCase() != "activex") {
		this.lastError = "RegisterCSPCertificates method is only available with the ActiveX client";
		this.log(this.lastError);
		return null;
	}
	return this.client.RegisterCSPCertificates(arcotIDName);
}

//
// End of Arcot Client API
//

// private
ArcotClient.prototype.log = function(msg) {
	if (this.console != null) {
		this.console.log("arcotclient.js: " + msg);
	}
}

// private
ArcotClient.prototype.isValidClientType = function(key) {
	var lowKey = key.toLowerCase();
	return (lowKey == "applet") || (lowKey == "activex") || (lowKey == "flash") || (lowKey == "ns-plugin") || (lowKey == "javascript");
} // isValidClientType()


// private
ArcotClient.prototype.clientSupportedOnBrowser = function(key) {

	var os = BrowserDetect.OS.toLowerCase();
	var browser = BrowserDetect.browser.toLowerCase();
	if (! this.isValidClientType(key)) return false;
	var lowKey = key.toLowerCase();
	if (lowKey == "applet") {
		if (browser == "chrome") {
			return deployJava.isJavaInstalledOnChrome();
		}
		else if (browser != "explorer") 
			return navigator.javaEnabled();
	        else return deployJava.isJavaInstalledOnIE();
	}
	if (lowKey == "activex") {
		if (BrowserDetect.browser != "Explorer" ||
		    BrowserDetect.OS != "Windows") {
			return false;
		}
		return true;
	}
	if (lowKey == "flash") {
		var objPlayerVersion = getFlashPlayerVersion();
		if (objPlayerVersion.major == 0) {
			return false;
		}
		var objReqVersion = new FlashPlayerVersion([FLASH_REQ_VERSION_MAJ, 
								FLASH_REQ_VERSION_MIN, 
								FLASH_REQ_VERSION_REV]);
		return objPlayerVersion.versionIsValid(objReqVersion);
	}
	if (lowKey == "ns-plugin") {
		// test platform/browser capability
		if (os == 'mac')  {
			if ((browser != 'safari') && (browser != 'firefox')) {
				return false;
			} else return true;
		} else if (os == 'windows')  {
			if (browser != 'firefox') {
				return false;
			} else return true;
		} else return false;
	}

	return false;
} // clientSupportedOnBrowser()


//private
// Returns the appropriate client for the current OS/browser
// or redirect:<url> if the user needs to be redirected to a URL (to install the Flash player for example)
// or null if no client is available
ArcotClient.prototype.findClientType = function() {
	var os = BrowserDetect.OS.toLowerCase();
	var browser = BrowserDetect.browser.toLowerCase();
	var browserVersion = BrowserDetect.version;
	
	if (this.prefClientTypes.length == 0) {	
		// This means auto-detect
		var brows = CLIENT_TYPE_MATRIX[os];
		if (brows == null) {
			this.log("OS not recognized '" + os + "'");
			brows = CLIENT_TYPE_MATRIX["default"];
		}
		var vers = brows[browser];
		if (vers == null) {
			this.log("browser not recognized '" + browser + "'");
			vers = brows["default"];
		}
		var prefClients = null;
		var version = parseInt(browserVersion);
		if (version == NaN) {
			this.log("failed to parse browser version '" + browserVersion + "'");
			prefClients = vers[vers.length - 1];
		} else {
			for (var i = 0; i < vers.length; i += 2) {
				if (vers[i] == "*") {
					if (prefClients == null) {
						prefClients = vers[i + 1];
						break;
					}
				} else {
					var curVer = parseInt(vers[i]);
					if (curVer == version) {
						prefClients = vers[i + 1];
						break;
					}
					if (curVer > version) {
						if (prefClients != null) {
							break;
						}
						// Keep going to the *
					}
				}
			}
		}
		if (prefClients == null) {
			this.log("error, no pref clients");
			this.prefClientTypes = DEF_PREF_CLIENT;
		} else {
			this.prefClientTypes = prefClients; 
		}
	}
	// Now let's iterate over the different types
	for (var i = 0; i < this.prefClientTypes.length; i++) {
		var lastChoice = false;
		if (i == (this.prefClientTypes.length - 1)) {
			lastChoice = true;
		}
		switch (this.prefClientTypes[i].toLowerCase()) {
			case "flash":
			  var flashVersion = getFlashPlayerVersion();
			  if (flashVersion.major == 0) { // Flash is not installed
			  	if (lastChoice) {
			  	  return "redirect:" + this.flashInstallURL;
				} else {
				  continue;
				}
			  }
			  if ((flashVersion.major < FLASH_REQ_VERSION_MAJ) || 
				  ((flashVersion.major == FLASH_REQ_VERSION_MAJ) && (flashVersion.minor < FLASH_REQ_VERSION_MIN)) ||
				  ((flashVersion.major == FLASH_REQ_VERSION_MAJ) && (flashVersion.minor == FLASH_REQ_VERSION_MIN) && (flashVersion.rev < FLASH_REQ_VERSION_REV))) { // Version not recent enough
  			  	if (lastChoice) {
			  	  return "redirect:" + this.flashUpdateURL;
				} else {
				  continue;
				}
			  }
			  return "Flash";
			case "applet":
				if (browser == "chrome" && !deployJava.isJavaInstalledOnChrome()) {
					if (lastChoice) {
					  return "redirect:" + this.javaInstallURL;
					}
					continue;				
				}
				if (browser != "explorer" && !navigator.javaEnabled()) {
					if (lastChoice) {
					  return "redirect:" + this.javaInstallURL;
					}
					continue;
				} else if (browser == "explorer" && !deployJava.isJavaInstalledOnIE()) {
					if (lastChoice) {
					  return "redirect:" + this.javaInstallURL;
					}
					continue;
				}
				return "Applet";
			case "activex":
				if ((os != "windows") || (browser != "explorer")) {
					if (lastChoice) {
					  return null;
					}
					continue;
				}
				return "ActiveX";
			case "ns-plugin":
				if (os == 'mac')  {
				     if ((browser != 'safari') && (browser != 'firefox')) {
					if (lastChoice) {
					  return null;
					}
					continue;
				     } else return "mac-ns-plugin";
				} else if (os == 'windows') {
					if (browser != 'firefox') {
						if (lastChoice) {
						  return null;
						}
						continue;
					} else return "win-ns-plugin";
				}
			case "javascript":
				return "Javascript";
			default:
				this.log("error, unknown client type " + this.prefClientTypes[i]);
				break;
		}
	}
}

// private
ArcotClient.prototype.createClientHTML = function(clientType) { 
//	var node;
	var str;
	var lcClientType = clientType.toLowerCase();
	switch (lcClientType) {
		case "activex":
			str = "<object id='";
			str += _ARCOT_CLIENT_NAME;
			str += "' width='0' height='0' classid='";
			str += ACTIVE_X_CLASS_ID;
			str += "' codebase='";
			str += this.clientBaseURL + ACTIVE_X_CAB;
			str += "#Version=" + this.activeXMinVersion + "'";
			str += ">";
			for (var k in this.extraParams) {
				str += "<PARAM name='" + k + "' value='" + this.extraParams[k] + "'>";
			}
			str += "</OBJECT>";
			return str;
		break;
		// Jan 12 2009: use non-0 size for applet because on slow lines it will
		//  show user that something is happening during applet download...Customize
		// the position and size of the applet window (width, height) as per your
		// application. To remove the display set width and height to 0.
		case "applet":
			str = "<center><applet id='";
			str += _ARCOT_CLIENT_NAME;
			str += "' width='80' height='80' codebase='";
			str += this.clientBaseURL;
			str += "' archive='";
			str += this.signedApplet ? APPLET_SIGNED_NAME : APPLET_RAW_NAME;
			str += ".jar' code='";
			str += APPLET_MAIN_CLASS;
			str += "' mayscript='true'>";
			str += "<PARAM name='cabbase' value='";
			str += this.signedApplet ? APPLET_SIGNED_NAME : APPLET_RAW_NAME;
			str += ".cab'>";	
			str += "<PARAM name='OnReadyCallback' value='arcotClientReady_'>";
			for (var k in this.extraParams) {
				str += "<PARAM name='" + k + "' value='" + this.extraParams[k] + "'>";
			}
			str += "</applet></center>";
			return str;
		break;
		case "flash":
		       var baseURL = this.clientBaseURL;
		       if (this.sharedFlashClientBaseURL != "") 
			{
			    baseURL = this.sharedFlashClientBaseURL;
			}
			var flashvars = "readyCallback=arcotClientReady";
			flashvars += "&errorCallback=arcotClientError";
			for (var k in this.extraVars) {
				flashvars += "&" + k + "=" + this.extraVars[k];
			}

			str = "<object id='";
			str += _ARCOT_CLIENT_NAME;
			str += "' width='0' height='0' classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000'";
			str += " codebase='https://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,5,0,0' >";
			str += "<param name='movie' value='"; 
			str += baseURL + FLASH_MOVIE_NAME;
			str += "' />";
			str += "<param name='bgcolor' value='#00ffff' />";
			str += "<param name='allowScriptAccess' value='always' />";
			str += "<param name='flashvars' value='" + flashvars + "' />";
			str += "<embed src='" + baseURL + FLASH_MOVIE_NAME + "' quality='high' width='0' height='0' ";
			str += "name='";
			str += _ARCOT_CLIENT_NAME
			str += "' align='' type='application/x-shockwave-flash' pluginspage='https://www.macromedia.com/go/getflashplayer' bgcolor='#00ffff' allowScriptAccess='always' flashvars='" + flashvars + "' >";
			str += "</embed></object>";
			return str;
		break;
		case "mac-ns-plugin":
			var baseURL = this.clientBaseURL;
			str ="<embed type='application/x-arcotid-client' name='";
			str += _ARCOT_CLIENT_NAME;
			str += "' pluginspage='";
			str += baseURL+MAC_NS_PLUGIN_NAME;
			str += "' hidden='true' AutoPlay='true' ";
			str += "readyCallBack='arcotClientReadyNP_'>";
			str += "</embed>";
			return str;
		case "win-ns-plugin":
			var baseURL = this.clientBaseURL;
			str ="<embed type='application/x-arcotid-client' name='";
			str += _ARCOT_CLIENT_NAME;
			str += "' pluginspage='";
			str += baseURL+WIN_NS_PLUGIN_NAME;
			str += "' hidden='true' AutoPlay='true' ";
			str += "readyCallBack='arcotClientReadyNP_'>";
			str += "</embed>";
			return str;
		case "javascript":
			str="";
			return str;
		default:
			this.log("error, unkown client type '" + clientType + "'");
			return null;
	}
	return null;
}


/*  detection functions - courtesy of SWFObject http://blog.deconcept.com/swfobject/ */
function getFlashPlayerVersion() {
	var PlayerVersion = new FlashPlayerVersion([0,0,0]);
	if(navigator.plugins && navigator.mimeTypes.length){
		var x = navigator.plugins["Shockwave Flash"];
		if(x && x.description) {
			PlayerVersion = new FlashPlayerVersion(x.description.replace(/([a-zA-Z]|\s)+/, "").replace(/(\s+r|\s+b[0-9]+)/, ".").split("."));
		}
	}else if (navigator.userAgent && navigator.userAgent.indexOf("Windows CE") >= 0){ // if Windows CE
		var axo = 1;
		var counter = 3;
		while(axo) {
			try {
				counter++;
				axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash."+ counter);
				PlayerVersion = new FlashPlayerVersion([counter,0,0]);
			} catch (e) {
				axo = null;
			}
		}
	} else { // Win IE (non mobile)
		// do minor version lookup in IE, but avoid fp6 crashing issues
		// see http://blog.deconcept.com/2006/01/11/getvariable-setvariable-crash-internet-explorer-flash-6/
		try{
			var axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
		}catch(e){
			try {
				var axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
				PlayerVersion = new FlashPlayerVersion([6,0,21]);
				axo.AllowScriptAccess = "always"; // error if player version < 6.0.47 (thanks to Michael Williams @ Adobe for this code)
			} catch(e) {
				if (PlayerVersion.major == 6) {
					return PlayerVersion;
				}
			}
			try {
				axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
			} catch(e) {}
		}
		if (axo != null) {
			PlayerVersion = new FlashPlayerVersion(axo.GetVariable("$version").split(" ")[1].split(","));
		}
	}
	return PlayerVersion;
}

// ctor
FlashPlayerVersion = function(arrVersion){
	this.major = arrVersion[0] != null ? parseInt(arrVersion[0]) : 0;
	this.minor = arrVersion[1] != null ? parseInt(arrVersion[1]) : 0;
	this.rev = arrVersion[2] != null ? parseInt(arrVersion[2]) : 0;
}
FlashPlayerVersion.prototype.versionIsValid = function(fv){
	if(this.major < fv.major) return false;
	if(this.major > fv.major) return true;
	if(this.minor < fv.minor) return false;
	if(this.minor > fv.minor) return true;
	if(this.rev < fv.rev) return false;
	return true;
}


// callback wrappers
function arcotClientReady() {
	if (navigator.appName.indexOf("Microsoft") != -1) {
	 _instance_.client = window[_ARCOT_CLIENT_NAME];
	    // May 13, 2008: when included a frame, the window may
	    // not correctely return the client, so use a document lookup instead
	 if (_instance_.client == null || _instance_.client == undefined) {
	    _instance_.client = document.getElementById(_ARCOT_CLIENT_NAME);
	 }
   } else {
     _instance_.client = window.document[_ARCOT_CLIENT_NAME];
   }

	if (_instance_.clientReadyCallback != null) {
		_instance_.clientReadyCallback();	
	}
}

function arcotClientError(msg) {
  if (navigator.appName.indexOf("Microsoft") != -1) {
	 _instance_.client = window[_ARCOT_CLIENT_NAME];
	 if (_instance_.client == null || _instance_.client == undefined) {
	    _instance_.client = document.getElementById(_ARCOT_CLIENT_NAME);
	 }
   } else {
	_instance_.client = window.document[_ARCOT_CLIENT_NAME];
   }
   if (_instance_.clientErrorCallback != null) {
	_instance_.clientErrorCallback(msg);	
  }
}


// Browser detect courtesy of http://www.quirksmode.org/js/detect.html
var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},

		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari"
		},
		{
			prop: window.opera,
			identity: "Opera"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};

/*
 * Copyright (c)  2009 Sun Microsystems, Inc.  All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 *   - Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 *
 *   - Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 *
 *   - Neither the name of Sun Microsystems nor the names of its
 *     contributors may be used to endorse or promote products derived
 *     from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/*
 * deployJava.js
 *
 * This file is part of the Deployment Toolkit.  It provides functions for web
 * pages to detect the presence of a JRE, install the latest JRE, and easily run
 * applets or Web Start programs.  More Information on usage of the 
 * Deployment Toolkit can be found in the Deployment Guide at:
 * http://java.sun.com/javase/6/docs/technotes/guides/jweb/index.html
 * 
 * The "live" copy of this file may be found at :
 * http://java.com/js/deployJava.js.  
 * For web pages provisioned using https, you may want to access the copy at:
 * https://java.com/js/deployJava.js.
 *
 * You are encouraged to link directly to the live copies. 
 * The above files are stripped of comments and whitespace for performance,
 * You can access this file w/o the whitespace and comments removed at:
 * http://java.com/js/deployJava.txt.
 *
 * @(#)deployJava.txt	1.6 09/11/17
 */

var deployJava = {
    debug: null,

    firefoxJavaVersion: null,

    myInterval: null,
    preInstallJREList: null,
    returnPage: null,
    brand: null,
    locale: null,
    installType: null,
    
    EAInstallEnabled: false,
    EarlyAccessURL: null,
    
    // GetJava page
    getJavaURL: 'http://java.sun.com/webapps/getjava/BrowserRedirect?host=java.com',
    
    // Apple redirect page
    appleRedirectPage: 'http://www.apple.com/support/downloads/',

    // mime-type of the DeployToolkit plugin object
    oldMimeType: 'application/npruntime-scriptable-plugin;DeploymentToolkit',
    mimeType: 'application/java-deployment-toolkit',

    // location of the Java Web Start launch button graphic
    launchButtonPNG: 'http://java.sun.com/products/jfc/tsc/articles/swing2d/webstart.png',

    browserName: null,
    browserName2: null,


    /**
     * Returns an array of currently-installed JRE version strings.  
     * Version strings are of the form #.#[.#[_#]], with the function returning
     * as much version information as it can determine, from just family 
     * versions ("1.4.2", "1.5") through the full version ("1.5.0_06").
     *
     * Detection is done on a best-effort basis.  Under some circumstances 
     * only the highest installed JRE version will be detected, and 
     * JREs older than 1.4.2 will not always be detected.
     */
    getJREs: function() {
            var browser = deployJava.getBrowser();
            var list = new Array();

            if (browser == 'MSIE') {
                if (deployJava.testUsingActiveX('1.7.0')) {
                    list[0] = '1.7.0';
                } else if (deployJava.testUsingActiveX('1.6.0')) {
                    list[0] = '1.6.0';
                } else if (deployJava.testUsingActiveX('1.5.0')) {
                    list[0] = '1.5.0';
                } else if (deployJava.testUsingActiveX('1.4.2')) {
                    list[0] = '1.4.2';
                } 
            } else if (browser == "Chrome") {
                if (deployJava.testUsingMimeTypes('1.7.0')) {
                    list[0] = '1.7.0';
                } else if (deployJava.testUsingMimeTypes('1.6.0')) {
                    list[0] = '1.6.0';
                } else if (deployJava.testUsingMimeTypes('1.5.0')) {
                    list[0] = '1.5.0';
                } else if (deployJava.testUsingMimeTypes('1.4.2')) {
                    list[0] = '1.4.2';
                } 
            }
        return list;
    },
    testUsingActiveX: function(version) {
        var objectName = 'JavaWebStart.isInstalled.' + version + '.0';
    
        if (!ActiveXObject) {
            if (deployJava.debug) {
              //alert ('Browser claims to be IE, but no ActiveXObject object?');
            }
            return false;
        }
    
        try {
            return (new ActiveXObject(objectName) != null);
        } catch (exception) {
            return false;
        }
    },
    testUsingMimeTypes: function(version) {
        if (!navigator.mimeTypes) {
            if (deployJava.debug) {
                //alert ('Browser claims to be Netscape family, but no mimeTypes[] array?');
            }
            return false;
        }
    
        for (var i = 0; i < navigator.mimeTypes.length; ++i) {
            s = navigator.mimeTypes[i].type;
            var m = s.match(/^application\/x-java-applet\x3Bversion=(1\.8|1\.7|1\.6|1\.5|1\.4\.2)$/);
            if (m != null) {
                if (deployJava.compareVersions(m[1], version)) {
                    return true;   
                }
            }
        }
        return false;
    },

    getBrowser: function() {

        if (deployJava.browserName == null) {
            var browser = navigator.userAgent.toLowerCase();
    
            if (deployJava.debug) {
                //alert('userAgent -> ' + browser);
            }

            // order is important here.  Safari userAgent contains mozilla,
            // and Chrome userAgent contains both mozilla and safari.
            if (browser.indexOf('msie') != -1) {
                deployJava.browserName = 'MSIE';
                deployJava.browserName2 = 'MSIE';
            } else if (browser.indexOf('firefox') != -1) {
                deployJava.browserName = 'Netscape Family';
                deployJava.browserName2 = 'Firefox';
            } else if (browser.indexOf('chrome') != -1) {
                deployJava.browserName = 'Netscape Family';
                deployJava.browserName2 = 'Chrome';
            } else if (browser.indexOf('safari') != -1) {
                deployJava.browserName = 'Netscape Family';
                deployJava.browserName2 = 'Safari';
            } else if (browser.indexOf('mozilla') != -1) {
                deployJava.browserName = 'Netscape Family';
                deployJava.browserName2 = 'Other';
            } else if (browser.indexOf('opera') != -1) {
                deployJava.browserName = 'Netscape Family';
                deployJava.browserName2 = 'Opera';
            } else {
                deployJava.browserName = '?';
                deployJava.browserName2 = 'unknown';
            }

            if (deployJava.debug) {
                //alert ('Detected browser name:'+ deployJava.browserName + ', ' + deployJava.browserName2);
            }
        }
        return deployJava.browserName;
    },
    isJavaInstalledOnIE: function() {
    	var ret = false;
    	var jreList = deployJava.getJREs();
    	if (jreList.length > 0) ret = true;
    	//alert("isJavaInstalledOnIE returns:"+ret);
    	return ret;
    },
    
    isJavaInstalledOnChrome: function() {
    	var ret = false;
    	var jreList = deployJava.getJREs();
    	if (jreList.length > 0) ret = true;
    	//alert("isJavaInstalledOnChrome returns:"+ret);
    	return ret;

    }

};

BrowserDetect.init();
