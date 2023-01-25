"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const Vscode = require("vscode");
const utils_1 = require("./utils");
const createFileSystemWatcher = () => {
    const folders = Vscode.workspace.workspaceFolders;
    const pattern = new Vscode.RelativePattern(folders[0], '**');
    const fileSystemWatcher = Vscode.workspace.createFileSystemWatcher(pattern, false, false, false);
    return fileSystemWatcher;
};
const createIndexFile = (path, extension) => {
    const filename = (0, path_1.join)(path, '/', `index.${extension}`);
    const emptyFileContent = '';
    (0, fs_1.writeFileSync)(filename, emptyFileContent);
};
const exportFileInIndex = (filepath, extension) => {
    const isAnIndexFile = (0, utils_1.fileIsAnIndex)(filepath, extension);
    if (isAnIndexFile) {
        return;
    }
    const folder = (0, utils_1.getItemFolder)(filepath);
    const filename = (0, utils_1.getFilenameWithoutExtensionFromPath)(filepath);
    const indexFile = (0, path_1.join)(folder, '/', `index.${extension}`);
    (0, fs_1.openSync)(indexFile, 'w');
    const isFileEmpty = (0, utils_1.fileIsEmpty)(indexFile);
    const fileContent = isFileEmpty ?
        `export * from './${filename}';` :
        `\nexport * from './${filename}';`;
    (0, fs_1.appendFileSync)(indexFile, fileContent);
};
const validateItem = (itemPath, settings) => {
    const splittedItemPath = itemPath.split('\\');
    const isAPathToIgnore = (0, utils_1.validatePathsToIgnore)(splittedItemPath, settings.ignore);
    const isAIncludedPath = (0, utils_1.validateIfPathIsIncluded)(itemPath, settings.includes);
    if (!isAIncludedPath || !isAPathToIgnore) {
        return false;
    }
    return true;
};
const getFileExtension = (type) => {
    const acceptedFileType = type.toUpperCase();
    const extension = acceptedFileType === 'JAVASCRIPT' ?
        'js' :
        'ts';
    return extension;
};
const exportFolderInIndex = (filepath, extension) => {
    const foldername = (0, utils_1.getFolderName)(filepath);
    const parentFolder = (0, utils_1.getItemFolder)(filepath);
    const indexFile = (0, path_1.join)(parentFolder, '/', `index.${extension}`);
    (0, fs_1.openSync)(indexFile, 'w');
    const isFileEmpty = (0, utils_1.fileIsEmpty)(indexFile);
    const fileContent = isFileEmpty ?
        `export * from './${foldername}';` :
        `\nexport * from './${foldername}';`;
    (0, fs_1.appendFileSync)(indexFile, fileContent);
};
const main = (uri, settings) => {
    try {
        const itemPath = uri.fsPath;
        const extension = getFileExtension(settings.type);
        const isAValidItem = validateItem(itemPath, settings);
        if (!isAValidItem) {
            return;
        }
        const itemType = (0, utils_1.verifyItemType)(uri);
        if (itemType === utils_1.ItemTypes.folder) {
            createIndexFile(itemPath, extension);
            exportFolderInIndex(itemPath, extension);
            return;
        }
        exportFileInIndex(itemPath, extension);
    }
    catch (error) {
        console.log(error);
    }
};
function activate(context) {
    console.log('The typescript indexer is active now!');
    const settings = (0, utils_1.loadConfigFile)();
    const watcher = createFileSystemWatcher();
    watcher.onDidCreate((uri) => main(uri, settings));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map