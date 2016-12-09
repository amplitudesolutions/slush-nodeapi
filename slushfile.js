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
    infection = require('inflection');

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

gulp.task('default', function (done) {
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
        name: 'moveon',
        message: 'Continue?'
    }];
    //Ask
    inquirer.prompt(prompts,
        function (answers) {
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
                .pipe(install())
                .on('end', function () {
                    done();
                });
        });
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

            answers.modelName = _this.args[0];
            answers.modelNameLCase = _this.args[0].toLowerCase();
            answers.modelNameUCase = _.capitalize(answers.modelName);
            answers.modelPluralLCase = infection.pluralize(answers.modelNameLCase);
            var modelNameNameSlug = _.slugify(answers.modelName);

            gulp.src(__dirname + '/templates/model/model.js')
                .pipe(template(answers))
                .pipe(rename(answers.modelName + '.js'))
                .pipe(conflict('./app/models'))
                .pipe(gulp.dest('./app/models'))
                .pipe(install())
                .on('end', function () {
                    done();
                });

            if (answers.genRoutes) {
                gulp.src(__dirname + '/templates/routes/route.js')
                    .pipe(template(answers))
                    .pipe(rename(answers.modelPluralLCase + '.js'))
                    .pipe(conflict('./app/routes'))
                    .pipe(gulp.dest('./app/routes'))
                    .pipe(install())
                    .on('end', function () {
                        done();
                    });
            }

            if (answers.genTests) {

            }

        });
});
