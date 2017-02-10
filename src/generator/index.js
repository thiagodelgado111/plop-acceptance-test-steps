import path from 'path';

export default plop => ({
  description: 'Generates a "Then" step model using cucumberjs standard',
  prompts: [{
    type: 'directory',
    name: 'stepFolder',
    message: 'Please type in the relative path to where the step definition should be created',
    basePath: plop.getPlopfilePath(),
  },
  {
    type: 'list',
    name: 'type',
    choices: ['Given', 'When', 'Then'],
    message: 'Which kind of step do you need?',
  },
  {
    type: 'input',
    name: 'stepName',
    message: 'Please type in the step definition:',
  }],
  actions: [{
    type: 'add',
    path: '{{stepFolder}}/{{titleCase type}}_{{parseScenarioFilename stepName type}}.js',
    templateFile: path.resolve(__dirname, 'step.hbs'),
    abortOnFail: true,
  }],
});
