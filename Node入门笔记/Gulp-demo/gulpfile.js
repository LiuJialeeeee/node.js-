const gulp = require('gulp');

gulp.task('first', () => {
    console.log('执行');

    gulp.src("./src/css/index.css").pipe(gulp.dest("./dist/css"));

});


const htmlmin = require('gulp-htmlmin');
const fileinclude = require('gulp-file-include');
const less = require('gulp-less');
const csso = require('gulp-csso');

gulp.task('minify', () => {
    gulp.src('src/*.html')
        .pipe(fileinclude())
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist'));
});
gulp.task('cssmin', () => {
    gulp.src(['./src/css/*.less', './src/css/*.css'])
        .pipe(less())
        .pipe(csso())
        .pipe(gulp.dest('dist/css'));
});
gulp.task('default', ['first', 'minify', 'cssmin']);