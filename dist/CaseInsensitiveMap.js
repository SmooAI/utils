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

// src/CaseInsensitiveMap.ts
var CaseInsensitiveMap_exports = {};
__export(CaseInsensitiveMap_exports, {
  CaseInsensitiveMap: () => CaseInsensitiveMap
});
module.exports = __toCommonJS(CaseInsensitiveMap_exports);
var CaseInsensitiveMap = class extends Map {
  constructor(values) {
    values ? super(
      Array.from(values, ([key, value]) => {
        if (typeof key === "string") {
          key = key.toLowerCase();
        }
        return [key, value];
      })
    ) : super();
  }
  set(key, value) {
    if (typeof key === "string") {
      key = key.toLowerCase();
    }
    return super.set(key, value);
  }
  get(key) {
    if (typeof key === "string") {
      key = key.toLowerCase();
    }
    return super.get(key);
  }
  has(key) {
    if (typeof key === "string") {
      key = key.toLowerCase();
    }
    return super.has(key);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CaseInsensitiveMap
});
//# sourceMappingURL=CaseInsensitiveMap.js.map