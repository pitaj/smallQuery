# Proprietary methods

These methods of SQ objects are not available within jQuery. Polyfills in the form of jQuery plugins are provided to fill in functionality when using jQuery.

## #outer
Like `#html`, but for `Element#outerHTML` instead of `Element#innerHTML`

### Polyfill
*Use this plugin in order to use `#outer` in jQuery environments*

```js

(function($, window, document){

  var getOuterHTML, setOuterHTML;

  if(!( "outerHTML" in document.createElement("span") )){
  (function(){

    var container = document.createElementNS("http://www.w3.org/1999/xhtml", "_"),
  	  xml_serializer = new XMLSerializer();
  	getOuterHTML = function (elem) {
  		var html;
  		if (document.xmlVersion) {
  			return xml_serializer.serializeToString(elem);
  		} else {
  			container.appendChild(elem.cloneNode(false));
  			html = container.innerHTML.replace("><", ">" + elem.innerHTML + "<");
  			container.innerHTML = "";
  			return html;
  		}
  	}
  	setOuterHTML = function (elem, html) {
  		var parent = elem.parentNode;
  		var child;

  		if (parent === null) {
  			DOMException.code = DOMException.NOT_FOUND_ERR;
  			throw DOMException;
  		}
  		container.innerHTML = html;
  		while ((child = container.firstChild)) {
  			parent.insertBefore(child, elem);
  		}
  		parent.removeChild(elem);
  	}

  })();
  } else {
    getOuterHTML = function(elem){
      return elem.outerHTML;
    };
    setOuterHTML = function(elem, html){
      elem.outerHTML = html;
    };
  }

  $.fn.outer = function(html){
    if(!html){
      return getOuterHTML(this[0]);
    }
    if(html.toString() === html){
      this.each(function(index, elem){
        setOuterHTML(elem, html);
      });
    } else {
      this.each(function(index, elem){
        setOuterHTML(elem, html(getOuterHTML(elem), elem));
      });
    }
    return this;
  };
})(jQuery, window, document);
```
