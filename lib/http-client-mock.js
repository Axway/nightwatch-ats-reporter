
const randomTimeout = () => new Promise(resolve => setTimeout(resolve, Math.random() * 10));

module.exports = class DbLoggerHttpClientMock {
 
  async startRun(data) {
    console.log('run starter');
    console.log(data);
    //console.log(data.timestamp);
    await randomTimeout();
    return { runId: 1, sessionId: '123214' };
  }

  async endRun() {
    console.log('end run');
    await randomTimeout();
  }

  async startSuite(data) {
    console.log('suite started');
    console.log(data);
    //console.log(data.timestamp);
    await randomTimeout();
    return { suiteId: 2 };
  }

  async endSuite() {
    console.log('suite ended');
    await randomTimeout();
  }

  async startTestcase(data) {
    console.log('test started');
    console.log(data);
    //console.log(data.timestamp);
    await randomTimeout();
    return { testcaseId: 12 };
  }

  async endTestcase() {
    console.log('test ended');
    await randomTimeout();
  }

  async insertMessage(data) {
    console.error(data);
    //console.log(data.timestamp);
    await randomTimeout();
  }

  async attachFile(data) {
    console.log(data);
    await randomTimeout();
  }
};
