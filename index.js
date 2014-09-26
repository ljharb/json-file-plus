var fs = require('fs');
var path = require('path');
var extend = require('node.extend');
var is = require('is');
var promiseback = require('promiseback');

var JSONFile = function (filename, raw) {
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
	var endingNewlines = this.format.trailing ? "\n\n" : "\n";
	var indent = this.format.indent || 2;
	var json = new Buffer(JSON.stringify(this.data, null, indent) + endingNewlines);
	var deferred = promiseback(callback);
	fs.writeFile(this.filename, json, deferred.resolve);
	return deferred.promise;
};

var readJSON = function (filename) {
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

		if (!err) {
			try { file = new JSONFile(filename, raw); }
			catch (e) { err = e; }
		}
		if (err) {
			deferred.reject(err);
		} else {
			deferred.resolve(file);
		}
	});
	return deferred.promise;
};
readJSON.JSONFile = JSONFile;

module.exports = readJSON;

