/**
 * Created by Íò²© on 2015/5/3.
 */
var serverMiddleware = require('./server'),
    imMiddleware = require('./im');


module.exports = {
    server: serverMiddleware,
    im: imMiddleware
};