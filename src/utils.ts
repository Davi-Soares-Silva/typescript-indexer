import * as Vscode from 'vscode';
import { join } from "path";
import { appendFileSync, existsSync, readFileSync, unlinkSync } from 'fs';
import defaultSettings from './utils/default-settings';

export enum ItemTypes {
  folder = 1,
  file = 2,
};

export const validatePathsToIgnore = (itemPath: string[], pathsToIgnore: string[]) => {
  const isANodeModulesItem = !!itemPath.find((item) => item === 'node_modules');

  if (isANodeModulesItem) { return false; }

  if (!pathsToIgnore?.length) { return true; }

  const isAValidPath = !pathsToIgnore
    .map((pathToIgnore) => !!itemPath.find((item => item === pathToIgnore)))
    .find((item) => item);

  return isAValidPath;
};

export const validateIfPathIsIncluded = (itemPath: string, includedPath: string) => {

  const splittedPath = itemPath.split('\\');

  const includedPathIndex = splittedPath.indexOf(includedPath);

  if (includedPathIndex === -1) { return false; }

  const nextItem = splittedPath[includedPathIndex + 1];

  if (!nextItem) { return false; }

  return true;

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

export const fileExists = (filepath: string) => existsSync(filepath);

export const fileIsAnIndex = (filepath: string, extension: string) => {
  return filepath.includes(`index.${extension}`);
};

export const loadConfigFile = () => {
  const folders = Vscode.workspace.workspaceFolders as Vscode.WorkspaceFolder[];

  const rootPath = folders[0].uri.fsPath;

  const configFilePath = join(rootPath, 'indexerconfig.json');

  const configFileExists = existsSync(configFilePath);

  if (!configFileExists) {
    return defaultSettings;
  }

  const fileContent = readFileSync(configFilePath).toString();

  return JSON.parse(fileContent);
};

export const writeIndexNewLine = (filepath: string, filename: string) => {
  const indexExists = existsSync(filepath);

  if (!indexExists) { return; }

  const fileContent = readFileSync(filepath)
    .toString()
    .split('\n')
    .filter(Boolean)
    .map((line) => `${line}\n`);

  const newLine = `export * from './${filename}';\n`;

  const allLines = [...fileContent, newLine].sort();

  unlinkSync(filepath);
  appendFileSync(filepath, '');

  for (const line of allLines) {
    appendFileSync(filepath, line);
  }

};
