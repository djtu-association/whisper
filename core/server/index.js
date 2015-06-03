/**
 * # server construction - middleware wrapper
 * we have 2 steps to construct a whisper server:
 *     1. wrapping middleware to our server
 *     2. adding several basic server-scoped functions like start(), stop()
 * here is the first step
 * @author PsionicCat Balflear (Wanbo Lu)
 * @type {exports|module.exports} init
 */

var http              = require('http'),
    socketIO          = require('socket.io'),

    Server             = require('./whisper-server'),
    config              = require('./config'),
    middleware       = require('./middleware'),

    init;


init =  function init (options) {
    var server = http.createServer(),
        app = socketIO(server);

    return config.load(options.config).then(function () {
        return config.checkDeprecated();
    }).then(function () {
        // dnode emitting functions wrapped by middleware
        middleware.server(server);

        // socket.io emitting functions also wrapped by middleware
        middleware.im(app);

        return new Server(server);
    });
};

module.exports = init;