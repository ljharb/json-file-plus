#json-file-plus <sup>[![Version Badge][npm-version-svg]][npm-url]</sup>

[![Build Status][travis-svg]][travis-url]
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
/* Note: jsonFile also returns a Promise, if you prefer that to a Node-style callback ("errorback"). */

var main = function (filename, callback) {
	return jsonFile(filename, function (err, file) {
		if (err) { return callback(err); }

		file.data; // Direct access to the data from the file
		file.format; // extracted formatting data. change at will.

		file.get('version'); // get top-level keys. returns a Promise
		// file.get('version', callback); // get top-level keys. calls the errorback
		file.get(); // get entire data. returns a Promise
		// file.get(callback); // get entire data. calls the errorback

		/* pass any plain object into "set" to merge in a deep copy */
		/* please note: references will be broken. */
		/* if a non-plain object is passed, will throw a TypeError. */
		file.set({
			foo: 'bar',
			bar: {
				baz: true
			}
		});

		/* change the filename if desired */
		file.filename = path.join(process.cwd(), 'new-package.json');

		/* Save the file, preserving formatting. */
		/* Errorback will be passed to fs.writeFile */
		/* Returns a Promise. */
		file.save()
			.then(callback)
			.catch(callback)
	});
}

main(filename, function (err) {
	// console.log('done') // logs => 'done'
})

```

## Tests
Simply run `npm test` in the repo

[npm-url]: https://npmjs.org/package/json-file-plus
[npm-version-svg]: http://versionbadg.es/ljharb/node-json-file.svg
[travis-svg]: https://travis-ci.org/ljharb/node-json-file.svg
[travis-url]: https://travis-ci.org/ljharb/node-json-file
[deps-svg]: https://david-dm.org/ljharb/node-json-file.svg
[deps-url]: https://david-dm.org/ljharb/node-json-file
[dev-deps-svg]: https://david-dm.org/ljharb/node-json-file/dev-status.svg
[dev-deps-url]: https://david-dm.org/ljharb/node-json-file#info=devDependencies
[npm-badge-png]: https://nodei.co/npm/json-file-plus.png?downloads=true&stars=true
[license-image]: http://img.shields.io/npm/l/json-file-plus.svg
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/json-file-plus.svg
[downloads-url]: http://npm-stat.com/charts.html?package=json-file-plus
