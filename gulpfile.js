// plugins for development
var gulp = require('gulp'),
	rimraf = require('rimraf'),
	pug = require('gulp-pug'),
	sass = require('gulp-dart-sass'),
	gulpSequence = require('gulp-sequence'),
	inlineimage = require('gulp-inline-image'),
	prefix = require('gulp-autoprefixer'),
	plumber = require('gulp-plumber'),
	dirSync = require('gulp-directory-sync'),
	browserSync = require('browser-sync').create(),
	reload = browserSync.reload,
	concat = require('gulp-concat'),
	cssfont64 = require('gulp-cssfont64'),
	sourcemaps = require('gulp-sourcemaps'),
	postcss = require('gulp-postcss'),
	assets = require('postcss-assets'),
	notify = require('gulp-notify')
	cache = require('gulp-cache');

let productionStatus;

// plugins for build
var purify = require('gulp-purifycss'),
	terser = require('gulp-terser'),
	image = require('gulp-image'),
	csso = require('gulp-csso');

//plugins for testing
var reporter = require('postcss-reporter'),
	stylelint = require('stylelint'),
	postcss_scss = require('postcss-scss');

// plugins for screenshots testing
var img1 = [],
	img2 = [],
	filesRead = 0,
	pageName;

var initialPageWidth = 1920;

var pageList = ['index'];

var assetsDir = 'assets/',
	outputDir = 'dist/',
	buildDir = 'build/';



//----------------------------------------------------Compiling
gulp.task('pug', function () {
	return gulp
		.src([assetsDir + 'pug/*.pug', '!' + assetsDir + 'pug/_*.pug'])
		.pipe(plumber())
		.pipe(
			pug({
				pretty: true,
				data: {
					productionStatus: productionStatus,
				},
			})
		)
		.on(
			'error',
			notify.onError({
				message: '<%= error.message %>',
				title: 'PUG Error!',
			})
		)
		.pipe(gulp.dest(outputDir))
		.pipe(browserSync.stream({ once: true }));
});

gulp.task('sass', function () {
	return gulp
		.src([assetsDir + 'sass/**/*.scss', '!' + assetsDir + 'sass/**/_*.scss'])
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(
			sass().on(
				'error',
				notify.onError({
					message: '<%= error.message %>',
					title: 'Sass Error!',
				})
			)
		)
		.pipe(inlineimage())
		.pipe(prefix('last 3 versions'))
		.pipe(
			postcss([
				assets({
					basePath: outputDir,
					loadPaths: ['i/'],
				}),
			])
		)
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(outputDir + 'styles/'))
		.pipe(browserSync.stream({ match: '**/*.css' }));
});

gulp.task('jsConcatLibs', function () {
	return gulp
		.src(assetsDir + 'js/libs/**/*.js')
		.pipe(concat('libs.js', { newLine: ';' }))
		.pipe(gulp.dest(outputDir + 'js/'))
		.pipe(browserSync.stream({ once: true }));
});

gulp.task('jsConcatComponents', function () {
	return gulp
		.src(assetsDir + 'js/components/**/*.js')
		.pipe(concat('components.js', { newLine: ';' }))
		.pipe(gulp.dest(outputDir + 'js/'))
		.pipe(browserSync.stream({ once: true }));
});

gulp.task('fontsConvert', function () {
	return gulp
		.src([assetsDir + 'fonts/*.woff', assetsDir + 'fonts/*.woff2'])
		.pipe(cssfont64())
		.pipe(gulp.dest(outputDir + 'styles/'))
		.pipe(browserSync.stream({ once: true }));
});

//----------------------------------------------------Compiling###

//-------------------------------------------------Synchronization
gulp.task('imageSync', function () {
	return gulp
		.src(assetsDir + 'i/**/*')
		.pipe(plumber())
		.pipe(gulp.dest(outputDir + 'i/'))
		.pipe(browserSync.stream({ once: true }));
});





gulp.task('fontsSync', function () {
	return gulp
		.src(assetsDir + 'fonts/**/*')
		.pipe(plumber())
		.pipe(gulp.dest(outputDir + 'fonts/'))
		.pipe(browserSync.stream({ once: true }));
});

gulp.task('jsSync', function () {
	return gulp
		.src(assetsDir + 'js/*.js')
		.pipe(plumber())
		.pipe(gulp.dest(outputDir + 'js/'))
		.pipe(browserSync.stream({ once: true }));
});
//-------------------------------------------------Synchronization###

//watching files and run tasks
gulp.task('watch', function () {
	gulp.watch(assetsDir + 'pug/**/*.pug', gulp.series('pug'));
	gulp.watch(assetsDir + 'sass/**/*.scss', gulp.series('sass'));
	gulp.watch(assetsDir + 'js/**/*.js', gulp.series('jsSync'));
	gulp.watch(assetsDir + 'js/libs/**/*.js', gulp.series('jsConcatLibs'));
	gulp.watch(
		assetsDir + 'js/components/**/*.js',
		gulp.series('jsConcatComponents')
	);
	gulp.watch(assetsDir + 'i/**/*', gulp.series('imageSync'));
	gulp.watch(
		assetsDir + 'fonts/**/*',
		gulp.series('fontsSync', 'fontsConvert')
	);
});

//livereload and open project in browser
var plugins = {
	browserSync: {
		options: {
			port: 3030,
			server: {
				baseDir: outputDir,
			},
			tunnel: 'arkada',
		},
	},
};

gulp.task('browser-sync', function () {
	return browserSync.init(plugins.browserSync.options);
});

gulp.task('bs-reload', function (cb) {
	browserSync.reload();
});

//---------------------------------building final project folder
//clean build folder
gulp.task('cleanBuildDir', function (cb) {
	return rimraf(buildDir, cb);
});

//minify images
gulp.task('imgBuild', function () {
	return gulp
		.src([outputDir + 'i/**/*', '!' + outputDir + 'i/sprite/**/*'])
		.pipe(
			image({
				pngquant: true,
				optipng: false,
				zopflipng: true,
				jpegRecompress: false,
				mozjpeg: true,
				gifsicle: true,
				svgo: false,
				concurrent: 10,
				quiet: false, // defaults to false
			})
		)
		.pipe(gulp.dest(buildDir + 'i/'));
});

gulp.task('imgMinify', function () {
	return gulp
		.src([assetsDir + 'i/**/*', '!' + assetsDir + 'i/sprite/**/*'])
		.pipe(cache(image({
			pngquant: true,
			optipng: false,
			zopflipng: true,
			jpegRecompress: false,
			mozjpeg: true,
			gifsicle: true,
			svgo: false,
			concurrent: 5,
			quiet: false,
		}), {
			key: function (file) {
				// Use the path relative to the working directory as cache key
				return file.relative;
			},
			// Specify the cache folder
			cacheDir: outputDir + 'i-cache'
		}))
		.pipe(gulp.dest(outputDir + 'i/'));
});



//copy sprite.svg
gulp.task('copySprite', function () {
	return gulp
		.src(outputDir + 'i/sprite/sprite.svg')
		.pipe(plumber())
		.pipe(gulp.dest(buildDir + 'i/sprite/'));
});

//copy fonts
gulp.task('fontsBuild', function () {
	return gulp
		.src(outputDir + 'fonts/**/*')
		.pipe(gulp.dest(buildDir + 'fonts/'));
});

//copy html
gulp.task('htmlBuild', function () {
	return gulp.src(outputDir + '**/*.html').pipe(gulp.dest(buildDir));
});

//copy and minify js
gulp.task('jsBuild', function () {
	return gulp
		.src(outputDir + 'js/**/*')
		.pipe(terser())
		.pipe(gulp.dest(buildDir + 'js/'));
});

//copy, minify css
gulp.task('cssBuild', function () {
	return gulp
		.src(outputDir + 'styles/**/*')
		.pipe(csso())
		.pipe(gulp.dest(buildDir + 'styles/'));
});

//// --------------------------------------------If you need iconfont
// var iconfont = require('gulp-iconfont'),
// 	iconfontCss = require('gulp-iconfont-css'),
// 	fontName = 'iconfont';
// gulp.task('iconfont', function () {
// 	gulp.src([assetsDir + 'i/icons/*.svg'])
// 		.pipe(iconfontCss({
// 			path: 'assets/sass/templates/_icons_template.scss',
// 			fontName: fontName,
// 			targetPath: '../../sass/_icons.scss',
// 			fontPath: '../fonts/icons/',
// 			svg: true
// 		}))
// 		.pipe(iconfont({
// 			fontName: fontName,
// 			svg: true,
// 			formats: ['svg','eot','woff','ttf']
// 		}))
// 		.pipe(gulp.dest('assets/fonts/icons'));
// });

// --------------------------------------------If you need svg sprite
var svgSprite = require('gulp-svg-sprite'),
	svgmin = require('gulp-svgmin'),
	cheerio = require('gulp-cheerio'),
	replace = require('gulp-replace');

gulp.task('svgSpriteBuild', function () {
	return (
		gulp
			.src(assetsDir + 'i/icons/*.svg')
			// minify svg
			.pipe(
				svgmin({
					js2svg: {
						pretty: true,
					},
				})
			)
			// remove all fill and style declarations in out shapes
			.pipe(
				cheerio({
					run: function ($) {
						$('[fill]').removeAttr('fill');
						$('[stroke]').removeAttr('stroke');
						$('[style]').removeAttr('style');
					},
					parserOptions: { xmlMode: true },
				})
			)
			// cheerio plugin create unnecessary string '&gt;', so replace it.
			.pipe(replace('&gt;', '>'))
			// build svg sprite
			.pipe(
				svgSprite({
					mode: {
						symbol: {
							sprite: '../sprite.svg',
							render: {
								scss: {
									dest: '../../../sass/_sprite.scss',
									template: assetsDir + 'sass/templates/_sprite_template.scss',
								},
							},
							example: true,
						},
					},
				})
			)
			.pipe(gulp.dest(assetsDir + 'i/sprite/'))
	);
});

gulp.task('cssLint', function () {
	return gulp
		.src([
			assetsDir + 'sass/**/*.scss',
			'!' + assetsDir + 'sass/templates/*.scss',
		])
		.pipe(
			postcss([stylelint(), reporter({ clearMessages: true })], {
				syntax: postcss_scss,
			})
		);
});

gulp.task('set-dev-node-env', function(done) {
	productionStatus = 'development';
	done();
});

gulp.task('set-prod-node-env', function(done) {
	productionStatus = 'production';
	done();
});






let taskArray = {
	development: gulp.series(
		'set-dev-node-env',
		gulp.parallel(
			'pug',
			'sass',
			'imgMinify',
			'imageSync',
			'fontsSync',
			'fontsConvert',
			'jsConcatLibs',
			'jsConcatComponents',
			'jsSync',
			'watch',
			'browser-sync'
		)
	),
	production: gulp.series(
		'cleanBuildDir',
		'set-prod-node-env',
		'pug',
		gulp.parallel(
			'imgBuild',
			'fontsBuild',
			'htmlBuild',
			'jsBuild',
			'cssBuild',
			'copySprite'
		)
	),
};


gulp.task('clearCache', function (done) {
	return cache.clearAll(done);
});


gulp.task('default', taskArray['development']);
gulp.task('build', taskArray['production']);





