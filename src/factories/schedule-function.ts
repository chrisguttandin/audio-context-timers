import type { IAudioBuffer, IAudioBufferSourceNode, IMinimalAudioContext } from 'standardized-audio-context';
import { TTimerType } from '../types';
import type { createCallFunction } from './call-function';

export const createScheduleFunction = (
    callFunction: ReturnType<typeof createCallFunction>,
    createAudioBuffer: (length: number, sampleRate: number) => IAudioBuffer,
    createAudioBufferSourceNode: (
        minimalAudioContext: ReturnType<typeof createMinimalAudioContext>,
        audioBuffer: ReturnType<typeof createAudioBuffer>
    ) => IAudioBufferSourceNode<typeof minimalAudioContext>,
    createMinimalAudioContext: () => IMinimalAudioContext,
    performance: Pick<Performance, 'now'>
) => {
    let audioBuffer: null | ReturnType<typeof createAudioBuffer> = null;
    let minimalAudioContext: null | ReturnType<typeof createMinimalAudioContext> = null;

    const scheduleFunction = (id: number, delay: number, type: TTimerType) => {
        const now = performance.now();

        if (minimalAudioContext === null) {
            minimalAudioContext = createMinimalAudioContext();
        }

        const { destination, sampleRate } = minimalAudioContext;

        if (audioBuffer === null) {
            audioBuffer = createAudioBuffer(2, sampleRate);
        }

        const audioBufferSourceNode = createAudioBufferSourceNode(minimalAudioContext, audioBuffer);

        audioBufferSourceNode.onended = () => {
            const elapsedTime = performance.now() - now;

            if (elapsedTime >= delay) {
                callFunction(id);
            } else {
                scheduleFunction(id, delay - elapsedTime, type);
            }

            audioBufferSourceNode.disconnect(destination);
        };

        audioBufferSourceNode.connect(destination);
        audioBufferSourceNode.start(Math.max(0, minimalAudioContext.currentTime + delay / 1000 - audioBuffer.duration));
    };

    return scheduleFunction;
};
