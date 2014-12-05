(function(window, document, undefined){

  function smallQuery(selector, context){
    var obj = [], x, elements, i;
    
    if(!selector){
      Object.assign(obj, smallQuery.fn);
      return obj;
    }
    
    // case (selector, [context])
    if(selector.substring){
      obj.selector = selector;
      obj[0] = document.getElementById(selector.substring(1));
      
      // case (#id)
      if(obj[0] && obj[0].nodeType){
        return obj;
        
      // case (selector, context)
      } else if(selector && context){
        return smallQuery(context).find(selector);
        
      // case (selector)
      } else {
        
        elements = document.getElementsByTagName(selector);
      
        // case (.class[.anotherclass])
        if((/^\.[a-zA-Z\_\-0-9\.]*$/).test(selector)){
          elements = document.getElementsByClassName(selector.replace(".", " ").trim());
          x = elements.length;
          for(i=0;i<x;i++){
            obj[i] = elements[i];
          }
        // case (tagname)
        } else if(elements && elements.length){
          
        }
        
        
      }
    } else if(selector.nodeType){
      obj[0] = selector;
      
    }
    
    Object.assign(obj, smallQuery.fn);
    return obj;
  }
  smallQuery.fn = {
  
  };
}(window, document))
