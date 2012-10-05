(function(){
	"use strict";

	// System information

	// This is kinda based on this:
	// http://www.quirksmode.org/js/detect.html
	// But more flexible and with rules redone and up-to-date


	// ================================================================================================================
	// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

	window.SystemUtils = function() {
		// No constructor
	};

	SystemUtils.prototype = {};
	SystemUtils.prototype.constructor = SystemUtils;

	// ================================================================================================================
	// STATIC INTERFACE -----------------------------------------------------------------------------------------------

	// Constants
	SystemUtils.BROWSER_CHROME = "chrome";
	SystemUtils.BROWSER_MSIE = "ie";
	SystemUtils.BROWSER_FIREFOX = "firefox";
	SystemUtils.BROWSER_OPERA = "opera";
	SystemUtils.BROWSER_SAFARI = "safari";

	SystemUtils.BROWSER_ANDROID_WEBKIT = "android-webkit";
	SystemUtils.BROWSER_DOLPHIN = "dolphin";
	SystemUtils.BROWSER_OTHER = "other";

	SystemUtils.PLATFORM_DESKTOP = "desktop";
	SystemUtils.PLATFORM_MOBILE_SMALL = "mobile-small";
	SystemUtils.PLATFORM_MOBILE_LARGE = "mobile-large";
	SystemUtils.PLATFORM_OTHER = "other";

	SystemUtils.OS_WINDOWS = "windows";
	SystemUtils.OS_OSX = "osx";
	SystemUtils.OS_LINUX = "linux";
	SystemUtils.OS_CHROME = "chrome-os";
	SystemUtils.OS_IOS = "ios";
	SystemUtils.OS_ANDROID = "android";
	SystemUtils.OS_WINDOWS_MOBILE = "windows-mobile";
	SystemUtils.OS_OTHER = "other";

	SystemUtils.DEVICE_OTHER = "other";

	SystemUtils.browserInfo = null;

	// Must satisfy ALL .contains and .doesNotContain rules to pass it
	SystemUtils.data = {
		browser:
		[
			/* Desktop browsers */
			{
				id: SystemUtils.BROWSER_CHROME,
				rules: {
					contains: {string:"Chrome", inside:"userAgent"}
				},
				version: {after:"Chrome", inside:"userAgent"}
			},
			{
				id: SystemUtils.BROWSER_MSIE,
				rules: {
					contains: {string:"MSIE", inside:"userAgent"},
					doesNotContain: {string:"IEMobile", inside:"userAgent"}
				},
				version: {after:"MSIE", inside:"userAgent"}
			},
			{
				id: SystemUtils.BROWSER_FIREFOX,
				rules: {
					contains: {string:"Firefox", inside:"userAgent"},
					doesNotContain: {string:"Opera", inside:"userAgent"}
				},
				version: {after:"Firefox", inside:"userAgent"}
			},
			{
				id: SystemUtils.BROWSER_OPERA,
				rules: {
					contains: {string:"Opera", inside:"userAgent"}
				},
				version: {after:"Version/", inside:"userAgent"}
			},
			{
				id: SystemUtils.BROWSER_SAFARI,
				rules: {
					contains: {string:"AppleWebKit", inside:"userAgent"},
					doesNotContain: [{string:"Android", inside:"userAgent"}, {string:"Mobile", inside:"userAgent"}]
				},
				version: {after:"Version/", inside:"userAgent"}
			},

			/* Mobile browsers */
			{
				id: SystemUtils.BROWSER_ANDROID_WEBKIT,
				rules: {
					contains: {string:"Android", inside:"userAgent"},
					doesNotContain: {string:"Chrome", inside:"userAgent"}
				},
				version: {after:"Android", inside:"userAgent"}
			},
			{
				id: SystemUtils.BROWSER_DOLPHIN,
				rules: {
					contains: {string:"Dolfin", inside:"userAgent"}
				},
				version: {after:"Dolfin/", inside:"userAgent"}
			},
			{
				id: SystemUtils.BROWSER_SAFARI,
				rules: {
					contains: {string:"iPad", inside:"userAgent"},
					doesNotContain: {string:"CriOS", inside:"userAgent"}
				},
				version: {after:"Version", inside:"userAgent"}
			},
			{
				id: SystemUtils.BROWSER_SAFARI,
				rules: {
					contains: {string:"iPhone", inside:"userAgent"},
					doesNotContain: {string:"CriOS", inside:"userAgent"}
				},
				version: {after:"Version", inside:"userAgent"}
			},
			{
				id: SystemUtils.BROWSER_SAFARI,
				rules: {
					contains: {string:"iPod", inside:"userAgent"},
					doesNotContain: {string:"CriOS", inside:"userAgent"}
				},
				version: {after:"Version", inside:"userAgent"}
			},
			{
				id: SystemUtils.BROWSER_CHROME,
				rules: {
					contains: {string:"CriOS", inside:"userAgent"}
				},
				version: {after:"CriOS", inside:"userAgent"}
			},
			{
				id: SystemUtils.BROWSER_MSIE,
				rules: {
					contains: {string:"IEMobile", inside:"userAgent"}
				},
				version: {after:"IEMobile", inside:"userAgent"}
			}

			/*
			{
				string: "userAgent",
				subString: "OmniWeb",
				versionSearch: "OmniWeb/",
				identity: "OmniWeb"
			},


			{
				string: "vendor",
				subString: "iCab",
				identity: "iCab"
			},
			{
				string: "vendor",
				subString: "KDE",
				identity: "Konqueror"
			},
			{
				string: "vendor",
				subString: "Camino",
				identity: "Camino"
			},
			{		// for newer Netscapes (6+)
				string: "userAgent",
				subString: "Netscape",
				identity: "Netscape"
			},

			{
				string: "userAgent",
				subString: "Gecko",
				identity: "Mozilla",
				versionSearch: "rv"
			},
			{ 		// for older Netscapes (4-)
				string: "userAgent",
				subString: "Mozilla",
				identity: "Netscape",
				versionSearch: "Mozilla"
			}
			*/
		],
		OS:
		[
			/* Desktop OSs */
			{
				id: SystemUtils.OS_WINDOWS,
				rules: {
					contains: {string:"Windows NT", inside:"userAgent"}
				},
				version: {after:"Windows NT", inside:"userAgent"},
				setPlatform: SystemUtils.PLATFORM_DESKTOP,
				setIsTouchDevice: false
			},
			{
				id: SystemUtils.OS_OSX,
				rules: {
					contains: {string:"Mac OS X", inside:"userAgent"},
					doesNotContain: [{string:"iPod", inside:"userAgent"},{string:"iPhone", inside:"userAgent"},{string:"iPad", inside:"userAgent"}]
				},
				version: {after:"Mac OS X", inside:"userAgent"},
				setPlatform: SystemUtils.PLATFORM_DESKTOP,
				setIsTouchDevice: false
			},
			{
				id: SystemUtils.OS_LINUX,
				rules: {
					contains: {string:"Linux", inside:"userAgent"},
					doesNotContain: {string:"Android", inside:"userAgent"}
				},
				version: {after:"rv:", inside:"userAgent"},
				setPlatform: SystemUtils.PLATFORM_DESKTOP,
				setIsTouchDevice: false
			},
			{
				id: SystemUtils.OS_CHROME,
				rules: {
					contains: {string:"CrOS", inside:"userAgent"}
				},
				version: {after:"CrOS i686", inside:"userAgent"},
				setPlatform: SystemUtils.PLATFORM_DESKTOP,
				setIsTouchDevice: false
			},

			/* Mobile OSs */
			{
				id: SystemUtils.OS_ANDROID,
				rules: {
					contains: [{string:"Android", inside:"userAgent"},{string:"Mobile", inside:"userAgent"}],
					doesNotContain: {string:"Firefox", inside:"userAgent"}
				},
				version: {after:"Android", inside:"userAgent"},
				setPlatform: SystemUtils.PLATFORM_MOBILE_SMALL,
				setIsTouchDevice: true
			},
			{
				/* Firefox for Android, phone form factor */
				id: SystemUtils.OS_ANDROID,
				rules: {
					contains: [{string:"Android", inside:"userAgent"},{string:"Mobile", inside:"userAgent"},{string:"Firefox", inside:"userAgent"}]
				},
				version: {after:"Android", inside:"userAgent"},
				setPlatform: SystemUtils.PLATFORM_MOBILE_SMALL,
				setIsTouchDevice: true
			},
			{
				/* Firefox for Android, tablet form factor */
				id: SystemUtils.OS_ANDROID,
				rules: {
					contains: [{string:"Android", inside:"userAgent"},{string:"Tablet", inside:"userAgent"},{string:"Firefox", inside:"userAgent"}]
				},
				version: {after:"Android", inside:"userAgent"},
				setPlatform: SystemUtils.PLATFORM_MOBILE_LARGE,
				setIsTouchDevice: true
			},
			{
				id: SystemUtils.OS_ANDROID,
				rules: {
					contains: {string:"Android", inside:"userAgent"},
					doesNotContain: {string:"Mobile", inside:"userAgent"}
				},
				version: {after:"Android", inside:"userAgent"},
				setPlatform: SystemUtils.PLATFORM_MOBILE_LARGE,
				setIsTouchDevice: true
			},
			{
				id: SystemUtils.OS_IOS,
				rules: {
					contains: {string:"iPhone", inside:"userAgent"}
				},
				version: {after:"iPhone OS", inside:"userAgent"},
				setPlatform: SystemUtils.PLATFORM_MOBILE_SMALL,
				setIsTouchDevice: true
			},
			{
				id: SystemUtils.OS_IOS,
				rules: {
					contains: {string:"iPod", inside:"userAgent"}
				},
				version: {after:"iPhone OS", inside:"userAgent"},
				setPlatform: SystemUtils.PLATFORM_MOBILE_SMALL,
				setIsTouchDevice: true
			},
			{
				id: SystemUtils.OS_IOS,
				rules: {
					contains: {string:"iPad", inside:"userAgent"}
				},
				version: {after:"CPU OS", inside:"userAgent"},
				setPlatform: SystemUtils.PLATFORM_MOBILE_LARGE,
				setIsTouchDevice: true
			},
			{
				id: SystemUtils.OS_WINDOWS_MOBILE,
				rules: {
					contains: {string:"Windows Phone OS", inside:"userAgent"}
				},
				version: {after:"Windows Phone OS", inside:"userAgent"},
				setPlatform: SystemUtils.PLATFORM_MOBILE_SMALL,
				setIsTouchDevice: true
			},
			{
				id: SystemUtils.OS_WINDOWS_MOBILE,
				rules: {
					contains: {string:"Windows CE", inside:"userAgent"}
				},
				setVersion: "CE",
				setPlatform: SystemUtils.PLATFORM_MOBILE_SMALL,
				setIsTouchDevice: true
			},
			{
				id: SystemUtils.OS_OTHER,
				rules: {
					contains: {string:"Dolfin", inside:"userAgent"}
				},
				setVersion: "",
				setPlatform: SystemUtils.PLATFORM_MOBILE_SMALL,
				setIsTouchDevice: true
			}
		],
		device:
		[
			/* Safari iOS */
			{
				id: "ipad",
				rules: {
					contains: {string:"iPad", inside:"userAgent"}
				},
				setVersion: ""
			},
			{
				id: "ipod-touch",
				rules: {
					contains: {string:"iPod", inside:"userAgent"}
				},
				setVersion: ""
			},
			{
				id: "iphone",
				rules: {
					contains: {string:"iPhone", inside:"userAgent"}
				},
				setVersion: ""
			}
		]
	};

	SystemUtils.getAbbreviatedVersion = function(__version) {
		// Based on a full version number, get the abbreviated version number
		if (__version == "") return "";
		var vnum = parseInt(__version);
		return isNaN(vnum) ? __version : vnum;
	};

	SystemUtils.readBrowserInfo = function(__injectedData) {
		this.browserInfo = {};

		var navigatorData = __injectedData || navigator;

		// Browser
		var browserVer = this.searchString(navigatorData, this.data.browser);
		if (browserVer) {
			this.browserInfo.browser = browserVer.id;
			this.browserInfo.browserVersionFull = this.searchVersion(navigatorData, browserVer);
			this.browserInfo.browserVersion = this.getAbbreviatedVersion(this.browserInfo.browserVersionFull);
		} else {
			this.browserInfo.browser = SystemUtils.BROWSER_OTHER;
			this.browserInfo.browserVersionFull = "";
			this.browserInfo.browserVersion = "";
		}

		// OS
		var OSVer = this.searchString(navigatorData, this.data.OS);
		if (OSVer) {
			this.browserInfo.OS = OSVer.id;
			this.browserInfo.OSVersionFull = this.searchVersion(navigatorData, OSVer);
			this.browserInfo.OSVersion = this.getAbbreviatedVersion(this.browserInfo.OSVersionFull);
			this.browserInfo.platform = OSVer.setPlatform;
			this.browserInfo.isTouchDevice = OSVer.setIsTouchDevice;
		} else {
			this.browserInfo.OS = SystemUtils.OS_OTHER;
			this.browserInfo.OSVersionFull = "";
			this.browserInfo.OSVersion = "";
			this.browserInfo.platform = SystemUtils.PLATFORM_OTHER;
			this.browserInfo.isTouchDevice = false;
		}

		// Device
		var deviceVer = this.searchString(navigatorData, this.data.device);
		if (deviceVer) {
			this.browserInfo.device = deviceVer.id;
			this.browserInfo.deviceVersionFull = this.searchVersion(navigatorData, deviceVer);
			this.browserInfo.deviceVersion = this.getAbbreviatedVersion(this.browserInfo.deviceVersionFull);
		} else {
			this.browserInfo.device = SystemUtils.DEVICE_OTHER;
			this.browserInfo.deviceVersionFull = "";
			this.browserInfo.deviceVersion = "";
		}

		// Language
		if (navigatorData.userLanguage != undefined) {
			// IE, Opera 12.02
			this.browserInfo.language = navigatorData.userLanguage;
		} else if (navigatorData.systemLanguage != undefined) {
			// IE
			this.browserInfo.language = navigatorData.userLanguage;
		} else {
			// FF, Chrome
			this.browserInfo.language = navigatorData.language;
		}

		// For reporting
		this.browserInfo.navigatorData = navigatorData;
	};

	SystemUtils.searchString = function(__navigatorData, __searchData) {
		var i, j, k;
		var allRulesPass;
		var passedRule;
		var ruleParams;
		for (i = 0; i < __searchData.length; i++)	{
			var rules = __searchData[i].rules;
			allRulesPass = true;
			for (j in rules) {
				passedRule = true;
				ruleParams = rules[j] instanceof Array ? rules[j] : [rules[j]];
				if (j == "contains") {
					for (k = 0; k < ruleParams.length; k++) {
						if (__navigatorData[ruleParams[k].inside].indexOf(ruleParams[k].string) == -1) {
							passedRule = false;
							break;
						}
					}
				} else if (j == "doesNotContain") {
					for (k = 0; k < ruleParams.length; k++) {
						if (__navigatorData[ruleParams[k].inside].indexOf(ruleParams[k].string) > -1) {
							passedRule = false;
							break;
						}
					}
				}

				if (!passedRule) {
					allRulesPass = false;
					break;
				}
			}
			if (allRulesPass) {
				return __searchData[i];
			}
		}
		return null;
	};

	SystemUtils.searchVersion = function (__navigatorData, __nameData) {
		// Check if version is set statically
		if (__nameData.setVersion != undefined) return __nameData.setVersion;

		// Search for version using the "version" data
		var versionSearchString = __nameData.version.after;
		var searchString = __navigatorData[__nameData.version.inside];
		var pos = searchString.indexOf(versionSearchString);
		if (pos == -1) return "";
		var isVersionChar = true;
		var fullVersion = "";
		var hasStarted = false;
		var validChars = "0123456789._"; // Chars counted as the version
		var validCharsAfter = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"; // Additional chars that are valid AFTER it started
		var validCharsBefore = " /"; // Chars allowed only BEFORE it's a valid number
		var charReplacements = [["_", "."]]; // Chars replaced in version
		var tChar;
		pos += versionSearchString.length;
		while (isVersionChar && pos < searchString.length) {
			tChar = searchString.substr(pos, 1);
			if (!hasStarted) {
				// Not started yet
				if (validChars.indexOf(tChar) > -1) {
					// A valid char, start!
					hasStarted = true;
					fullVersion += tChar;
				} else if (validCharsBefore.indexOf(tChar) > -1) {
					// Valid char before starting
				} else {
					// Invalid char! end before having even started
					isVersionChar = false;
				}
			} else {
				// Has started
				if (validChars.indexOf(tChar) > -1 || validCharsAfter.indexOf(tChar) > -1) {
					// Found a valid char
					fullVersion += tChar;
				} else {
					// Invalid char! Ends!
					isVersionChar = false;
				}
			}
			pos++;
		}

		for (var i = 0; i < charReplacements.length; i++){
			fullVersion = fullVersion.split(charReplacements[i][0]).join(charReplacements[i][1]);
		}
		return fullVersion;
	};

	SystemUtils.getOS = function() {
		return this.browserInfo.OS;
	};

	SystemUtils.getOSVersion = function() {
		return this.browserInfo.OSVersion;
	};

	SystemUtils.getOSVersionFull = function() {
		return this.browserInfo.OSVersionFull;
	};

	SystemUtils.getBrowser = function() {
		return this.browserInfo.browser;
	};

	SystemUtils.getBrowserVersion = function() {
		return this.browserInfo.browserVersion;
	};

	SystemUtils.getBrowserVersionFull = function() {
		return this.browserInfo.browserVersionFull;
	};

	SystemUtils.getPlatform = function() {
		return this.browserInfo.platform;
	};

	SystemUtils.getDevice = function() {
		return this.browserInfo.device;
	};

	SystemUtils.getDeviceVersion = function() {
		return this.browserInfo.deviceVersion;
	};

	SystemUtils.getDeviceVersionFull = function() {
		return this.browserInfo.deviceVersionFull;
	};

	SystemUtils.isTouchDevice = function() {
		return this.browserInfo.isTouchDevice;
	};

	SystemUtils.hasTouchEvents = function() {
		// Returns false on Windows Mobile
		return ("ontouchstart" in window);
	};

	SystemUtils.readBrowserInfo();

	/*
	Mac OSX Macbook Air Laptop

	Browser: [firefox] Version [15] [15.0.1]
	OS: [windows] Version [10] [10.7]
	Platform: [desktop]
	Multi-touch: [false]
	*/

})();
