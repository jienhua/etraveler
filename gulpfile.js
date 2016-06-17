var babel      = require('gulp-babel'),
    gulp       = require('gulp'),
    gutil      = require('gulp-util'),
    jshint     = require('gulp-jshint'),
    sourcemaps = require('gulp-sourcemaps'),
    concat     = require('gulp-concat'),
    uglify     = require('gulp-uglify');


// define the default task and add the watch
// gulp.task('default', ['build-js']);

gulp.task('jshint', function(){
	return gulp.src('source/js/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('build-js', function(){
	return gulp.src('source/js/**/*.js')
		.pipe(sourcemaps.init())
			.pipe(babel())
			.pipe(concat('bundle.js'))
			// only uglify if gulp is ran with '--type production'
			.pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('public/js'));			
});