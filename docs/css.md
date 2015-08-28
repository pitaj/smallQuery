## #css
Set CSS properties on all element in the set, or get computed CSS styles from the first element

### `#css( name, value )`  
*Set CSS properties on all elements in the set*
 + **`name`** *String* - The CSS property name. Must be CSS-style aka `margin-top`
 + **`value`** *String* - The value to set the property. Must have any units necessary

```js
$("div").css("height", "50px");
```

### `#css( obj )`
*Set multiple CSS properties on all elements from hash*
 + **`obj`** *Object* - Hash of CSS property-values

```js
$("div").css({
  "height": "50px",
  // unsafe property names must have quotes
  "margin-top": "10px"
});
```

### *String* `#css( name )`
*Get CSS properties of first element in the set*
+ **`name`** *String* - The CSS property to retrieve

```js
$("div").css("height"); // "50px"
```

### *CSSStyleDeclaration* `#css()`
*Get CSS computed style object of first element*

```js
$("div").css(); // CSSStyleDeclaration { ... }
```
