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
const jsonFile = require('json-file-plus');
const path = require('path');
const fs = require('fs');
const assert = require('assert');

const filename = path.join(process.cwd(), 'package.json');

const originalContents = String(fs.readFileSync(filename));

jsonFile(filename).then((file) => {
	file.data; // Direct access to the data from the file
	file.format; // extracted formatting data. change at will.

	file.get('version'); // get top-level keys. returns a Promise
	file.get(); // get entire data. returns a Promise

	/* pass any plain object into "set" to merge in a deep copy */
	/* please note: references will be broken. */
	/* if a non-plain object is passed, will throw a TypeError. */
	file.set({
		foo: 'bar',
		bar: {
			baz: true,
		},
	});

	file.remove('description'); // remove a specific key-value pair. returns a Promise

	/* change the filename if desired */
	file.filename = path.join(process.cwd(), 'new-package.json');

	/* Save the file, preserving formatting. returns a Promise. */
	file.save().then(() => {
		console.log('success!');

		const finalContents = String(fs.readFileSync(filename));
		assert.equal(originalContents, finalContents);
	}).catch((err) => {
		console.log('error!', err);
		process.exitCode = 1;
	}).finally(() => {
		fs.writeFileSync(filename, originalContents, { encoding: 'utf8' });
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
