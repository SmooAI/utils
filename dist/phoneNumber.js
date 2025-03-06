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

// src/phoneNumber.ts
var phoneNumber_exports = {};
__export(phoneNumber_exports, {
  validateAndTransformPhoneNumber: () => validateAndTransformPhoneNumber
});
module.exports = __toCommonJS(phoneNumber_exports);
var import_libphonenumber_js = require("libphonenumber-js");
var import_zod = require("zod");
function validateAndTransformPhoneNumber(value, context) {
  let phoneNumber;
  if (!value) return void 0;
  try {
    phoneNumber = (0, import_libphonenumber_js.parsePhoneNumberWithError)(value, "US");
  } catch (error) {
    let errorMessage = `Unable to parse phone number (${value}) and convert into E.164 format.`;
    if (error instanceof Error) {
      errorMessage += ` Error: ${error.message}`;
    }
    context.addIssue({
      code: import_zod.z.ZodIssueCode.custom,
      message: errorMessage
    });
    return import_zod.z.NEVER;
  }
  return phoneNumber.number;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  validateAndTransformPhoneNumber
});
//# sourceMappingURL=phoneNumber.js.map