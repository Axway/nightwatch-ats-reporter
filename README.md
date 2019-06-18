[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

# Nightwatch ATS reporter

A custom reporter for Nightwatch Javascript browser automation [https://nightwatchjs.org/](https://nightwatchjs.org/). This reporter allows you to push test results from a Nightwatch test run into [ATS Test Explorer](https://github.com/Axway/ats-testexplorer) database using [ATS HTTP DB logger](https://github.com/Axway/ats-httpdblogger).

## How to setup

### Install the package through NPM:

```sh
npm install @axway/nightwatch-ats-reporter --save-dev
```

### Create a configuration file for Axway ATS HTTP DB Logger with name `.ats.config` and put it in project root folder:

```javascript
module.exports = {
  dbHost: "localhost",
  dbName: "HTTP_TESTS",
  dbUser: "admin",
  dbPassword: "password",
  dbLoggerUrl: "http://localhost:8080/ats-httpdblogger-4.1.0-SNAPSHOT/service/logger",
  productName: "HTTP Application",
  versionName: "1.0.0",
  buildName: "123"
};
```

### Add the `--reporter` option to Nightwatch run command. Example:

```sh
node ./node_modules/nightwatch/bin/runner --reporter node_modules/@axway/nightwatch-ats-reporter
```

## Development

For local development, checkout the project and run `npm install` first. Dev environment can run against real ATS HTTP DB Logger instance or a mock client. If your IDE is VisualStudio Code, open 'Debug' (Ctrl+Shift+D) and choose between `Start real` and `Start mock` accordingly. For real instance you will need ATS HTTP DB Logger service and an `.ats.config` file with proper configurations. For both configurations, the test results are taken from `/test/results_all.json`. To change the test results file, locate and change this line in `test/start.js`:

```javascript
.......
const file = 'test/results_all.json';
.......
```

To run without debugging, type `npm run start` in terminal.

## Known issues

- Uploading screenshots is not working. Currently in Nightwatch `0.9.21` results output object does not contain the screenshots file names. Reporter is not tested yet with Nightwatch latest version `1.1.12`.

## Copyright

Copyright (c) 2019 Axway Software SA and its affiliates. All rights reserved.

## License

All files in this repository are licensed by Axway Software SA and its affiliates under the Apache License, Version 2.0, available at http://www.apache.org/licenses/.