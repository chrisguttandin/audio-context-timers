import { TFunctionMap, TTimerType } from '../types';

export const createCallFunction = (functions: TFunctionMap, type: TTimerType) => (id: number) => {
    if (functions.has(id)) {
        const func = functions.get(id);

        if (func !== undefined) {
            func();

            if (type === 'timeout') {
                functions.delete(id);
            }
        }
    }
};
