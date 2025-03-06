"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/errorHandler.ts
var errorHandler_exports = {};
__export(errorHandler_exports, {
  errorHandler: () => errorHandler
});
module.exports = __toCommonJS(errorHandler_exports);
var import_zod = require("zod");
var import_zod_validation_error = require("zod-validation-error");

// src/ApiError.ts
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

// src/errorHandler.ts
var import_AwsLambdaLogger = __toESM(require("@smooai/logger/AwsLambdaLogger"));
var logger = new import_AwsLambdaLogger.default();
async function errorHandler(handler, ...args) {
  try {
    return await handler(...args);
  } catch (error) {
    if (error instanceof ApiError) {
      logger.error(error, `An API error occurred: Status: ${error.status} (${error.statusText}); Message: ${error.message}`);
      throw error;
    } else if (error instanceof import_zod.ZodError) {
      const validationError = (0, import_zod_validation_error.fromZodError)(error);
      logger.error(error, `A validation error occurred: ${validationError.toString()}`);
      throw error;
    } else if (error instanceof Error) {
      logger.error(error, `An unexpected error occurred: ${error.message}`);
      throw error;
    } else {
      logger.error(error, `An unexpected error occurred: ${error}`);
      throw error;
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  errorHandler
});
//# sourceMappingURL=errorHandler.js.map