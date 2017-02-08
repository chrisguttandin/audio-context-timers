import { AudioContext, isSupported } from 'standardized-audio-context';

const AUDIO_CONTEXT = new AudioContext();

const AUDIO_BUFFER = AUDIO_CONTEXT.createBuffer(1, 2, AUDIO_CONTEXT.sampleRate);

const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1;

const SAMPLE_DURATION = 2 / AUDIO_CONTEXT.sampleRate;

const SCHEDULED_TIMEOUT_FUNCTIONS: Map<number, Function> = new Map();

const SCHEDULED_INTERVAL_FUNCTIONS: Map<number, Function> = new Map();

const callIntervalFunction = (id, type) => {
    const functions = (type === 'interval') ? SCHEDULED_INTERVAL_FUNCTIONS : SCHEDULED_TIMEOUT_FUNCTIONS;

    if (functions.has(id)) {
        const func = functions.get(id);

        if (func) {
            func();
        }
    }
};

const generateUniqueId = (map) => {
    let id = Math.round(Math.random() * MAX_SAFE_INTEGER);

    while (map.has(id)) {
        id = Math.round(Math.random() * MAX_SAFE_INTEGER);
    }

    return id;
};

const scheduleFunction = (id, delay, type) => {
    const now = performance.now();

    const audioBufferSourceNode = AUDIO_CONTEXT.createBufferSource();

    audioBufferSourceNode.buffer = AUDIO_BUFFER;
    audioBufferSourceNode.onended = () => {
        const elapsedTime = performance.now() - now;

        if (elapsedTime >= delay) {
            callIntervalFunction(id, type);
        } else {
            scheduleFunction(id, delay - elapsedTime, type);
        }
    };
    audioBufferSourceNode.connect(AUDIO_CONTEXT.destination);
    audioBufferSourceNode.start(AUDIO_CONTEXT.currentTime + (delay / 1000) - SAMPLE_DURATION);
};

export const clearTimeout = (id: number) => {
    SCHEDULED_TIMEOUT_FUNCTIONS.delete(id);
};

export const clearInterval = (id: number) => {
    SCHEDULED_INTERVAL_FUNCTIONS.delete(id);
};

export { isSupported };

export const setTimeout = (func: Function, delay: number) => {
    const id = generateUniqueId(SCHEDULED_TIMEOUT_FUNCTIONS);

    SCHEDULED_TIMEOUT_FUNCTIONS.set(id, func);

    scheduleFunction(id, delay, 'timeout');

    return id;
};

export const setInterval = (func: Function, delay: number) => {
    const id = generateUniqueId(SCHEDULED_INTERVAL_FUNCTIONS);

    SCHEDULED_INTERVAL_FUNCTIONS.set(id, () => {
        func();

        scheduleFunction(id, delay, 'interval');
    });

    scheduleFunction(id, delay, 'interval');

    return id;
};
