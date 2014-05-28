/*
 * grunt-requestfiles
 * https://github.com/hi/grunt-requestfiles
 *
 * Copyright (c) 2014 Hello Innovation
 * All rights reserved
 */

module.exports = function(grunt) {
	'use strict';

	var http = require('http');
	var url = require('url');
	var path = require('path');
	var fs = require('fs');
	var chalk = require('chalk');
	var async = require('async');

	// increase max sockets
	http.globalAgent.maxSockets = 100;
	http.globalAgent.keepAlive = false;

	grunt.registerMultiTask('requestfiles', 'Clear file cache by http requests.', function() {

		var options = this.options({
			url: false,
			path: '/layout/',
			relative: '',
			params: '?reset=1'
		});

		var done = this.async();

		var tally = {
			total: 0,
			success: 0,
			files: 0,
			fail: 0
		};

		var printFiles = function() {
			if (tally.files) {
				grunt.log.writeln();
				grunt.log.write(chalk.green(tally.success.toString()) + (tally.success === 1 ? ' file' : ' files') + ' reseted. ' + chalk.red(tally.fail.toString()) + (tally.fail === 1 ? ' file' : ' files') + ' failed.');
			}
		}

		var total = this.files.length;

		this.files.forEach(function(filePair) {
			async.eachSeries(filePair.src, function(src, callback) {
				if (!grunt.file.isDir(src)) {
					tally.files++;

					var filename = unixifyPath(path.relative(options.relative, src)),
						uri = url.resolve(options.path, filename),
						httpOptions = {
							host: options.host,
							path: uri + options.params,
							method: 'GET',
							headers: {
								'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.36',
								'Accept': '*/*;q=0.8',
								'Accept-Language': 'en-US,en;q=0.8,pt;q=0.6',
								'Cache-Control': 'max-age=0',
								'Connection': 'close'
							},
							agent: false
						};

					var req = http.request(httpOptions, function(res) {

						res.on('data', function() { /* do nothing */ });
						res.on('end', function() {
							tally.total++;
							if (res.statusCode == 200) {
								grunt.log.writeln(chalk.green('>>') + tally.total + ' / ' + total + ' Reset ' + chalk.cyan(options.path + filename));
								tally.success++;
							} else {
								grunt.log.writeln(chalk.red('>>') + tally.total + ' / ' + total + ' Reset ' + chalk.cyan(filename) + ' ' + chalk.red(res.statusCode + ' ' + http.STATUS_CODES[res.statusCode]));
								tally.fail++;
							}

							if (tally.total >= total) {
								done();
								printFiles();
							}

							callback();
						});

					}).on('error', function(e) {
						grunt.log.writeln(chalk.red('>>') + tally.total + ' / ' + total + ' Reset ' + chalk.cyan(filename) + ' ' + chalk.red('ERROR'));
						tally.fail++;
						tally.total++;
					});

					req.end();
				} else {
					tally.total++;
				}

				if (tally.total >= total) {
					done();
					printFiles();
				}

				callback();
			});
		});

		grunt.log.writeln();
	});

	var unixifyPath = function(filepath) {
		if (process.platform === 'win32') {
			return filepath.replace(/\\/g, '/');
		} else {
			return filepath;
		}
	};
};
