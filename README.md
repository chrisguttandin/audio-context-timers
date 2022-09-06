# audio-context-timers

**A replacement for setInterval() and setTimeout() which works in unfocused windows.**

[![version](https://img.shields.io/npm/v/audio-context-timers.svg?style=flat-square)](https://www.npmjs.com/package/audio-context-timers)

## Motivation

For scripts that rely on [WindowTimers](http://www.w3.org/TR/html5/webappapis.html#timers) like setInterval() or setTimeout() things get confusing when the site which the script is running on loses focus. Chrome, Firefox and maybe others throttle the frequency at which they invoke those timers to a maximum of once per second in such a situation. However it is possible to schedule [AudioBufferSourceNodes](https://webaudio.github.io/web-audio-api/#AudioBufferSourceNode) and listen for their [`onended`](https://webaudio.github.io/web-audio-api/#widl-AudioScheduledSourceNode-onended) event to achieve a similar result. This makes it possible to avoid the throttling.

## Getting Started

`audio-context-timers` is available as a package on [npm](https://www.npmjs.org/package/audio-context-timers). Run the following command to install it:

```shell
npm install audio-context-timers
```

You can then import the exported functions in your code like this:

```js
import { clearInterval, clearTimeout, setInterval, setTimeout } from 'audio-context-timers';
```

The usage is exactly the same as with the corresponding functions on the global scope.

```js
var intervalId = setInterval(() => {
    // do something many times
}, 100);

clearInterval(intervalId);

var timeoutId = setTimeout(() => {
    // do something once
}, 100);

clearTimeout(timeoutId);
```

However there are some subtle differences between `audio-context-timers` and WindowTimers which are the same those of the [`worker-timers`](https://github.com/chrisguttandin/worker-timers) package.
