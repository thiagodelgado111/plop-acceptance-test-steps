const replaceKeyword = template => {
  let scenarioTemplate = template;
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

export const parseArgsNumberHelper = template => {
  const numbers = template.match(/^(?=[^.])[0-9]+$/gi) || [];
  const decimals = template.match(/(\d+(?:\.\d*)?)/gi) || [];
  const text = template.match(/"([^(\s+|"|(\d+))]*)"/g) || [];
  const options = template.match(/\[(.*)\]/gi) || [];
  return [...numbers, ...decimals, ...text, ...options].map((item, idx) => `arg${idx + 1}`).join(', ');
};

export const parseScenarioTextHelper = (template, type) => {
  let scenarioTemplate = template && template.trim();
  scenarioTemplate = scenarioTemplate.toUpperCase().startsWith(`${type.toUpperCase()} `) ?
    scenarioTemplate.substring(`${type} `.length, scenarioTemplate.length) :
    scenarioTemplate;

  return scenarioTemplate.split(' ').reduce((prev, current) => {
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

    const acceptsText = /"([^(\s+|"|(\d+))]*)"/g.test(current);
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
