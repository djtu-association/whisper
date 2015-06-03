/**
 * # whisper bootloader - dependency bootloader
 * @author PsionicCat Balflear (Wanbo Lu)
 */

var server = require('./server');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// if whisper is been required instead of standalone booting,
// we need options with config json to keep whisper working
function createServer(options) {
    options = options || {};

    return server(options);
}

module.exports = createServer;