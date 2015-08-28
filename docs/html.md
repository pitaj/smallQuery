## #html

Get inner HTML of first element, or set inner HTML of all elements in list

### `#html( htmlStr )`
*Set inner HTML of all elements in list*

+ `htmlStr` *String* - Value of HTML to set

```js
$("div").html("<p>Hello, world!</p>");
```

### `#html( callback )`
*Augment inner HTML with a function*

+ *String* `callback( original, element )` *Function* - The augmentation function
  + `original` *String* - The existing HTML of the element
  + `element` *Node* - The element being augmented

```js
$("div").html(function(original, element){
  return original + "Hello, " + element.tagName;
});
```

### *String* `#html()`
*Get the current inner HTML of the first element*

```js
$("div").html(); // Hello, World!
```

## #outer

Get outer HTML of first element, or set outer HTML of all elements in list. Can be used for element replacement.

### `#outer( htmlStr )`
*Set outer HTML of all elements in list*

+ `htmlStr` *String* - Value of HTML to set

```js
$("div").outer("<p>Hello, world!</p>");
```

### `#outer( callback )`
*Augment outer HTML with a function*

+ *String* `callback( original, element )` *Function* - The augmentation function
  + `original` *String* - The existing HTML of the element
  + `element` *Node* - The element being augmented

```js
$("div").outer(function(original, element){
  return '<span class="' + element.className + '" >' + original + "</span>";
});
```

### *String* `#outer()`
*Get the current outer HTML of the first element*

```js
$("div").outer(); // <div>Hello, World!</div>
```

## #text

Get text content of first element, or set text content of all elements in list

### `#text( str )`
*Set text content of all elements in list*

+ `htmlStr` *String* - Value of text to set

```js
$("div").text("Hello, world!");
```

### `#text( callback )`
*Augment text content of all elements with a function*

+ *String* `callback( original, element )` *Function* - The augmentation function
  + `original` *String* - The existing text of the element
  + `element` *Node* - The element being augmented

```js
$("div").text(function(original, element){
  return element.innerHTML;
});
```

### *String* `#text()`
*Get the current text content of the first element*

```js
$("div").text(); // Hello, World!
```

## #after

Insert HTML or an element  directly after each element in the list

### `#after( html )`

+ `html` *String* - HTML to insert

```js
$("div").after("<p>Attack!</p>");
```

### `#after( element )`

+ `element` *Node* - Element to insert

```js
$("div").after(document.createElement("span"));
```

## #before

Insert HTML or an element directly before each element in the list

### `#before( html )`

+ `html` *String* - HTML to insert

```js
$("div").before("<p>Attack!</p>");
```

### `#before( element )`

+ `element` *Node* - Element to insert

```js
$("div").before(document.createElement("span"));
```

## #prepend

Insert HTML or an element after the beginning of each element in the list

### `#prepend( html )`

+ `html` *String* - HTML to insert

```js
$("div").prepend("<p>Attack!</p>");
```

### `#prepend( element )`

+ `element` *Node* - Element to insert

```js
$("div").prepend(document.createElement("span"));
```

## #append

Insert HTML or an element before the end of each element in the list

### `#after( html )`

+ `html` *String* - HTML to insert

```js
$("div").after("<p>Attack!</p>");
```

### `#after( element )`

+ `element` *Node* - Element to insert

```js
$("div").after(document.createElement("span"));
```
