import { createClearFunction } from '../../../src/factories/clear-function';

describe('clearFunction()', () => {
    let clearFunction;
    let functions;
    let id;

    beforeEach(() => {
        id = 17;
        functions = new Map([[id, () => {}]]);

        clearFunction = createClearFunction(functions);
    });

    it('should delete the function with the given id', () => {
        clearFunction(id);

        expect(functions.has(id)).to.be.false;
    });
});
