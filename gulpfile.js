var gulp = require('gulp')
  , watch = require('gulp-watch')
  , sass = require('gulp-sass')
  , fs = require('fs')
  , webpack = require('gulp-webpack')
  , _webpack = require('webpack')
  , browserSync = require('browser-sync')
  , nodemon = require('gulp-nodemon')
  , sourcemaps = require('gulp-sourcemaps')
  , plumber = require('gulp-plumber')
  , reload = browserSync.reload;

var handleError = function(err) {
  console.log(err.stack);
  return this.emit('end');
};

var child_process = require('child_process')
  , exec = child_process.exec;

var child_processes = [];


var paths = {
  static: ['public/**/!(*.css)', 'dist/**/!(*.css)', 'views/**/*.*'],
};

gulp.task('webpack:dev', function() {
  return gulp.src('src/js/app.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('dist/'));
});


gulp.task('sass-dev', function() {
  gulp.src('src/**/*.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/'))
    .pipe(reload({stream:true}));
});

gulp.task('sass', function() {
  gulp.src('src/**/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest('dist/'));
});


gulp.task('webpack:build', function() {
  var webpackConfig = require('./webpack.config.js');
  webpackConfig.watch = false;
  webpackConfig.plugins = (webpackConfig.plugins || []).concat(
      new _webpack.optimize.DedupePlugin(),
      new _webpack.optimize.UglifyJsPlugin()
    );
  return gulp.src('src/js/app.js')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('dist/'));
});

gulp.task('stream-css', function() {
  return gulp.src('public/**/*.css')
    .pipe(reload({stream:true}));
});

gulp.task('browser-sync', ['server'], function() {
  // browser sync, refresh the page when you update something
  browserSync.init(null, {
    proxy: "http://localhost:3000",
    files: paths.static,
    browser: "google chrome",
    port: 5000,
  });
  gulp.watch('src/**/*.scss', ['sass-dev']);
  // gulp.watch('dist/**/*.css', ['stream-css']);
  // gulp.watch('public/**/*.css', ['stream-css']);
});

gulp.task('database', function(cb) {
  // make the database directory if it doesn't already exist
  try {
    fs.mkdirSync('./database');
  } catch(e) {
    // folder already exists
  }
  // run mongod
  child_processes.push(child_process.spawn('mongod', ['--dbpath=database'], {
    cwd: process.cwd()
  }));
  child_processes.forEach(function(cp) {
    cp.stdout.on('data', function(data) {
      process.stdout.write(data.toString());
    });

    cp.stderr.on('data', function(data) {
      process.stdout.write(data.toString()); 
    });
  });

  // pass through the the gulpfile's input to the nodemon process
  // to allow for 'rs' restart 
  // process.stdin.on('data', function(data) {
  //   child_processes[1].stdin.write(data.toString());
  // });

  cb();
})

gulp.task('server', ['database'], function(cb) {
  var theFirst = true;
  nodemon({
    script: 'server.js',
    ext: "js ejs ls",
    watch: [
      "development.json",
      "production.json",
      "routes/",
      "models/",
      "config/",
      "server.js",
      "services/",
    ]
  })
  .on('start', function() {
    if(theFirst) {
      setTimeout(cb, 2000);
      theFirst = false;
    } else {
      setTimeout(reload, 2000);
    }
  })
})


gulp.task('serve', ['webpack:dev', 'browser-sync',  'server', 'sass-dev']);

gulp.task('dist', ['webpack:build', 'sass']);

gulp.task('heroku:production', ['webpack:build', 'sass']);