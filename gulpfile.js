let gulp = require('gulp');
let sass = require('gulp-sass');
let browsersync = require('browser-sync');
let clean = require('gulp-clean-css');
let concat = require('gulp-concat');
let compressimages = require('compress-images');


gulp.task('sass', function () {
    return gulp.src('./build/scss/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('style.min.css'))
        .pipe(clean())
        .pipe(gulp.dest('./css'));
});

gulp.task('compress_images', function () {
    compressimages('./build/images/*.{jpg,JPG,jpeg,JPEG,png,svg,gif}', './assets/', {
            compress_force: false,
            statistic: true,
            autoupdate: true
        }, false,
        {jpg: {engine: 'jpegRecompress', command: ['--quality', 'high', '--min', '60']}},
        {png: {engine: 'pngquant', command: ['--quality=20-50']}},
        {svg: {engine: 'svgo', command: '--multipass'}},
        {gif: {engine: 'gifsicle', command: ['--colors', '64', '--use-col=web']}}, function (err) {
            if (err !== null) {
                console.log("Use another config for compression!");
            }
        });
});


gulp.task('browser-sync', function () {
    browsersync.init({
        server: {
            baseDir: './'
        },
        watch: ['./*']
    });
});


gulp.task('default', function (event) {
    gulp.run('sass', 'browser-sync', 'compress_images');

    gulp.watch(['./build/scss/**/*.scss'], function () {
        gulp.run('sass');
    });

    gulp.watch(['./build/images/**/*.{jpg,JPG,jpeg,JPEG,png,svg,gif}'], function () {
        gulp.run('compress_images');
    });

});