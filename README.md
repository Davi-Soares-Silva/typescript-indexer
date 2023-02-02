# Typescript and Javascript Indexer README

This is an extension to make your work easier and faster when exporting modules using javascript or typescript. Its purpose is to automate the creation of index files.

## Features

- Create index on folder creation.
- Export folder in index on folder creation.
- Create index on file creation.
- Export file in index on file creation.

## Requirements

The only requirement to use this extension is that you use js or ts.

## Extension Settings

For the extension to be active, you need to create a configuration file in the root of your project named `indexerconfig.json`.

For example:

```json
{
  "type": "typescript",
  "includes": "src",
  "ignore": ["report"]
}
```

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

### 1.0.0

- Init extension.
