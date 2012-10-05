(function(){
	"use strict";

	// TextLoader (for XMLs, TXTs, JSONs, etc)

	// ================================================================================================================
	// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

	window.TextLoader = function() {
		// Properties

		this.bytesLoaded = 0;
		this.bytesTotal = 0;

		this.isLoading = false;
		this.isLoaded = false;

		this.URL = "";
		this.data = "";
		this.dataXML = "";
		//this.dataFormat

		this.fileRequest = null;

		this.onComplete = new SimpleSignal();

		// TODO: add other events and proper error responses

		//complete			Dispatched after all the received data is decoded and placed in the data property of the URLLoader object.	URLLoader
		//httpResponseStatus	Dispatched if a call to the load() method attempts to access data over HTTP, and Adobe AIR is able to detect and return the status code for the request.	URLLoader
		//httpStatus			Dispatched if a call to URLLoader.load() attempts to access data over HTTP.	URLLoader
		//ioError			Dispatched if a call to URLLoader.load() results in a fatal error that terminates the download.	URLLoader
		//open				Dispatched when the download operation commences following a call to the URLLoader.load() method.	URLLoader
		//progress			Dispatched when data is received as the download operation progresses.	URLLoader
		//securityError		Dispatched if a call to URLLoader.load() attempts to load data from a server outside the security sandbox.

		// .status
		// .statusText
	};

	TextLoader.prototype = {};
	TextLoader.prototype.constructor = TextLoader;


	// ================================================================================================================
	// STATIC INTERFACE -----------------------------------------------------------------------------------------------

	// Constants

	// Enums
	// http://msdn.microsoft.com/en-us/library/ie/ms534361(v=vs.85).aspx
	TextLoader.READYSTATE_UNINITIALIZED = 0;		// The object has been created, but not initialized (the open method has not been called).
	TextLoader.READYSTATE_LOADING = 1;				// A request has been opened, but the send method has not been called.
	TextLoader.READYSTATE_LOADED = 2;				// The send method has been called. No data is available yet.
	TextLoader.READYSTATE_INTERACTIVE = 3;			// Some data has been received; however, neither responseText nor responseBody is available.
	TextLoader.READYSTATE_COMPLETE = 4;				// All the data has been received.


	// ================================================================================================================
	// INTERNAL INTERFACE ---------------------------------------------------------------------------------------------

	TextLoader.prototype.getNewFileRequest = function() {
	// Shim from http://en.wikipedia.org/wiki/XMLHttpRequest
		if (typeof XMLHttpRequest == "undefined") {
			XMLHttpRequest = function () {
				try {
					return new ActiveXObject("Msxml2.XMLHTTP.6.0");
				} catch (e) { }
				try {
					return new ActiveXObject("Msxml2.XMLHTTP.3.0");
				} catch (e) {}
				try {
					return new ActiveXObject("Microsoft.XMLHTTP");
				} catch (e) {}
				throw new Error("This browser does not support XMLHttpRequest.");
			};
		}

		return new XMLHttpRequest();
	};


	// ================================================================================================================
	// EVENT INTERFACE ------------------------------------------------------------------------------------------------

	TextLoader.prototype.onFileRequestStateChanged = function(__event) {
		switch(this.fileRequest.readyState) {
			case TextLoader.READYSTATE_UNINITIALIZED:
				break;
			case TextLoader.READYSTATE_LOADING:
				break;
			case TextLoader.READYSTATE_LOADED:
				break;
			case TextLoader.READYSTATE_INTERACTIVE:
				break;
			case TextLoader.READYSTATE_COMPLETE:
				this.isLoading = false;
				this.isLoaded = true;
				this.data = this.fileRequest.responseText;
				this.dataXML = this.fileRequest.responseXML;
				this.fileRequest = null;
				this.onComplete.dispatch();
				break;
		}
		//if (syndLinkRequest.readyState != 4) {}
		//return;

		//var result = xmlHttp.responseText;
	};


	// ================================================================================================================
	// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

	TextLoader.prototype.load = function(__url) {
		this.close();

		this.fileRequest = this.getNewFileRequest();
		this.fileRequest.open("GET", __url, true);
		if (this.onFileRequestStateChanged.bind) {
			this.fileRequest.onreadystatechange = this.onFileRequestStateChanged.bind(this);
		} else {
			// No bind supported
			var __obj = this;
			this.fileRequest.onreadystatechange = function(e) { __obj.onFileRequestStateChanged.call(__obj, e); };
		}
		// xmlhttp.setRequestHeader("Method", "POST "+sURL+" HTTP/1.1");
		this.fileRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		this.fileRequest.send(null); // use querystrings here for post
		this.isLoading = true;
		this.isLoaded = false;
	};

	TextLoader.prototype.close = function() {
		if (this.isLoading) {
			this.isLoading = false;

			this.fileRequest.abort();
			this.fileRequest = null;
		}
	};

})();
