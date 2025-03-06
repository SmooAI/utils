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

// src/hono.ts
var hono_exports = {};
__export(hono_exports, {
  createAwsLambdaHonoApp: () => createAwsLambdaHonoApp
});
module.exports = __toCommonJS(hono_exports);
var import_hono = require("hono");
var import_http_exception = require("hono/http-exception");
var import_zod = require("zod");
var import_zod_validation_error = require("zod-validation-error");
var import_logger = require("hono/logger");
var import_request_id = require("hono/request-id");
var import_pretty_json = require("hono/pretty-json");
var import_aws_lambda = require("hono/aws-lambda");
var import_AwsLambdaLogger = __toESM(require("@smooai/logger/AwsLambdaLogger"));

// src/env.ts
function isRunningLocally() {
  return !!process.env.SST_DEV;
}

// src/hono.ts
var logger = new import_AwsLambdaLogger.default();
function createAwsLambdaHonoApp(appFunction) {
  const app = new import_hono.Hono();
  app.use((0, import_request_id.requestId)());
  app.use(
    (0, import_logger.logger)((str, ...rest) => {
      logger.info(str, ...rest);
    })
  );
  app.use(async (c, next) => {
    logger.addContext({
      honoRequestId: c.get("requestId")
    });
    await next();
  });
  if (isRunningLocally()) {
    app.use((0, import_pretty_json.prettyJSON)());
  }
  app.onError((error) => {
    if (error instanceof import_zod.ZodError) {
      const validationError = (0, import_zod_validation_error.fromZodError)(error);
      logger.error(error, `A validation error occurred: ${validationError.toString()}`);
      throw new import_http_exception.HTTPException(400, {
        cause: error,
        message: validationError.toString()
      });
    }
    throw error;
  });
  const appWithRoutes = appFunction(app);
  return (event, lambdaContext) => {
    logger.addLambdaContext(event, lambdaContext);
    return (0, import_aws_lambda.handle)(appWithRoutes)(event, lambdaContext);
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createAwsLambdaHonoApp
});
//# sourceMappingURL=hono.js.map