const os = require('os');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');
const utils = require('./utils');
const constants = require('./constants');

const stripMessage = message => String(message).substr(0, 3900);

const consoleApi = utils.getConsoleApi();

module.exports = class DbLoggerRuntime {
  constructor(httpClient, config) {
    this.client = httpClient;
    this.config = config;

    this.resetRun();
  }

  get sessionData() {
    return { sessionId: this.sessionId, timestamp: this.currentTimestamp };
  }

  get messageDetails() {
    const { level } = constants;
    return {
      machineName: os.hostname(),
      threadName: 'main',
      logLevel: level.TRACE,
    };
  }

  resetRun() {
    this.runId = null;
    this.sessionId = null;
    this.suiteId = null;
    this.currentTimestamp = 0;
  }

  setOptions(options) {
    this.options = options;
  }

  async startRun() {
    const { browser, version } = utils.getRunDetails(this.options.filename_prefix);
    const runData = {
      timestamp: this.currentTimestamp,
      runName: `${browser} ${version}`,
      osName: `${os.type().substr(0, 3)}${os.release()}${os.arch()}`,
      hostName: os.hostname(),
      ...this.config
    };
    const { runId, sessionId } = await this.client.startRun(runData);
    this.runId = runId;
    this.sessionId = sessionId;
  }

  async endRun({ systemerr }) {
    const { level, parentType } = constants;

    if (systemerr) {
      await this.client.insertMessage({
        message: stripMessage(systemerr),
        level: level.ERROR,
        parentId: this.runId,
        parentType: parentType.RUN,
        ...this.messageDetails,
        ...this.sessionData
      });
    }
    await this.client.endRun(this.sessionData);
    this.resetRun();
  }

  async processSuite({ className, module, moduleName }) {
    const { timestamp, group, completed, skipped } = module;

    this.currentTimestamp = utils.parseDate(timestamp);

    if (!this.runId) {
      await this.startRun();
    }
    
    const suiteData = {
      parentId: this.runId,
      suiteName: className,
      packageName:  group || moduleName,
      ...this.sessionData
    };

    const { suiteId } = await this.client.startSuite(suiteData);

    await this.processCompleted(suiteId, completed);

    if (skipped && skipped.length > 0) {
      await this.processSkipped(suiteId, skipped);
    }
    await this.client.endSuite({ suiteId, ...this.sessionData });
  }

  async processCompleted(suiteId, completed) {
    const { testResult, level, parentType } = constants;

    for (let testCase in completed) {
      const { assertions, failed, message, stackTrace, time } = completed[testCase];

      const { testcaseId } = await this.client.startTestcase({
        parentId: suiteId,
        testcaseName: testCase,
        scenarioName: testCase,
        ...this.sessionData
      });

      await this.processAssertions(testcaseId, assertions);

      this.currentTimestamp += utils.parseTime(time);
      let result = testResult.PASSED;

      if (failed > 0) {
        if (message || stackTrace) {
          await this.insertMessage({
            message: stripMessage(`${message || ''}\n${stackTrace || ''}`),
            level: level.ERROR,
            parentId: testcaseId,
            parentType: parentType.TESTCASE,
            ...this.messageDetails,
            ...this.sessionData
          });
        }
        result = testResult.FAILED;
      }
      await this.client.endTestcase({
        result,
        testcaseId,
        parentId: suiteId,
        ...this.sessionData
      });
    }
  }

  async processSkipped(suiteId, skipped) {
    const { testResult } = constants;

    for (let testCase in skipped) {
      const { testcaseId } = await this.client.startTestcase({
        parentId: suiteId,
        testcaseName: skipped[testCase],
        scenarioName: skipped[testCase],
        ...this.sessionData
      });
      await this.client.endTestcase({
        result: testResult.SKIPPED,
        testcaseId,
        parentId: suiteId,
        ...this.sessionData
      });
    }
  }

  async processAssertions(testcaseId, assertions) {
    for (let i = 0, a = Promise.resolve(); i < assertions.length; i++) {
      a = await this.processAssertion(testcaseId, assertions[i]);
    }
  }

  async processAssertion(testcaseId, assertion) {
    const { level, parentType } = constants;
    const { failure, message, stackTrace, screenshots } = assertion;

    if (failure) {
      await this.client.insertMessage({
        message: stripMessage(`${failure}\n${message}\n${stackTrace}`),
        level: level.ERROR,
        parentId: testcaseId,
        parentType: parentType.TESTCASE,
        ...this.messageDetails,
        ...this.sessionData
      });
    }
    // uncomment when the issue with screenshot name is solved
    // this.attachScreenshots(testcaseId, screenshots);
  }

  async attachScreenshots(testcaseId, screenshots) {
    if (screenshots && screenshots.length) {
      for (let i = 0, a = Promise.resolve(); i < screenshots.length; i++) {
        a = await this.attachScreenshot(testcaseId, screenshots[i]);
      }
    }
  }

  // not working
  async attachScreenshot(testcaseId, filePath) {
    const { parentType } = constants;

    const fileName = path.basename();
    const data = new FormData();

    try {
      data.append('upfile', fs.createReadStream(path.resolve(filePath)));

      await this.client.attachFile({
        testcaseId,
        parentType: parentType.TESTCASE,
        fileName,
        data,
        ...this.sessionData
      });
    } catch (err) {
      consoleApi.error('Error attaching screenshot ' + fileName);
      consoleApi.error(err);
    }
  }
};