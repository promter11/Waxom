const   gulp            = require("gulp"),
        browserSync     = require("browser-sync"),
        sass            = require("gulp-sass"),
        htmlmin         = require("gulp-htmlmin"),
        cleanCSS        = require("gulp-clean-css"),
        uglify          = require("gulp-uglifyjs"),
        concat          = require("gulp-concat"),
        rename          = require("gulp-rename"),
        autoprefixer    = require("gulp-autoprefixer"),
        imagemin        = require("gulp-imagemin"),
        pngquant        = require("imagemin-pngquant"),
        cache           = require("gulp-cache"),
        del             = require("del");

gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: "app"
        },

        notify: false
    });
});

gulp.task('sass', () => {
    return gulp.src('app/scss/**/*.scss')
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(autoprefixer({browsers: ['last 15 versions'], cascade: false}))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.stream({stream: true}));
});

gulp.task('styles', () => {
    return gulp.src('app/libs/css/**/*.css')
        .pipe(concat('libs.min.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('app/libs/css'));
});

gulp.task('scripts', () => {
    return gulp.src('app/libs/js/**/*.js')
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/libs/js'));
});

gulp.task('img', () => {
    return gulp.src('app/img/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('app/img'));
});

gulp.task('minify-html', () => {
    return gulp.src('app/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist'));
});

gulp.task('minify-css', () => {
    return gulp.src('app/css/**/*.css')
        .pipe(rename({suffix: '.min', prefix : ''}))
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('minify-js', () => {
    return gulp.src('app/js/*.js')
        .pipe(concat('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('clear-dist', (done) => {
    del.sync('dist');
    done();
});

gulp.task('clear-cache', () => {
    return cache.clearAll();
});

gulp.task('build-dist', (done) => {
    const buildCss = gulp.src('app/css/**/*.css')
        .pipe(gulp.dest('dist/css'));
    
    const buildJs = gulp.src('app/js/*.js')
        .pipe(gulp.dest('dist/js'));
    
    const buildLibs = gulp.src('app/libs/**/*')
        .pipe(gulp.dest('dist/libs'));
    
    const buildImg = gulp.src('app/img/**/*')
        .pipe(gulp.dest('dist/img'));
    
    const buildFonts = gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));

    done();
});

gulp.task('watch', gulp.parallel('browser-sync', 'sass', () => {
    gulp.watch('app/scss/**/*.scss', gulp.parallel('sass'));
    gulp.watch('app/js/*.js').on('change', browserSync.reload);
    gulp.watch('app/*.html').on('change', browserSync.reload);
}));

gulp.task('build', gulp.series('clear-dist', 'img', 'styles', 'scripts', 'build-dist', 'minify-html', 'minify-css', 'minify-js'));