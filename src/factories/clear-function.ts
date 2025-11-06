import { TFunctionMap } from '../types';

export const createClearFunction = (functions: TFunctionMap) => (id: number) => {
    functions.delete(id);
};
