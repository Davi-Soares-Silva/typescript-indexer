import * as Vscode from 'vscode';
import { join } from "path";
import { readFileSync } from 'fs';

export enum CreationTypes {
  folder = 1,
  file = 2,
}

export const getFileFolder = (filepath: string) => {
  const splittedFilepath = filepath.split("\\");

  const [_, ...fileWithoutPath] = splittedFilepath.reverse();

  return join(...fileWithoutPath.reverse());
};

export const getFilenameWithoutExtensionFromPath = (filepath: string) => {
  const filename = filepath.split('\\').pop();

  if (!filename) { throw new Error('INVALID_FILEPATH'); }

  const [filenameWithoutExtension] = filename.split('.');

  return filenameWithoutExtension;
};


export const verifyCreationType = (uri: Vscode.Uri) => {
  const isFile = uri.path.includes('.');

  if (isFile) { return CreationTypes.file; }

  return CreationTypes.folder;
};

export const fileIsEmpty = (filepath: string) => {
  const fileData = readFileSync(filepath).toString();

  const isEmpty = !fileData.length;

  return isEmpty;
};

export const fileIsAnIndex = (filepath: string) => {
  return filepath.includes('index.ts');
};