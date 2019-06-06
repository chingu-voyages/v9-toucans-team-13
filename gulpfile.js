'use strict';

//packages required
const { series, parallel, src, dest, watch } = require('gulp'),
  babel = require('gulp-babel'),
  path = require('path'),
  pug = require('gulp-pug'),
  sass = require('gulp-sass'),
  minifyJS = require('gulp-js-minify'),
  browserSync = require('browser-sync');

//Gulp tasks

//pug to html
function compilePug() {
  return src('src/index.pug')
    .pipe(pug({
      pretty: true
    }))
    .on('error', function (err) {
      process.stderr.write(err.message + '\n');
      this.emit('end');
    })
    .pipe(dest('dist'));
};

//scss to css
function compileSass() {
  return src('src/sass/**/*.scss')
    .pipe(sass({
      includePaths: ['src/sass'],
      outputStyle: 'compressed'
    }))
    .on('error', sass.logError)
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

//ES6 to ES5 and minify
function js() {
  return src('src/js/*.js')
    .pipe(babel())
    .pipe(minifyJs())
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

function reload(done) {
  browserSync.reload();

  done();
}

function serve() {
  browserSync.init({
    server: 'dist'
  });

  watch(['src/**/*.pug'], series(
    compilePug, compileSass, reload,
  ));

  watch(['src/**/*.scss'], series(
    compileSass,
  ));

  watch(['src/**/*.js'], series(js));
}

exports.default = series(compilePug, compileSass, serve);