'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseScenarioFilenameHelper = exports.parseArgsNumberHelper = exports.parseScenarioTextHelper = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var replaceKeyword = function replaceKeyword(template) {
  var scenarioTemplate = template;
  if (/"([^"]*)"/g.test(scenarioTemplate)) {
    scenarioTemplate = scenarioTemplate.replace(/"([^"]*)"/g, '#');
  }

  // eslint-disable-next-line no-useless-escape
  if (/\[([a-zA-Z\|]+)]/g.test(scenarioTemplate)) {
    // eslint-disable-next-line no-useless-escape
    scenarioTemplate = scenarioTemplate.replace(/\[([a-zA-Z\|]+)]/g, '#');
  }

  return scenarioTemplate;
};

var replaceDecimals = function replaceDecimals(template) {
  var scenarioTemplate = template;
  if (/(\d+(?:\.\d*)?)/g.test(scenarioTemplate)) scenarioTemplate = scenarioTemplate.replace(/(\d+(?:\.\d*)?)/g, '#');
  return scenarioTemplate;
};

var replaceNumbers = function replaceNumbers(template) {
  var scenarioTemplate = template;
  if (/(\d+)/g.test(scenarioTemplate)) scenarioTemplate = scenarioTemplate.replace(/(\d+)/g, '#');
  return scenarioTemplate;
};

var replaceWhitespaces = function replaceWhitespaces(template) {
  var scenarioTemplate = template;
  if (/(\s+)/g.test(scenarioTemplate)) scenarioTemplate = scenarioTemplate.replace(/(\s+)/g, '_');
  return scenarioTemplate;
};

var parseScenarioTextHelper = exports.parseScenarioTextHelper = function parseScenarioTextHelper(template) {
  return template.split(' ').reduce(function (prev, current) {
    var acceptsIntegerNumbers = /^(?=[^.])[0-9]+$/.test(current);
    if (acceptsIntegerNumbers) {
      return `${prev} (\\d+)`;
    }

    var acceptsDecimalNumbers = /(\d+(?:\.\d*)?)/.test(current);
    if (acceptsDecimalNumbers) {
      return `${prev} (\\d+(?:\\.\\d*)?)`;
    }

    var acceptMultipleChoices = /\[(.*)\]/gi.test(current);
    if (acceptMultipleChoices) {
      var choices = current.match(/\[(.*)\]/gi);
      var formattedChoices = choices.reduce(function (options, option) {
        return options.replace(/\[(.*)\]/gi, `"(${option}*)"`);
      }, current);
      return `${prev} ${formattedChoices}`;
    }

    var acceptsText = /"([^(\s+|"|(\d+))]*)"/g.test(current);
    if (acceptsText) {
      return `${prev} "([^"]*)"`;
    }

    return `${prev} ${current}`;
  }, '');
};

var parseArgsNumberHelper = exports.parseArgsNumberHelper = function parseArgsNumberHelper(template) {
  var numbers = template.match(/^(?=[^.])[0-9]+$/gi) || [];
  var decimals = template.match(/(\d+(?:\.\d*)?)/gi) || [];
  var text = template.match(/"([^(\s+|"|(\d+))]*)"/g) || [];
  var options = template.match(/\[(.*)\]/gi) || [];
  return [].concat((0, _toConsumableArray3.default)(numbers), (0, _toConsumableArray3.default)(decimals), (0, _toConsumableArray3.default)(text), (0, _toConsumableArray3.default)(options)).map(function (item, idx) {
    return `arg${idx + 1}`;
  }).join(', ');
};

var parseScenarioFilenameHelper = exports.parseScenarioFilenameHelper = function parseScenarioFilenameHelper(template, type) {
  var scenarioTemplate = template && template.trim();
  scenarioTemplate = scenarioTemplate.startsWith(`${type} `) ? scenarioTemplate.substring(`${type} `.length, scenarioTemplate.length) : scenarioTemplate;

  scenarioTemplate = replaceKeyword(scenarioTemplate);
  scenarioTemplate = replaceDecimals(scenarioTemplate);
  scenarioTemplate = replaceNumbers(scenarioTemplate);
  scenarioTemplate = replaceWhitespaces(scenarioTemplate);
  return scenarioTemplate;
};