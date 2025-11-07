import { generateUniqueNumber } from 'fast-unique-numbers';
import {
    AudioBuffer,
    AudioBufferSourceNode,
    IAudioBuffer,
    IMinimalAudioContext,
    MinimalAudioContext,
    isSupported
} from 'standardized-audio-context';
import { createCallFunction } from './factories/call-function';
import { createClearFunction } from './factories/clear-function';
import { createScheduleFunction } from './factories/schedule-function';
import { TFunctionMap } from './types';

const SCHEDULED_INTERVAL_FUNCTIONS: TFunctionMap = new Map();
const callIntervalFunction = createCallFunction(SCHEDULED_INTERVAL_FUNCTIONS, 'interval');

export const clearInterval = createClearFunction(SCHEDULED_INTERVAL_FUNCTIONS);

const SCHEDULED_TIMEOUT_FUNCTIONS: TFunctionMap = new Map();
const callTimeoutFunction = createCallFunction(SCHEDULED_TIMEOUT_FUNCTIONS, 'timeout');

export const clearTimeout = createClearFunction(SCHEDULED_TIMEOUT_FUNCTIONS);

export { isSupported };

const createAudioBuffer = (length: number, sampleRate: number) => new AudioBuffer({ length, sampleRate });
const createAudioBufferSourceNode = (minimalAudioContext: IMinimalAudioContext, audioBuffer: IAudioBuffer) =>
    new AudioBufferSourceNode(minimalAudioContext, { buffer: audioBuffer });
const createMinimalAudioContext = () => new MinimalAudioContext();
const scheduleIntervalFunction = createScheduleFunction(
    callIntervalFunction,
    createAudioBuffer,
    createAudioBufferSourceNode,
    createMinimalAudioContext,
    performance
);

export const setInterval = (func: Function, delay: number) => {
    const id = generateUniqueNumber(SCHEDULED_INTERVAL_FUNCTIONS);

    SCHEDULED_INTERVAL_FUNCTIONS.set(id, () => {
        func();

        scheduleIntervalFunction(id, delay, 'interval');
    });

    scheduleIntervalFunction(id, delay, 'interval');

    return id;
};

const scheduleTimeoutFunction = createScheduleFunction(
    callTimeoutFunction,
    createAudioBuffer,
    createAudioBufferSourceNode,
    createMinimalAudioContext,
    performance
);

export const setTimeout = (func: Function, delay: number) => {
    const id = generateUniqueNumber(SCHEDULED_TIMEOUT_FUNCTIONS);

    SCHEDULED_TIMEOUT_FUNCTIONS.set(id, func);

    scheduleTimeoutFunction(id, delay, 'timeout');

    return id;
};
