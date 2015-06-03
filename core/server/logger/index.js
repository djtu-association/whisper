/**
 * # whisper logger
 * This is an encapsulation for different types of logging.
 * We recommend all developers to deprecate all other ways like ``console.log()``
 *     and use these functions instead.
 * @author PsionicCat Balflear (Wanbo Lu)
 * @type {exports|module.exports} logger
 */
var colors = require('colors'),
    Promise = require('bluebird'),
    _ = require('lodash'),

    logger;

// required for jshint
colors.setTheme({silly: 'rainbow'});

logger = {
    // ## basic operations
    print: function (message, detail, hint) {
        var env = process.env.NODE_ENV,
            msg;
        if (env === 'development' || env === 'staging' || env === 'production') {
            msg = [(_.isString(message) ? message : ''), '\n'];

            if (detail) {
                msg.push(detail, '\n');
            }

            if (hint) {
                msg.push(hint, '\n');
            }

            console.log.apply(console, msg);
        }
    },
    /**
     * ### info: log an info
     * @param component
     * @param message message of this info
     */
    info: function (component, message) {
        var env = process.env.NODE_ENV,
            msg;
        if (env === 'development' || env === 'staging' || env === 'production') {
            msg = ['[INFO]'.cyan, component.cyan, ':'.cyan, message.cyan, '\n'];

            console.info.apply(console, msg);
        }
    },
    /**
     * ### warn: log a warn
     * @param message warning message
     * @param detail details of this message
     * @param hint hint for solving this warn
     */
    warn: function (message, detail, hint) {
        var env = process.env.NODE_ENV,
            msg;
        if (env === 'development' || env === 'staging' || env === 'production') {
            message = message || "No message supplied";
            msg = ['[WARNING]: '.yellow, message.yellow, '\n'];

            if (detail) {
                msg.push(detail.white, '\n');
            }

            if (hint) {
                msg.push(hint.green, '\n');
            }
            console.warn.apply(console, msg);
        }
    },
    /**
     * ### reject: return a rejected promise to keep proceeding promise loop working
     * @param message rejecting message
     */
    reject: function (message) {
        message = _.isString(message) ? new Error(message) : message;
        return Promise.reject(message);
    },
    /**
     * ### error: log an error
     * @param message error message
     * @param detail details of this message
     * @param hint hint for solving this error
     */
    error: function (message, detail, hint) {
        var self = this,
            originArgs = _.toArray(arguments).slice(1),
            stack,
            msg;

        // convert message to one or more string (if it isn't)

        // if numbers of errors threw at the same time,
        // we can process them recursively
        if (_.isArray(message)) {
            _.each(message, function (error) {
                var newArgs = [error].concat(originArgs);
                logger.error.apply(self, newArgs);
            });
            return;
        }

        stack = message ? message.stack : null;

        if (!_.isString(message)) {
            if (_.isObject(message) && _.isString(message.message)) {
                message = message.message;
            } else {
                message = 'An unknown error occurred. ';
            }
        }

        // log message
        var env = process.env.NODE_ENV;
        if (env === 'development' || env === 'staging' || env === 'production') {
            msg = ['\n[ERROR]: '.red, message.red, '\n'];

            if (detail) {
                msg.push(detail.white, '\n');
            }

            if (hint) {
                msg.push(hint.green, '\n');
            }

            if (stack) {
                msg.push(stack, '\n');
            }
            console.error.apply(console, msg);
        }
    },
    /**
     * ### throwError: throw an error
     * throw is a node.js keyword. maybe name this function as thr0w is better?
     * @param message required error message
     * @throws EcmaScript error
     */
    throwError: function (message) {
        if (!message) {
            message = new Error('There is an error occurred with no message. ');
        }

        if(_.isString(message)) {
            throw new Error(message);
        }

        throw message;
    },
    // ## advanced operations
    /**
     * startup is used **ONLY** when a whisper server is initializing
     * @param message welcome message
     * @param detail details about server startup
     * @param hint hints about commands of running instance
     */
    startup: function (message, detail, hint) {
        var msg;
        if (_.isString(message)) {
            msg = ['\n' + message.green + '\n'];
        } else {
            msg = ['\nwhisper is running. \n'.green];
        }

        if (_.isString(detail)) {
            msg.push(detail, '\n');
        }

        if (_.isString(hint)) {
            msg.push(hint.grey, '\n');
        }

        console.log.apply(console, msg);
    },
    /**
     * shutdown is used **ONLY** when whisper is shutting down **WITHOUT** any error
     * @param message
     * @param detail
     */
    shutdown: function (message, detail) {
        var msg;
        if (_.isString(message)) {
            msg = ['\n', message.red];
        } else {
            msg = ['\nwhisper has shut down. \n'.red];
        }

        if (_.isString(detail)) {
            msg.push(detail, '\n');
        }

        console.log.apply(console, msg);
        process.exit(0);
    },
    /**
     * ### panic: log an error and exit with 0
     * @param message error message
     * @param detail details of this error
     * @param hint hint for solving this error
     */
    panic: function (message, detail, hint) {
        // log this error first ...
        this.error(message, detail, hint);

        // ... then exit with 0 to prevent npm reports it again
        process.exit(0);
    },
    /**
     * throwAndLog: throw an error and log it
     * @param message error message
     * @param detail details of this error
     * @param hint hints for solving this error
     */
    throwAndLog: function (message, detail, hint) {
        this.error(message, detail, hint);

        this.throwError(message, detail, hint);
    },
    rejectAndLog: function (message, detail, hint) {
        this.error(message, detail, hint);

        return this.reject(message, detail, hint);
    }
};

module.exports = logger;