/**
 * Created by Íò²© on 2015/5/14.
 */


var routes  = require('../routes'),
    setupMiddleware;

setupMiddleware = function (io) {
    io.on('connection', function (socket) {

        routes.user(socket);

    });
};

module.exports = setupMiddleware;