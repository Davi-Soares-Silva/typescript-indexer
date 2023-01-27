"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfigFile = exports.fileIsAnIndex = exports.fileExists = exports.fileIsEmpty = exports.verifyItemType = exports.getFilenameWithoutExtensionFromPath = exports.getFolderName = exports.getItemFolder = exports.validateIfPathIsIncluded = exports.validatePathsToIgnore = exports.ItemTypes = void 0;
const Vscode = require("vscode");
const path_1 = require("path");
const fs_1 = require("fs");
var ItemTypes;
(function (ItemTypes) {
    ItemTypes[ItemTypes["folder"] = 1] = "folder";
    ItemTypes[ItemTypes["file"] = 2] = "file";
})(ItemTypes = exports.ItemTypes || (exports.ItemTypes = {}));
const validatePathsToIgnore = (itemPath, pathsToIgnore) => {
    const isANodeModulesItem = !!itemPath.find((item) => item === 'node_modules');
    if (isANodeModulesItem) {
        return false;
    }
    const isAValidPath = !pathsToIgnore
        .map((pathToIgnore) => !!itemPath.find((item => item === pathToIgnore)))
        .find((item) => item);
    return isAValidPath;
};
exports.validatePathsToIgnore = validatePathsToIgnore;
const validateIfPathIsIncluded = (itemPath, includedPath) => {
    const splittedPath = itemPath.split('\\');
    const includedPathIndex = splittedPath.indexOf(includedPath);
    if (includedPathIndex === -1) {
        return false;
    }
    const nextItem = splittedPath[includedPathIndex + 1];
    if (!nextItem) {
        return false;
    }
    return true;
};
exports.validateIfPathIsIncluded = validateIfPathIsIncluded;
const getItemFolder = (filepath) => {
    const splittedFilepath = filepath.split("\\");
    const [_, ...fileWithoutPath] = splittedFilepath.reverse();
    return (0, path_1.join)(...fileWithoutPath.reverse());
};
exports.getItemFolder = getItemFolder;
const getFolderName = (filepath) => {
    return filepath.split('\\').pop();
};
exports.getFolderName = getFolderName;
const getFilenameWithoutExtensionFromPath = (filepath) => {
    const filename = filepath.split('\\').pop();
    if (!filename) {
        throw new Error('INVALID_FILEPATH');
    }
    const [filenameWithoutExtension] = filename.split('.');
    return filenameWithoutExtension;
};
exports.getFilenameWithoutExtensionFromPath = getFilenameWithoutExtensionFromPath;
const verifyItemType = (uri) => {
    const isFile = uri.path.includes('.');
    if (isFile) {
        return ItemTypes.file;
    }
    return ItemTypes.folder;
};
exports.verifyItemType = verifyItemType;
const fileIsEmpty = (filepath) => {
    const fileData = (0, fs_1.readFileSync)(filepath).toString();
    const isEmpty = !fileData.length;
    return isEmpty;
};
exports.fileIsEmpty = fileIsEmpty;
const fileExists = (filepath) => (0, fs_1.existsSync)(filepath);
exports.fileExists = fileExists;
const fileIsAnIndex = (filepath, extension) => {
    return filepath.includes(`index.${extension}`);
};
exports.fileIsAnIndex = fileIsAnIndex;
const loadConfigFile = () => {
    const folders = Vscode.workspace.workspaceFolders;
    const rootPath = folders[0].uri.fsPath;
    const configFilePath = (0, path_1.join)(rootPath, 'indexerconfig.json');
    const fileContent = (0, fs_1.readFileSync)(configFilePath).toString();
    return JSON.parse(fileContent);
};
exports.loadConfigFile = loadConfigFile;
//# sourceMappingURL=utils.js.map