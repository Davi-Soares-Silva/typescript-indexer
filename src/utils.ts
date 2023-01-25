import * as Vscode from 'vscode';
import { join } from "path";
import { readFileSync } from 'fs';

export enum ItemTypes {
  folder = 1,
  file = 2,
}

export const validatePathsToIgnore = (itemPath: string[], pathsToIgnore: string[]) => {
  const isANodeModulesItem = !!itemPath.find((item) => item === 'node_modules');

  if (isANodeModulesItem) { return false; }

  const isAValidPath = !pathsToIgnore
    .map((pathToIgnore) => !!itemPath.find((item => item === pathToIgnore)))
    .find((item) => item);

  return isAValidPath;
};

export const validateIfPathIsIncluded = (itemPath: string, includedPath: string) => {

  const isAIncludedPath = itemPath.includes(includedPath);

  return isAIncludedPath;

};

export const getItemFolder = (filepath: string) => {
  const splittedFilepath = filepath.split("\\");

  const [_, ...fileWithoutPath] = splittedFilepath.reverse();

  return join(...fileWithoutPath.reverse());
};

export const getFolderName = (filepath: string) => {
  return filepath.split('\\').pop();
};


export const getFilenameWithoutExtensionFromPath = (filepath: string) => {
  const filename = filepath.split('\\').pop();

  if (!filename) { throw new Error('INVALID_FILEPATH'); }

  const [filenameWithoutExtension] = filename.split('.');

  return filenameWithoutExtension;
};


export const verifyItemType = (uri: Vscode.Uri) => {
  const isFile = uri.path.includes('.');

  if (isFile) { return ItemTypes.file; }

  return ItemTypes.folder;
};

export const fileIsEmpty = (filepath: string) => {
  const fileData = readFileSync(filepath).toString();

  const isEmpty = !fileData.length;

  return isEmpty;
};

export const fileIsAnIndex = (filepath: string, extension: string) => {
  return filepath.includes(`index.${extension}`);
};

export const loadConfigFile = () => {
  const folders = Vscode.workspace.workspaceFolders as Vscode.WorkspaceFolder[];

  const rootPath = folders[0].uri.fsPath;

  const configFilePath = join(rootPath, 'indexerconfig.json');

  const fileContent = readFileSync(configFilePath).toString();

  return JSON.parse(fileContent);
};