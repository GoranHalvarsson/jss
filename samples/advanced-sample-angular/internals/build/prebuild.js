#!/usr/bin/env node

/**
 * Allows us to dynamically set Angular CLI environment values.
 * Inspired by: https://github.com/angular/angular-cli/issues/4318#issuecomment-293829342
 */


const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const scjssConfig = require('../../scjssconfig.json');

const environmentFilesDirectory = path.join(__dirname, '../../src/environments');
let targetEnvironmentTemplateFileName = 'environment.ts.template';
if (process.argv.length > 2) {
    targetEnvironmentTemplateFileName = `environment.${process.argv[2]}.ts.template`;
}
const targetLength = targetEnvironmentTemplateFileName.length - '.template'.length;
const targetEnvironmentFileName = targetEnvironmentTemplateFileName.substr(0, targetLength);

const templateValues = {
    SC_API_KEY: scjssConfig.sitecore.apiKey
};

// Load template file
const environmentTemplate = fs.readFileSync(
  path.join(environmentFilesDirectory, targetEnvironmentTemplateFileName),
  {encoding: 'utf-8'}
);

// Generate output data
const output = ejs.render(environmentTemplate, templateValues);

// Write environment file
fs.writeFileSync(path.join(environmentFilesDirectory, targetEnvironmentFileName), output);

process.exit(0);