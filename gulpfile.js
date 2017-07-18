var gulp    = require('gulp'),
    gutil   = require('gulp-util'),
    connect = require('gulp-connect'),
    deploy  = require('gulp-gh-pages');

var sass    = require('gulp-sass');

var bower   = require('gulp-bower');

var uglify  = require('gulp-uglify'),
    concat  = require('gulp-concat');

// live reload
gulp.task('connect', function() {
  connect.server({
    root: 'build/',
    livereload: true
  });
});

// deploy to gh-pages
gulp.task('deploy', function() {
  return gulp.src('./build/**/*')
    .pipe(deploy(
      {
        remoteUrl: 'https://github.com/berwinxie/berwinxie.github.io.git',
        branch: 'master'
      }
    ))
});

// push changes
gulp.task('push', function(msg) {
  return gulp.src('./**/*')
  .pipe(deploy(
    {
      branch: 'master'
    }
  ))
});

gulp.task('cname', function() {
  gulp.src('CNAME').
  pipe(gulp.dest('build'))
});

gulp.task('bower', function() {
  return bower('./public')
    .pipe(gulp.dest('build/assets/lib/'))
});

gulp.task('img', function() {
  gulp.src('assets/img/**/*')
  .pipe(gulp.dest('build/assets/img/'))
});

gulp.task('html', function() {
  gulp.src('index.html')
  .pipe(gulp.dest('build'))
  .pipe(connect.reload())
})

gulp.task('sass', function() {
  gulp.src('assets/scss/style.scss')
  .pipe(sass({style: 'expanded'}))
    .on('error', gutil.log)
  .pipe(gulp.dest('build/assets'))
  .pipe(connect.reload())
});

gulp.task('js', function() {
  gulp.src('assets/js/*.js')
  .pipe(uglify())
  .pipe(concat('script.js'))
  .pipe(gulp.dest('build/assets'))
  .pipe(connect.reload())
});

gulp.task('watch', function() {
  gulp.watch('assets/js/*.js', ['js']);
  gulp.watch('assets/scss/*.scss', ['sass']);
  gulp.watch('assets/img/**/*', ['img']);
  gulp.watch('index.html', ['html']);
});

gulp.task('default', ['html', 'cname', 'bower', 'js', 'sass', 'img', 'connect', 'watch']);