# StInput

State-based input for JavaScript.

# Usage:

To use `StInput` you need to create a manager instance, update it at the end of every frame, and query it. 
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
