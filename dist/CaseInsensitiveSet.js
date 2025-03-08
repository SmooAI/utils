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

// src/CaseInsensitiveSet.ts
var CaseInsensitiveSet_exports = {};
__export(CaseInsensitiveSet_exports, {
  CaseInsensitiveSet: () => CaseInsensitiveSet
});
module.exports = __toCommonJS(CaseInsensitiveSet_exports);
var CaseInsensitiveSet = class extends Set {
  constructor(values) {
    values ? super(
      Array.from(values, (key) => {
        if (typeof key === "string") {
          key = key.toLowerCase();
        }
        return key;
      })
    ) : super();
  }
  add(key) {
    if (typeof key === "string") {
      key = key.toLowerCase();
    }
    return super.add(key);
  }
  has(key) {
    if (typeof key === "string") {
      key = key.toLowerCase();
    }
    return super.has(key);
  }
  delete(key) {
    if (typeof key === "string") {
      key = key.toLowerCase();
    }
    return super.delete(key);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CaseInsensitiveSet
});
//# sourceMappingURL=CaseInsensitiveSet.js.map