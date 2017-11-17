import * as audioContextTimers from '../../src/module';

describe('module', () => {

    describe('clearInterval()', () => {

        it('should not call the function after clearing the interval', (done) => {
            const id = audioContextTimers.setInterval(() => {
                throw new Error('this should never be called');
            }, 100);

            audioContextTimers.clearInterval(id);

            // Wait 200ms to be sure the function never gets called.
            setTimeout(done, 200);
        });

        it('should not call the function anymore after clearing the interval after the first callback', (done) => {
            let id = audioContextTimers.setInterval(() => {
                if (id === null) {
                    throw new Error('this should never be called');
                }

                audioContextTimers.clearInterval(id);
                id = null;
            }, 50);

            // Wait 200ms to be sure the function gets not called anymore.
            setTimeout(done, 200);
        });

    });

    describe('clearTimeout()', () => {

        it('should not call the function after clearing the timeout', (done) => {
            const id = audioContextTimers.setTimeout(() => {
                throw new Error('this should never be called');
            }, 100);

            audioContextTimers.clearTimeout(id);

            // Wait 200ms to be sure the function never gets called.
            setTimeout(done, 200);
        });

    });

    describe('setInterval()', () => {

        let id;

        afterEach(() => {
            audioContextTimers.clearTimeout(id);
        });

        it('should return a numeric id', () => {
            id = audioContextTimers.setInterval(() => {}, 0);

            expect(id).to.be.a('number');
        });

        it('should constantly call a function with the given delay', function (done) {
            this.timeout(4000);

            let before = performance.now();
            let calls = 0;

            function func () {
                const now = performance.now();
                const elapsed = now - before;

                expect(elapsed).to.be.at.least(100);

                // Test five calls.
                if (calls > 4) {
                    done();
                }

                before = now;
                calls += 1;
            }

            id = audioContextTimers.setInterval(func, 100);
        });

    });

    describe('setTimeout()', () => {

        let id;

        afterEach(() => {
            audioContextTimers.clearInterval(id);
        });

        it('should return a numeric id', () => {
            id = audioContextTimers.setTimeout(() => {}, 0);

            expect(id).to.be.a('number');
        });

        it('should postpone a function for the given delay', (done) => {
            const before = performance.now();

            function func () {
                const elapsed = performance.now() - before;

                expect(elapsed).to.be.at.least(100);

                done();
            }

            id = audioContextTimers.setTimeout(func, 100);
        });

    });

});
