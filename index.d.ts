/// <reference types="node" />
import { InspectOptions } from 'util';
declare type Dictionary<T> = {
    [key: string]: T;
};
interface LoggerBase extends InspectOptions {
    encoding?: string;
    flags?: string;
    prompt?: string;
}
interface LoggerOptions extends LoggerBase {
    output: string;
    date?: string | (() => string);
}
declare type LoggerDefs = Dictionary<LoggerOptions | string>;
declare const $CONTEXT: unique symbol;
interface Context {
    [$CONTEXT]: boolean;
    [key: string]: any;
}
interface LoggerFunction {
    (...args: any[]): void;
    (message?: string, ...args: any[]): void;
    (context?: Context, message?: string, ...args: any[]): void;
}
interface Logger extends LoggerFunction {
    [key: string]: LoggerFunction;
}
declare const logger: Logger;
export default logger;
export declare function registerLogger(name: string, output?: string): void;
export declare function registerLogger(name: string, options?: LoggerOptions): void;
export declare function registerLogger(defs: LoggerDefs): any;
export declare function contextualize(obj: object): Context;
