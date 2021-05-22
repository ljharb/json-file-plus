# json-file-plus <sup>[![Version Badge][npm-version-svg]][npm-url]</sup>

[![github actions][actions-image]][actions-url]
[![coverage][codecov-image]][codecov-url]
[![dependency status][deps-svg]][deps-url]
[![dev dependency status][dev-deps-svg]][dev-deps-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][npm-badge-png]][npm-url]

A module to read from and write to JSON files, without losing formatting, to minimize diffs.

## Example
```js
var jsonFile = require('json-file-plus');
var path = require('path'); // in node-core
var filename = path.join(process.cwd(), 'package.json');
var callback = function (err, result) { /* your code here */ };

/* Note: jsonFile also returns a Promise, if you prefer that to a Node-style callback ("errorback"). */
jsonFile(filename, function (err, file) {
	if (err) { return doSomethingWithError(err); }

	file.data; // Direct access to the data from the file
	file.format; // extracted formatting data. change at will.

	file.get('version'); // get top-level keys. returns a Promise
	file.get('version', callback); // get top-level keys. calls the errorback
	file.get(); // get entire data. returns a Promise
	file.get(callback); // get entire data. calls the errorback

	/* pass any plain object into "set" to merge in a deep copy */
	/* please note: references will be broken. */
	/* if a non-plain object is passed, will throw a TypeError. */
	file.set({
		foo: 'bar',
		bar: {
			baz: true
		}
	});

	file.remove('description'); // remove a specific key-value pair. returns a Promise
    	file.remove('description', callback); // remove a specific key-value pair. calls the errorback

	/* change the filename if desired */
	file.filename = path.join(process.cwd(), 'new-package.json');

	/* Save the file, preserving formatting. */
	/* Errorback will be passed to fs.writeFile */
	/* Returns a Promise. */
	file.save(callback).then(function () {
		console.log('success!');
	}).catch(function (err) {
		console.log('error!', err);
	});
});
```

## Tests
Simply run `npm test` in the repo

[npm-url]: https://npmjs.org/package/json-file-plus
[npm-version-svg]: https://versionbadg.es/ljharb/json-file-plus.svg
[deps-svg]: https://david-dm.org/ljharb/json-file-plus.svg
[deps-url]: https://david-dm.org/ljharb/json-file-plus
[dev-deps-svg]: https://david-dm.org/ljharb/json-file-plus/dev-status.svg
[dev-deps-url]: https://david-dm.org/ljharb/json-file-plus#info=devDependencies
[npm-badge-png]: https://nodei.co/npm/json-file-plus.png?downloads=true&stars=true
[license-image]: https://img.shields.io/npm/l/json-file-plus.svg
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dm/json-file-plus.svg
[downloads-url]: https://npm-stat.com/charts.html?package=json-file-plus
[codecov-image]: https://codecov.io/gh/ljharb/json-file-plus/branch/main/graphs/badge.svg
[codecov-url]: https://app.codecov.io/gh/ljharb/json-file-plus/
[actions-image]: https://img.shields.io/endpoint?url=https://github-actions-badge-u3jn4tfpocch.runkit.sh/ljharb/json-file-plus
[actions-url]: https://github.com/ljharb/json-file-plus/actions
