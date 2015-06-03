/**
 * # config example file
 */
var path = require('path'),
    config;

config = {
    // ### Production
    // When running whisper in the wild, it will be in **production** environment

    // Configure your URL here
    production: {
        // the example url doesn't exists at all. it's just an example.
        url: 'http://whisper.com',

        // current whisper server host and port
        // host and port will be passed to node's `net.Server#listen()`
        server: {
            host: '0.0.0.0',
            // for iisnode set this to `process.env.PORT`
            port: '1333'
        },
        dnode: {
            port: '1332'
        },
        // **UNFINISHED** whisper hub is a hub for multi-whispers distributed system
        //     in order to transferring messages through different whisper instances
        // so far we haven't get this done yet.
        hub: {
            host: '127.0.0.1',
            port: '1444'
        },
        // icollege is used for authorization and other supports (through RESTful APIs)
        icollege: {
            host: '127.0.0.1',
            port: '1222'
        },
        // beanstalkd is used for database queuing
        beanstalkd: {
            host: '127.0.0.1',
            port: '1555'
        }
    },

    // ### Development
    // When running whisper for system developing test (like black box testing),
    // whisper is running in **development** mode,
    // which means that the server is running only for localhost
    development: {
        url: 'http://127.0.0.1:1333',

        // current whisper server host and port
        // host and port will be passed to node's `net.Server#listen()`
        server: {
            host: '127.0.0.1',
            // for iisnode set this to `process.env.PORT`
            port: '1333'
        },
        dnode: {
            port: '1332'
        },
        // **UNFINISHED** whisper hub is a hub for multi-whispers distributed system
        //     in order to transferring messages through different whisper instances
        // so far we haven't get this done yet.
        hub: {
            host: '127.0.0.1',
            port: '1444'
        },
        // icollege is used for authorization and other supports (through RESTful APIs)
        icollege: {
            host: '127.0.0.1',
            port: '1222'
        },
        // beanstalkd is used for database queuing
        beanstalkd: {
            host: '127.0.0.1',
            port: '1555'
        },

        // logging level
        logging: true

    },

    // ### Testing
    // Used when developing whisper to run tests and check the health of whisper
    // Uses a **different** port number
    testing: {
        url: 'http://127.0.0.1:1332',

        // current whisper server host and port
        // host and port will be passed to node's `net.Server#listen()`
        server: {
            host: '127.0.0.1',
            // for iisnode set this to `process.env.PORT`
            port: '1323'
        },
        dnode: {
            port: '1322'
        },
        // **UNFINISHED** whisper hub is a hub for multi-whispers distributed system
        //     in order to transferring messages through different whisper instances
        // so far we haven't get this done yet.
        hub: {
            host: '127.0.0.1',
            port: '1444'
        },
        // icollege is used for authorization and other supports (through RESTful APIs)
        icollege: {
            host: '127.0.0.1',
            port: '1222'
        },
        // beanstalkd is used for database queuing
        beanstalkd: {
            host: '127.0.0.1',
            port: '1555'
        },

        logging: false
    }
};

// Export config
module.exports = config;