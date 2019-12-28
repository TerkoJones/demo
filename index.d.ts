/// <reference types="node" />
import { InspectOptions } from 'util';
import { Writable } from 'stream';
declare function replace(sandbox: object, message: string, options?: InspectOptions): string;
declare namespace replace {
    function writable(sandbox: object, writable: Writable, options?: InspectOptions): Writable;
}
export = replace;
