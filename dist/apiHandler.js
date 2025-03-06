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

// src/apiHandler.ts
var apiHandler_exports = {};
__export(apiHandler_exports, {
  eventBridgeHandler: () => eventBridgeHandler,
  lambdaApiHandler: () => lambdaApiHandler,
  sqsHandler: () => sqsHandler
});
module.exports = __toCommonJS(apiHandler_exports);
var import_http_status_codes2 = require("http-status-codes");
var import_zod2 = require("zod");
var import_zod_validation_error2 = require("zod-validation-error");

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
var import_zod = require("zod");
var import_zod_validation_error = require("zod-validation-error");
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

// src/apiHandler.ts
var import_AwsLambdaLogger2 = __toESM(require("@smooai/logger/AwsLambdaLogger"));
var logger2 = new import_AwsLambdaLogger2.default();
async function lambdaApiHandler(event, context, handler) {
  try {
    logger2.addLambdaContext(event, context);
    return await errorHandler(
      async (event2, context2) => {
        const response = await handler(event2, context2);
        const awsLambdaResponse = {
          ...response,
          body: response.body ? typeof response.body === "string" ? response.body : JSON.stringify(response.body) : void 0
        };
        return awsLambdaResponse;
      },
      event,
      context
    );
  } catch (error) {
    if (error instanceof ApiError) {
      logger2.error(error, `An API error occurred: Status: ${error.status} (${error.statusText}); Message: ${error.message}`);
      return {
        body: JSON.stringify({
          error: { message: error.message, statusText: error.statusText }
        }),
        statusCode: error.status,
        headers: { "Content-type": "application/json" }
      };
    } else if (error instanceof import_zod2.ZodError) {
      const validationError = (0, import_zod_validation_error2.fromZodError)(error);
      logger2.error(error, `A validation error occurred: ${validationError}`);
      return {
        body: JSON.stringify({
          error: {
            message: error.message,
            statusText: (0, import_http_status_codes2.getReasonPhrase)(import_http_status_codes2.StatusCodes.BAD_REQUEST)
          }
        }),
        statusCode: import_http_status_codes2.StatusCodes.BAD_REQUEST,
        headers: { "Content-type": "application/json" }
      };
    } else if (error instanceof Error) {
      logger2.error(error, `An unexpected error occurred: ${error.message}`);
      return {
        body: JSON.stringify({
          error: {
            message: error.message,
            statusText: (0, import_http_status_codes2.getReasonPhrase)(import_http_status_codes2.StatusCodes.INTERNAL_SERVER_ERROR)
          }
        }),
        statusCode: import_http_status_codes2.StatusCodes.INTERNAL_SERVER_ERROR,
        headers: { "Content-type": "application/json" }
      };
    } else {
      logger2.error(error, `An unexpected error occurred: ${error}`);
      return {
        body: JSON.stringify({
          error: {
            message: "An unexpected error occurred.",
            statusCode: import_http_status_codes2.StatusCodes.INTERNAL_SERVER_ERROR,
            statusText: (0, import_http_status_codes2.getReasonPhrase)(import_http_status_codes2.StatusCodes.INTERNAL_SERVER_ERROR),
            headers: { "Content-type": "application/json" }
          }
        })
      };
    }
  }
}
async function eventBridgeHandler(event, context, handler) {
  try {
    logger2.addLambdaContext(void 0, context);
    return await errorHandler(
      async (event2, context2) => {
        await handler(event2, context2);
      },
      event,
      context
    );
  } catch (error) {
    if (error instanceof ApiError) {
      logger2.error(error, `An API error occurred: Status: ${error.status} (${error.statusText}); Message: ${error.message}`);
    } else if (error instanceof import_zod2.ZodError) {
      const validationError = (0, import_zod_validation_error2.fromZodError)(error);
      logger2.error(error, `A validation error occurred: ${validationError}`);
    } else if (error instanceof Error) {
      logger2.error(error, `An unexpected error occurred: ${error.message}`);
    } else {
      logger2.error(error, `An unexpected error occurred: ${error}`);
    }
  }
}
async function sqsHandler(event, context, handler) {
  try {
    logger2.addLambdaContext(void 0, context);
    return await errorHandler(
      async (event2, context2) => {
        return await handler(event2, context2);
      },
      event,
      context
    );
  } catch (error) {
    if (error instanceof ApiError) {
      logger2.error(error, `An API error occurred: Status: ${error.status} (${error.statusText}); Message: ${error.message}`);
    } else if (error instanceof import_zod2.ZodError) {
      const validationError = (0, import_zod_validation_error2.fromZodError)(error);
      logger2.error(error, `A validation error occurred: ${validationError}`);
    } else if (error instanceof Error) {
      logger2.error(error, `An unexpected error occurred: ${error.message}`);
    } else {
      logger2.error(error, `An unexpected error occurred: ${error}`);
    }
    if (event.Records?.length) {
      return Promise.allSettled(event.Records.map((_record) => Promise.reject(error)));
    } else {
      return Promise.reject(error);
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  eventBridgeHandler,
  lambdaApiHandler,
  sqsHandler
});
//# sourceMappingURL=apiHandler.js.map