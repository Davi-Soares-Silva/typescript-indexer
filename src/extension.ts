import * as Vscode from 'vscode';
import { appendFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import {
	CreationTypes,
	fileIsAnIndex,
	fileIsEmpty,
	getFileFolder,
	getFilenameWithoutExtensionFromPath,
	verifyCreationType
} from './utils';

const createFileSystemWatcher = () => {
	const folders = Vscode.workspace.workspaceFolders as Vscode.WorkspaceFolder[];

	const pattern = new Vscode.RelativePattern(folders[0], '**');

	const fileSystemWatcher = Vscode.workspace.createFileSystemWatcher(
		pattern,
		false,
		false,
		false
	);

	return fileSystemWatcher;
};

const createIndexFile = (path: string) => {
	const filename = join(path, '/', 'index.ts');

	const emptyFileContent = '';

	writeFileSync(filename, emptyFileContent);
};

const exportFileInIndex = (filepath: string) => {
	const isAnIndexFile = fileIsAnIndex(filepath);

	if (isAnIndexFile) { return; }

	const folder = getFileFolder(filepath);
	const filename = getFilenameWithoutExtensionFromPath(filepath);
	const indexFile = join(folder, '/', 'index.ts');
	const isFileEmpty = fileIsEmpty(indexFile);

	const fileContent = isFileEmpty ?
		`export * from './${filename}';` :
		`\nexport * from './${filename}';`;

	appendFileSync(indexFile, fileContent);
};

const main = (uri: Vscode.Uri) => {
	try {
		const creationType = verifyCreationType(uri);

		if (creationType === CreationTypes.folder) { return createIndexFile(uri.fsPath); }

		exportFileInIndex(uri.fsPath);
	} catch (error) {
		console.log(error);
	}

};

export function activate(context: Vscode.ExtensionContext) {

	const watcher = createFileSystemWatcher();

	watcher.onDidCreate((uri) => main(uri));


	console.log('The typescript indexer is active now!');


	// let disposable = vscode.commands.registerCommand('tsindexer.helloWorld', () => {

	// 	vscode.window.showInformationMessage('Hello World from typescript-indexer!');
	// });

	// context.subscriptions.push(disposable);
}

export function deactivate() {}
