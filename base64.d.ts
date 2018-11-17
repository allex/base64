// Type definitions for @allex/base64
// Project: https://github.com/allex/base64
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare function encode(s: string, uriSafe?: boolean): string;
declare function decode(base64: string): string;
declare function encodeURI(s: string): string;

declare function toUtf8(s: string): Buffer;
declare function fromUtf8(s: string): Buffer;
