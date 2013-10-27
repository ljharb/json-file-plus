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
	t.plan(5);
	jsonFile(testFilename, function (err, file) {
		t.notOk(err, 'no error');
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

test('#get(): file.data', function (st) {
	st.plan(3);
	jsonFile(testFilename, function (err, file) {
		st.notOk(err, 'no error');
		st.deepEqual(file.data, testContents, 'file.data matches expected');
		st.notEqual(file.get('obj'), file.data.obj, 'get(key)->object is not the same reference');
		st.end();
	});
});

test('#get(): with key sync', function (st) {
	st.plan(keys(testContents).length + 1);
	jsonFile(testFilename, function (err, file) {
		st.notOk(err, 'no error');
		forEach(testContents, function (keyContents, key) {
			st.deepEqual(file.get(key), keyContents, 'data from get("' + key + '") matches');
		});
		st.end();
	});
});

test('#get(): with key async', function (st) {
	st.plan(keys(testContents).length + 1);
	jsonFile(testFilename, function (err, file) {
		st.notOk(err, 'no error');
		forEach(testContents, function (keyContents, key) {
			file.get(key, function (err, data) {
				st.deepEqual(data, keyContents, 'data from async get("' + key + '") matches');
			});
		});
	});
});

test('#get(): without key sync', function (s2t) {
	s2t.plan(3);
	jsonFile(testFilename, function (err, file) {
		s2t.notOk(err, 'no error');
		var getData = file.get();
		s2t.deepEqual(getData, file.data, 'data from get() matches');
		s2t.notEqual(getData, file.data, 'data from get() is not the same reference');
		s2t.end();
	});
});

test('#get(): without key async', function (s2t) {
	s2t.plan(3);
	jsonFile(testFilename, function (err, file) {
		s2t.notOk(err, 'no error');
		file.get(function (err, data) {
			s2t.deepEqual(data, file.data, 'data from async get() matches');
			s2t.notEqual(data, file.data, 'data from async get() is not the same reference');
			s2t.end();
		});
	});
});

test('#set()', function (t) {
	t.plan(4);
	jsonFile(testFilename, function (err, file) {
		t.notOk(err, 'no error');
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

		t.end();
	});
});

test('#set(): setting invalid data', function (st) {
	st.plan(7);
	jsonFile(testFilename, function (err, file) {
		st.notOk(err, 'no error');
		var error = new TypeError('object must be a plain object');
		st.throws(function () { return file.set(null); }, error, 'throws when given non-object');
		st.throws(function () { return file.set(true); }, error, 'throws when given non-object');
		st.throws(function () { return file.set([]); }, error, 'throws when given non-object');
		st.throws(function () { return file.set(function () {}); }, error, 'throws when given non-object');
		st.throws(function () { return file.set('foo'); }, error, 'throws when given non-object');
		st.throws(function () { return file.set(/f/); }, error, 'throws when given non-object');
		st.end();
	});
});

test('returns an error when no file', function (t) {
	t.plan(1);
	var filename = path.join(process.cwd(), 'does not exist.json');
	jsonFile(filename, function (err, file) {
		var expectedError = {
			errno: 34,
			code: "ENOENT",
			path: filename
		};
		t.deepEqual(err, expectedError, 'returned an error');
		t.end();
	});
});

test('remembers filename', function (t) {
	t.plan(1);
	jsonFile(testFilename, function (err, file) {
		t.equal(file.filename, testFilename, 'filename equals ' + testFilename);
		t.end();
	});
});

test('saves properly', function (t) {
	t.plan(4);
	jsonFile(testFilename, function (err, file) {
		t.equal(file.filename, testFilename, 'filename equals ' + testFilename);
		file.set({ foo: !testContents.foo });
		file.save(function (err) {
			t.notOk(err, 'no error');
			jsonFile(testFilename, function (err, file2) {
				t.equal(file2.get('foo'), !testContents.foo, 'value was properly saved');
				file2.set({ foo: testContents.foo }); // restore original value
				file2.save(function (err) {
					t.notOk(err, 'no error');
					t.end();
				});
			});
		});
	});
});

