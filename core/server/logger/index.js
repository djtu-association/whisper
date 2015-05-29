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
    /**
     * ### info: log an info
     * @param component
     * @param message message of this info
     */
    info: function (component, message) {
        var env = process.env.NODE_ENV,
            msg;
        if (env === 'development' || env === 'staging' || env === 'production') {
            msg = [component.cyan + ':'.cyan, message.cyan];

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
            console.log.apply(console, msg);
        }
    },
    /**
     * ### reject: return a rejected promise to keep proceeding promise loop working
     * @param message reject message
     */
    reject: function (message) {
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
            _.each(error, function (error) {
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
            console.info.apply(console, msg);
        }
    },
    /**
     * ### throwError: throw an error
     * throw is a node.js keyword. maybe name this function as thr0w is better?
     * @param message error message
     */
    throwError: function (message) {
        if (!message) {
            message = new Error('There is an error occurred with no message. ');
        }

        if(_.isString(message)) {
            throw new Error(message);
        }
    },
    // ## advanced operations
    /**
     * ### panic: panic means there is a serious error and the program cannot proceed
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