/*
 * slush-nodeapi
 * https://github.com/amplitudesolutions/slush-nodeapi
 *
 * Copyright (c) 2016, Martin Fedec
 * Licensed under the MIT license.
 */

'use strict';

var gulp = require('gulp'),
    install = require('gulp-install'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    rename = require('gulp-rename'),
    _ = require('underscore.string'),
    inquirer = require('inquirer'),
    path = require('path'),
    inflection = require('inflection');

var includeJWT = false;

function format(string) {
    var username = string.toLowerCase();
    return username.replace(/\s/g, '');
}

var defaults = (function () {
    var workingDirName = path.basename(process.cwd()),
      homeDir, osUserName, configFile, user;

    if (process.platform === 'win32') {
        homeDir = process.env.USERPROFILE;
        osUserName = process.env.USERNAME || path.basename(homeDir).toLowerCase();
    }
    else {
        homeDir = process.env.HOME || process.env.HOMEPATH;
        osUserName = homeDir && homeDir.split('/').pop() || 'root';
    }

    configFile = path.join(homeDir, '.gitconfig');
    user = {};

    if (require('fs').existsSync(configFile)) {
        user = require('iniparser').parseSync(configFile).user;
    }

    return {
        appName: workingDirName,
        userName: osUserName || format(user.name || ''),
        authorName: user.name || '',
        authorEmail: user.email || '',
        mongodbPath: 'mongodb://localhost:27017'
    };
})();

gulp.task('main', function (done) {
    var prompts = [{
        name: 'appName',
        message: 'What is the name of your project?',
        default: defaults.appName
    }, {
        name: 'appDescription',
        message: 'What is the description?'
    }, {
        name: 'appVersion',
        message: 'What is the version of your project?',
        default: '0.1.0'
    }, {
        name: 'authorName',
        message: 'What is the author name?',
        default: defaults.authorName
    }, {
        name: 'authorEmail',
        message: 'What is the author email?',
        default: defaults.authorEmail
    }, {
        name: 'userName',
        message: 'What is the github username?',
        default: defaults.userName
    }, {
        name: 'mongoPath',
        message: 'What is the path to MongoDB Instance?',
        default: defaults.mongodbPath

    }, {
        type: 'confirm',
        name: 'JWT',
        message: 'Do you want JWT user authentication?'
    }
    , {
        type: 'confirm',
        name: 'moveon',
        message: 'Continue?'
    }];
    //Ask
    inquirer.prompt(prompts,
        function (answers) {
            answers.jwtDependencies = '';
            if (answers.JWT) {
                includeJWT = answers.JWT;
                answers.jwtDependencies = ', "bcryptjs": "~2.3.0", "jsonwebtoken": "~7.1.9"';
            }

            if (!answers.moveon) {
                return done();
            }

            answers.appNameSlug = _.slugify(answers.appName);
            gulp.src(__dirname + '/templates/src/**')
                .pipe(template(answers))
                .pipe(rename(function (file) {
                    if (file.basename[0] === '_') {
                        file.basename = '.' + file.basename.slice(1);
                    }
                }))
                .pipe(conflict('./'))
                .pipe(gulp.dest('./'))
                .on('end', function () {
                    done();
                });
        });
});

gulp.task('jwt', ['main'], function(done) {
    if (includeJWT) {

        // Copy user model over
        gulp.src(__dirname + '/templates/model/user.js')
            .pipe(conflict('./app/models'))
            .pipe(gulp.dest('./app/models'))
            // .on('end', function () {
            //     done();
            // })
            ;

        // Overwrite routes file with Auth one.
        gulp.src(__dirname + '/templates/routes/auth_routes.js')
            .pipe(rename('routes.js'))
            // .pipe(conflict('./app/routes'))
            .pipe(gulp.dest('./app/routes'))
            .on('end', function () {
            });

        done();
    } else {
        done();
    }
});

gulp.task('model', function (done) {
    var _this = this;
    // _this.args = arguments passed in as an array if multiple.
    
    var prompts = [{
        type: 'confirm',
        name: 'genRoutes',
        message: 'Generate routes as well?'
    }, {
        type: 'confirm',
        name: 'genTests',
        message: 'Generate tests as well?'
    }, {
        type: 'confirm',
        name: 'moveon',
        message: 'Continue?'
    }];

    //Ask
    inquirer.prompt(prompts,
        function (answers) {
            if (!answers.moveon) {
                return done();
            }

            answers.modelName = inflection.singularize(_this.args[0]);
            answers.modelNameLCase = answers.modelName.toLowerCase();
            answers.modelNameUCase = _.capitalize(answers.modelName);
            answers.modelPluralLCase = inflection.pluralize(answers.modelNameLCase);
            var modelNameNameSlug = _.slugify(answers.modelName);

            gulp.src(__dirname + '/templates/model/model.js')
                .pipe(template(answers))
                .pipe(rename(answers.modelName + '.js'))
                .pipe(conflict('./app/models'))
                .pipe(gulp.dest('./app/models'));

            if (answers.genRoutes) {
                gulp.src(__dirname + '/templates/routes/route.js')
                    .pipe(template(answers))
                    .pipe(rename(answers.modelPluralLCase + '.js'))
                    .pipe(conflict('./app/routes'))
                    .pipe(gulp.dest('./app/routes'));
            }

            if (answers.genTests) {
                gulp.src(__dirname + '/templates/tests/test.js')
                    .pipe(template(answers))
                    .pipe(rename('test-' + answers.modelPluralLCase + '.js'))
                    .pipe(conflict('./test'))
                    .pipe(gulp.dest('./test'));
            }

            done();

        });
});

gulp.task('default', ['main', 'jwt'], function(done) {
    gulp.src('./package.json')
        .pipe(install());
    done();
});