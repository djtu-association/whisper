/**
 * # middleware hub
 * @author PsionicCat Balflear (Wanbo Lu)
 * @type {setupMiddleware|exports|module.exports}
 */
var serverMiddleware = require('./server'),
    imIntergration = require('./im-integration'),
    dnodeIntergration = require('./dnode-integration');

//is server middleware necessary now?
module.exports = {
    server: serverMiddleware,
    im: imIntergration,
    dnode: dnodeIntergration
};