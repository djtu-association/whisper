/**
 * Dnode intergration middleware
 * @author PsionicCat Balflear (Wanbo Lu)
 */

var dnode = require('dnode'),
    config = require('../config'),

    dnodeIntegration;

dnodeIntegration = function (server) {
    dnode({
        testDnode: function () {
            return 'hello world';
        }
    }).listen({
        server: config.url,
        port: config.dnode.port
    });
};

module.exports = dnodeIntegration;