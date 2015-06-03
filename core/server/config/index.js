/**
 * @author Psioniccat Balflear (Wanbo Lu)
 */

var path          = require('path'),
    Promise       = require('bluebird'),
    fs              = require('fs'),
    validator      = require('validator'),
    url             = require('url'),
    _               = require('lodash'),

    packageInfo   = require('../../../package.json'),

    logger          = require('../logger'),
    appRoot       = path.resolve(__dirname, '../../..'),
    corePath      = path.resolve(appRoot, 'core/'),
    testingEnvs   = ['testing'],
    defaultConfig = {};

function ConfigManager(config) {
    this._config = {};

    //this.urlFor = configUrl.urlFor;

    if (config && _.isObject(config)) {
        this.set(config);
    }
}

ConfigManager.prototype.getSocket = function () {
    var socketConfig,
        values = {
            path: path.join(this._config.paths.contentPath, process.env.NODE_ENV + '.socket'),
            permissions: '660'
        };

    if (this._config.server.hasOwnProperty('socket')) {
        socketConfig = this._config.server.socket;

        if (_.isString(socketConfig)) {
            values.path = socketConfig;

            return values;
        }

        if (_.isObject(socketConfig)) {
            values.path = socketConfig.path || values.path;
            values.permissions = socketConfig.permissions || values.permissions;

            return values;
        }
    }

    return false;
};

ConfigManager.prototype.getSocket = function () {
    var socketConfig,
        values = {
            path: path.join(this._config.paths.contentPath, process.env.NODE_ENV + '.socket'),
            permissions: '660'
        };

    if (this._config.server.hasOwnProperty('socket')) {
        socketConfig = this._config.server.socket;

        if (_.isString(socketConfig)) {
            values.path = socketConfig;

            return values;
        }

        if (_.isObject(socketConfig)) {
            values.path = socketConfig.path || values.path;
            values.permissions = socketConfig.permissions || values.permissions;

            return values;
        }
    }

    return false;
};

ConfigManager.prototype.init = function (rawConfig) {
    var self = this;

    self.set(rawConfig);

    return Promise.resolve(self._config);
};

ConfigManager.prototype.set = function (config) {
    var localPath = '',
        contentPath,
        subdir;

    _.merge(this._config, config);

    this._config.paths = this._config.paths || {};

    if (this._config.url) {
        localPath = url.parse(this._config.url).path;
        if (localPath !== '/') {
            localPath = localPath.replace(/\/$/, '');
        }
    }

    subdir = localPath === '/' ? '' : localPath;


    contentPath = this._config.paths.contentPath || path.resolve(appRoot, 'content');

    // merge dynamic parameters into config object
    _.merge(this._config, {
        whispersVersion: packageInfo.version,
        paths: {
            appRoot : appRoot,
            contentPath:      contentPath,
            subdir: subdir,
            config: this._config.paths.config || path.join(appRoot, 'config.js'),
            configExample: path.join(appRoot, 'config.example.js'),
            corePath : corePath
        }
    });

    _.extend(this, this._config);
};

ConfigManager.prototype.get = function () {
    return this._config;
};

ConfigManager.prototype.load = function (configFilePath) {
    var self = this;

    self._config.paths.config = process.env.WHISPERS_CONFIG || configFilePath || self._config.paths.config;

    return new Promise(function (resolve, reject) {
        fs.exists(self._config.paths.config, function (exists) {
            var pendingConfig;

            if(!exists) {
                pendingConfig = self.writeFile();
            }

            Promise.resolve(pendingConfig).then(function () {
                return self.validate();
            }).then(function (rawConfig) {
                resolve(self.init(rawConfig));
            }).catch(reject);
        });
    });
};

ConfigManager.prototype.writeFile = function () {
    var configPath = this._config.paths.config,
        configExamplePath = this._config.paths.configExample;

    return new Promise(function (resolve) {
        fs.exists(configExamplePath, function checkTemplate(templateExists) {
            var readStream,
                writeStream;

            if (!templateExists) {
                var message = '\nUnable to read or write configure file',
                    detail = '\nLocation: ' + appRoot,
                    hint = '\nPlease check config.js and config.example.js';
                logger.throwAndLog(message, detail, hint);
            }

            readStream = fs.createReadStream(configExamplePath);
            readStream.on('error', function (error) {
                return logger.reject(error);
            });

            writeStream = fs.createWriteStream(configPath);
            writeStream.on('error', function (error) {
                return logger.reject(error);
            });

            writeStream.on('finish', resolve);

            readStream.pipe(writeStream);
        });
    });
};

ConfigManager.prototype.readFile = function (envVal) {
    return require(this._config.paths.config)[envVal];
};

ConfigManager.prototype.validate = function () {
    var envVal = process.env.Node_ENV,
        hasHostAndPort,
        config,
        parsedUrl;

    try {
        config = this.readFile(envVal);
    } catch (error) {
        return logger.reject(error);
    }

    var message;
    if (!config) {
        message = '\n Unable to load configuration for Node_ENV==' + envVal;
        return logger.reject(message);
    }

    if (!validator.isURL(config.url, {protocols: ['http', 'https']})) {
        message = '\nInvalid site url in configuration file';
        return logger.reject(message);
    }

    parsedUrl = url.parse(config.url || 'invalid', false, true);

    if (/\/whisper(\/|$)/.test(parsedUrl.pathname)) {
        message = '\nInstance path with \'whisper\' which is not allowed';
        return logger.reject(message);
    }

    //todo: check icollege host and port in config.js
    hasHostAndPort = config.server && !!config.server.host && !!config.server.port;

    if (!config.server || !(hasHostAndPort)) {
        message = '\nInvalid server host or port. ';
        return logger.reject(message);
    }

    return Promise.resolve(config);
};

// privacy settings is handled by icollege, so this function is deprecated
//ConfigManager.prototype.isPrivacyDisabled = function (privacyFlag) {
//    if (!this.privacy) {
//        return false;
//    }
//
//    if (this.privacy.useTinfoil === true) {
//        return true;
//    }
//
//    return this.privacy[privacyFlag] === false;
//};

/**
 * Check if any of the currently set config items are deprecated, and issues a warning.
 */
ConfigManager.prototype.checkDeprecated = function () {
    var self = this;
    _.each(this.deprecatedItems, function (property) {
        self.displayDeprecated(self, property.split('.'), []);
    });
};

ConfigManager.prototype.displayDeprecated = function (item, properties, address) {
    var self = this,
        property = properties.shift(),
        message,
        detail,
        hint;

    address.push(property);

    if (item.hasOwnProperty(property)) {
        if (properties.length) {
            return self.displayDeprecated(item[property], properties, address);
        }
        message = 'The configuration property [' + address.join('.').bold + '] has been deprecated.';
        detail = 'This will be removed in a future version, please update your config.js file.';
        hint = 'Please check https://42.96.195.83/association/whisper/blob/master/config.example.js ' +
            'for the most up-to-date example.';
        logger.warn(message, detail, hint);
    }
};

if (testingEnvs.indexOf(process.env.NODE_ENV) > -1) {
    defaultConfig  = require('../../../config.example')[process.env.NODE_ENV];
}

module.exports = new ConfigManager(defaultConfig);
