import directoryPrompt from 'inquirer-directory';
import acceptanceTestStepGenerator from './generator';
import { parseScenarioTextHelper, parseScenarioFilenameHelper, parseArgsNumberHelper } from './helpers';

module.exports = plop => {
  plop.addHelper('parseArgsNumber', parseArgsNumberHelper);
  plop.addHelper('parseScenarioFilename', parseScenarioFilenameHelper);
  plop.addHelper('parseScenarioText', parseScenarioTextHelper);
  plop.addPrompt('directory', directoryPrompt);
  plop.setGenerator('acceptance-tests', acceptanceTestStepGenerator(plop));
};
