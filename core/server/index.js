/**
 * Created by PsionicCat Balflear on 2015/5/3.
 */

var express         = require('express'),
    http             = require('http'),
    socketIO        = require('socket.io'),
    Promise         = require('bluebird'),
    methodOverride = require('method-override'),

    Server           = require('./whispers-server'),
    config           = require('./config'),
    middleware      = require('./middleware');


function init(options) {
    console.log('.\\core\\server\\index.js\n');

    var expressApp = express(),
        server = http.Server(expressApp),
        application = socketIO(server);

    return config.load(options.config).then(function () {
        console.log('config.load completed');
        //console.log(config);
        return config.checkDeprecated();
    }).then(function () {
        // return the correct mime type for woff filess
        express['static'].mime.define({'application/font-woff': ['woff']});

        // enabled gzip compression by default
        //if (config.server.compress !== false) {
        //    application.use(compress());
        //}

        // override with http method having ?_method=DELETE or something else
        application.use(methodOverride('_method'));
        console.log('return new server');
        return new Server(server, application);
    });
}

module.exports = init;