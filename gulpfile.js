var path = require('path');
var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('default', function() {
  return gulp.src('jquery.pictofy.js')
    .pipe(uglify({preserveComments:'license'}))
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('./'));
});

gulp.task('watch', function(){
  gulp.watch('jquery.pictofy.js', ['default']);
});
