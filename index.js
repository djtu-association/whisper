/**
 * # whisper Bootloader
 * Created by PsionicCat Balflear on 2015/4/21.
 */

var express      = require('express'),
    socketIO      = require('socket.io'),
    whisper      = require('./core'),
    errors        = require('./core/server/errors');

    //parentServer  = express(),
    //parentApp     = socketIO();

whisper().then(function (whisperServer) {

    whisperServer.start();
});