# Why the need for this boilerplate

This boilerplate was created to enable cucumber testing within a corporate network where you cannot run the npm selenium standalone installs.

This uses selenium standalone jar file with chrome driver which you can download manually.

Given the problems with phantomjs trying to test against javascript driven applications, built by something like React or Angular, it is easier to use chromedriver with an argument to force to run headlessly.

To run like the equivalent npm selenium_standalone where you don't want to run two seperate commandlines, this uses gulp and npm-run-cmd to auto load a seperate cmd in the background to run selenium and closes when it's finished.

# prerequisites
- java
- node
- npm
- git

# How to use this as your vanilla setup?
## Clone this repo onto your drive
$ git clone thisrepo

## install all node dependencies
$ npm install

## extract chromedriver_win32.zip
- from: cucumber-boilerplate/selenium_drivers/chromedriver_win32.zip
- into: cucumber-boilerplate/selenium_drivers/chromedriver.exe

## run
$ npm run test

# How to build this project from all the pieces?

## Using command line go to your project
$ cd myproject

## Clone cucumber boilerplate from location
or download and extract it if you don't have access over network

$ git clone https://github.com/webdriverio/cucumber-boilerplate.git

## Download java selenium server
https://docs.seleniumhq.org/download/
selenium-server-standalone-3.11.0.jar
put into

./myproject/cucumber-boilerplate/selenium_drivers/selenium-server-standalone-3.11.0.jar

## Download chrome driver here
https://sites.google.com/a/chromium.org/chromedriver/home
chromedriver_win32.zip
put into
./myproject/cucumber-boilerplate/selenium_drivers/chromedriver_win32.zip

extract to
./myproject/cucumber-boilerplate/selenium_drivers/chromedriver.exe

## add chromedriver.exe to .gitignore because you don't want to version control an exe file
chromedriver.exe

## Create gulpfile.js

```javascript
const path = require('path');
const gulp = require('gulp');
const gutil = require('gutil');
const nrc = require('node-run-cmd');
const Launcher = require('webdriverio').Launcher;

gulp.task('selenium', cb => {
  nrc.run(`java
    -Dwebdriver.chrome.driver=./selenium_drivers/chromedriver.exe
    -jar ./selenium_drivers/selenium-server-standalone-3.11.0.jar
    -port 4444`, err => {
      cb(err)
  })
});

gulp.task('wdio', () => {
  const createLauncherWithConfig = () => {
    const strFile = path.join(__dirname, 'wdio.conf.js');
    const wdio =  new Launcher(strFile, {
      specs: ['./src/features/**/*.feature']
    });
    return wdio;
  };
  const wdio = createLauncherWithConfig(gutil.env);
  wdio.run().then(
    code => {
      process.exit(code);
    }, error => {
      console.error('Launcher failed to start the test', error.stacktrace);
      process.exit(1);
    }
  );
});
gulp.task('default', ['selenium', 'wdio']);
```

## update wdio.conf.js

### remove references to services, because you are going to use your local java file
```javascript
services: ['selenium-standalone']
```

## Add arguments to capabilities to run chrome headlessly
```javascript
capabilities: [{
    // maxInstances can get overwritten per capability. So if you have an
    // in-house Selenium grid with only 5 firefox instance available you can
    // make sure that not more than 5 instance gets started at a time.
    maxInstances: 5,
    //
    browserName: 'chrome',
    chromeOptions: {
      args: ['--headless --disable-extensions']
    }
}]
```
## add deprecationWarnings: false
```javascript
deprecationWarnings: false,
```


## Create package.json file local to your project with reference to gulpfile in cucumber folder
$ npm init -y

## Add script test inside package.json file
```javascript
"scripts": {
  "test": "gulp --gulpfile cucumber-boilerplate/gulpfile.js"
},
```

## remove cucumber-boilerplate package.json file and install all dependencies local to your project
$ npm install gulp gutil node-run-cmd --save-dev

package.json should look like this:
```javascript
{
  "name": "project-with-internal-cucumber-testing",
  "version": "1.3.2",
  "description": "project with internal cucumber testing",
  "scripts": {
    "test": "gulp --gulpfile cucumber-boilerplate/gulpfile.js"
  },
  "keywords": [
    "webdriverio",
    "cucumber",
    "test",
    "selenium"
  ],
  "license": "MIT",
  "dependencies": {
    "babel-jest": "~23.0.0-alpha.0",
    "babel-polyfill": "~6.26.0",
    "babel-preset-es2015": "~6.24.0",
    "babel-register": "~6.26.0",
    "chai": "~4.1.2",
    "forever": "~0.15.3",
    "gulp": "^3.9.1",
    "gutil": "^1.6.4",
    "jest": "~22.1.0",
    "node-run-cmd": "^1.0.1",
    "wdio-cucumber-framework": "~1.1.0",
    "wdio-phantomjs-service": "~0.2.2",
    "wdio-selenium-standalone-service": "~0.0.9",
    "wdio-spec-reporter": "~0.1.2",
    "webdriverio": "4.12.0"
  }
}
```

# How to run
$ yarn run test

## troubleshooting - chrome can't create service
Make sure you have extracted: chromedriver_win32.zip
From
./myproject/cucumber-boilerplate/selenium_drivers/chromedriver_win32.zip
extract to
./myproject/cucumber-boilerplate/selenium_drivers/chromedriver.exe

## troubleshootings ERROR: connect ECONNREFUSED 127.0.0.1:4444
Close cmd and open a new cmd
CTRL ALT DELETE
find proceses
2.36-x64-chromedriver*32
kill all of them
start again

## troubleshootings not working - make sure java works from command line
$ cd myproject
java -Dwebdriver.chrome.driver=./cucumber-boilerplate/selenium_drivers/chromedriver.exe -jar ./cucumber-boilerplate/selenium_drivers/selenium-server-standalone-3.11.0.jar -port 8080


## Remove all cucumber-boilerplate stuff unnecessary
.git
.github
.yarn.lock
node_modules
package.json
test/ folder
.babelrc - should be moved to myproject
.gitignore - should be moved to myproject

## For testing purposes - remove all the features except
sampleSnippets.feature
