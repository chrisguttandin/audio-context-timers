import { clearInterval, clearTimeout, setInterval, setTimeout } from '../../src/module';

describe('module', () => {
    describe('clearInterval()', () => {
        it('should be a function', () => {
            expect(clearInterval).to.be.a('function');
        });

        if (typeof window !== 'undefined') {
            it('should not call the function after clearing the interval', (done) => {
                const id = setInterval(() => {
                    throw new Error('this should never be called');
                }, 100);

                clearInterval(id);

                // Wait 200ms to be sure the function never gets called.
                setTimeout(done, 200);
            });

            it('should not call the function anymore after clearing the interval after the first callback', (done) => {
                let id = setInterval(() => {
                    if (id === null) {
                        throw new Error('this should never be called');
                    }

                    clearInterval(id);
                    id = null;
                }, 50);

                // Wait 200ms to be sure the function gets not called anymore.
                setTimeout(done, 200);
            });
        }
    });

    describe('clearTimeout()', () => {
        it('should be a function', () => {
            expect(clearTimeout).to.be.a('function');
        });

        if (typeof window !== 'undefined') {
            it('should not call the function after clearing the timeout', (done) => {
                const id = setTimeout(() => {
                    throw new Error('this should never be called');
                }, 100);

                clearTimeout(id);

                // Wait 200ms to be sure the function never gets called.
                setTimeout(done, 200);
            });
        }
    });

    describe('setInterval()', () => {
        it('should be a function', () => {
            expect(setInterval).to.be.a('function');
        });

        if (typeof window !== 'undefined') {
            let id;

            afterEach(() => {
                clearTimeout(id);
            });

            it('should return a numeric id', () => {
                id = setInterval(() => {}, 0);

                expect(id).to.be.a('number');
            });

            // @todo There is currently no way to disable the autoplay policy on BrowserStack or Sauce Labs.
            // eslint-disable-next-line no-undef
            if (!process.env.CI) {
                it('should constantly call a function with the given delay', function (done) {
                    this.timeout(4000);

                    let before = performance.now();
                    let calls = 0;

                    function func() {
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

                    id = setInterval(func, 100);
                });
            }
        }
    });

    describe('setTimeout()', () => {
        it('should be a function', () => {
            expect(setTimeout).to.be.a('function');
        });

        if (typeof window !== 'undefined') {
            let id;

            afterEach(() => {
                clearInterval(id);
            });

            it('should return a numeric id', () => {
                id = setTimeout(() => {}, 0);

                expect(id).to.be.a('number');
            });

            // @todo There is currently no way to disable the autoplay policy on BrowserStack or Sauce Labs.
            // eslint-disable-next-line no-undef
            if (!process.env.CI) {
                it('should postpone a function for the given delay', (done) => {
                    const before = performance.now();

                    function func() {
                        const elapsed = performance.now() - before;

                        expect(elapsed).to.be.at.least(100);

                        done();
                    }

                    id = setTimeout(func, 100);
                });
            }
        }
    });
});
