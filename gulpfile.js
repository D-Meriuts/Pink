const gulp = require("gulp");
const fileInclude = require("gulp-file-include");
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const sassGlob = require('gulp-sass-glob');
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const htmlmin = require('gulp-htmlmin');
const csso = require('postcss-csso');
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const del = require("del");
const webpack = require("webpack-stream");

const plumberNotify = (blockTitle) => {
  return {
    errorHandler: notify.onError({
      title: blockTitle,
      message: "Error: <%= error.message %>",
      sound: false
    })
  }
}


// Styles
const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber(plumberNotify('SASS')))
    .pipe(sourcemap.init())
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// HTML
const html = () => {
  return gulp.src("source/html/*.html")
    .pipe(plumber(plumberNotify('HTML')))
    .pipe(fileInclude({
      prefix: "@@",
      basepath: "@file"
    }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"))
}

exports.html = html;

// Scripts
const scripts = () => {
  return gulp.src("source/js/*.js")
    .pipe(plumber(plumberNotify('JS')))
    .pipe(webpack(require("./webpack.config.js")))
    .pipe(gulp.dest("build/js"))
    .pipe(sync.stream());
}

exports.scripts = scripts;


// Images
const optimizeImages = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}")
    .pipe(imagemin({verbose: true}))
    .pipe(gulp.dest("build/img"))
}

exports.optimizeImages = optimizeImages;

const copyImages = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}")
    .pipe(gulp.dest("build/img"))
}

exports.copyImages = copyImages;

// WebP
const createWebp = () => {
  return gulp.src(["source/img/**/*.{jpg,png}", "!source/img/favicons/*.{jpg,png}"])
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest("build/img"))
}

exports.createWebp = createWebp;

// Sprite
const sprite = () => {
  return gulp.src("source/img/svg_icons/*.svg")
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
}

exports.sprite = sprite;

// Copy
const copy = (done) => {
  gulp.src([
    "source/fonts/*.{woff2,woff}",
    "source/*.ico",
    "source/img/favicons/*.webmanifest",
    "source/img/**/*.{jpg,png,svg}",
    "!source/img/svg_icons/*.svg",
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"))
  done();
}

exports.copy = copy;

// Clean
const clean = () => {
  return del("build");
};

exports.clean = clean;

// Server
const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Reload
const reload = (done) => {
  sync.reload();
  done();
}

// Watcher
const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series(styles));
  gulp.watch("source/js/**/*.js", gulp.series(scripts));
  gulp.watch("source/html/**/*.html", gulp.series(html, reload));
}

// Build
const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    sprite,
    createWebp
  ),
);

exports.build = build;

// Default
exports.default = gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    sprite,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  ));
