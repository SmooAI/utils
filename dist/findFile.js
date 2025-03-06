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

// src/findFile.ts
var findFile_exports = {};
__export(findFile_exports, {
  findFile: () => findFile,
  findFileSync: () => findFileSync
});
module.exports = __toCommonJS(findFile_exports);
var import_Logger = __toESM(require("@smooai/logger/Logger"));
var import_find_up = require("find-up");
var logger = new import_Logger.default({ name: "findFile" });
var findFile = async (filename, options) => {
  const logError = options?.logError ?? true;
  try {
    const foundPath = await (0, import_find_up.findUp)(filename);
    if (!foundPath) {
      throw new Error(`Unable to find ${filename}`);
    }
    return foundPath;
  } catch (error) {
    if (logError) logger.error(error, `Error finding file '${filename}`);
    throw error;
  }
};
var findFileSync = (filename, options) => {
  const logError = options?.logError ?? true;
  try {
    const foundPath = (0, import_find_up.findUpSync)(filename);
    if (!foundPath) {
      throw new Error(`Unable to find ${filename}`);
    }
    return foundPath;
  } catch (error) {
    if (logError) logger.error(error, `Error finding file '${filename}`);
    throw error;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  findFile,
  findFileSync
});
//# sourceMappingURL=findFile.js.map