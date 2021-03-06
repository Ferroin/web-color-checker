/* eslint-disable no-console */
const {src, dest, parallel, series, watch} = require('gulp')

const jsLibrarySources = [
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/jquery/dist/jquery.min.map',
    'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
    'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js.map',
    'node_modules/arrive/minified/arrive.min.js',
]

const jsAppSources = [
    'src/app.js',
]

const jsWatch = [
    'src/**/*.js',
]

const jsLint = [
    'src/**/*.js',
    'gulpfile.js',
]

const styleSources = [
    'src/styles.scss',
]

const stylesWatch = [
    'src/**/*.scss',
]

const stylesLint = [
    'src/**/*.scss',
]

const htmlSources = [
    'src/index.html',
]

const fontSources = [
    'node_modules/fork-awesome/fonts/forkawesome-webfont.woff2',
]

const watchOptions = {
    delay: 1000,
    queue: true,
}

const distDirectory = 'dist/'

function jsLibrary() {
    return src(jsLibrarySources)
        .pipe(dest('dist/'))
}

function jsApp() {
    const rollup = require('gulp-better-rollup')
    const sourcemaps = require('gulp-sourcemaps')
    const terser = require('gulp-terser')

    return src(jsAppSources)
        .pipe(sourcemaps.init())
        .pipe(rollup({
            cache: false,
        }, {
            format: 'iife',
        }))
        .pipe(terser({
            mangle: false,
            compress: false,
        }))
        .pipe(sourcemaps.write(''))
        .pipe(dest(distDirectory))
}

function styles() {
    const cleanCSS = require('gulp-clean-css')
    const sass = require('gulp-sass')
    const sourcemaps = require('gulp-sourcemaps')

    return src(styleSources)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS({
            rebase: false,
            level: 2,
        }))
        .pipe(sourcemaps.write(''))
        .pipe(dest(distDirectory))
}

function html() {
    const htmlmin = require('gulp-htmlmin')

    return src(htmlSources)
        .pipe(htmlmin({
            collapseWhitespace: true,
            conservativeCollapse: true,
            decodeEntities: true,
            keepClosingSlash: true,
            removeComments: true,
        }))
        .pipe(dest(distDirectory))
}

function fonts() {
    return src(fontSources)
        .pipe(dest('dist/fonts/'))
}

function watchLive() {
    watch(jsWatch, watchOptions, jsApp)
    watch(stylesWatch, watchOptions, styles)
    watch(htmlSources, watchOptions, html)
}

function serve() {
    const connect = require('gulp-connect')

    connect.server({
        root: distDirectory,
        livereload: false,
    })
}

function cleanDist() {
    const del = require('del')

    return del('dist/**')
}

function eslint() {
    const eslint = require('gulp-eslint')

    return src(jsLint)
        .pipe(eslint())
        .pipe(eslint.format('stylish'))
        .pipe(eslint.failAfterError())
}

function stylelint() {
    const stylelint = require('gulp-stylelint')

    return src(stylesLint)
        .pipe(stylelint({
            failAfterError: true,
            reporters: [
                {
                    formatter: 'verbose',
                    console: true,
                },
            ],
            syntax: 'scss',
        }))
}

function htmllintReporter(filepath, issues) {
    const colors = require('ansi-colors')
    const fancyLog = require('fancy-log')

    if (issues.length > 0) {
        for (const issue of issues) {
            fancyLog(`${colors.cyan('[gulp-htmllint] ')}${colors.white(`${filepath} [${issue.line},${issue.column}]: `)}${colors.red(`(${issue.code}) ${issue.msg}`)}`)
        }

        process.exitCode = 1
    }
}

function htmllint() {
    const htmllint = require('gulp-htmllint')
    const options = {
        rules: require('./package.json').htmllint,
        config: '',
    }

    options.rules['raw-ignore-regex'] = /^ *<%.*?%>$/

    return src(htmlSources)
        .pipe(htmllint(options, htmllintReporter))
}

exports.default = series(
    cleanDist,
    parallel(
        jsLibrary,
        jsApp,
        styles,
        html,
        fonts,
    ),
)
exports.default.description = 'Build the app.'

exports.serve = series(
    exports.default,
    serve,
)
exports.serve.description = 'Serve a local instance of the app on port 8080.'

exports.clean = parallel(
    cleanDist,
)
exports.clean.description = 'Clean the project directory.'

exports.check = series(
    eslint,
    stylelint,
    htmllint,
)
exports.check.description = 'Run code quality checks.'

exports.live = series(
    exports.default,
    parallel(
        watchLive,
        serve,
    ),
)
exports.live.description = 'Run a live version of the app for development, updating files as their sources are modified.'
