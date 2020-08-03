const gulp = require("gulp");

const plumber = require("gulp-plumber");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const server = require("browser-sync").create();
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const posthtml = require("gulp-posthtml");
const include = require("posthtml-include");
const del = require("del");
const cssBase64 = require("gulp-css-base64");
const webpack = require("webpack-stream");
const realFavicon = require('gulp-real-favicon');
const fs = require('fs');
const FAVICON_DATA_FILE = 'faviconData.json';

const FAVICON_MASTER_PICTURE = './source/img/favicon.svg';

const path = {
  dist: './build/',
  base: 'source',
  build: {
    html: 'build/',
    js: 'build/js/',
    css: 'build/css/',
    img: 'source/img/',
    fonts: 'build/fonts/',
    favicon: 'build/img/favicon/',
    faviconInHtml: './build/*.html'
  },
  src: {
    html: 'source/*.html',
    script: './source/js/main.js',
    js: 'source/js/**/*.js',
    css: 'source/sass/style.scss',
    base64: 'build/css/style.min.css',
    img: 'source/img/*.{png,jpg,svg}',
    webp: 'source/img/*.{png,jpg}',
    sprite: 'source/img/icon_*.svg',
    fonts: 'source/fonts/**/*.{woff,woff2}',
    iconPath: './img/favicon/',
    copyIco: 'source//*.ico',
    copyImg: 'source/img/*.*',
  },
  watch: {
    html: 'source/*.html',
    js: 'source/js/**/*.js',
    css: 'source/sass/**/*.{scss,sass}',
    sprite: 'source/img/icon_*.svg'
  }
};

const configNames = {
  js: 'main.js',
  jsMin: 'main.min.js',
  css: 'style.min.css',
  sprite: 'sprite.svg',
};

function script() {
  return gulp.src(path.src.script)
    .pipe(webpack({
      mode: 'development',
      output: {
        filename: configNames.js
      },
      watch: false,
      devtool: "source-map",
      module: {
        rules: [{
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  debug: true,
                  corejs: 3,
                  useBuiltIns: "usage"
                }]
              ]
            }
          }
        }]
      }
    }))
    .pipe(gulp.dest(path.build.js));
}

function scriptMin() {
  return gulp.src("./source/js/main.js")
    .pipe(webpack({
      mode: 'production',
      output: {
        filename: configNames.jsMin
      },
      module: {
        rules: [{
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  corejs: 3,
                  useBuiltIns: "usage"
                }]
              ]
            }
          }
        }],
      }
    }))
    .pipe(gulp.dest(path.build.js));
}

function css() {
  return gulp.src(path.src.css)
    .pipe(plumber())
    .pipe(sass({
      includePaths: require('node-normalize-scss').includePaths
    }))
    .pipe(postcss([autoprefixer({
      browsers: [
        "> 1%",
        "not dead"
      ]
    })]))
    .pipe(csso())
    .pipe(rename(configNames.css))
    .pipe(gulp.dest(path.build.css))
    .pipe(server.stream());
}

function refresh() {
  server.reload();
}

function serve() {
  server.init({
    server: path.dist,
    notify: false,
    open: true,
    cors: true,
    ui: false
  });
  gulp.watch(path.watch.css, gulp.series(css, base64)).on('change', refresh);
  gulp.watch(path.watch.sprite, gulp.series(sprite, copy, html)).on('change', refresh);
  gulp.watch(path.watch.html, gulp.series(html)).on('change', refresh);
  gulp.watch(path.watch.js, gulp.series(script)).on('change', refresh);
  gulp.watch(path.src.img, gulp.series(copyImg)).on('change', refresh);
}

function images() {
  return gulp.src(path.src.img)
    .pipe(imagemin([
      imagemin.optipng({
        optimizationLevel: 3
      }),
      imagemin.jpegtran({
        progressive: true
      }),
      imagemin.svgo({
        plugins: [{
            cleanupIDs: false
          },
          {
            removeViewBox: false
          },
          {
            convertPathData: false
          },
          {
            mergePaths: false
          },
        ],
      })
    ]))
    .pipe(gulp.dest(path.build.img));
}

function webpImg() {
  return gulp.src(path.src.webp)
    .pipe(webp({
      quality: 90
    }))
    .pipe(gulp.dest(path.build.img));
}

function sprite() {
  return gulp.src(path.src.sprite)
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename(configNames.sprite))
    .pipe(gulp.dest(path.build.img));
}

function base64() {
  return gulp.src(path.src.base64)
    .pipe(cssBase64({
      maxWeightResource: 5000, //50кб
      extensionsAllowed: [".png", ".jpg"]
    }))
    .pipe(gulp.dest(path.build.css));
}

function generateFavicon(done) {
  realFavicon.generateFavicon({
    masterPicture: FAVICON_MASTER_PICTURE,
    dest: path.build.favicon,
    iconsPath: path.src.iconPath,
    design: {
      ios: {
        pictureAspect: 'noChange',
        assets: {
          ios6AndPriorIcons: false,
          ios7AndLaterIcons: false,
          precomposedIcons: false,
          declareOnlyDefaultIcon: true
        }
      },
      desktopBrowser: {
        design: 'raw'
      },
      windows: {
        pictureAspect: 'noChange',
        backgroundColor: '#e4e4e4',
        onConflict: 'override',
        assets: {
          windows80Ie10Tile: false,
          windows10Ie11EdgeTiles: {
            small: false,
            medium: true,
            big: false,
            rectangle: false
          }
        }
      },
      androidChrome: {
        pictureAspect: 'noChange',
        themeColor: '#ffffff',
        manifest: {
          display: 'standalone',
          orientation: 'notSet',
          onConflict: 'override',
          declared: true
        },
        assets: {
          legacyIcon: false,
          lowResolutionIcons: false
        }
      },
      safariPinnedTab: {
        pictureAspect: 'silhouette',
        themeColor: '#5bbad5'
      }
    },
    settings: {
      scalingAlgorithm: 'Mitchell',
      errorOnImageTooSmall: false,
      readmeFile: false,
      htmlCodeFile: false,
      usePathAsIs: false
    },
    markupFile: FAVICON_DATA_FILE
  }, function () {
    done();
  });
}

function injectFaviconMarkups(done) {
  gulp.src([path.build.faviconInHtml])
    .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
    .pipe(gulp.dest(path.dist));
  done();
}

function checkForFaviconUpdate(done) {
  let currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
  realFavicon.checkForUpdates(currentVersion, function (err) {
    if (err) {
      throw err;
    }
  });
  done();
}

function html() {
  return gulp.src(path.src.html)
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest(path.build.html));
}

function copy() {
  return gulp.src([
      path.src.fonts,
      path.src.copyImg,
      path.src.copyIco,
    ], {
      base: path.base
    })
    .pipe(gulp.dest(path.dist));
}

function copyImg() {
  return gulp.src([
      path.src.copyImg,
    ], {
      base: path.base
    })
    .pipe(gulp.dest(path.dist));
}


function clean() {
  return del(path.dist);
}

const build = gulp.series(clean, copy, script, css, base64, sprite, html);
const favicon = gulp.series(generateFavicon, checkForFaviconUpdate, injectFaviconMarkups);
let prod = gulp.series(clean, webpImg, images, copy, scriptMin, css, base64, sprite, html);
if (FAVICON_MASTER_PICTURE) {
  prod = gulp.series(clean, webpImg, images, copy, scriptMin, css, base64, sprite, html, favicon);
}

module.exports.build = build;
module.exports.start = gulp.series(build, serve);
module.exports.prod = prod;
module.exports.img = gulp.series(webpImg, images, copy);
