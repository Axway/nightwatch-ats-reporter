const HttpClient = require('./http-client');
const Reporter = require('./reporter');
const Runtime = require('./db-logger-runtime');
const getConfig = require('./config');

const { dbLoggerUrl, ...config } = getConfig();
const runtime = new Runtime(new HttpClient(dbLoggerUrl), config);

module.exports = new Reporter(runtime);