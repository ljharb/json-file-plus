'use strict';

var fs = require('fs');
var extend = require('node.extend');
var is = require('is');
var promiseback = require('promiseback');

var JSONFile = function JSONFile(filename, raw) {
	var hasTrailingNewline = (/\n\n$/).test(raw);
	var indentMatch = String(raw).match(/^[ \t]+/m);
	var indent = indentMatch ? indentMatch[0] : 2;

	this.format = {
		indent: indent,
		trailing: hasTrailingNewline
	};
	this.filename = filename;
	this.data = JSON.parse(raw);
};
JSONFile.prototype.get = function (key, callback) {
	var data = extend({}, this.data);
	if (is.fn(key)) {
		callback = key;
		key = null;
	}
	var value = key ? data[key] : data;
	if (is.hash(value)) {
		value = extend({}, value);
	}
	var deferred = promiseback(callback);
	deferred.resolve(value);
	return deferred.promise;
};
JSONFile.prototype.set = function (obj) {
	if (!is.hash(obj)) { throw new TypeError('object must be a plain object'); }
	extend(true, this.data, obj);
};
JSONFile.prototype.save = function (callback) {
	var endingNewlines = this.format.trailing ? '\n\n' : '\n';
	var indent = this.format.indent || 2;
	var json = new Buffer(JSON.stringify(this.data, null, indent) + endingNewlines);
	var deferred = promiseback(callback);
	fs.writeFile(this.filename, json, function (err, result) {
		if (err) {
			deferred.reject(err);
		} else {
			deferred.resolve(result);
		}
	});
	return deferred.promise;
};

var readJSON = function readJSON(filename) {
	var callback;
	if (arguments.length > 1) {
		callback = arguments[1];
		if (!is.fn(callback)) {
			throw new TypeError('callback must be a function if provided');
		}
	}
	var deferred = promiseback(callback);
	fs.readFile(filename, { encoding: 'utf8' }, function (err, raw) {
		var file;

		if (err) {
			deferred.reject(err);
		} else {
			try {
				file = new JSONFile(filename, raw);
				deferred.resolve(file);
			} catch (e) {
				deferred.reject(e);
			}
		}
	});
	return deferred.promise;
};

var readOrCreate = function readOrCreate(filename) {
	return new promiseback.Deferred.Promise(function (resolve, reject) {
		fs.readFile(filename, { encoding: 'utf8' }, function (err, raw) {
			try {
				resolve(new JSONFile(filename, err ? '{}' : raw));
			} catch (e) {
				reject(e);
			}
		});
	});
};

readJSON.JSONFile = JSONFile;
readJSON.readOrCreate = readOrCreate;

module.exports = readJSON;
