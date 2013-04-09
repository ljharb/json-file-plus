var test = require('tape');
var path = require('path');
var jsonFile = require('../index');
var forEach = require('foreach');

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
	jsonFile(testFilename, function (err, file) {
		t.false(err, 'no error');
		t.true(file instanceof jsonFile.JSONFile, 'file is instance of JSONFile');
		t.test('format', function (st) {
			st.equal(file.format.indent, '\t', 'reads tabs');
			st.equal(file.format.trailing, true, 'reads trailing newline');
			st.deepEqual(file.format, {
				indent: '\t',
				trailing: true
			}, 'entire format is properly read');
			st.test('no trailing newline', function (s2t) {
				jsonFile(noNewlineFilename, function (err, file) {
					s2t.false(file.format.trailing, 'reads no trailing newline');
					s2t.equal(file.format.indent, '   ', 'reads three spaces');
					s2t.end();
				});
			});
			st.end();
		});

		t.test('reads the data', function (st) {
			st.deepEqual(file.data, testContents, 'file.data matches expected');
			st.test('.get()', function (sst) {
				sst.test('with key', function (s2t) {
					forEach(testContents, function (keyContents, key) {
						s2t.deepEqual(file.get(key), keyContents, 'data from get("' + key + '") matches');
						s2t.test('async', function (s3t) {
							file.get(key, function (err, data) {
								s3t.deepEqual(data, keyContents, 'data from async get("' + key + '") matches');
								s3t.end();
							});
						});
					});
					s2t.notEqual(file.get('obj'), file.data.obj, 'get(key)->object is not the same reference');
					s2t.end();
				});
				sst.test('without key', function (s2t) {
					var getData = file.get();
					s2t.deepEqual(getData, file.data, 'data from get() matches');
					s2t.notEqual(getData, file.data, 'data from get() is not the same reference');
					s2t.test('async', function (s3t) {
						file.get(function (err, data) {
							s3t.deepEqual(data, file.data, 'data from async get() matches');
							s3t.notEqual(data, file.data, 'data from async get() is not the same reference');
							s3t.end();
						});
					});
					s2t.end();
				});
				sst.end();
			});
			st.end();
		});

		t.test('#set()', function (st) {
			st.test('setting data', function (sst) {
				sst.equal(file.data.foobar, undefined, 'foo starts undefined');
				var data = {
					foobar: {
						bar: 'baz',
						quux: true
					}
				};
				file.set(data);
				sst.deepEqual(file.data.foobar, data.foobar, 'expected data is set');
				sst.notEqual(file.data.foobar, data.foobar, 'data is not the same reference');
				sst.end();
			});
			st.test('setting invalid data', function (sst) {
				sst.throws(function () { return file.set(null); }, TypeError, 'throws when given non-object');
				sst.throws(function () { return file.set(true); }, TypeError, 'throws when given non-object');
				sst.throws(function () { return file.set([]); }, TypeError, 'throws when given non-object');
				sst.throws(function () { return file.set(function () {}); }, TypeError, 'throws when given non-object');
				sst.throws(function () { return file.set('foo'); }, TypeError, 'throws when given non-object');
				sst.throws(function () { return file.set(/f/); }, TypeError, 'throws when given non-object');
				sst.end();
			});
			st.end();
		});
		t.end();
	});
});


test('returns an error when no file', function (t) {
	var filename = 'does not exist.json';
	jsonFile(filename, function (err, file) {
		var expectedError = {
			errno: 34,
			code: "ENOENT",
			path: path.join(process.cwd() + filename)
		};
		t.deepEqual(err, expectedError, 'returned an error');
	});
	t.end();
});

