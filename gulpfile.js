'use strict';

var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    plumber      = require('gulp-plumber'),
    notify       = require('gulp-notify'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCss    = require('gulp-minify-css'),
    rename       = require('gulp-rename'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglify'),
    copy         = require('gulp-copy'),
    browserSync  = require('browser-sync'),
    reload       = browserSync.reload;

gulp.task('browser-sync', function() {
  return browserSync({
    notify: false,
    files: ["./Build/**/*.html"],
    server: {
        baseDir: "./Build"
    }
  });
});

gulp.task('styles', function () {
  return gulp.src('./assets/scss/**/*.scss')
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(sass({
      outputStyle: 'nested', // libsass doesn't support expanded yet
      precision: 10,
      includePaths: ['./bower_components/jeet/scss/jeet/', './bower_components/normalize.scss/'],
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe(minifyCss())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./Build/assets/css'))
    .pipe(reload({stream: true}));
});

gulp.task('scripts', function() {
  return gulp.src('./assets/js/*.js')
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./Build/assets/js'))
    .pipe(reload({stream: true}));
});

gulp.task('copy-html', function() {
  return gulp.src('./*.html')
    .pipe(plumber())
    .pipe(copy('./Build'));
});

gulp.task("watch", ['browser-sync'], function() {
  gulp.watch("./**/*.html", ['copy-html']);
  gulp.watch("./assets/scss/**/*.scss", ['styles']);
  gulp.watch("./assets/js/*.js", ["scripts"]);
});

gulp.task("default", ["browser-sync", "styles", "scripts", "watch"]);
