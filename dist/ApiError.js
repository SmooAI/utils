"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/ApiError.ts
var ApiError_exports = {};
__export(ApiError_exports, {
  ApiError: () => ApiError
});
module.exports = __toCommonJS(ApiError_exports);
var import_http_status_codes = require("http-status-codes");
var ApiError = class _ApiError extends Error {
  constructor(status, message, statusText) {
    super(message);
    this.status = status;
    this.statusText = statusText;
  }
  static throw(status, message, statusText) {
    throw new _ApiError(status, message, statusText || (0, import_http_status_codes.getReasonPhrase)(status));
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ApiError
});
//# sourceMappingURL=ApiError.js.map