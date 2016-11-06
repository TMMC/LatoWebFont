"use strict";

// ==============================================
// === Require & plugins config
// ==============================================
var gulp               = require('gulp'),
  plugins              = require('gulp-load-plugins')({
    pattern : ['gulp-*', 'gulp.*', 'less-*'],
    rename  : {'less-plugin-autoprefix': 'lessAutoprefix', 'less-plugin-clean-css' : 'lessCleanCss'}
  }),
  autoprefixerOptions  = { browsers: [ 'last 3 versions', '> 5%', 'ie >= 8', 'firefox >= 4', 'android >= 4' ], cascade: true },
  lessAutoprefixer     = new plugins.lessAutoprefix(autoprefixerOptions),
  cleanCssOptions      = {advanced: true, compatibility: ["ie8"], s1: true},
  lessCleanCss         = new plugins.lessCleanCss(cleanCssOptions),
  sassOptionsDev       = { errLogToConsole: false, outputStyle: 'expanded' },
  sassOptionsProd      = { errLogToConsole: false, outputStyle: 'compressed' },
  lessOptionsDev       = { plugins: [lessAutoprefixer], ieCompat: true, compress: false, sourceMap: false },
  lessOptionsProd      = { plugins: [lessAutoprefixer, lessCleanCss], ieCompat: true, compress: true, sourceMap: false },
  cssCompiler          = 'sass';

// ==============================================
// === Tasks
// ==============================================

// == compile-sass task: compiling sass to css
gulp.task('compile-sass', function() {
  // Outputs non-minified and minified stylesheets
  return gulp.src('src/*.scss')
    .pipe(plugins.plumber())
    .pipe(plugins.sass(sassOptionsDev))
    .on('error', function (err) { plugins.util.log(err); this.emit('end'); })
    .pipe(plugins.autoprefixer(autoprefixerOptions))
    .pipe(gulp.dest('dist/css'))
    .pipe(plugins.sass(sassOptionsProd))
    .on('error', function (err) { plugins.util.log(err); this.emit('end'); })
    .pipe(plugins.rename({ extname : '.min.css' }))
    .pipe(plugins.autoprefixer(autoprefixerOptions))
    .pipe(gulp.dest('dist/css'));
});

// == compile-less task: compiling less to css
gulp.task('compile-less', function () {
  return gulp.src('src/*.less')
    .pipe(plugins.plumber())
    .pipe(plugins.less(lessOptionsDev))
    .on('error', function (err) { plugins.util.log(err); this.emit('end'); })
    .pipe(gulp.dest('dist/css'))
    .pipe(plugins.less(lessOptionsProd))
    .on('error', function (err) { plugins.util.log(err); this.emit('end'); })
    .pipe(plugins.rename({ extname : '.min.css' }))
    .pipe(gulp.dest('dist/css'));
    gulp.watch('src/fonts.less', ['build-css']);
});

// == build-css task: compiling css depending on preprocessor
if (cssCompiler === 'sass') {
  gulp.task('build-css', ['compile-sass']);
} else {
  gulp.task('build-css', ['compile-less']);
}

// == watch task
gulp.task('watch', function() {
  if (cssCompiler === 'sass') {
    gulp.watch('src/*.scss', ['compile-sass']);
  } else {
    gulp.watch('src/*.less', ['compile-less']);
  }
});

// == default task
gulp.task('default', ['build-css', 'watch']);
