/**
 * IM module intergration middleware
 * @author PsionicCat Balflear (Wanbo Lu)
 */


var routes  = require('../routes'),
    imIntegration;

imIntegration = function (io) {
    io.on('connection', function (socket) {

        // todo: user authorization and save necessary information into socket
        routes.user(socket);

    });
};

module.exports = imIntegration;