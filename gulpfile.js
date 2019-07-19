const gulp = require('gulp');
const zip = require('gulp-zip');

gulp.task('default', () =>
	gulp.src(['index.js', 'package.json'])
		.pipe(zip('contact-form-function.zip'))
		.pipe(gulp.dest('dist'))
);
