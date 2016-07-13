
# TextHighlighter

TextHighlighter allows you to highlight text on web pages. Just select it!

## Getting started

Download TextHighlighter directly from GitHub or install with Bower:

```
$ bower install nodehack-texthighlighter
```

Add script file to head section of your web page:

```
<script type="text/javascript" src="TextHighlighter.min.js"></script>
```

And use it!

```
var hltr = new TextHighlighter(document.body);
```

For more details see [API reference](http://mir3z.github.io/texthighlighter/doc/index.html) or 
[Wiki](https://github.com/mir3z/texthighlighter/wiki) pages on GitHub.

Also check Demos section below for examples of usage.

## Features

* Highlighting of selected text.
* Highlighting all occurrences of given text (find & highlight).
* Removing highlights.
* Selecting highlight color.
* Serialization & deserialization.
* Works well in iframes.
* Keeps DOM clean.
* No dependencies. No jQuery or other libraries needed.

## Compatibility

Should work in all decent browsers and IE >= 9.

## Demos

* [Simple demo](http://mir3z.github.io/texthighlighter/demos/simple.html)
* [Callbacks](http://mir3z.github.io/texthighlighter/demos/callbacks.html)
* [Serialization](http://mir3z.github.io/texthighlighter/demos/serialization.html)
* [Iframe](http://mir3z.github.io/texthighlighter/demos/iframe.html)

## Documentation
   
You may check [API reference](http://mir3z.github.io/texthighlighter/doc/index.html) or 
[Wiki](https://github.com/mir3z/texthighlighter/wiki) pages on GitHub.

## Updates

This repository has a few updates to since its clone from mir3z's original repo.
#### Options
* Added an `enabled` flag to the options.  Set this flag to `false` when creating a new text highlighter if you do not want the highlighter to automatically highlight text when a user makes a selection.

Usage:
```
let highlighter = new TextHighlighter(document.body, {
  enabled: false,
  color: "",
  highlightedClass: 'my-highlighter-class',
  onBeforeHighlight: function (range) {
    ...
  },
  onAfterHighlight: function (range, normalizedHighlights, timestamp) {
    ...
  }
});
```

#### Exposed functions
* `highlighter.removeHighlight(highlight)`
	* If you have a specific highlight you want to get rid of you can remove it via this new function.  The highlight parameter is a single highlight node.
* `highlighter.serializeHighlight(highlight)` -> Array
	* Allows you to turn a single highlight into an array of descriptors.  This maybe misnamed as it does not actually make a string out of the highlight.  If you want to create a string like the `highlighter.serializeHighlights` function, just call `JSON.stringify(<Array>)`.
* `highlighter.enable()`
	* Enables the highlighter.  If the user has already made a selection you can call `highlighter.doHighlight()` immediately after to highlight that selection.  This is tied to the `enabled` constructor option.
* `highlighter.disable()`
	*  Disables the highlighter.  You could call this in your `onAfterHighlight` function if you want to have your highlights triggered by some other means.  This is tied to the `enabled` constructor option.
