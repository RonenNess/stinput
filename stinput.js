 /**
  * StInput v1.0.0
  */
 (function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.StInput = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){

/**
 * State-based Input manager to handle mouse and keyboard events on all modern browsers.
 * This library provide a state-query API, in oppose to the default event-based API given by browsers.
 * eg instead of registering callbacks to respond to mouse down event, you can use it like this:
 * if (stinput.isDown('mouse_left'))
 *      // do something...
 * 
 * This is especially useful for web apps like games and other things that have a main update loop.
 * 
 * Author: Ronen Ness.
 * Since: 2018.
 */

 "use strict";

/**
 * A simple Point object for mouse position.
 */
class Point
{
   /**
    * Create the Point object.
    * @param {number} x Point X.
    * @param {number} y Point Y.
    */
   constructor(x = 0, y = 0)
   {
       this.x = x;
       this.y = y;
   }

   /**
    * Clone the point.
    */
   clone()
   {
       return new Point(this.x, this.y);
   }

   /**
    * Return if point equals another point.
    * @param {*} other Other point to compare to.
    */
   equals(other)
   {
       return ((this === other) || (this.x === other.x && this.y === other.y));
   }

   /**
    * Get point (0,0).
    */
   static get zero()
   {
       return new Point();
   }
}

/**
 * Simple state-based input manager to handle mouse and keyboard events.
 * To use make sure to call .endFrame() at the end of every frame in your main loop.
 */
class StInput
{
    /**
     * Create the input manager.
     */
    constructor()
    {
        // set all the events to listen to
        var _this = this;
        this._callbacks = {
            'mousedown': function(event) {_this._onMouseDown(event);},
            'mouseup': function(event) {_this._onMouseUp(event);},
            'mousemove': function(event) {_this._onMouseMove(event);},
            'keydown': function(event) {_this._onKeyDown(event);},
            'keyup': function(event) {_this._onKeyUp(event);},
            'blur': function(event) {_this._onBlur(event);},
        };

        // mouse button codes
        this.MouseButton = {
            left: 0,
            middle: 1,
            right: 2,
        };

        // keyboard codes
        this.KeyboardButton = {
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
        };

        // should we reset on focus lost?
        this.resetOnFocusLoss = true;

        // reset all data to init initial state
        this._resetAll();
                
        // register all callbacks
        for (var event in this._callbacks) {
            window.addEventListener(event, this._callbacks[event], true);
        }
    }

    /**
     * Clear this input manager resources.
     * This is especially important so we can remove the registered events, otherwise the gc can never collect this object.
     */
    dispose()
    {
        // unregister all callbacks
        if (this._callbacks)
        {
            for (var event in this._callbacks) {
                window.removeEventListener(event, this._callbacks[event]);
            }
            this._callbacks = null;
        }
    }

    /**
     * Reset all internal data and states.
     */
    _resetAll()
    {
        // mouse states
        this._mousePos = new Point();
        this._mouseState = {};
        this._mouseClick = {};
        this._mousePrevPos = new Point();
        this._mouseMoveCache = null;

        // keyboard keys
        this._keyboardState = {};
        this._keyboardReleased = {};
    }
    
    /**
     * Get mouse position.
     * @returns {Point} Mouse position.
     */
    get mousePosition()
    {
        return this._mousePos.clone();
    }
        
    /**
     * Get mouse previous position (before the last endFrame() call).
     * @returns {Point} Mouse position.
     */
    get prevMousePosition()
    {
        return (this._mousePrevPos || this._mousePos).clone();
    }

    /**
     * Get mouse movement since last endFrame() call.
     * @returns {Point} Mouse diff.
     */
    get mouseMove()
    {
        // already calculated mouse movement this frame? return it
        if (this._mouseMoveCache)
            return this._mouseMoveCache;

        // no previous position? return 0,0.
        if (!this._mousePrevPos)
            return Point.zero;

        // get mouse diff
        this._mouseMoveCache = new Point(this._mousePos.x - this._mousePrevPos.x, this._mousePos.y - this._mousePrevPos.y);
        return this._mouseMoveCache;
    }

    /**
     * Get if mouse is currently moving.
     */
    get isMouseMoving()
    {
        return (this._mousePrevPos && !this._mousePrevPos.equals(this._mousePos));
    }

    /**
     * Get if mouse button is currently pressed.
     * @param {MouseButton} button Button code (defults to MouseButton.left).
     */
    isMouseButtonDown(button = 0)
    {
        if (button === undefined) throw new Error("Invalid button code!");
        return this._mouseState[button] === true;
    }

    /**
     * Get if mouse button is currently not pressed.
     * @param {MouseButton} button Button code (defults to MouseButton.left).
     */
    isMouseButtonUp(button = 0)
    {
        if (button === undefined) throw new Error("Invalid button code!");
        return !this.isMouseButtonDown(button);
    }
    
    /**
     * Get if mouse button was clicked since last endFrame() call.
     * @param {MouseButton} button Button code (defults to MouseButton.left).
     */
    isMouseButtonReleased(button = 0)
    {
        if (button === undefined) throw new Error("Invalid button code!");
        return this._mouseClick[button] === true;
    }

    /**
     * Get if keyboard button is currently pressed.
     * @param {KeyboardButton} button Button code.
     */
    isKeyboardButtonDown(button)
    {
        if (button === undefined) throw new Error("Invalid button code!");
        return this._keyboardState[button] === true;
    }

    /**
     * Get if keyboard button is currently not pressed.
     * @param {KeyboardButton} button Button code.
     */
    isKeyboardButtonUp(button)
    {
        return !this.isKeyboardButtonDown(button);
    }

    /**
     * Get if keyboard button was released this frame.
     * @param {KeyboardButton} button Button code.
     */
    isKeyboardButtonReleased(button)
    {
        if (button === undefined) throw new Error("Invalid button code!");
        return this._keyboardReleased[button] === true;
    }

    /**
     * Get if shift is currently pressed.
     */
    get isShiftDown()
    {
        return this.isKeyboardButtonDown(this.KeyboardButton.shift);
    }

    /**
     * Get if ctrl is currently pressed.
     */
    get isCtrlDown()
    {
        return this.isKeyboardButtonDown(this.KeyboardButton.ctrl);
    }

    /**
     * Get if alt is currently pressed.
     */
    get isAltDown()
    {
        return this.isKeyboardButtonDown(this.KeyboardButton.alt);
    }

    /**
     * Get if any keyboard key is currently down.
     */
    get isAnyKeyDown()
    {
        for (var key in this._keyboardState) {
            if (this._keyboardState[key])
                return true;
        }
        return false;
    }

    /**
     * Return if a mouse or keyboard button is currently down.
     * @param {string} code Keyboard or mouse code. 
     *                          For mouse buttons: mouse_left, mouse_right or mouse_middle.
     *                          For keyboard buttons: use one of the keys of KeyboardButton (for example 'a', 'alt', 'up_arrow', etc..)
     *                          For numbers (0-9): you can use the number.
     */
    isDown(code)
    {
        // make sure code is string
        code = String(code);

        // if starts with 'mouse' its for mouse button events
        if (code.indexOf('mouse_') === 0) {

            // get mouse code name
            var codename = code.split('_')[1];

            // return if mouse down
            return this.isMouseButtonDown(this.MouseButton[codename]);
        }

        // if its just a number, add the 'n' prefix
        if (parseInt(code) != NaN && code.length === 1)
            code = 'n' + code;

        // if not start with 'mouse', treat it as a keyboard key
        return this.isKeyboardButtonDown(this.KeyboardButton[code]);
    }

    /**
     * Return if a mouse or keyboard button was released in this frame.
     * @param {string} code Keyboard or mouse code. 
     *                          For mouse buttons: mouse_left, mouse_right or mouse_middle.
     *                          For keyboard buttons: use one of the keys of KeyboardButton (for example 'a', 'alt', 'up_arrow', etc..)
     *                          For numbers (0-9): you can use the number.
     */
    isReleased(code)
    {
        // make sure code is string
        code = String(code);

        // if starts with 'mouse' its for mouse button events
        if (code.indexOf('mouse') === 0) {

            // get mouse code name
            var codename = code.split('_')[1];

            // return if mouse down
            return this.isMouseButtonReleased(this.MouseButton[codename]);
        }

        // if its just a number, add the 'n' prefix
        if (parseInt(code) != NaN && code.length === 1)
            code = 'n' + code;

        // if not start with 'mouse', treat it as a keyboard key
        return this.isKeyboardButtonReleased(this.KeyboardButton[code]);
    }

    /**
     * update event states.
     * Call this every frame, *at the end of your main loop code*, to make sure events like mouse-click and mouse move work.
     */
    endFrame()
    {
        this._mouseClick = {};
        this._mousePrevPos = this._mousePos.clone();
        this._keyboardReleased = {};
        this._mouseMoveCache = null;
    }

    /**
     * Get keyboard key code from event.
     */
    _getKeyboardKeyCode(event)
    {
        event = this._getEvent(event);
        return event.keyCode !== undefined ? event.keyCode : event.key.charCodeAt(0);
    }

    /**
     * Called when window loses focus - clear all input states to prevent keys getting stuck.
     */
    _onBlur(event)
    {
        if (this.resetOnFocusLoss)
            this._resetAll();
    }

    /**
     * Handle keyboard down event.
     * @param {*} event Event data from browser.
     */
    _onKeyDown(event)
    {
        var keycode = this._getKeyboardKeyCode(event);
        this._keyboardState[keycode] = true;
    }

    /**
     * Handle keyboard up event.
     * @param {*} event Event data from browser.
     */
    _onKeyUp(event)
    {
        var keycode = this._getKeyboardKeyCode(event);
        this._keyboardState[keycode] = false;
        this._keyboardReleased[keycode] = true;
    }

    /**
     * Handle mouse down event.
     * @param {*} event Event data from browser.
     */
    _onMouseDown(event)
    {
        event = this._getEvent(event);
        this._mouseState[event.button] = true;
    }

    /**
     * Handle mouse up event.
     * @param {*} event Event data from browser.
     */
    _onMouseUp(event)
    {
        event = this._getEvent(event);
        this._mouseState[event.button] = false;
        this._mouseClick[event.button] = true;
    }

    /**
     * Handle mouse up event.
     * @param {*} event Event data from browser.
     */
    _onMouseMove(event)
    {
        // get event in a cross-browser way
        event = this._getEvent(event);

        // try to get pageX and pageY from event
        var pageX = event.pageX;
        var pageY = event.pageY;

        // if pageX and pageY are not supported, use clientX and clientY instead
        if (pageX === undefined) {
            pageX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            pageY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }

        // set current mouse position
        this._mousePos.x = pageX;
        this._mousePos.y = pageY;
    }

    /**
     * Get event either from event param or from window.event. 
     * This is for older browsers support.
     */
    _getEvent(event)
    {
        return event || window.event;
    }
}

// export the input manager class.
module.exports = StInput;

},{}]},{},[1])(1)
});