/**
 * # whisper Bootloader - standalone bootloader
 * @author PsionicCat Balflear (Wanbo Lu)
 */

var whisper = require('./core'),
    logger    = require('./core/server/logger');

// initialize whisper server
whisper().then(function (whisperServer) {
    // let whisper start
    whisperServer.start();
}).catch(function (error) {
    logger.panic(error);
});