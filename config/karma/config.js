module.exports = (config) => {

    config.set({

        concurrency: 2,

        files: [
            {
                included: false,
                pattern: '../../src/**',
                served: false,
                watched: true
            },
            '../../test/unit/**/*.js'
        ],

        frameworks: [
            'mocha',
            'sinon-chai'
        ],

        preprocessors: {
            '../../test/unit/**/*.js': 'webpack'
        },

        webpack: {
            mode: 'development',
            module: {
                rules: [ {
                    test: /\.ts?$/,
                    use: {
                        loader: 'ts-loader'
                    }
                } ]
            },
            resolve: {
                extensions: [ '.js', '.ts' ]
            }
        },

        webpackMiddleware: {
            noInfo: true
        }

    });

    if (process.env.TRAVIS) {

        config.set({

            browserStack: {
                accessKey: process.env.BROWSER_STACK_ACCESS_KEY,
                username: process.env.BROWSER_STACK_USERNAME
            },

            browsers: [
                'ChromeBrowserStack',
                'FirefoxBrowserStack',
                'SafariBrowserStack'
            ],

            captureTimeout: 120000,

            customLaunchers: {
                ChromeBrowserStack: {
                    base: 'BrowserStack',
                    browser: 'chrome',
                    flags: [ '--autoplay-policy=no-user-gesture-required' ],
                    os: 'OS X',
                    os_version: 'Sierra' // eslint-disable-line camelcase
                },
                FirefoxBrowserStack: {
                    base: 'BrowserStack',
                    browser: 'firefox',
                    os: 'OS X',
                    os_version: 'Sierra' // eslint-disable-line camelcase
                },
                SafariBrowserStack: {
                    base: 'BrowserStack',
                    browser: 'safari',
                    os: 'OS X',
                    os_version: 'Sierra' // eslint-disable-line camelcase
                }
            },

            tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER

        });

    } else {

        config.set({

            browsers: [
                'ChromeCanaryHeadlessWithNoRequiredUserGesture',
                'ChromeHeadlessWithNoRequiredUserGesture',
                'FirefoxDeveloperHeadless',
                'FirefoxHeadless',
                'Safari'
            ],

            customLaunchers: {
                ChromeCanaryHeadlessWithNoRequiredUserGesture: {
                    base: 'ChromeCanaryHeadless',
                    flags: [ '--autoplay-policy=no-user-gesture-required' ]
                },
                ChromeHeadlessWithNoRequiredUserGesture: {
                    base: 'ChromeHeadless',
                    flags: [ '--autoplay-policy=no-user-gesture-required' ]
                }
            }

        });

    }

};
