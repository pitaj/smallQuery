"use strict";

(function(document, window, undefined){

let compat = window.$;
let compatSQ = window.SmallQuery;

let SmallQuery = {
  // covers CSS queries
  query(selector, namespace){
    namespace = namespace || document;
    return SmallQuery.from(namespace.querySelectorAll(selector));
  },
  // creates a new SmallQuery object
  create(elem){
    if(elem){
      return Object.create(SmallQuery.prototype, {
        '0': {
          value: elem,
          configurable: true,
          enumerable: true,
          writable: true
        },
        length: {
          value: 1,
          writable: true,
          enumerable: false
        }
      });
    }
    return Object.create(SmallQuery.prototype, {
      length: {
        value: 0,
        writable: true,
        enumerable: false
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
    return SmallQuery.create();
  },
  // for compat with libraries using window.$
  noConflict(all){
    window.$ = compat;
    if(all){
      window.SmallQuery = compatSQ;
    }
    return SmallQuery.SQ;
  },
  // for console stuff
  toString(){
    return "[object SmallQuery]";
  }
};

// jQuery compat $.noConflict
SmallQuery.SQ.noConflict = SmallQuery.noConflict;

// allow access of the ma`in `object from the query function
SmallQuery.SQ.main = function(){
  return SmallQuery;
};

// use symbol for element datastores
let dataSymbol = Symbol("SmallQuery DataStore");
// use separate symbol for element eventhandlers
let handlerSymbol = Symbol("SmallQuery EventHandler Store");

function flatten(arrOfArrs){
  var merged = [];
  Array.prototype.forEach.call(arrOfArrs, function(arr){
    merged.push.apply(merged, arr);
  });
  return merged;
}

SmallQuery.prototype = {
  [Symbol.iterator]: Array.prototype[Symbol.iterator],

  toString(){
    return "[object SmallQueryList]";
  },

  splice: function(){},

  // internal utility functions
  mmap(fn){
    let arr = Array.prototype.map.call(this, fn);
    if(arr[0] && arr[0].length !== undefined && arr[0].toString() !== arr[0]){
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
    return this.mmap((elem, index) => fn.call(elem, index, elem));
  },
  filter(fn){
    if(fn.toString() === fn){
      return this.mfilter(fn);
    }
    return this.mfilter((elem, index) => fn.call(elem, index, elem));
  },

  // functions which don't fit below, mainly overloaded getters / setters
  html(str){
    if(str !== undefined){

      if(typeof str === "function"){
        return this.forEach(function(elem, index){
          elem.innerHTML = str.call(elem, index, elem.innerHTML);
        });
      }

      for(let elem of this){
        elem.innerHTML = str;
      }
      return this;
    }
    return this[0].innerHTML;
  },
  outer(str){
    if(str !== undefined){

      if(typeof str === "function"){
        return this.forEach(function(elem, index){
          elem.outerHTML = str.call(elem, index, elem.outerHTML);
        });
      }

      for(let elem of this){
        elem.outerHTML = str;
      }
      return this;
    }
    return this[0].outerHTML;
  },
  text(str){
    if(str !== undefined){
      if(typeof str === "function") {
        return this.forEach(function(elem, index){
          elem.textContent = str.call(elem, index, elem.textContent);
        });
      }

      for(let elem of this){
        elem.textContent = str;
      }

      return this;
    }

    var ret = "";
    for(let elem of this){
      ret += elem.textContent;
    }
    return ret;
  },
  prop(name, value){
    if(name.toString() === name){
      if(value !== undefined){

        if(typeof value === "function"){
          return this.forEach(function(elem, index){
            elem[name] = value.call(elem, index, elem[name]);
          });
        }

        for(let elem of this){
          elem[name] = value;
        }
        return this;
      }
      return this[0][name];
    }
    for(let elem of this){
      for(let prop of Object.keys(name)){
        elem[prop] = name[prop];
      }
    }
    return this;
  },
  attr(name, value){
    if(name.toString() === name){
      if(value !== undefined){

        if(typeof value === "function"){
          return this.forEach(function(elem, index){
            elem.setAttribute(name, value.call(elem, index, elem.getAttribute(name)));
          });
        }

        for(let elem of this){
          elem.setAttribute(name, value);
        }
        return this;
      }
      return this[0].getAttribute(name);
    }
    for(let elem of this){
      for(let prop of Object.keys(name)){
        elem.setAttribute(prop, name[prop]);
      }
    }
    return this;
  },
  val(value){
    if(value !== undefined){

      if(typeof value === "function"){
        return this.forEach(function(elem, index){
          elem.value =  value.call(elem, index, elem.value);
        });
      }

      for(let elem of this){
        elem.value = value;
      }
      return this;
    }
    return this[0].value !== undefined ? this[0].value : "";
  },
  css(name, value){
    if(!name){
      return this;
    }
    if(name.toString() === name){
      if(value !== undefined){
        for(let elem of this){
          elem.style.setProperty(name, value);
        }
        return this;
      }

      var self = this;

      let swit = {
        width: function(){
          let rect = self[0].getBoundingClientRect();
          return Math.round(rect.right - rect.left) + "px";
        },
        height: function(){
          let rect = self[0].getBoundingClientRect();
          return Math.round(rect.bottom - rect.top) + "px";
        }
      };

      if(swit.hasOwnProperty(name)){
        return swit[name]();
      }

      let style = window.getComputedStyle(this[0]);
      return style.getPropertyValue(name);
    }
    for(let elem of this){
      for(let style of Object.keys(name)){
        elem.style.setProperty(style, name[style]);
      }
    }
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
      for(let elem of this){
        Object.assign(elem[dataSymbol], name);
      }
      return this;
    }
    if(value === undefined){
      return this[0][dataSymbol][name];
    }
    for(let elem of this){
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
  on(eventName, selector, callback){
    this[handlerSymbol][eventName].push(callback);
    this.addEventListener(eventName, callback, false);
  },
  off(eventName, callback){
    if(!eventName){
      for(let event of Object.keys(this[handlerSymbol])){
        for(let fn of this[handlerSymbol][event]){
          this.removeEventListener(event, fn, false);
        }
      }
    }
    if(!callback){
      for(let fn of this[handlerSymbol][eventName]){
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
    this[handlerSymbol][eventName].push(fn);
    this.addEventListener(eventName, fn, false);
  },
  delegate(selector, eventName, callback){
    function fn(e){
      let target = e.target.closest(selector);
      if(target){
        callback.apply(target, arguments);
      }
    }
    this[handlerSymbol][eventName].push(fn);
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

if(window.define && window.define.amd){
  window.define("SmallQuery", function (){
    return SmallQuery;
  });
} else if(window.require && window.module){
  module.exports = SmallQuery;
} else {
  window.SmallQuery = SmallQuery;
  window.$ = SmallQuery.SQ;
}

})(document, window);
