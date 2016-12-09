var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    pug         = require('gulp-pug'),
    browserSync  = require('browser-sync'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglifyjs'),
    rename       = require('gulp-rename'),
    del          = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
    sprite       = require('gulp.spritesmith'),
    buffer       = require('vinyl-buffer'),
    imagemin     = require('gulp-imagemin'),
    csso         = require('gulp-csso');

gulp.task('clean', function() {
  return del.sync('app/fonts/*/')
})

gulp.task('fonts', function() {
  return gulp.src('app/libs/open-sans-fontface/fonts/**/*.+(eot|svg|ttf|woff|woff2)')
  .pipe(gulp.dest('app/fonts/OpenSans'))
})

gulp.task('sprite', function() {
  var spriteData = gulp.src('app/img/default-img/forSprite_page2/**/*.png')
    .pipe(sprite({
                  imgName: 'sprite.png',
                  cssName: 'sprite.sass',
                  algorithm: 'top-down'
                  }));
  spriteData.img
      .pipe(buffer())
      .pipe(gulp.dest('app/img/'));
 spriteData.css
      .pipe(gulp.dest('app/sass/'));
      //.pipe(csso())

})


// gulp.task('sass', function() {
//     return gulp.src(['!app/sass/sprite.sass','!app/sass/fonts.scss','!app/sass/libs.sass', '!app/sass/meadia-query.scss', 'app/sass/**/*.+(sass|scss)/'])
//     .pipe(sass().on('error', sass.logError))
//     .pipe(autoprefixer(['last 50 versions', '> 1%', 'ie 6', 'ie 7', 'ie 8', ], {cascade: true}))
//     .pipe(gulp.dest('app/css'))
//     .pipe(browserSync.reload({stream: true}))
// });

gulp.task('sass-libs', function() {
    return gulp.src('app/components/Fixed-Header-Table/css/defaultTheme.css')
    .pipe(gulp.dest('app/css/'))
    .pipe(browserSync.reload({stream: true}))
})


gulp.task('scripts', function() {
    return gulp.src(['!app/components/jquery/dist/jquery.min.js',
    '!app/components/datatables.net-fixedheader/js/dataTables.fixedHeader.min.js', '!app/components/datatables.net-fixedcolumns/js/dataTables.fixedColumns.min.js',
     'app/components/Fixed-Header-Table/jquery.fixedheadertable.min.js',
    '!app/components/Fixed-Header-Table/lib/jquery.mousewheel.js'
                    ])
    .pipe(concat('libs.min.js', {newLine: ';'}))
    //.pipe(uglify())
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('pug', function() {
    return gulp.src(['!app/views/**/_*.pug', 'app/views/**/index.pug'])
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('app/'))
    .pipe(browserSync.reload({stream: true}))

});

gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: 'app'
        }
    })
});

gulp.task('watch',[ 'sass-libs', 'scripts','browserSync'], function() {
    gulp.watch('app/libs/bootstrap-sass/assets/stylesheets/bootstrap/_variables.scss',['sass-libs'], browserSync.reload);
    gulp.watch('app/sass/**/*.+(sass|scss)', ['sass', 'sass-libs'], browserSync.reload);
    //gulp.watch('app/**/*.pug', ['pug']);
    gulp.watch('app/**/*.html', browserSync.reload);
    gulp.watch('app/css/**/*.css', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
    gulp.watch('browserSync', ['sass', 'sass-libs', 'scripts']);
});

gulp.task('clean', function() {
    return del.sync('dist');
});


gulp.task('build', ['clean', 'sass', 'scripts'], function() {
  var buildCss = gulp.src(['app/css/main.css', 'app/css/libs.css'])
                  .pipe(gulp.dest('dist/css'))

  var buildFonts = gulp.src('app/fonts/**/*')
                    .pipe(gulp.dest('dist/fonts'))

  var builsJs = gulp.src(['app/js/**/*'])
                    .pipe(gulp.dest('dist/js'))

  var builPug = gulp.src('app/views/**/*')
                    .pipe(gulp.dest('dist/views'))

  //var buildHtml = gulp.src('app/*.html')
  //                  .pipe(gulp.dest('dist'))
})
