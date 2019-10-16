const jsonfile = require('jsonfile');

const HttpClient = require('../lib/http-client-mock');
const Reporter = require('../lib/reporter');
const Runtime = require('../lib/db-logger-runtime');
const getConfig = require('../lib/config');

const reporter = require('../index'); // real http client

const { dbLoggerUrl, ...config } = getConfig();
const runtime = new Runtime(new HttpClient(dbLoggerUrl), config);
const reporterMock = new Reporter(runtime); // mock http client

const getReporter = () => process.argv.length > 2 ? reporterMock : reporter;

const file = 'test/results_all.json';
jsonfile.readFile(file)
  .then(obj => {
    // console.dir(obj);
    getReporter().write(
      obj,
      { output_folder: '', filename_prefix: 'dev-chrome_75_linux_' },
      () => false,
    );
  })
  .catch(error => console.error(error));
