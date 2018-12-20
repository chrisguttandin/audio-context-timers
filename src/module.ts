import { generateUniqueNumber } from 'fast-unique-numbers';
import { AudioBuffer, AudioBufferSourceNode, MinimalAudioContext, isSupported } from 'standardized-audio-context';
import { TFunctionMap, TTimerType } from './types';

const MINIMAL_AUDIO_CONTEXT = new MinimalAudioContext();

const AUDIO_BUFFER = new AudioBuffer({ length: 2, sampleRate: MINIMAL_AUDIO_CONTEXT.sampleRate });

const SAMPLE_DURATION = 2 / MINIMAL_AUDIO_CONTEXT.sampleRate;

const SCHEDULED_TIMEOUT_FUNCTIONS: TFunctionMap = new Map();

const SCHEDULED_INTERVAL_FUNCTIONS: TFunctionMap = new Map();

const callIntervalFunction = (id: number, type: TTimerType) => {
    const functions = (type === 'interval') ? SCHEDULED_INTERVAL_FUNCTIONS : SCHEDULED_TIMEOUT_FUNCTIONS;

    if (functions.has(id)) {
        const func = functions.get(id);

        if (func !== undefined) {
            func();

            if (type === 'timeout') {
                SCHEDULED_TIMEOUT_FUNCTIONS.delete(id);
            }
        }
    }
};

const scheduleFunction = (id: number, delay: number, type: TTimerType) => {
    const now = performance.now();

    const audioBufferSourceNode = new AudioBufferSourceNode(MINIMAL_AUDIO_CONTEXT, { buffer: AUDIO_BUFFER });

    audioBufferSourceNode.onended = () => {
        const elapsedTime = performance.now() - now;

        if (elapsedTime >= delay) {
            callIntervalFunction(id, type);
        } else {
            scheduleFunction(id, delay - elapsedTime, type);
        }
    };
    audioBufferSourceNode.connect(MINIMAL_AUDIO_CONTEXT.destination);
    audioBufferSourceNode.start(Math.max(0, MINIMAL_AUDIO_CONTEXT.currentTime + (delay / 1000) - SAMPLE_DURATION));
};

export const clearInterval = (id: number) => {
    SCHEDULED_INTERVAL_FUNCTIONS.delete(id);
};

export const clearTimeout = (id: number) => {
    SCHEDULED_TIMEOUT_FUNCTIONS.delete(id);
};

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
