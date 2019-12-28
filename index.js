"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
var fs = require("fs");
var path = require("path");
var replace = require("mmo-replace");
var $CONTEXT = Symbol('Context');
var ENTRY_FOLDER = process.cwd();
var DEFAULT_LOGGER_NAME = 'log';
var CREATE_PROPERTY = 'extend';
var DATE_PLACEHOLDERS = {
    DA: 'getDay',
    MO: 'getMonth',
    YE: 'getFullYear',
    HO: 'getHours',
    MI: 'getMinutes',
    SE: 'getSeconds',
    ML: 'getMilliseconds'
};
var REX_PROPS = /[A-Z][A-Z]+/g;
var REX_PH = /%%|%([\s\u0021-\u0024\u0026-\u01ff]|%{2,})+%/g;
var WRITERS = {
    stdout: process.stdout,
    stderr: process.stderr
};
var LOGGERS = (_a = {},
    _a[DEFAULT_LOGGER_NAME] = {
        writer: process.stdout,
        colors: true
    },
    _a);
var DEFAULT_OPTIONS = {
    encoding: 'utf8'
};
function write(message) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var prev = '';
    if (this.prompt)
        prev = this.prompt;
    if (this.date)
        prev += '[' + this.date() + ']';
    if (prev)
        prev += ':';
    if (message) {
        if (message[$CONTEXT]) {
            var context = message;
            message = args.shift();
            if (message)
                message = replace(context, message, this) + '\n';
        }
        else if (typeof message !== 'string') {
            args.unshift(message);
            message = '';
        }
        else {
            message += '\n';
        }
    }
    else {
        message = '';
    }
    this.writer.write(util_1.formatWithOptions.apply(void 0, __spreadArrays([this, prev + message], args)));
}
var logger = write.bind(LOGGERS[DEFAULT_LOGGER_NAME]);
function register_logger(alias, options) {
    var output;
    if (typeof options === 'string') {
        options = {
            output: options
        };
    }
    output = options.output;
    var cur = LOGGERS[alias];
    if (cur) {
        Object.assign(cur, {
            writer: register_writer(output, options)
        }, options);
    }
    else {
        cur = LOGGERS[alias] = Object.assign({
            writer: register_writer(output, options)
        }, DEFAULT_OPTIONS, options);
        Object.defineProperty(logger, alias, {
            value: write.bind(LOGGERS[alias]),
            enumerable: true,
            writable: false,
            configurable: false
        });
    }
    if (typeof options.date === 'string')
        cur.date = parse_date(options.date);
    if (cur.colors === undefined) {
        cur.colors = (output === 'stdout' || output === 'stderr');
    }
    else {
        cur.colors = (output === 'stdout' || output === 'stderr') ? cur.colors : false;
    }
}
function register_writer(pathname, options) {
    if (pathname === 'stderr' || pathname === 'stdout')
        return WRITERS[pathname];
    if (!path.isAbsolute(pathname))
        pathname = path.resolve(ENTRY_FOLDER, pathname);
    if (WRITERS[pathname])
        return WRITERS[pathname];
    return WRITERS[pathname] = fs.createWriteStream(pathname, options);
}
function parse_date(template) {
    return function () {
        var date = new Date(Date.now());
        REX_PROPS.lastIndex = 0;
        return template.replace(REX_PROPS, function (m) {
            if (m.length === 2) {
                var prop = DATE_PLACEHOLDERS[m];
                if (prop) {
                    var val = date[prop]().toString();
                    val = m === 'Milliseconds' ? val.padStart(3, '0') : val.padStart(2, '0');
                    return val;
                }
            }
            return m;
        });
    };
}
exports.default = logger;
function registerLogger(name, options) {
    if (typeof name === 'string') {
        register_logger(name, options);
    }
    else {
        for (var k in name)
            register_logger(k, name[k]);
    }
}
exports.registerLogger = registerLogger;
function contextualize(obj) {
    var _a;
    return Object.assign((_a = {},
        _a[$CONTEXT] = true,
        _a), obj);
}
exports.contextualize = contextualize;
//# sourceMappingURL=index.js.map