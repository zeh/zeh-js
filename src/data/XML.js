(function(){
	"use strict";

	// ================================================================================================================
	// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

	window.XML = function(__documentDOM) {
		// Properties

		this.documentDOM = __documentDOM;
	};

	XML.prototype = {};
	XML.prototype.constructor = XML;


	// ================================================================================================================
	// STATIC INTERFACE -----------------------------------------------------------------------------------------------

	// Constants

	XML.VALUES_BOOLEAN = ["1", "true", "yes", "y"];

	// ================================================================================================================
	// INTERNAL INTERFACE ---------------------------------------------------------------------------------------------



	// ================================================================================================================
	// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

	XML.prototype.hasChild = function(__name) {
		// Returns true if a child of a given name exists (or true if any node exists, if name is not given)
		var i;
		for (i = 0; i < this.documentDOM.childNodes.length; i++) {
			if (__name == undefined || this.documentDOM.childNodes[i].nodeName == __name) return true;
		}
		return false;
	};

	XML.prototype.getChild = function(__name) {
		// Returns one child node of a given name (or first node if name is not given)
		var filteredChildren = this.getChildren(__name, 1);

		if (filteredChildren.length == 0) {
			console.error("Error: trying to read a children named [" + __name + "] that doesn't exist");
			return null;
		}
		return filteredChildren[0];
	};

	XML.prototype.getChildren = function(__name, __maximumResults) {
		// Returns all child nodes of a given name (or all nodes if name is not given)
		var children = [];
		var i;
		for (i = 0; i < this.documentDOM.childNodes.length; i++) {
			if (!isNaN(__maximumResults) && children.length == __maximumResults) {
				// If the limit has been reached, stop adding
				break;
			}

			if (__name == undefined || this.documentDOM.childNodes[i].nodeName == __name) {
				// Will add this
				children.push(new XML(this.documentDOM.childNodes[i]));
			}
		}

		return children;
	};


	// TODO: this is too Java-style - use real getters/setters?
	XML.prototype.getNodeName = function() {
		return this.documentDOM.nodeName;
	};

	XML.prototype.getChildAsText = function(__name, __default) {
		var nodes = this.getChildren(__name, 1);
		return nodes.length == 0 ? __default : nodes[0].getText();
	};

	XML.prototype.getText = function() {
	//	if (isTextNode) {
	//		// It's a normal text node, just respond with the text
			if (this.documentDOM.textContent != undefined) {
				// All browsers?
				return this.documentDOM.textContent;
			} else if (this.documentDOM.innerText != undefined) {
				// Some IE?
				return this.documentDOM.innerText;
			} else {
				// IE 9?
				return this.documentDOM.text;
			}

	//	} else {
	//		// It's a complex node, concatenates everything!
	//		String txt = "";
	//		for (int i = 0; i < children.size(); i++) {
	//			txt += children.get(i).getTextSource();
	//		}
	//		return txt.intern();
	//	}
	};

	XML.prototype.getAttributes = function() {
		// Returns all attributes
		var attributes = [];
		var i;
		for (i = 0; i < this.documentDOM.attributes.length; i++) {
			attributes.push(new XMLAttribute(this.documentDOM.attributes[i].nodeName, this.documentDOM.attributes[i].value));
		}
	};

	XML.prototype.getAttribute = function(__name, __default) {
		// Returns all attributes
		var attributes = [];
		var i;
		for (i = 0; i < this.documentDOM.attributes.length; i++) {
			if (this.documentDOM.attributes[i].nodeName == __name) {
				return new XMLAttribute(this.documentDOM.attributes[i].nodeName, this.documentDOM.attributes[i].value);
			}
		}

		if (__default != undefined) {
			return new XMLAttribute(__name, __default);
		} else {
			console.error("Error: trying to read an attribute named [" + __name + "] that doesn't exist; pass a default value instead!");
			return null;
		}
	};

	XML.prototype.getAttributeAsText = function(__name, __default) {
		var attribute = this.getAttribute(__name, __default);
		return attribute == null ? __default : attribute.getText();
	};

	XML.prototype.getAttributeAsBoolean = function(__name, __default) {
		var attribute = this.getAttribute(__name, "");
		if (attribute == null) return __default;
		return XML.VALUES_BOOLEAN.indexOf(attribute.getText().toLowerCase()) > -1;
	};

	XML.prototype.getAttributeAsInteger = function(__name, __default) {
		return parseInt(this.getAttributeAsText(__name, __default));
	};

	/*

	public class XML {

		// Constants
		public static final String VALUE_BOOLEAN_TRUE = "true";
		public static final String VALUE_BOOLEAN_FALSE = "false";

		// Properties
		private String nodeName;
		private String text;
		private String namespace;

		private boolean isTextNode;

		private ArrayList<XML> children;
		private ArrayList<XMLAttribute> attributes;

		// ================================================================================================================
		// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

		public XML() {
			this("", "", "");
		}

		// ================================================================================================================
		// INTERNAL INTERFACE ---------------------------------------------------------------------------------------------

		protected void addTextChild(String __text) {
			// Add a new text node
			XML xml = new XML();
			xml.setText(__text);
			children.add(xml);
		}

		// ================================================================================================================
		// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

		public XML getChild(String __name, String __defaultText) {
			// Return the first children of a given name
			return getChild(__name, new XML(__name, __defaultText));
		}

		public XML getChild(String __name, XML __defaultXML) {
			// Return the first children of a given name
			ArrayList<XML> filteredChildren = getChildren(__name, 1);

			if (filteredChildren.size() == 0) return __defaultXML;

			return filteredChildren.get(0);
		}

		public void addChild(XML __xml) {
			if (isTextNode) {
				// It's a simple node; need to switch to a complex node
				if (text.length() > 0) {
					// Already has text

					// Create a simple node to hold it
					addTextChild(text);

					// Reset the text
					text = "";
				}
				isTextNode = false;
			}
			children.add(__xml);
		}

		public void addAttribute(XMLAttribute __attribute) {
			attributes.add(__attribute);
			//Log.v("XML", "  attribute :: " + __attribute.getName() + " = " + __attribute.getValue() + " =-----> " + attributes.size());
		}

		// ================================================================================================================
		// ACCESSOR INTERFACE ---------------------------------------------------------------------------------------------

		public String getText() {
			if (isTextNode) {
				// It's a normal text node, just respond with the text
				return text.intern();
			} else {
				// It's a complex node, concatenates everything!
				String txt = "";
				for (int i = 0; i < children.size(); i++) {
					txt += children.get(i).getTextSource();
				}
				return txt.intern();
			}
		}

		public boolean getTextAsBoolean() {
			return getText().equalsIgnoreCase(VALUE_BOOLEAN_TRUE);
		}

		public float getTextAsFloat() {
			return Float.parseFloat(getText());
		}

		public long getTextAsLong() {
			return getTextAsLong(10);
		}

		public long getTextAsLong(int __base) {
			return Long.parseLong(getText(), __base);
		}

		public int getTextAsInt() {
			return getTextAsInt(10);
		}

		public int getTextAsInt(int __base) {
			return Integer.parseInt(getText(), __base);
		}

		public void setText(String __text) {
			if (!isTextNode) {
				// It's a complex node, reset everything first!
				children = new ArrayList<XML>();
				isTextNode = true;
			}

			// It's a text node, just set the new text
			text = __text.intern();
		}

		public void appendText(String __text) {
			// Appends text accordingly.
			if (isTextNode) {
				// It's a text node, just concatenates
				text += __text.intern();
			} else {
				// It's a complex node, need to create a new text node
				addTextChild(__text.intern());
			}
		}

		public String getTextSource() {
			// Returns the whole XML source
			String txt = "";

			// Opening tag
			if (nodeName.length() > 0) {
				txt += "<" + nodeName;
				//Log.v("XML", "  concatenating :: " + attributes.size());
				//txt += " " + attributes.size();
				for (int i = 0; i < attributes.size(); i++) {
					//Log.v("XML", "	  --> " + attributes.get(i).getName());
					txt += " " + attributes.get(i).getName() + "=\"" + attributes.get(i).getText() + "\"";
				}
				txt += ">";
			}

			// Content
			txt += getText();

			// Closing tag
			if (nodeName.length() > 0) {
				txt += "</" + nodeName + ">";
			}

			return txt;


		}

		public boolean getIsTextNode() {
			// Returns whether this is a simple, text node, or a complex node with children
			return isTextNode;
		}

	}

	*/


	// ================================================================================================================
	// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

	window.XMLAttribute = function(__name, __text) {
		// Properties

		this.name = __name;
		this.text = __text;
	};

	XMLAttribute.prototype = {};
	XMLAttribute.prototype.constructor = XMLAttribute;


	// ================================================================================================================
	// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

	XMLAttribute.prototype.getName = function() {
		return this.name;
	};

	XMLAttribute.prototype.getText = function() {
		return this.text;
	};

	/*
	package com.zehfernando.data.xml;

	public class XMLAttribute {

		// Properties
		private String name;
		private String text;

		// ================================================================================================================
		// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

		public XMLAttribute() {
			this ("", "");
		}

		public XMLAttribute(String __name, String __value) {
			name = __name.intern();
			text = __value.intern();
		}

		// ================================================================================================================
		// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

		public String getName() {
			return name;
		}

		public void setName(String __name) {
			name = __name.intern();
		}

		public String getText() {
			return text;
		}

		public boolean getTextAsBoolean() {
			return getText().equalsIgnoreCase(XML.VALUE_BOOLEAN_TRUE);
		}

		public float getTextAsFloat() {
			return Float.parseFloat(getText());
		}

		public long getTextAsLong() {
			return getTextAsLong(10);
		}

		public long getTextAsLong(int __base) {
			return Long.parseLong(getText(), __base);
		}

		public int getTextAsInt() {
			return getTextAsInt(10);
		}

		public int getTextAsInt(int __base) {
			return Integer.parseInt(getText(), __base);
		}

		public void setText(String __value) {
			text = __value.intern();
		}
	}
	*/

})();
