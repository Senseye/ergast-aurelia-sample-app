import gulp from 'gulp';
import changedInPlace from 'gulp-changed-in-place';
import sourcemaps from 'gulp-sourcemaps';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import project from '../aurelia.json';
import {build} from 'aurelia-cli';

import postcssImport from  'postcss-import';
import postcssMixins from 'postcss-mixins'; // Must be set *before* simple-vars and nested
import postcssSimpleVars from 'postcss-simple-vars';
import postssCalc from 'postcss-calc';
import postcssNested from 'postcss-nested';
import postcssSimpleExtend from 'postcss-simple-extend'; // Must be set *after* nested
import postcssMediaMinMax from 'postcss-media-minmax';
import postcssPseudoElements from 'postcss-pseudoelements';
import postcssFocus from 'postcss-focus';
import postcssFakeid from 'postcss-fakeid';
//postcss-at2x, // Not needed if using sprites
import cmqpacker from 'css-mqpacker';
import csswring from 'csswring';
import postcssBemLinter from 'postcss-bem-linter';
import postcssStats from 'postcss-cssstats';
import postcssReporter from 'postcss-reporter'
import sass from 'gulp-sass';

export default function processCSS() {
  let processors = [
    postcssImport(({ path: 'public/pcss/' })),
    postcssMixins,
    postcssSimpleVars,
    postssCalc,
    postcssNested,
    postcssSimpleExtend,
    postcssMediaMinMax,
    postcssPseudoElements,
    postcssFocus,
    postcssFakeid,
    autoprefixer({browsers: ['last 1 version']}),
    cmqpacker,
    csswring,
    postcssBemLinter((function (a) {
      console.log(a);
    })),
    postcssReporter((function (stats) {
      console.log(
        '\n' +
        'CSS Stats: ' + '\n' +
        'AVERAGE SPECIFICITY: ' +
        Math.round(stats.averages.specificity * 100) / 100 +
        '\n' + 'AVERAGE RULE SIZE: ' +
        Math.round(stats.averages.ruleSize * 100) / 100 +
        '\n' + 'SIZE: ' + stats.size + '\n' +
        'GZIP SIZE: ' + stats.gzipSize
      );
    }))
  ];

  return gulp.src(project.cssProcessor.source)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(build.bundle());
}
