"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var util_1 = require("util");
var vm_1 = require("vm");
var stream_1 = require("stream");
var REX_PH_STRING = /%%|%([\s\u0021-\u0024\u0026-\uffff]|%{2,})+%(?!%)/g;
var REX_PH_STREAM = /(%%)|(%([\s\u0021-\u0024\u0026-\uffff]|%{2,})+%)|(%([\s\u0021-\u0024\u0026-\uffff]|%{2,})*$)/g;
function replace(sandbox, message, options) {
    REX_PH_STRING.lastIndex = 0;
    vm_1.createContext(sandbox);
    return message.replace(REX_PH_STRING, function (m) {
        if (m === '%%')
            return '%';
        return parse_expression(sandbox, m, options);
    });
}
function parse_expression(context, expr, options) {
    console.log(expr);
    expr = '(' + expr.substr(1, expr.length - 2).replace(/%%/g, '%') + ')';
    var val = vm_1.runInContext(expr, context);
    return options ? util_1.inspect(val, options) : val.toString();
}
var Replacer = (function (_super) {
    __extends(Replacer, _super);
    function Replacer(sandbox, destiny, options) {
        var _this = _super.call(this) || this;
        _this._writer = destiny;
        _this._rest = '';
        _this._sandbox = vm_1.createContext(sandbox);
        _this._options = options;
        return _this;
    }
    Replacer.prototype._write = function (chunk, encoding, callback) {
        if (this._rest) {
            chunk = this._rest + chunk.toString();
            this._rest = '';
        }
        else {
            chunk = chunk.toString();
        }
        var m;
        var from = 0;
        REX_PH_STREAM.lastIndex = 0;
        while ((m = REX_PH_STREAM.exec(chunk)) != null) {
            if (m.index > from)
                this._writer.write(chunk.substr(from, m.index - from));
            if (m[4]) {
                console.log(m[0]);
                this._rest = m[0];
                from = chunk.length;
                break;
            }
            this._writer.write(parse_expression(this._sandbox, m[0], this._options));
            from = m.index + m[0].length;
        }
        if (from < chunk.length)
            this._writer.write(chunk.substr(from));
        callback();
    };
    return Replacer;
}(stream_1.Writable));
(function (replace) {
    function writable(sandbox, writable, options) {
        return new Replacer(sandbox, writable, options);
    }
    replace.writable = writable;
})(replace || (replace = {}));
module.exports = replace;
//# sourceMappingURL=index.js.map