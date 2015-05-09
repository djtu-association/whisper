/**
 * Created by Íò²© on 2015/4/22.
 */

var path = require('path'),
    config;

config = {
    // ### Production
    // When running Ghost in the wild, use the production environment
    // Configure your URL and mail settings here
    production: {
        url: 'http://whispers.com',

        server: {
            // Host to be passed to node's `net.Server#listen()`
            host: '127.0.0.1',
            // Port to be passed to node's `net.Server#listen()`, for iisnode set this to `process.env.PORT`
            port: '1333'
        }
    },

    // ### Development **(default)**
    development: {
        // The url to use when providing links to the site, E.g. in RSS and email.
        url: 'http://localhost:1333',

        // server config
        server: {
            // Host to be passed to node's `net.Server#listen()`
            host: '127.0.0.1',
            // Port to be passed to node's `net.Server#listen()`, for iisnode set this to `process.env.PORT`
            port: '1333'
        },
        // paths config
        paths: {
            // do we need this?
            contentPath: path.join(__dirname, '/content/')
        },

        // logging level
        logging: true

    },

    // ### Testing
    // Used when developing Ghost to run tests and check the health of Ghost
    // Uses a different port number
    testing: {
        url: 'http://127.0.0.1:1333',

        server: {
            host: '127.0.0.1',
            port: '1333'
        },
        logging: false
    }
};

// Export config
module.exports = config;