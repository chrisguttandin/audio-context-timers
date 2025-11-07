import { createCallFunction } from '../../../src/factories/call-function';
import { spy } from 'sinon';

describe('callFunction()', () => {
    let func;
    let functions;
    let id;

    beforeEach(() => {
        func = spy();
        id = 17;
        functions = new Map([[id, func]]);
    });

    describe('with a timer of type interval', () => {
        let callFunction;

        beforeEach(() => {
            callFunction = createCallFunction(functions, 'interval');
        });

        it('should call the function with the given id', () => {
            callFunction(id);

            expect(func).to.have.been.calledOnce;
        });

        it('should not delete the function with the given id', () => {
            callFunction(id);

            expect(functions.has(id)).to.be.true;
        });
    });

    describe('with a timer of type timeout', () => {
        let callFunction;

        beforeEach(() => {
            callFunction = createCallFunction(functions, 'timeout');
        });

        it('should call the function with the given id', () => {
            callFunction(id);

            expect(func).to.have.been.calledOnce;
        });

        it('should delete the function with the given id', () => {
            callFunction(id);

            expect(functions.has(id)).to.be.false;
        });
    });
});
