/**
 * Created by PsionicCat Balflear on 2015/5/3.
 */

var path           = require('path'),
    Promise        = require('bluebird'),
    fs              = require('fs'),
    validator      = require('validator'),
    url             = require('url'),
    _               = require('lodash'),

    packageInfo   = require('../../../package.json'),

    appRoot        = path.resolve(__dirname, '../../..'),
    corePath       = path.resolve(appRoot, 'core/'),
    testingEnvs   = ['testing'],
    defaultConfig = {};

function ConfigManager(config) {
    console.log('ConfigManager constructor from \\core\\server\\config\\index.js');
    this._config = {};

    //this.urlFor = configUrl.urlFor;

    if (config && _.isObject(config)) {
        this.set(config);
    }
}

ConfigManager.prototype.getSocket = function () {
    console.log('config getSocket begining');
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
    console.log('config get socket');
    var socketConfig,
        values = {
            path: path.join(this._config.paths.contentPath, process.env.NODE_ENV + '.socket'),
            permissions: '660'
        };

    console.log(values);
    console.log(this._config.server.hasOwnProperty('socket'));
    if (this._config.server.hasOwnProperty('socket')) {
        console.log(this._config);
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
    console.log('ConfigManager init from \\core\\server\\config\\index.js');
    // 由于this的灵活性，我们需要保留当前对象的“句柄”来进行操作
    var self = this;

    self.set(rawConfig);

    return Promise.resolve(self._config);
};

ConfigManager.prototype.set = function (config) {
    var localPath = '',
        contentPath,
        subdir;


    // 使用merge函数避免undefined带来的问题
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

    // 通常的配置项都应在config.js中
    // 但存在一些动态配置项或特殊原因
    // 无法或不应写入静态文件的配置项
    // 在此一并通过merge合并到配置中
    _.merge(this._config, {
        whispersVersion: packageInfo.version,
        paths: {
            appRoot : appRoot,
            subdir: subdir,
            config: this._config.paths.config || path.join(appRoot, 'config.js'),
            configExample: path.join(appRoot, 'config.example.js'),
            corePath : corePath
        }
    });

    //configUrl.setConfig(this._config);

    // 将处理好的配置复制到当前config对象
    _.extend(this, this._config);
};

ConfigManager.prototype.get = function () {
    return this._config;
};

ConfigManager.prototype.load = function (configFilePath) {
    console.log('ConfigManager load from \\core\\server\\config\\index.js');
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
    console.log('ConfigManager writefile from \\core\\server\\config\\index.js')
    var configPath = this._config.paths.config,
        configExamplePath = this._config.paths.configExample;

    return new Promise(function (resolve, reject) {
        fs.exists(configExamplePath, function checkTemplate(templateExists) {
            var readStream,
                writeStream,
                error;

            if (!templateExists) {
                error = new Error('无法定位配置文件。');
                error.context = appRoot;
                error.help = '请检查部署实例的config.js或者config.example.js文件是否可用。';

                return reject(error);
            }

            readStream = fs.createReadStream(configExamplePath);
            readStream.on('error', function (error) {
                // todo: log this error
                reject(error);
            });

            writeStream = fs.createWriteStream(configPath);
            writeStream.on('error', function (error) {
                //todo: log this error
                reject(error);
            });

            writeStream.on('finish', resolve);

            readStream.pipe(writeStream);
        });
    });
};

ConfigManager.prototype.readFile = function (envVal) {
    console.log('ConfigManager readfile envVal:' + envVal);
    return require(this._config.paths.config)[envVal];
};

ConfigManager.prototype.validate = function () {
    console.log('ConfigManager validate from \\core\\server\\config\\index.js');
    var envVal = process.env.Node_ENV,
        hasHostAndPort,
        config,
        parsedUrl;

    console.log('ConfigManager validate env:' + envVal);
    try {
        config = this.readFile(envVal);
    } catch (error) {
        return Promise.reject(error);
    }

    if (!config) {
        //todo: log this error: cannot find the configuration for the current NODE_ENV
        return Promise.reject(new Error('无法加载NODE_ENV为' + envVal + '时的配置。'));
    }

    if (!validator.isURL(config.url, {protocols: ['http', 'https']})) {
        //todo: log this error: invalid site url
        return Promise.reject(new Error('配置文件中指定的站点URL无效。'))
    }

    parsedUrl = url.parse(config.url || 'invalid', false, true);

    if (/\/icollege(\/|$)/.test(parsedUrl.pathname)) {
        //todo: log this error: path contains 'whispers'
        return Promise.reject(new Error('部署实例所在路径不应包含whispers目录'));
    }

    //todo: check icollege host and port in config.js
    hasHostAndPort = config.server && !!config.server.host && !!config.server.port;

    if (!config.server || !(hasHostAndPort)) {
        //todo: log this error: invalid server configuration
        return Promise.reject(new Error('无效的服务器主机或端口设定'));
    }

    return Promise.resolve(config);
};

ConfigManager.prototype.isPrivacyDisabled = function (privacyFlag) {
    if (!this.privacy) {
        return false;
    }

    if (this.privacy.useTinfoil === true) {
        return true;
    }

    return this.privacy[privacyFlag] === false;
};

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
        errorText,
        explanationText,
        helpText;

    address.push(property);

    if (item.hasOwnProperty(property)) {
        if (properties.length) {
            return self.displayDeprecated(item[property], properties, address);
        }
        errorText = 'The configuration property [' + address.join('.').bold + '] has been deprecated.';
        explanationText =  'This will be removed in a future version, please update your config.js file.';
        helpText = 'Please check https://42.96.195.83/guanggu/icollege/blob/master/config.example.js for the most up-to-date example.';
        errors.logWarn(errorText, explanationText, helpText);
    }
};

module.exports = new ConfigManager(defaultConfig);
