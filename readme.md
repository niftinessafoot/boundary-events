# Boundary Events
An ES6 module for emitting custom events when the browser window crosses predefined thresholds. Kinda like media queries for JavaScript.

## contents

<!-- MarkdownTOC -->

- [usage](#usage)
    - [basic setup](#basic-setup)
    - [initialization options](#initialization-options)
- [default export methods](#default-export-methods)
    - [registerBoundary](#registerboundary)
    - [removeBoundary](#removeboundary)
    - [listenStart](#listenstart)
    - [listenEnd](#listenend)
    - [isListening](#islistening)
- [named export methods](#named-export-methods)
    - [getDimensions](#getdimensions)
- [how it works](#how-it-works)
- [license](#license)
- [credits](#credits)

<!-- /MarkdownTOC -->


## usage
`boundaryEvents` is an event emitter, dispatching the event named `cross` at user-defined thresholds. You will need to initiate an event listener to handle incoming events.

### basic setup
```js
import boundaryEvents from './boundaryEvents.js';
const boundary = boundaryEvents();

boundary.registerBoundary('id',500);

window.addEventListener('cross',(evt)=>{
    console.log(evt);
});
```

### initialization options
`boundaryEvents` accepts the following config options as an object literal as the sole parameter. All properties are optional.

```js
// Defaults defined in the example below.
boundaryEvents({
    parent : window,
    eventName : 'cross',
    eventNameReturn : 'cross',
    initOnCall : true,
    bubbles : true,
    throttle : 66
})
```

#### parameters
Name | Type | Required | Description
:--- | :--- | :---: | :---
parent | DOM Node || The DOM element `boundaryEvents` dispatches events from.
eventName | String || The name of the custom event when the viewpoint is sized _beyond_ the boundary threshold.
eventNameReturn | String || The name of the custom event fired when the viewport is is sized back _below_ the boundary threshold. Defaults to the same event name, as there are properties in the event payload to help discern direction.
initOnCall | Boolean || Optionally prevent the resize listener from initiating on call. You can manually start the listener via child methods.
bubbles | Boolean || Set whether the boundary event bubbles up the DOM or not.
throttle | Number || Customize the length of time, in millisecods, between resize calls. No need to spam the event handler.

## default export methods
`boundaryEvents` features five methods for registering boundaries and controlling event listeners.

### registerBoundary
Add a new boundary to the object store. Returns `true`.

#### parameters
Name | Type | Required | Description
:--- | :--- | :---: | :---
id | String | √ | User-defined key name. Passed back on event call.
boundary | Number | √ | Pixel-width of boundary line. Passed back on event call.
isHeight | Boolean || Set to `true` if listening for window height resize.
data | Any || Accepts any number of artibary parameters. Returned on event call as an array.

#### example
```js
const boundary = boundaryEvents();
boundary.registerBoundary('breakpointOne', 960, false, {optionalData: 'abc'})
```

### removeBoundary
Deletes an existing entry from the roster. Returns `true`;

#### parameters
Name | Type | Required | Description
:- | :- | :: | :-
id | String | √ | User-defined key name. Must match id in `registerBoundary`.

#### example
```js
boundary.removeBoundary('breakpointOne');
```

### listenStart
Adds a `resize` event listener to `window`. Will not add redundant listeners.

#### parameters
none

#### example
```js
boundary.listenStart();
```

### listenEnd
Removes `resize` listener from window, if listener exists.

#### parameters
none

#### example
```js
boundary.listenEnd();
```

### isListening
Reports whether there is an active listener or not. Returns Boolean.

#### parameters
none

#### example
```js
boundary.isListening();
```

## named export methods

### getDimensions
Returns an object literal `{height: [Number], width: [Number]}` of the current page dimensions.
#### parameters
none

#### example
```js
import { getDimensions } from './boundaryEvents';
getDimensions();
```

## how it works
`boundaryEvents` creates an object store, fed by user-supplied keys. On a throttled resize event, the script cycles through the stored object, and compares the current window size to the registered boundaries. If a boundary is crossed, the script emits an event with the relevant data, including the key and any passed arguments, in the payload.

## license
[MIT](license) © [Matthew Smith](http://www.niftinessafoot.com)

## credits
made with ❤️ and ☕️ by

![Niftiness Afoot!](https://gist.githubusercontent.com/niftinessafoot/2dba588395cb557293d5f09aebcd2ab0/raw/770293c76bead4f0986ff959f3ea8880017d92c0/bot.svg?sanitize=true)  Matthew Smith [@niftinessafoot](https://github.com/niftinessafoot)