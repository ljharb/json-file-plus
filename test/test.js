var test = require('tape');
var path = require('path');
var jsonFile = require('../index');
var forEach = require('foreach');
var keys = require('object-keys');

var noNewlineFilename = 'test/no-trailing-newline.json';
var testFilename = 'test/test.json';
var testContents = {
	foo: "bar",
	null: null,
	true: true,
	false: false,
	arr: [1, 2, 3],
	obj: {
		nested: {}
	}
};

test('returns a file', function (t) {
	t.plan(2);
	jsonFile(testFilename, function (err, file) {
		t.notOk(err, 'no error');
		t.ok(file instanceof jsonFile.JSONFile, 'file is instance of JSONFile');
		t.end();
	});
});

test('format', function (t) {
	t.plan(3);
	jsonFile(testFilename, function (err, file) {
		t.equal(file.format.indent, '\t', 'reads tabs');
		t.equal(file.format.trailing, true, 'reads trailing newline');
		t.deepEqual(file.format, {
			indent: '\t',
			trailing: true
		}, 'entire format is properly read');

		t.test('no trailing newline', function (s1t) {
			s1t.plan(3);
			jsonFile(noNewlineFilename, function (err, file) {
				s1t.notOk(err, 'no error');
				s1t.notOk(file.format.trailing, 'reads no trailing newline');
				s1t.equal(file.format.indent, '   ', 'reads three spaces');
				s1t.end();
			});
		});
		t.end();
	});
});

test('#get()', function (t) {
	t.plan(2);
	jsonFile(testFilename, function (err, file) {
		t.deepEqual(file.data, testContents, 'file.data matches expected');
		t.notEqual(file.get('obj'), file.data.obj, 'get(key)->object is not the same reference');

		t.test('with key sync', function (st) {
			st.plan(keys(testContents).length);
			forEach(testContents, function (keyContents, key) {
				st.deepEqual(file.get(key), keyContents, 'data from get("' + key + '") matches');
			});
			st.end();
		});

		t.test('with key async', function (st) {
			st.plan(keys(testContents).length);
			forEach(testContents, function (keyContents, key) {
				file.get(key, function (err, data) {
					st.deepEqual(data, keyContents, 'data from async get("' + key + '") matches');
				});
			});
			st.end();
		});

		t.test('without key sync', function (s2t) {
			var getData = file.get();
			s2t.plan(2);
			s2t.deepEqual(getData, file.data, 'data from get() matches');
			s2t.notEqual(getData, file.data, 'data from get() is not the same reference');
			s2t.end();
		});
		t.test('without key async', function (s2t) {
			s2t.plan(2);
			file.get(function (err, data) {
				s2t.deepEqual(data, file.data, 'data from async get() matches');
				s3t.notEqual(data, file.data, 'data from async get() is not the same reference');
				s3t.end();
			});
			s2t.end();
		});
		t.end();
	});
});

test('#set()', function (t) {
	t.plan(3);
	jsonFile(testFilename, function (err, file) {
		t.equal(undefined, file.data.foobar, 'foo starts undefined');
		var data = {
			foobar: {
				bar: 'baz',
				quux: true
			}
		};
		file.set(data);
		t.deepEqual(file.data.foobar, data.foobar, 'expected data is set');
		t.notEqual(file.data.foobar, data.foobar, 'data is not the same reference');

		t.test('setting invalid data', function (st) {
			st.plan(6);
			var error = new TypeError('object must be a plain object');
			st.throws(function () { return file.set(null); }, error, 'throws when given non-object');
			st.throws(function () { return file.set(true); }, error, 'throws when given non-object');
			st.throws(function () { return file.set([]); }, error, 'throws when given non-object');
			st.throws(function () { return file.set(function () {}); }, error, 'throws when given non-object');
			st.throws(function () { return file.set('foo'); }, error, 'throws when given non-object');
			st.throws(function () { return file.set(/f/); }, error, 'throws when given non-object');
			st.end();
		});
		t.end();
	});
});

test('returns an error when no file', function (t) {
	t.plan(1);
	var filename = 'does not exist.json';
	jsonFile(filename, function (err, file) {
		var expectedError = {
			errno: 34,
			code: "ENOENT",
			path: path.join(process.cwd() + '/' + filename)
		};
		t.deepEqual(err, expectedError, 'returned an error');
		t.end();
	});
});

