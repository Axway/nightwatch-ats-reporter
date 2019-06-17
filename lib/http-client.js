const axios = require('axios');
const utils = require('./utils');

const consoleApi = utils.getConsoleApi();

module.exports = class DbLoggerHttpClient {
  constructor(dbLoggerUrl) {
    this.api = axios.create({
      baseURL: dbLoggerUrl,
      timeout: 10 * 1000,
      headers: { 'Content-type': 'application/json', 'Accept': 'application/json' },
    });
    this.apiUpload = axios.create({
      baseURL: dbLoggerUrl,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    // Use interceptors to debug
    // this.api.interceptors.request.use((request) => {
    //   const { url, method, data } = request;
    //   consoleApi.log(`${method.toUpperCase()} ${url}`);
    //   console.log(JSON.stringify(data));
    //   // Do not forget to return the request, otherwise will thrown an error about missing cancelToken
    //   return request;
    // });
  }

  async tryPost(resource, data) {
    try {
      const response = await this.api.post(resource, data);
      return response.data;
    } catch (err) {
      consoleApi.error('Error sending request: ' + err);
      consoleApi.log(`${resource} ${url}`);
      consoleApi.log(JSON.stringify(data));
      return {};
    }
  }

  async startRun(data) {
    const response = await this.api.post('/startRun', data);
    return response.data;
  }

  async endRun(data) {
    await this.tryPost('/endRun', data);
  }

  async startSuite(data) {
    return this.tryPost('/startSuite', data);
  }

  async endSuite(data) {
    return this.tryPost('/endSuite', data);
  }

  async startTestcase(data) {
    return this.tryPost('/startTestcase', data);
  }

  async endTestcase(data) {
    return this.tryPost('/endTestcase', data);
  }

  async insertMessage(data) {
    return this.tryPost('/insertMessage', data);
  }

  async attachFile(data) {
    await this.apiUpload.put('/attachFile', data);
  }
};