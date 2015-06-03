/**
 * server-side middleware
 * @type {posix|exports|module.exports} middleware installer
 */

var setupMiddleware;

// the server created can be argument of setupMiddleware()
setupMiddleware = function () {
    //dnode.listen(server);
    //var logging = config.logging,
    //    subdir = config.paths.subdir,
    //    contentPath = config.paths.contentPath,
    //    corePath = config.paths.corePath;
    //
    //expressServer = server;
    //console.log(server);
    ////expressServer.enable('trust proxy');
    //
    //if (logging !== false) {
    //    if (expressServer.get('env') !== 'development') {
    //        expressServer.use(logger(logging || {}));
    //    } else {
    //        expressServer.use(logger(logging || 'dev'));
    //    }
    //}

    //expressServer.use(subdir, favicon(contentPath + '/resources/icons/favicon.png'));
    //
    //// ### Static assets
    ////expressServer.use(subdir + '/', express['static'](path.join(contentPath), {maxAge: utils.ONE_YEAR_MS}));
    //expressServer.use(subdir + '/', express['static'](path.join(contentPath)));
};

module.exports = setupMiddleware;