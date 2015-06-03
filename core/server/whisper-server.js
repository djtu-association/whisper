/**
 * @author PsionicCat Balflear (Wanbo Lu)
 * @type {Promise|exports|module.exports} required server object with basic functions
 */

var Promise     = require('bluebird'),
    fs           = require('fs'),
    semver = require('semver'),

    packageInfo = require('../../package.json'),
    logger = require('./logger'),
    config       = require('./config'),
    middleware = require('./middleware'),

    Server;


Server = function Server (rootServer) {
    this.rootServer = rootServer;
    this.workingServer = null;
    this.connections = {};
    this.connectionId = 0;
    this.upgradeWarning = setTimeout(this.logUpgradeWarning.bind(this), 5000);

    // Expose config module for use externally.
    this.config = config;
};

Server.prototype.connection = function (socket) {
    var self = this;

    self.connectionId += 1;
    socket._whisperId = self.connectionId;

    socket.on('close', function () {
        delete self.connections[this._whisperId];
    });

    self.connections[socket._whisperId] = socket;
};

// Most browsers keep a persistent connection open to the server
// which prevents the close callback of workingServer from returning
// We need to destroy all connections manually
Server.prototype.closeConnections = function () {
    var self = this;

    Object.keys(self.connections).forEach(function (socketId) {
        var socket = self.connections[socketId];

        if (socket) {
            socket.destroy();
        }
    });
};

Server.prototype.logStartMessages = function () {
    var message, detail, hint;
    // Tell users if their node version is not supported, and exit
    if (!semver.satisfies(process.versions.node, packageInfo.engines.node)) {
        message = "Unsupported version of Node.js engine";
        detail = "whisper needs Node.js version: " + packageInfo.engines.node + ". " +
            "you are using version: " + process.versions.node;
        hint = "Please go to https://nodejs.org to get a supported version";
        logger.panic(message, detail, hint);
    }

    // Startup & Shutdown messages
    if (process.env.NODE_ENV === 'production') {
        message = 'whisper is running. :-)';
        detail = 'Your host is now available on' + config.url;
        hint = 'press Ctrl + C to shut down';
        logger.startup(message, detail, hint);
    } else {
        message = 'whisper is running in ' + process.env.NODE_ENV + ' environment. :-)';
        detail = 'Socket IO server listening on ' +
            (config.getSocket() || config.server.host + ':' + config.server.port) +
            '\n Url configured as: ' + config.url;
        hint = 'press Ctrl + C to shut down';
        logger.startup(message, detail, hint);
    }

    // invoking this may cause a shutdown
    function shutdown() {
        var message = 'whisper has shut down. ',
            detail;
        if (process.env.NODE_ENV === 'production') {
            detail = '\nYour host is now offline. ';
        } else {
            detail = '\nwhisper was running for ' + Math.round(process.uptime()) + ' seconds';
        }
        logger.shutdown(message, detail);
    }
    // ensure that whisper exits correctly on Ctrl+C and SIGTERM
    process.
        removeAllListeners('SIGINT').on('SIGINT', shutdown).
        removeAllListeners('SIGTERM').on('SIGTERM', shutdown);
};

Server.prototype.logUpgradeWarning = function () {
    var message = 'whisper startup is timeout',
        detail = 'whisper do not starts automatically when using it as an npm module. ',
        hint = 'If you\'re seeing this message, you may need to check your custom code. ';
    logger.warn(message, detail, hint);
};

Server.prototype.start = function (externalServer) {
    var self = this,
        rootServer = externalServer ? externalServer : self.rootServer;

    // ## Start whisper App
    return new Promise(function (resolve) {
        if (config.getSocket()) {
            // Make sure the socket is gone before trying to create another
            try {
                fs.unlinkSync(config.getSocket());
            } catch (e) {
                // We can ignore this.
            }

            self.workingServer = rootServer.listen(config.getSocket());

            // lock current socket with opcodes:
            // 0660 => rw-rw-----
            // > search **chmod** for more information
            fs.chmod(config.getSocket(), '0660');
        } else {
            self.workingServer = rootServer.listen(config.server.port, config.server.host);
            middleware.dnode(self.workingServer);
        }

        self.workingServer.on('error', function (error) {
            var message, detail, hint;
            if (error.errno === 'EADDRINUSE') {
                message = '(EADDRINUSE) Cannot start whisper. ';
                detail = 'Port' + config.server.port + ' is already in use by another program. ';
                hint = 'Is another whisper instance already running? ';
                logger.error(message, detail, hint);
            } else {
                message = 'Code: ' + error.errno + '. ';
                detail = 'Please use the error code above to search for a solution';
                logger.error(message, detail);
            }
            process.exit(-1);
        });
        self.workingServer.on('connection', self.connection.bind(self));
        self.workingServer.on('listening', function () {
            self.logStartMessages();
            clearTimeout(self.upgradeWarning);
            resolve(self);
        });
    });
};

Server.prototype.stop = function () {
    var self = this;

    return new Promise(function (resolve) {
        if (self.workingServer === null) {
            resolve(self);
        } else {
            self.workingServer.close(function () {
                self.workingServer = null;
                self.logShutdownMessages();
                resolve(self);
            });

            self.closeConnections();
        }
    });
};

Server.prototype.restart = function () {
    return this.stop().then(this.start.bind(this));
};

Server.prototype.logShutdownMessages = function () {
    console.log('whisper is closing connections'.red);
};

module.exports = Server;