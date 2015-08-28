## #each
Executes provided function on every element in list

### `#each( callback )`

+ `callback( index, element )` *Function* - Executed over each element in the list
  - `index` *Number* - Current position in the list
  - `element` *Node* - Current element of list
  - `this` bound to `element`

```js
$("div").each(function(){
  this.innerHTML += "Hello, world!";
});
```

## #map
Creates a new `SmallQueryList` with the results of calling a provided function on every element in this `SmallQueryList`

### *SmallQueryList* `#map( callback )`

+ *Node | ArrayLike* `callback( index, element )` *Function* - Executed over each element in the list
  - `index` *Number* - Current position in the list
  - `element` *Node* - Current element of list
  - `this` bound to `element`

```js
$("div").map(function(){
  return this.parentNode;
}); // SmallQueryList [ ... ]
```

## #mfilter
Creates a new `SmallQueryList` with all elements that pass the test condition

### *SmallQueryList* `#filter( callback )`
*Filter elements with a callback function*

+ *Boolean* `callback( index, element )` *Function* - Test executed over each element of the list
  - `index` *Number* - Current position in the list
  - `element` *Node* - Current element of list
  - `this` bound to `element`

```js
$("div").filter(function(){
  return this.innerHTML.indexOf("hello") === -1;
}); // SmallQueryList [ ... ]
```

### *SmallQueryList* `#filter( selector )`
*Filter elements by CSS selector*

+ `selector` *String* - CSS selector

```js
$("div").filter(".hidden"); // SmallQueryList [ ... ]
```

## #forEach
Executes provided function on every element in this `SmallQueryList`

### `#forEach( callback )`

+ `callback( element, index )` *Function* - Executed over each element in the list
  - `element` *Node* - Current element of list
  - `index` *Number* - Current position in the list

```js
$("div").forEach(function(element){
  element.innerHTML += "Hello, world!";
});
```

## #mfilter
Creates a new `SmallQueryList` with all elements that pass the test condition

### *SmallQueryList* `#mfilter( callback )`
*Filter elements with a callback function*

+ *Boolean* `callback( element, index )` *Function* - Test executed over each element of the list
  - `element` *Node* - Current element of list
  - `index` *Number* - Current position in the list

```js
$("div").mfilter(function(element){
  return element.innerHTML.indexOf("hello") === -1;
}); // SmallQueryList [ ... ]
```

### *SmallQueryList* `#mfilter( selector )`
*Filter elements by CSS selector*

+ `selector` *String* - CSS selector

```js
$("div").mfilter(".hidden"); // SmallQueryList [ ... ]
```

## #mmap
Creates a new `SmallQueryList` with the results of calling a provided function on every element in this `SmallQueryList`

### *SmallQueryList* `#mmap( callback )`

+ *Node | ArrayLike* `callback( element, index )` *Function* - Executed over each element in the list
  - `element` *Node* - Current element of list
  - `index` *Number* - Current position in the list

```js
$("div").mmap(function(element){
  return element.parentNode;
}); // SmallQueryList [ ... ]
```
