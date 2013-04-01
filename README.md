#json-file

[![Build Status](https://travis-ci.org/ljharb/node-json-file.png)](https://travis-ci.org/ljharb/node-json-file)

A module to read from and write to JSON files, without losing formatting, to minimize diffs.

## Example
```js
var jsonFile = require('json-file-plus');
jsonFile.read('package.json', function (err, file) {
	if (err) { return doSomethingWithError(err); }

	file.data; // Direct access to the data from the file
	file.format; // extracted formatting data. change at will.

	file.get('version'); // get top-level keys, synchronously
	file.get('version', callback); // get top-level keys, asynchronously
	file.get(); // get entire data, synchronously
	file.get(callback); // get entire data, asynchronously

	/* pass any plain object into "set" to merge in a deep copy */
	/* please note: references will be broken. */
	/* if a non-plain object is passed, will throw a TypeError. */
	file.set({
		foo: 'bar',
		bar: {
			baz: true
		}
	});

	/* Save the file, preserving formatting. */
	/* Callback will be passed to fs.writeFile */
	file.save('new-package.json', fsWriteFileCallback);
});
```

## Tests
Tests currently use tape - which doesn't yet work in node 0.10, but works in browserify. Rest assured, they pass.

