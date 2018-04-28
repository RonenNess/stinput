# StInput

State-based input for JavaScript, for modern browsers.

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

## Usage

To use `StInput` you need to create an StInput instance, update it at the end of every frame, and query it. 

For example:

```js
// create the input manager
input = new StInput();

// our main loop
function mainLoop() 
{
	// left mouse button is down
	if (input.isDown('mouse_left')) {
		console.log("Mouse is down.");
	}

	// left mouse button is released
	if (input.isReleased('mouse_left')) {
		console.log("Mouse was released.");
	}
	
	// keyboard button up arrow was released
	if (input.isReleased('left_arrow')) {
		console.log("Left arrow was released.");
	}
	
	// mouse moved
	if (input.isMouseMoving) {
		console.log("Mouse move:", input.mouseMove);
	}
	
	// update input
	input.endFrame();
}

// start main loop
setInterval(mainLoop);
```

And when you're done using it call ```input.dispose()```, which will unregister its event handlers.

## API

### Create / Destroy

Creating New StInput

```js
var input = new StInput();
```

Destroying StInput

```js
input.dispose();
```

### Mouse Buttons

Checking if mouse button is down:

```js
input.isDown('mouse_left')			// left mouse button
input.isDown('mouse_right')			// right mouse button
input.isDown('mouse_middle')		// middle mouse button

// Or:

input.isMouseButtonDown(input.MouseButton.left)			// left mouse button
input.isMouseButtonDown(input.MouseButton.right)		// right mouse button
input.isMouseButtonDown(input.MouseButton.middle)		// middle mouse button
```

Checking if mouse button was released this frame:

```js
input.isReleased('mouse_left')			// left mouse button
input.isReleased('mouse_right')			// right mouse button
input.isReleased('mouse_middle')		// middle mouse button

// Or:

input.isMouseButtonReleased(input.MouseButton.left)			// left mouse button
input.isMouseButtonReleased(input.MouseButton.right)		// right mouse button
input.isMouseButtonReleased(input.MouseButton.middle)		// middle mouse button
```

### Mouse Position & Movement

Get mouse current position

```js
var mousePos = input.mousePosition
```

Checking if mouse is currently moving:

```js
input.isMouseMoving
```

Get a point {x,y} representing mouse movement since last frame:

```js
var movement = input.mouseMove
```

