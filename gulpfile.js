let gulp = require('gulp');
let sass = require('gulp-sass');
let browsersync = require('browser-sync');
let clean = require('gulp-clean-css');
let concat = require('gulp-concat');
let compressimages = require('compress-images');
let uglify = require('gulp-uglify');


gulp.task('sass', function () {
    return gulp.src('./build/scss/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('style.min.css'))
        .pipe(clean())
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('compress-images', function () {
    compressimages('./build/images/*.{jpg,JPG,jpeg,JPEG,png,svg,gif}', './dist/assets/', {
        compress_force: false,
        statistic: true,
        autoupdate: true
    }, false, {
        jpg: {
            engine: 'jpegRecompress',
            command: ['--quality', 'high', '--min', '60']
        }
    }, {
        png: {
            engine: 'pngquant',
            command: ['--quality=20-50']
        }
    }, {
        svg: {
            engine: 'svgo',
            command: '--multipass'
        }
    }, {
        gif: {
            engine: 'gifsicle',
            command: ['--colors', '64', '--use-col=web']
        }
    }, function (err) {
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


gulp.task('js', function () {
    return gulp.src('./build/js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))
});


gulp.task('default', function (event) {

    gulp.start('sass', 'browser-sync', 'js');

    gulp.watch('./build/scss/**/*.scss', () => gulp.start('sass'));

    gulp.watch('./build/js/**/*.js', () => gulp.start('js'));

    gulp.watch(['build/images/*.{jpg,JPG,jpeg,JPEG,png,svg,gif}'])
        .on('change', () => gulp.start('compress-images'));
});

// Check qualitity before compression