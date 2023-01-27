import { accessSync, appendFileSync, openSync, writeFileSync } from 'fs';
import { join } from 'path';
import * as Vscode from 'vscode';

import {
	ItemTypes,
	fileExists,
	fileIsAnIndex,
	fileIsEmpty,
	getFilenameWithoutExtensionFromPath,
	getFolderName,
	getItemFolder,
	loadConfigFile,
	validateIfPathIsIncluded,
	validatePathsToIgnore,
	verifyItemType
} from './utils';

type Settings = {
	type: string;
	includes: string;
	ignore: string[];
};

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

const createIndexFile = (path: string, extension: string) => {

	const filename = join(path, '/', `index.${extension}`);

	const emptyFileContent = '';

	writeFileSync(filename, emptyFileContent);
};

const exportFileInIndex = (filepath: string, extension: string) => {

	const folder = getItemFolder(filepath);
	const filename = getFilenameWithoutExtensionFromPath(filepath);
	const indexFile = join(folder, '/', `index.${extension}`);

	const indexExists = fileExists(indexFile);

	if (!indexExists) {
		createIndexFile(folder, extension);
	}

	const isFileEmpty = fileIsEmpty(indexFile);

	const fileContent = isFileEmpty ?
		`export * from './${filename}';` :
		`\nexport * from './${filename}';`;

	appendFileSync(indexFile, fileContent);
};

const validateItem = (itemPath: string, settings: Settings, extension: string) => {
	const isAnIndexFile = fileIsAnIndex(itemPath, extension);

	if (isAnIndexFile) { return; }

	const splittedItemPath = itemPath.split('\\');


	const isAPathToIgnore = validatePathsToIgnore(splittedItemPath, settings.ignore);

	const isAIncludedPath = validateIfPathIsIncluded(itemPath, settings.includes);

	if (!isAIncludedPath || !isAPathToIgnore) { return false; }

	return true;
};

const getSelectedExtension = (type: string) => {
	const acceptedFileType = type.toUpperCase();

	const extension = acceptedFileType === 'JAVASCRIPT' ?
		'js' :
		'ts';

	return extension;
};

const getFileExtension = (itemPath: string) => {
	const [extension] = itemPath.split('.').reverse();

	return extension;
};

const isAValidExtension = (extension: string, acceptedExtension: string) => extension === acceptedExtension;

const exportFolderInIndex = (filepath: string, extension: string) => {
	const foldername = getFolderName(filepath);
	const parentFolder = getItemFolder(filepath);
	const indexFile = join(parentFolder, '/', `index.${extension}`);

	const indexExists = fileExists(indexFile);

	if (!indexExists) {
		createIndexFile(parentFolder, extension);
	}

	const isFileEmpty = fileIsEmpty(indexFile);

	const fileContent = isFileEmpty ?
		`export * from './${foldername}';` :
		`\nexport * from './${foldername}';`;

	appendFileSync(indexFile, fileContent);
};


const main = (uri: Vscode.Uri, settings: Settings) => {
	try {
		const itemPath = uri.fsPath;
		const selectedExtension = getSelectedExtension(settings.type);

		const isAValidItem = validateItem(itemPath, settings, selectedExtension);

		if (!isAValidItem) { return; }

		const itemType = verifyItemType(uri);

		if (itemType === ItemTypes.folder) {
			createIndexFile(itemPath, selectedExtension);
			exportFolderInIndex(itemPath, selectedExtension);
			return;
		}

		const fileExtension = getFileExtension(itemPath);

		const extensionIsValid = isAValidExtension(fileExtension, selectedExtension);

		if (!extensionIsValid) { return; }

		exportFileInIndex(itemPath, selectedExtension);
	} catch (error) {
		console.log(error);
	}

};

export function activate(context: Vscode.ExtensionContext) {
	console.log('The typescript indexer is active now!');

	const settings = loadConfigFile();

	const watcher = createFileSystemWatcher();

	watcher.onDidCreate((uri) => main(uri, settings));

}

export function deactivate() {}
