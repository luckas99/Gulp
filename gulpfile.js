var gulp = require('gulp');
var sass = require ('gulp-sass');
var browsersync = require ('browser-sync');
var clean = require ('gulp-clean-css');
var concat = require('gulp-concat');

gulp.task('sass', function () {
    return gulp.src('./build/scss/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('style.min.css'))
        .pipe(clean())
        .pipe(gulp.dest('./css'));
});



gulp.task('browser-sync', function() {
    browsersync.init({
        server: {
            baseDir: "./"
        },
        watch:['./css', './images', './index.html']
    });
});



gulp.task('default', function () {
    gulp.run('sass', 'browser-sync');
    gulp.watch(['./build/scss/**/*.scss'], function (evt) {
        gulp.run('sass');
    });
});