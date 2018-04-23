//gulp
var gulp = require('gulp');
var clean = require('gulp-clean');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var cheerio = require('gulp-cheerio');

//bower
var wiredep = require('gulp-wiredep');

//html scripts
var useref = require('gulp-useref');

//sass=css
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');

//js
var uglify = require('gulp-uglify');

//dev
var browserSync = require('browser-sync').create();

//svg
var svgSprite = require('gulp-svg-sprite');
var svgmin = require('gulp-svgmin');

//personal
var config = {
    mode: {
        symbol: {
            sprite: "../socials-sprite.svg"
        }
    }
};

//common tasks
gulp.task('default', ['clean'], function(){
    gulp.run('dev');
});

gulp.task('production', ['clean'], function(){
    gulp.run('build');
});

gulp.task('dev', ['build', 'watch', 'browser-sync']);

gulp.task('build', ['svgSpriteBuild', 'html', 'css', 'js', 'assets']);

gulp.task('watch', function(){
    gulp.watch('src/css/**/*.scss', ['css']);
    gulp.watch('src/js/**/*.js', ['js']);
    gulp.watch('src/*.html', ['html']);
    gulp.watch('src/assets/**/*.*', ['assets']);
    gulp.watch('src/**/*.*').on('change', browserSync.reload);
});

gulp.task('clean', function(){
    return gulp.src('build/')
        .pipe(clean());
});

//engine tasks
gulp.task('svgSpriteBuild', function() {
    return gulp.src('src/assets/images/icons/*.svg')
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        .pipe(cheerio({
            run: function($) {
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
            },
            parserOptions: { xmlMode: true }
        }))
        .pipe(replace('&gt;', '>'))
        .pipe(svgSprite(config))
        .pipe(gulp.dest('src/assets/images/icons/sprite/'));
});

gulp.task('html', function(){
    return gulp.src('src/*.html')
        .pipe(wiredep({
            directory: 'bower_components/'
        }))
        .pipe(gulp.dest('build/'))
        .on('end', function(){
            gulp.run('useref');
        });
});

gulp.task('useref', function(){
    return gulp.src('build/*.html')
        .pipe(useref())
        .pipe(gulp.dest('build/'));
});

gulp.task('css', function(){
    return gulp.src('src/css/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(rename('main.min.css'))
        .pipe(postcss([cssnano, autoprefixer]))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/css'));
});

gulp.task('js', function(){
    gulp.src('src/js/*.js')
        .pipe(uglify())
        .pipe(rename("main.min.js"))
        .pipe(gulp.dest('build/js/'));
});

gulp.task('assets', function(){
    return gulp.src('src/assets/**/*.*')
        .pipe(gulp.dest('build/assets'));
});

gulp.task('browser-sync', function() {
    return browserSync.init({
        server: {
            baseDir: 'build/'
        }
    });
});