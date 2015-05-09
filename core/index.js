/**
 * # whispers bootloader
 * Created by PsionicCat Balflear on 2015/4/21.
 */

var server = require('./server');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

function createServer(options) {
    console.log('createServer');
    options = options || {};

    return server(options);
}

module.exports = createServer;