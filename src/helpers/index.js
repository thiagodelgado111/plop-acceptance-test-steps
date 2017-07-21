const replaceKeyword = template => {
  let scenarioTemplate = template;
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

const replaceDecimals = template => {
  let scenarioTemplate = template;
  if (/(\d+(?:\.\d*)?)/g.test(scenarioTemplate)) scenarioTemplate = scenarioTemplate.replace(/(\d+(?:\.\d*)?)/g, '#');
  return scenarioTemplate;
};

const replaceNumbers = template => {
  let scenarioTemplate = template;
  if (/(\d+)/g.test(scenarioTemplate)) scenarioTemplate = scenarioTemplate.replace(/(\d+)/g, '#');
  return scenarioTemplate;
};

const replaceWhitespaces = template => {
  let scenarioTemplate = template;
  if (/(\s+)/g.test(scenarioTemplate)) scenarioTemplate = scenarioTemplate.replace(/(\s+)/g, '_');
  return scenarioTemplate;
};

export const parseArgsNumberHelper = (template, addDoneCallback) => {
  let scenarioTemplate = template && template.trim();
  // eslint-disable-next-line no-useless-escape
  scenarioTemplate = scenarioTemplate.replace(/\s+(?=([^"]*"[^"]*")*[^"]*$)(?=([^\[]*\[[^\[]*)*[^\]]*$)/gi, '___');
  const numberOfArgs = scenarioTemplate.split('___').reduce((prev, current) => {
    const acceptsIntegerNumbers = /^(?=[^.])[0-9]+$/.test(current);
    if (acceptsIntegerNumbers) {
      return prev + 1;
    }

    const acceptsDecimalNumbers = /(\d+(?:\.\d*)?)/.test(current);
    if (acceptsDecimalNumbers) {
      return prev + 1;
    }

    const acceptMultipleChoices = /\[(.*)\]/gi.test(current);
    if (acceptMultipleChoices) {
      return prev + 1;
    }

    const acceptsText = /"(.*)"/g.test(current);
    if (acceptsText) {
      return prev + 1;
    }

    return prev;
  }, 0);

  let args = Array.from(Array(numberOfArgs)).map((item, idx) => `arg${idx + 1}`).join(', ');
  if (addDoneCallback) {
    args += ', done';
  }

  return args;
};

export const parseScenarioTextHelper = (template, type) => {
  let scenarioTemplate = template && template.trim();
  scenarioTemplate = scenarioTemplate.toUpperCase().startsWith(`${type.toUpperCase()} `) ?
    scenarioTemplate.substring(`${type} `.length, scenarioTemplate.length) :
    scenarioTemplate;

  // eslint-disable-next-line no-useless-escape
  scenarioTemplate = scenarioTemplate.replace(/\s+(?=([^"]*"[^"]*")*[^"]*$)(?=([^\[]*\[[^\[]*)*[^\]]*$)/gi, '___');
  return scenarioTemplate.split('___').reduce((prev, current) => {
    const acceptsIntegerNumbers = /^(?=[^.])[0-9]+$/.test(current);
    if (acceptsIntegerNumbers) {
      return `${prev} (\\d+)`;
    }

    const acceptsDecimalNumbers = /(\d+(?:\.\d*)?)/.test(current);
    if (acceptsDecimalNumbers) {
      return `${prev} (\\d+(?:\\.\\d*)?)`;
    }

    const acceptMultipleChoices = /\[(.*)\]/gi.test(current);
    if (acceptMultipleChoices) {
      const choices = current.match(/\[(.*)\]/gi);
      const formattedChoices = choices
        .reduce((options, option) => options.replace(/\[(.*)\]/gi, `"(${option}*)"`), current);
      return `${prev} ${formattedChoices}`;
    }

    const acceptsText = /"(.*)"/g.test(current);
    if (acceptsText) {
      return `${prev} "([^"]*)"`;
    }

    return `${prev} ${current}`;
  }, '').trim();
};

export const parseScenarioFilenameHelper = (template, type) => {
  let scenarioTemplate = template && template.trim();
  scenarioTemplate = scenarioTemplate.toUpperCase().startsWith(`${type.toUpperCase()} `) ?
    scenarioTemplate.substring(`${type} `.length, scenarioTemplate.length) :
    scenarioTemplate;

  scenarioTemplate = replaceKeyword(scenarioTemplate);
  scenarioTemplate = replaceDecimals(scenarioTemplate);
  scenarioTemplate = replaceNumbers(scenarioTemplate);
  scenarioTemplate = replaceWhitespaces(scenarioTemplate);
  return scenarioTemplate && scenarioTemplate.trim();
};
