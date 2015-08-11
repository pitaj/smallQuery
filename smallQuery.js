(function(document, window, undefined){

let compat = window.$;

let SmallQuery = {
  // covers CSS queries
  query(selector, namespace){
    namespace = namespace || document;
    return SmallQuery.from(namespace.querySelectorAll(selector));
  },
  // creates a new SmallQuery object
  create(elem){
    return Object.create(SmallQuery.prototype, {
      '0': {
        value: elem
      },
      length: {
        value: 1
      }
    });
  },
  // creates a new SmallQuery object from an array-like object
  from(arr){
    let sq = SmallQuery.create();
    for(let i = 0, l = arr.length; i < l; i++){
      sq[i] = arr[i];
    }
    sq.length = arr.length;
    return sq;
  },
  // covers all of the above
  SQ(selector, namespace){
    if(selector){
      if(selector.toString() === selector){
        return SmallQuery.query(selector, namespace);
      }
      if(selector.length){
        return SmallQuery.from(selector);
      }
      try {
        document.contains(selector);
        return SmallQuery.create(selector);
      } catch(e){
        // not a node
      }
    }
    return SmallQuery.create(document);
  },
  compat(){
    window.$ = compat;
    return SmallQuery.SQ;
  }
};

let dataSymbol = new Symbol("SmallQuery DataStore");

function flatten(arrOfArrs){
  return Array.prototype.concat.apply([], arrOfArrs);
}

SmallQuery.prototype = {
  [Symbol.iterator]: Array.prototype[Symbol.iterator],

  // internal utility functions
  mmap(fn){
    let arr = Array.prototype.map.call(this, fn);
    if(arr[0].length && arr[0].toString() !== arr[0]){
      arr = flatten(arr);
    }
    return SmallQuery.from(arr);
  },
  forEach(fn){
    Array.prototype.forEach.call(this, fn);
    return this;
  },
  mfilter(fn){
    if(fn.toString() === fn){
      let selector = fn;
      fn = function(elem){
        return elem.matches(selector);
      };
    }
    return SmallQuery.from(Array.prototype.filter.call(this, fn));
  },

  // compat with jQuery
  each(fn){
    return this.forEach(function(elem, index){
      fn.call(elem, index, elem);
    });
  },
  map(fn){
    return this.mmap(function(elem, index){
      fn.call(elem, index, elem);
    });
  },
  filter(fn){
    if(fn.toString() === fn){
      return this.mfilter(fn);
    }
    return this.mfilter(function(elem, index){
      fn.call(elem, index, elem);
    });
  },

  // functions which don't fit below, mainly overloaded getters / setters
  html(str){
    if(str !== undefined){
      if(str.toString() === str){
        for(let elem of this){
          elem.innerHTML = str;
        }
      } else {
        for(let elem of this){
          elem.innerHTML = str(elem.innerHTML, elem);
        }
      }
      return this;
    }
    return this[0].innerHTML;
  },
  outer(str){
    if(str !== undefined){
      if(str.toString() === str){
        for(let elem of this){
          elem.outerHTML = str;
        }
      } else {
        for(let elem of this){
          elem.outerHTML = str(elem.outerHTML, elem);
        }
      }
      return this;
    }
    return this[0].outerHTML;
  },
  text(str){
    if(str !== undefined){
      if(str.toString() === str){
        for(let elem of this){
          elem.textContent = str;
        }
      } else {
        for(let elem of this){
          elem.textContent = str(elem.textContent, elem);
        }
      }
      return this;
    }
    return this[0].textContent;
  },
  prop(name, value){
    if(name && value !== undefined){
      for(let elem of this){
        elem[name] = value;
      }
      return this;
    }
    return this[0][name];
  },
  val(value){
    if(value !== undefined){
      for(let elem of this){
        elem.value = value;
      }
      return this;
    }
    return this[0].value;
  },
  css(name, value){
    if(name.toString() === name){
      if(value !== undefined){
        for(let elem in this){
          elem.style[name] = value;
        }
        return this;
      }
      var style = window.getComputedStyle(this);
      return style.getPropertyValue(name);
    }
    if(!name){
      return window.getComputedStyle(this);
    }
    for(let elem in this){
      for(let style in Object.keys(name)){
        elem.style.setProperty(style, name[style]);
      }
    }
    return this;
  },
  scrollTop(value){
    if(value !== undefined){
      for(let elem of this){
        elem.pageYOffset = value;
      }
      return this;
    }
    return this[0].pageYOffset;
  },
  scrollLeft(value){
    if(value !== undefined){
      for(let elem of this){
        elem.pageXOffset = value;
      }
      return this;
    }
    return this[0].pageXOffset;
  },
  data(name, value){
    if(name === undefined){
      return this[0].dataset;
    }
    if(name.toString() !== name){
      for(let elem in this){
        Object.assign(elem[dataSymbol], name);
      }
      return this;
    }
    if(value === undefined){
      return this[0][dataSymbol][name];
    }
    for(let elem in this){
      elem[dataSymbol][name] = value;
    }
    return this;
  },
  ready(fn){
    if(this[0] === document){
      if(document.readyState !== 'loading'){
        fn();
      } else {
        eachers.one.call(document, 'DOMContentLoaded', fn);
      }
    }
    return this;
  },
  load(fn){
    if(this[0] === window){
      if(document.readyState === "complete"){
        fn();
      } else {
        eachers.one.call(window, 'load', fn);
      }
    }
    return this;
  },

};

let mappers = {
  parent(){
    return this.parentNode;
  },
  children(){
    return this.children;
  },
  closest(selector){
    return this.closest(selector);
  },
  next(){
    return this.nextElementSibling;
  },
  prev(){
    return this.previousElementSibling;
  },
  find(selector){
    return SmallQuery.query(selector, this);
  },
  siblings(){
    return Array.prototype.filter.call(this.parentNode.children, function(child){
      return child !== this;
    });
  },
};

for(let key of Object.keys(mappers)){
  SmallQuery.prototype[key] = function(){
    let args = arguments;
    return this.map(function(elem){
      mappers[key].apply(elem, args);
    });
  };
}

let eachers = {
  addClass(clss){
    this.classList.add(clss);
  },
  removeClass(clss){
    this.classList.remove(clss);
  },
  toggleClass(clss, bool){
    this.classList.toggle(clss, bool);
  },
  removeAttr(name){
    this.removeAttribute(name);
  },
  on(eventName, callback){
    this[dataSymbol].handlers[eventName].push(callback);
    this.addEventListener(eventName, callback, false);
  },
  off(eventName, callback){
    if(!eventName){
      for(let event in Object.keys(this[dataSymbol].handlers)){
        for(let fn in this[dataSymbol].handlers[event]){
          this.removeEventListener(event, fn, false);
        }
      }
    }
    if(!callback){
      for(let fn in this[dataSymbol].handlers[eventName]){
        this.removeEventListener(eventName, fn, false);
      }
    }
    this.removeEventListener(eventName, callback, false);
  },
  one(eventName, callback){
    var self = this;
    function fn(){
      callback.apply(this, arguments);
      self.removeEventListener(eventName, fn, false);
    }
    this[dataSymbol].handlers[eventName].push(fn);
    this.addEventListener(eventName, fn, false);
  },
  delegate(selector, eventName, callback){
    function fn(e){
      let target = e.target.closest(selector);
      if(target){
        callback.apply(target, arguments);
      }
    }
    this[dataSymbol].handlers[eventName].push(fn);
    this.addEventListener(eventName, fn, false);
  },
  after(elem){
    if(elem.toString() === elem){
      this.insertAdjacentHTML('afterend', elem);
    } else {
      if(this.nextSibling){
        this.parentNode.insertBefore(elem, this.nextSibling);
      } else {
        this.parentNode.appendChild(elem);
      }
    }
  },
  before(elem){
    if(elem.toString() === elem){
      this.insertAdjacentHTML('beforebegin', elem);
    } else {
      this.parentNode.insertBefore(elem, this);
    }
  },
  empty(){
    this.innerHTML = '';
  },
  prepend(elem){
    if(elem.toString() === elem){
      this.insertAdjacentHTML('afterbegin', elem);
    } else {
      this.insertBefore(elem, this.firstChild);
    }
  },
  append(elem){
    if(elem.toString() === elem){
      this.insertAdjacentHTML('beforeend', elem);
    } else {
      this.appendChild(elem);
    }
  },
  remove(){
    this.parentNode.removeChild(this);
  },
  trigger(eventName){
    var event = document.createEvent('HTMLEvents');
    event.initEvent(eventName, true, false);
    this.dispatchEvent(event);
  }
};

for(let key of Object.keys(eachers)){
  SmallQuery.prototype[key] = function(){
    for(let elem of this){
      eachers[key].apply(elem, arguments);
    }
    return this;
  };
}

let oners = {
  hasClass(clss){
    return this.classList.contains(clss);
  },
  clone(){
    return this.cloneNode(true);
  },
  contains(child){
    if(child.toString() === child){
      child = document.querySelector(child);
    }
    return this !== child && this.contains(child);
  },
  is(elem){
    if(elem.toString() === elem){
      return this.matches(elem);
    }
    return this === elem;
  },
  offset(viewport){
    var rect = this.getBoundingClientRect();

    if(viewport){
      return rect;
    }

    return {
      top: rect.top + document.body.scrollTop,
      left: rect.left + document.body.scrollLeft
    };
  },
  offsetParent(){
    return this.offsetParent || this;
  },
  position(){
    return {
      left: this.offsetLeft,
      top: this.offsetTop
    };
  },
  outerHeight(margin){
    if(!margin){
      return this.offsetHeight;
    }

    var style = getComputedStyle(this);

    return this.offsetHeight +
      parseInt(style.getPropertyValue('margin-top')) +
      parseInt(style.getPropertyValue('margin-bottom'));
  },
  outerWidth(margin){
    if(!margin){
      return this.offsetWidth;
    }

    var style = getComputedStyle(this);

    return this.offsetWidth +
      parseInt(style.getPropertyValue('margin-left')) +
      parseInt(style.getPropertyValue('margin-right'));
  },

};

for(let key of Object.keys(oners)){
  SmallQuery.prototype[key] = function(){
    return oners[key].hasClass.apply(this[0], arguments);
  };
}

window.SmallQuery = SmallQuery;

window.$ = SmallQuery.SQ;

})(document, window);
