const path = require('path');
const utils = require('./utils');

const consoleApi = utils.getConsoleApi();

/**
 * Reporter for Axway ATS HTTP DB Logger
 *
 * @see https://github.com/Axway/ats-httpdblogger
 * @type {exports}
 */
module.exports = class AtsReporter {

  constructor(runtime) {
    this.globalResults = [];
    this.runtime = runtime;
  }

  adaptAssertions(module) {
    Object.keys(module.completed).forEach((item) => {
      const testcase = module.completed[item];
      const assertions = testcase.assertions;
      for (let i = 0; i < assertions.length; i++) {
        if (assertions[i].stackTrace) {
          assertions[i].stackTrace = utils.stackTraceFilter(assertions[i].stackTrace.split('\n'));
        }
      }

      if (testcase.failed > 0 && testcase.stackTrace) {
        const stackParts = testcase.stackTrace.split('\n');
        const errorMessage = stackParts.shift();
        testcase.stackTrace = utils.stackTraceFilter(stackParts);
        testcase.message = errorMessage;
      }
    });
  }

  writeReport(moduleKey, _opts, callback) {
    const module = this.globalResults.modules[moduleKey];
    const pathParts = moduleKey.split(path.sep);
    const moduleName = pathParts.pop();
    let className = moduleName;

    this.adaptAssertions(module);

    if (pathParts.length) {
      className = pathParts.join('.') + '.' + moduleName;
    }

    const reportInfo = { module, moduleName, className };

    this.runtime.processSuite(reportInfo).then(callback).catch(callback);
  }

  write(results, options, callback) {
    this.globalResults = results;
    const keys = Object.keys(results.modules);

    this.runtime.setOptions(options);

    const createReport = () => {
      const moduleKey = keys.shift();
      // simple progress
      keys.length && process.stdout.write('.');

      this.writeReport(moduleKey, options, async (err) => {
        if (err || (keys.length === 0)) {
          await this.runtime.endRun({ systemerr: this.globalResults.errmessages.join('\n') });
          consoleApi.log();
          consoleApi.info('Test results successfully saved.');
          callback(err);
        } else {
          createReport();
        }
      });
    };

    createReport();
  };
};
