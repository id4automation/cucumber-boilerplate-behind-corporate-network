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
