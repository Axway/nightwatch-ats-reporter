# Nightwatch ATS reporter

A custom reporter for Nightwatch Javascript browser automation (https://nightwatchjs.org/). This reporter allows you to push test results from a Nightwatch test run into ATS Test Explorer database using ATS HTTP DB logger API(https://axway.github.io/ats-httpdblogger/swagger/index.html).

## How to setup

1. Install the package through NPM:

```sh
npm install @axway/nightwatch-ats-reporter --save-dev
```
**Note** This reporter is not published yet to NPM, instead you can install it from this github repository:
```sh
npm install git+ssh://git@github.com:Axway/nightwatch-ats-reporter.git --save-dev
```
You must run the command in a shell that is authenticated to git.ecd.axway.int

2. Create a configuration file for Axway ATS HTTP DB Logger with name `.ats.config` and put it in project root folder:

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

3. Add the `--reporter` option to Nightwatch run command. Example:
```sh
babel-node ./node_modules/nightwatch/bin/runner --reporter node_modules/nightwatch-ats-reporter
```

## Copyright

Copyright (c) 2019 Axway Software SA and its affiliates. All rights reserved.

## License

All files in this repository are licensed by Axway Software SA and its affiliates under the Apache License, Version 2.0, available at http://www.apache.org/licenses/.