"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const Vscode = require("vscode");
const fs_1 = require("fs");
const path_1 = require("path");
const utils_1 = require("./utils");
const createFileSystemWatcher = () => {
    const folders = Vscode.workspace.workspaceFolders;
    const pattern = new Vscode.RelativePattern(folders[0], '**');
    const fileSystemWatcher = Vscode.workspace.createFileSystemWatcher(pattern, false, false, false);
    return fileSystemWatcher;
};
const createIndexFile = (path) => {
    const filename = (0, path_1.join)(path, '/', 'index.ts');
    const emptyFileContent = '';
    (0, fs_1.writeFileSync)(filename, emptyFileContent);
};
const exportFileInIndex = (filepath) => {
    const isAnIndexFile = (0, utils_1.fileIsAnIndex)(filepath);
    if (isAnIndexFile) {
        return;
    }
    const folder = (0, utils_1.getFileFolder)(filepath);
    const filename = (0, utils_1.getFilenameWithoutExtensionFromPath)(filepath);
    const indexFile = (0, path_1.join)(folder, '/', 'index.ts');
    const isFileEmpty = (0, utils_1.fileIsEmpty)(indexFile);
    const fileContent = isFileEmpty ?
        `export * from './${filename}';` :
        `\nexport * from './${filename}';`;
    (0, fs_1.appendFileSync)(indexFile, fileContent);
};
const main = (uri) => {
    try {
        const creationType = (0, utils_1.verifyCreationType)(uri);
        if (creationType === utils_1.CreationTypes.folder) {
            return createIndexFile(uri.fsPath);
        }
        exportFileInIndex(uri.fsPath);
    }
    catch (error) {
        console.log(error);
    }
};
function activate(context) {
    const watcher = createFileSystemWatcher();
    watcher.onDidCreate((uri) => main(uri));
    console.log('The typescript indexer is active now!');
    // let disposable = vscode.commands.registerCommand('tsindexer.helloWorld', () => {
    // 	vscode.window.showInformationMessage('Hello World from typescript-indexer!');
    // });
    // context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map