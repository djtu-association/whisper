/**
 * Created by Íò²© on 2015/5/4.
 */

var Promise     = require('bluebird'),
    fs           = require('fs'),
    semver = require('semver'),

    packageInfo = require('../../package.json'),
    errors       = require('./errors'),
    config       = require('./config'),

    Server;

Server = function Server(rootServer, rootApp) {
    console.log('whispers-server.js on');
    this.rootServer = rootServer;
    this.rootApp = rootApp;
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
    socket._whispersId = self.connectionId;

    socket.on('close', function () {
        delete self.connections[this._whispersId];
    });

    self.connections[socket._whispersId] = socket;
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
    // Tell users if their node version is not supported, and exit
    if (!semver.satisfies(process.versions.node, packageInfo.engines.node)) {
        console.log(
            '\nERROR: Unsupported version of Node'.red,
            '\nwhispers needs Node version'.red,
            packageInfo.engines.node.yellow,
            'you are using version'.red,
            process.versions.node.yellow,
            '\nPlease go to http://nodejs.org to get a supported version'.green
        );

        process.exit(0);
    }

    // Startup & Shutdown messages
    if (process.env.NODE_ENV === 'production') {
        console.log(
            'whispers is running...'.green,
            '\nYour host is now available on',
            config.url,
            '\nCtrl+C to shut down'.grey
        );
    } else {
        var str = 'whispers is running in ' + process.env.NODE_ENV + '...';
        console.log(str);
        console.log(config.server.host);
        console.log('Listening on' + (config.getSocket() || config.server.host) + ':' + config.server.port);
        console.log('\nUrl configured as:' + config.url);
        console.log('Ctrl+C to shut down'.grey);
    }

    function shutdown() {
        console.log('\nwhispers has shut down'.red);
        if (process.env.NODE_ENV === 'production') {
            console.log(
                '\nYour host is now offline'
            );
        } else {
            console.log(
                '\nwhispers was running for',
                Math.round(process.uptime()),
                'seconds'
            );
        }
        process.exit(0);
    }
    // ensure that whispers exits correctly on Ctrl+C and SIGTERM
    process.
        removeAllListeners('SIGINT').on('SIGINT', shutdown).
        removeAllListeners('SIGTERM').on('SIGTERM', shutdown);
};

Server.prototype.logUpgradeWarning = function () {
    //todo: log this error: startup timeout as an npm module
    //errors.logWarn(
    //    'whispers no longer starts automatically when using it as an npm module.',
    //    'If you\'re seeing this message, you may need to update your custom code.',
    //    'Please see the docs at http://tinyurl.com/npm-upgrade for more information.'
    //);
    console.log('error: whispers system does not start automatically. plz check your custom code');
};

Server.prototype.start = function (externalServer, externalApp) {
    console.log('server prototype start');
    var self = this,
        rootServer = externalServer ? externalServer : self.rootServer,
        rootApp = externalApp ? externalApp : self.rootApp;

    // ## Start whispers App
    return new Promise(function (resolve) {
        console.log('server start returning');
        if (config.getSocket()) {
            console.log('server getSocket');
            // Make sure the socket is gone before trying to create another
            try {
                fs.unlinkSync(config.getSocket());
            } catch (e) {
                // We can ignore this.
            }

            self.workingServer = rootServer.listen(config.getSocket());

            fs.chmod(config.getSocket(), '0660');
        } else {
            console.log('start lestening on ' + config.server.port);
            self.workingServer = rootServer.listen(config.server.port);
        }

        self.workingServer.on('error', function (error) {
            if (error.errno === 'EADDRINUSE') {
                //errors.logError(
                console.log(
                    '(EADDRINUSE) Cannot start whispers.',
                    'Port ' + config.server.port + ' is already in use by another program.',
                    'Is another whispers instance already running?'
                );
            } else {
                //errors.logError(
                console.log(
                    '(Code: ' + error.errno + ')',
                    'There was an error starting your server.',
                    'Please use the error code above to search for a solution.'
                );
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
    console.log('whispers is closing connections'.red);
};

module.exports = Server;