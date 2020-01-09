# StInput

State-based input for modern browsers.

## Install

### NPM

```
npm install stinput
```

### Bower

```
bower install stinput
```

### Other

Just fetch `stinput.js` from this repo and include in your web page.

## Supported Browsers

StInput don't require any external libs and should work on all modern browsers, but note that it uses JavaScript classes and therefor requires ECMAScript 2015 or newer to run.

## Usage Example

To use `StInput` you need to create an StInput instance, update it at the end of every frame, and query it. 

For example:

```js
// create the input manager
input = new StInput();

// our main loop
function mainLoop() 
{
	// left mouse button is down
	if (input.down('mouse_left')) {
		console.log("Mouse is down.");
	}

	// left mouse button was released this update call
	if (input.released('mouse_left')) {
		console.log("Mouse was released this update call.");
	}
	
	// left mouse button was released this update call
	if (input.pressed('mouse_left')) {
		console.log("Mouse was pressed this update call.");
	}
	
	// keyboard button up arrow was released
	if (input.released('left_arrow')) {
		console.log("Left arrow was released this update call.");
	}
	
	// mouse moved
	if (input.mouseMoving) {
		console.log("Mouse delta:", input.mouseDelta);
	}
	
	// update input
	input.endFrame();
}

// start main loop
setInterval(mainLoop);
```

And when you're done using StInput call ```input.dispose()``` to unregister all its event handlers.

## Full API

### Create / Destroy

Creating New StInput:

```js
var input = new StInput();
```

Destroying StInput:

```js
input.dispose();
```

### Update

For StInput to work properly, you must update it every frame of your main loop, **at the end of your update function**. 
To do so, call `endFrame()`:

```js
input.endFrame();
```

### Mouse Buttons

Checking if mouse button is down:

```js
// returns if different mouse buttons are held down
input.down('mouse_left')
input.down('mouse_right')
input.down('mouse_middle')

// Or:

// returns if different mouse buttons are held down
input.mouseDown(input.MouseButtons.left)
input.mouseDown(input.MouseButtons.right)
input.mouseDown(input.MouseButtons.middle)
```

Checking if a mouse button was released this update call:

```js
// returns if different mouse buttons were released this update call
input.released('mouse_left')
input.released('mouse_right')
input.released('mouse_middle')

// Or:

// returns if different mouse buttons were released this update call
input.mouseReleased(input.MouseButtons.left)
input.mouseReleased(input.MouseButtons.right)
input.mouseReleased(input.MouseButtons.middle)
```

Checking if mouse button was pressed this update call:

```js
// returns if different mouse buttons were released this update call
input.pressed('mouse_left')
input.pressed('mouse_right')
input.pressed('mouse_middle')

// Or:

// returns if different mouse buttons were released this update call
input.mousePressed(input.MouseButtons.left)
input.mousePressed(input.MouseButtons.right)
input.mousePressed(input.MouseButtons.middle)
```

### Mouse Position & Movement

Get mouse current position:

```js
// returns Point with x,y representing mouse current position
input.mousePosition	
```

Checking if mouse is currently moving:

```js
// returns true if mouse is currently moving
input.mouseMoving
```

Get a point {x,y} representing the mouse position delta since last update call:

```js
// returns Point with x,y representing mouse movement
input.mouseDelta
```

### Mouse Wheel

Get mouse wheel delta in this update call:

```js
// get mouse wheel delta
input.mouseWheel

// get just the mouse wheel change sign:
input.mouseWheelDirection
```

### Keyboard

Checking if keyboard key is down:

```js
// returns if 'a' key is down
input.down('a')

// Or:

// returns if 'a' key is down
input.keyDown(input.KeyboardKeys.a)
```

Checking if keyboard key was released this update call:

```js
// returns if 'a' key was released this update call
input.released('a')

// Or:

// returns if 'a' key was released this update call
input.keyReleased(input.KeyboardKeys.a)
```

Checking if keyboard key was pressed this update call:

```js
// returns if 'a' key was released this update call
input.pressed('a')

// Or:

// returns if 'a' key was released this update call
input.keyPressed(input.KeyboardKeys.a)
```

Check if any keyboard key is currently down:

```js
// returns if any keyboard key is held down
input.anyKeyDown
```

Check special keys states:

```js
// returns if alt, ctrl, or shift are currently held down
// note: in some browsers pressing 'alt' will make the window lose focus, so its not recommended to use
input.altDown
input.ctrlDown
input.shiftDown
```

### Supported Keys

All supported mouse buttons are:

```js
Stinput.MouseButtonss = {
	left: 0,
	middle: 1,
	right: 2,
}
```

All supported keyboard keys are:

```js
Stinput.KeyboardKeys = {
	backspace: 8,
	tab: 9,
	enter: 13,
	shift: 16,
	ctrl: 17,
	alt: 18,
	break: 19,
	caps_lock: 20,
	escape: 27,
	page_up: 33,
	page_down: 34,
	end: 35,
	home: 36,
	left_arrow: 37,
	up_arrow: 38,
	right_arrow: 39,
	down_arrow: 40,
	insert: 45,
	delete: 46,
	space: 32,
	n0: 48,
	n1: 49,
	n2: 50,
	n3: 51,
	n4: 52,
	n5: 53,
	n6: 54,
	n7: 55,
	n8: 56,
	n9: 57,
	a: 65,
	b: 66,
	c: 67,
	d: 68,
	e: 69,
	f: 70,
	g: 71,
	h: 72,
	i: 73,
	j: 74,
	k: 75,
	l: 76,
	m: 77,
	n: 78,
	o: 79,
	p: 80,
	q: 81,
	r: 82,
	s: 83,
	t: 84,
	u: 85,
	v: 86,
	w: 87,
	x: 88,
	y: 89,
	z: 90,
	left_window_key: 91,
	right_window_key: 92,
	select_key: 93,
	numpad_0: 96,
	numpad_1: 97,
	numpad_2: 98,
	numpad_3: 99,
	numpad_4: 100,
	numpad_5: 101,
	numpad_6: 102,
	numpad_7: 103,
	numpad_8: 104,
	numpad_9: 105,
	multiply: 106,
	add: 107,
	subtract: 109,
	decimal_point: 110,
	divide: 111,
	f1: 112,
	f2: 113,
	f3: 114,
	f4: 115,
	f5: 116,
	f6: 117,
	f7: 118,
	f8: 119,
	f9: 120,
	f10: 121,
	f11: 122,
	f12: 123,
	numlock: 144,
	scroll_lock: 145,
	semicolon: 186,
	equal_sign: 187,
	comma: 188,
	dash: 189,
	period: 190,
	forward_slash: 191,
	grave_accent: 192,
	open_bracket: 219,
	back_slash: 220,
	close_braket: 221,
	single_quote: 222,
}
```

## Handling Focus Loss

By default, whenever the browser window loses its focus, StInput will reset all its internal state.

This behavior is important to prevent keys from getting "stuck" in down state due to browsers limitations (for example, if you hold down a key, make the window lose focus, and then release the key outside - you won't get the keyup event and the key will remain stuck).

However, if you wish to override this behavior, set `resetOnFocusLoss` to false:

```js
// will not reset state on focus loss.
input.resetOnFocusLoss = false;
```

## License

StInput is distributed under the permissive MIT license and may be used for any purpose, commercial included. 