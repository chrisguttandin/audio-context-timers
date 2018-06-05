# audio-context-timers

**A replacement for setInterval() and setTimeout() which works in unfocused windows.**

[![tests](https://img.shields.io/travis/chrisguttandin/audio-context-timers/master.svg?style=flat-square)](https://travis-ci.org/chrisguttandin/audio-context-timers)
[![dependencies](https://img.shields.io/david/chrisguttandin/audio-context-timers.svg?style=flat-square)](https://www.npmjs.com/package/audio-context-timers)
[![version](https://img.shields.io/npm/v/audio-context-timers.svg?style=flat-square)](https://www.npmjs.com/package/audio-context-timers) [![Greenkeeper badge](https://badges.greenkeeper.io/chrisguttandin/audio-context-timers.svg)](https://greenkeeper.io/)

## Motivation

For scripts that rely on [WindowTimers](http://www.w3.org/TR/html5/webappapis.html#timers) like
setInterval() or setTimeout() things get confusing when the site which the script is running on
loses focus. Chrome, Firefox and maybe others throttle the frequency of firing those timers to a
maximum of once per second in such a situation. However it is possible to schedule
[AudioBufferSourceNodes](https://webaudio.github.io/web-audio-api/#AudioBufferSourceNode) and listen
for their
[`onended`](https://webaudio.github.io/web-audio-api/#widl-AudioScheduledSourceNode-onended) event
to achieve a similar result. This makes it possible to avoid the throttling.

## Getting Started

AudioContextTimers are available as a package on
[npm](https://www.npmjs.org/package/audio-context-timers). Simply run the following command to
install it:

```shell
npm install audio-context-timers
```

You can then require the audioContextTimers instance from within your code like this:

```js
import * as audioContextTimers from 'audio-context-timers';
```

The usage is exactly the same as with the corresponding functions on the global scope.

```js
var intervalId = audioContextTimers.setInterval(() => {
    // do something many times
}, 100);

audioContextTimers.clearInterval(intervalId);

var timeoutId = audioContextTimers.setTimeout(() => {
    // do something once
}, 100);

audioContextTimers.clearTimeout(timeoutId);
```

However there are some subtle differences between AudioContextTimers and WindowTimers which are
basically the same those of the [worker-timers](https://github.com/chrisguttandin/worker-timers)
package.
