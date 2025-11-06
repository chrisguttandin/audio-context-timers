import { generateUniqueNumber } from 'fast-unique-numbers';
import { AudioBuffer, AudioBufferSourceNode, MinimalAudioContext, isSupported } from 'standardized-audio-context';
import { createCallFunction } from './factories/call-function';
import { createClearFunction } from './factories/clear-function';
import { TFunctionMap, TTimerType } from './types';

const MINIMAL_AUDIO_CONTEXT = new MinimalAudioContext();

const AUDIO_BUFFER = new AudioBuffer({ length: 2, sampleRate: MINIMAL_AUDIO_CONTEXT.sampleRate });

const SAMPLE_DURATION = 2 / MINIMAL_AUDIO_CONTEXT.sampleRate;

const SCHEDULED_TIMEOUT_FUNCTIONS: TFunctionMap = new Map();

const SCHEDULED_INTERVAL_FUNCTIONS: TFunctionMap = new Map();

const callIntervalFunction = createCallFunction(SCHEDULED_INTERVAL_FUNCTIONS, 'interval');
const callTimeoutFunction = createCallFunction(SCHEDULED_TIMEOUT_FUNCTIONS, 'timeout');
const scheduleFunction = (id: number, delay: number, type: TTimerType) => {
    const now = performance.now();

    const audioBufferSourceNode = new AudioBufferSourceNode(MINIMAL_AUDIO_CONTEXT, { buffer: AUDIO_BUFFER });

    audioBufferSourceNode.onended = () => {
        const elapsedTime = performance.now() - now;

        if (elapsedTime >= delay) {
            type === 'interval' ? callIntervalFunction(id) : callTimeoutFunction(id);
        } else {
            scheduleFunction(id, delay - elapsedTime, type);
        }

        audioBufferSourceNode.disconnect(MINIMAL_AUDIO_CONTEXT.destination);
    };
    audioBufferSourceNode.connect(MINIMAL_AUDIO_CONTEXT.destination);
    audioBufferSourceNode.start(Math.max(0, MINIMAL_AUDIO_CONTEXT.currentTime + delay / 1000 - SAMPLE_DURATION));
};

export const clearInterval = createClearFunction(SCHEDULED_INTERVAL_FUNCTIONS);

export const clearTimeout = createClearFunction(SCHEDULED_TIMEOUT_FUNCTIONS);

export { isSupported };

export const setInterval = (func: Function, delay: number) => {
    const id = generateUniqueNumber(SCHEDULED_INTERVAL_FUNCTIONS);

    SCHEDULED_INTERVAL_FUNCTIONS.set(id, () => {
        func();

        scheduleFunction(id, delay, 'interval');
    });

    scheduleFunction(id, delay, 'interval');

    return id;
};

export const setTimeout = (func: Function, delay: number) => {
    const id = generateUniqueNumber(SCHEDULED_TIMEOUT_FUNCTIONS);

    SCHEDULED_TIMEOUT_FUNCTIONS.set(id, func);

    scheduleFunction(id, delay, 'timeout');

    return id;
};
