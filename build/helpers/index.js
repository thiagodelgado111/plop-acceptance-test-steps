'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseScenarioFilenameHelper = exports.parseScenarioTextHelper = exports.parseArgsNumberHelper = undefined;

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var replaceKeyword = function replaceKeyword(template) {
  var scenarioTemplate = template;
  if (/"([^"]*)"/g.test(scenarioTemplate)) {
    scenarioTemplate = scenarioTemplate.replace(/"([^"]*)"/g, '#');
  }

  // eslint-disable-next-line no-useless-escape
  if (/\[([\sa-zA-Z\|]+)]/g.test(scenarioTemplate)) {
    // eslint-disable-next-line no-useless-escape
    scenarioTemplate = scenarioTemplate.replace(/\[([\sa-zA-Z\|]+)]/g, '#');
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

var parseArgsNumberHelper = exports.parseArgsNumberHelper = function parseArgsNumberHelper(template, addDoneCallback) {
  var scenarioTemplate = template && template.trim();
  // eslint-disable-next-line no-useless-escape
  scenarioTemplate = scenarioTemplate.replace(/\s+(?=([^"]*"[^"]*")*[^"]*$)(?=([^\[]*\[[^\[]*)*[^\]]*$)/gi, '___');
  var numberOfArgs = scenarioTemplate.split('___').reduce(function (prev, current) {
    var acceptsText = /"(.*)"/g.test(current);
    if (acceptsText) {
      return prev + 1;
    }

    var acceptMultipleChoices = /\[(.*)\]/gi.test(current);
    if (acceptMultipleChoices) {
      return prev + 1;
    }

    var acceptsIntegerNumbers = /^(?=[^.])[0-9]+$/.test(current);
    if (acceptsIntegerNumbers) {
      return prev + 1;
    }

    var acceptsDecimalNumbers = /(\d+(?:\.\d*)?)/.test(current);
    if (acceptsDecimalNumbers) {
      return prev + 1;
    }

    return prev;
  }, 0);

  var args = (0, _from2.default)(Array(numberOfArgs)).map(function (item, idx) {
    return `arg${idx + 1}`;
  }).join(', ');
  if (addDoneCallback) {
    args += ', done';
  }

  return args;
};

var parseScenarioTextHelper = exports.parseScenarioTextHelper = function parseScenarioTextHelper(template, type) {
  var scenarioTemplate = template && template.trim();
  scenarioTemplate = scenarioTemplate.toUpperCase().startsWith(`${type.toUpperCase()} `) ? scenarioTemplate.substring(`${type} `.length, scenarioTemplate.length) : scenarioTemplate;

  // eslint-disable-next-line no-useless-escape
  scenarioTemplate = scenarioTemplate.replace(/\s+(?=([^"]*"[^"]*")*[^"]*$)(?=([^\[]*\[[^\[]*)*[^\]]*$)/gi, '___');
  return scenarioTemplate.split('___').reduce(function (prev, current) {
    var acceptsText = /"(.*)"/g.test(current);
    if (acceptsText) {
      return `${prev} "([^"]*)"`;
    }

    var acceptMultipleChoices = /\[(.*)\]/gi.test(current);
    if (acceptMultipleChoices) {
      var choices = current.match(/\[(.*)\]/gi);
      var formattedChoices = choices.reduce(function (options, option) {
        return options.replace(/\[(.*)\]/gi, `"(${option}*)"`);
      }, current);
      return `${prev} ${formattedChoices}`;
    }

    var acceptsIntegerNumbers = /^(?=[^.])[0-9]+$/.test(current);
    if (acceptsIntegerNumbers) {
      return `${prev} (\\d+)`;
    }

    var acceptsDecimalNumbers = /(\d+(?:\.\d*)?)/.test(current);
    if (acceptsDecimalNumbers) {
      return `${prev} (\\d+(?:\\.\\d*)?)`;
    }

    return `${prev} ${current}`;
  }, '').trim();
};

var parseScenarioFilenameHelper = exports.parseScenarioFilenameHelper = function parseScenarioFilenameHelper(template, type) {
  var scenarioTemplate = template && template.trim();
  scenarioTemplate = scenarioTemplate.toUpperCase().startsWith(`${type.toUpperCase()} `) ? scenarioTemplate.substring(`${type} `.length, scenarioTemplate.length) : scenarioTemplate;

  scenarioTemplate = replaceKeyword(scenarioTemplate);
  scenarioTemplate = replaceDecimals(scenarioTemplate);
  scenarioTemplate = replaceNumbers(scenarioTemplate);
  scenarioTemplate = replaceWhitespaces(scenarioTemplate);
  return scenarioTemplate && scenarioTemplate.trim();
};