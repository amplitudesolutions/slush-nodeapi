var chai = require('chai');
var gulp = require('gulp');
var mockGulpDest = require('mock-gulp-dest')(gulp);
var expect = chai.expect;

var mockPrompt = require('./prompt-fixture');

require('../slushfile');

describe('Basic API Generator without JWT', function() {
	beforeEach(function() {
		mockPrompt({
			appName: 'My Test App',
			appDescription: 'Some stuff here',
			appVersion: '0.2.0',
			authorName: 'Some cool guy',
			authorEmail: 'test@test.com',
			userName: 'test@github.com',
			mongoPath: 'http://localhost:27107',
			JWT: false,
			moveon: true
		});
	});

	it('should create a package.json', function() {

		gulp
			.start('default')
			.once('task_stop', function() {
				console.log('test');
				mockGulpDest.assertDestContains('package2.json');
				
			});

	});
});