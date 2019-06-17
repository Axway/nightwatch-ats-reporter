
const utils = require('./utils');

const parentType = utils.makeObjectFromArray(['RUN', 'SUITE', 'TESTCASE']);

const testResult = utils.makeObjectFromArray(['FAILED', 'PASSED', 'SKIPPED', 'RUNNING']);

const level = utils.makeObjectFromArray(['TRACE', 'DEBUG','INFO', 'WARN', 'ERROR', 'FATAL']);

const configFileName = '.ats.config';

module.exports = {
  parentType,
  testResult,
  level,
  configFileName,
};