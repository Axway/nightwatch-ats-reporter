
// taken from Nightwatch sources
const contains = (str, text) => {
  if (Array.isArray(text)) {
    for (let i = 0; i < text.length; i++) {
      if (contains(str, text[i])) {
        return true;
      }
    }
  }

  return str.indexOf(text) > -1;
};

// taken from Nightwatch sources
const stackTraceFilter = (parts) => {
  const stack = parts.reduce((list, line) => {
    if (contains(line, [
        'node_modules',
        '(node.js:',
        '(events.js:'
      ])) {
      return list;
    }

    list.push(line);
    return list;
  }, []);

  return stack.join('\n');
};

const getRunDetails = (filenamePrefix = []) => {
  const [browser, version] = filenamePrefix.split('_');
  return {
    browser: browser || 'unknown browser',
    version: version || 'unknown version',
  };
};

const makeObjectFromArray = (arr) => arr.reduce((acc, curr) => {
  acc[curr] = curr;
  return acc;
}, {});

const parseTime = str => parseFloat(str) * 1000;

const parseDate = str => Date.parse(str);

// taken from Nightwatch sources
// todo: replace new Date() with the actual date from the saved screenshot
const getScreenshotFileName = (currentTest, is_error, screenshots_path) => {
  let prefix = currentTest.module + '/' + currentTest.name;
  prefix = prefix.replace(/\s/g, '-').replace(/"|'/g, '');
  prefix += is_error ? '_ERROR' : '_FAILED';

  const d = new Date();
  const dateParts = d.toString().replace(/:/g,'').split(' ');
  dateParts.shift();
  dateParts.pop();
  const dateStamp = dateParts.join('-');
  // todo: add path to require!
  return path.resolve(path.join(screenshots_path, prefix + '_' + dateStamp + '.png'));
};

const getConsoleApi = () => {
  const { info, error, log, time, timeEnd } = console;
  return {
    info,
    error,
    time,
    timeEnd,
    log,
  };
};

module.exports = {
  stackTraceFilter,
  getRunDetails,
  makeObjectFromArray,
  parseTime,
  parseDate,
  getConsoleApi,
  getScreenshotFileName,
};