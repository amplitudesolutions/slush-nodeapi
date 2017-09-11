var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');

function test(cb) {

  var mochaOpts = {
    // reporter: 'nyan' //cool-mode
  };

  function runner() {
    gulp
      .src(['./tests/test-*.js'])
      .pipe(mocha(mochaOpts))
      .pipe(istanbul.writeReports())
      .on('end', cb);
  }

  gulp
    .src(['./slushfile.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', runner);
}

gulp.task('test', test)