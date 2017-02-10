'use strict';

var _inquirerDirectory = require('inquirer-directory');

var _inquirerDirectory2 = _interopRequireDefault(_inquirerDirectory);

var _generator = require('./generator');

var _generator2 = _interopRequireDefault(_generator);

var _helpers = require('./helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (plop) {
  plop.addHelper('parseArgsNumber', _helpers.parseArgsNumberHelper);
  plop.addHelper('parseScenarioFilename', _helpers.parseScenarioFilenameHelper);
  plop.addHelper('parseScenarioText', _helpers.parseScenarioTextHelper);
  plop.addPrompt('directory', _inquirerDirectory2.default);
  plop.setGenerator('acceptance-tests', (0, _generator2.default)(plop));
};