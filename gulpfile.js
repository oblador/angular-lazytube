var gulp   = require('gulp');
var clean  = require('gulp-clean');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngmin  = require('gulp-ngmin');
var rename = require('gulp-rename');
var htmlmin = require('gulp-htmlmin');
var templateCache = require('gulp-angular-templatecache');
var es = require('event-stream');

var sources = [
  'src/module.js',
  'src/config.js',
  'src/directive.js'
];

var targets = 'angular-lazytube.{js,min.js,min.js.map}';

gulp.task('clean', function() {
  gulp.src(targets)
    .pipe(clean());
});

gulp.task('lint', function() {
  gulp.src(sources)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('compress', function() {
  es.concat(
    gulp.src(sources).pipe(ngmin()),
    gulp.src('src/**/*.html')
      .pipe(htmlmin({ collapseWhitespace: true, minifyCSS: true }))
      .pipe(templateCache({
        root: 'templates/lazytube/', 
        standalone: true,
        module: 'oblador.lazytube.templates'
      }))
    )
    .pipe(concat('angular-lazytube.js', { newLine: '\n\n' }))
    .pipe(gulp.dest('./'))
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(uglify({ outSourceMap: true }))
    .pipe(gulp.dest('./'))
});

gulp.task('default', ['lint', 'clean', 'compress']);
