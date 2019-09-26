const path = require('path');
const appRoot = require('app-root-path');
const utils = require('./utils');
const constants = require('./constants');

const consoleApi = utils.getConsoleApi();

module.exports = () => {
  try {
    const location = path.join(appRoot.path, constants.configFileName);
    const config = require(location);
    consoleApi.info('Nightwatch ATS reporter - configuration loaded');
    consoleApi.info(`Saving test results to ${config.dbName} database`);
    return config;
  } catch (err) {
    if (err.code !== 'MODULE_NOT_FOUND') {
      throw err;
    }
    consoleApi.log('PSSST!! LISTEN...');
    consoleApi.log('  Create in the root of the project a file named .ats.config and having the following content:');
    consoleApi.log('  module.exports = {');
    consoleApi.log('    dbHost: "localhost",');
    consoleApi.log('    dbPort: "5432",');
    consoleApi.log('    dbName: "YourATSDBName",');
    consoleApi.log('    dbUser: "admin",');
    consoleApi.log('    dbPassword: "password",');
    consoleApi.log('    dbLoggerUrl: "http://<DB_LOGGER_HOST>:<PORT>/ats-httpdblogger/service/logger",'),
    consoleApi.log('    productName: "Your product",');
    consoleApi.log('    versionName: "1.30.0",');
    consoleApi.log('    buildName: "1234"');
    consoleApi.log('  };');

    throw(new Error('Missing ot bad configuration'));
  }
};