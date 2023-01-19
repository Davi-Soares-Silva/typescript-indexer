"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileIsAnIndex = exports.fileIsEmpty = exports.verifyCreationType = exports.getFilenameWithoutExtensionFromPath = exports.getFileFolder = exports.CreationTypes = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
var CreationTypes;
(function (CreationTypes) {
    CreationTypes[CreationTypes["folder"] = 1] = "folder";
    CreationTypes[CreationTypes["file"] = 2] = "file";
})(CreationTypes = exports.CreationTypes || (exports.CreationTypes = {}));
const getFileFolder = (filepath) => {
    const splittedFilepath = filepath.split("\\");
    const [_, ...fileWithoutPath] = splittedFilepath.reverse();
    return (0, path_1.join)(...fileWithoutPath.reverse());
};
exports.getFileFolder = getFileFolder;
const getFilenameWithoutExtensionFromPath = (filepath) => {
    const filename = filepath.split('\\').pop();
    if (!filename) {
        throw new Error('INVALID_FILEPATH');
    }
    const [filenameWithoutExtension] = filename.split('.');
    return filenameWithoutExtension;
};
exports.getFilenameWithoutExtensionFromPath = getFilenameWithoutExtensionFromPath;
const verifyCreationType = (uri) => {
    const isFile = uri.path.includes('.');
    if (isFile) {
        return CreationTypes.file;
    }
    return CreationTypes.folder;
};
exports.verifyCreationType = verifyCreationType;
const fileIsEmpty = (filepath) => {
    const fileData = (0, fs_1.readFileSync)(filepath).toString();
    const isEmpty = !fileData.length;
    return isEmpty;
};
exports.fileIsEmpty = fileIsEmpty;
const fileIsAnIndex = (filepath) => {
    return filepath.includes('index.ts');
};
exports.fileIsAnIndex = fileIsAnIndex;
//# sourceMappingURL=utils.js.map