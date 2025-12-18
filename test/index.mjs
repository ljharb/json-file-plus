import path from 'path';
import { fileURLToPath } from 'url';

import test from 'tape';
import hasOwn from 'hasown';
import v from 'es-value-fixtures';

import jsonFile, { sync, JSONFile, JSONData } from '../index.mjs';

const noNewlineFilename = 'test/no-trailing-newline.json';
const testFilename = 'test/test.json';
const testContents = {
	arr: [1, 2, 3],
	false: false,
	foo: 'bar',
	null: null,
	obj: { nested: {} },
	true: true,
};

/* eslint no-extra-parens: 0 */

/** @typedef {Error & { errno: NODE_010_NOT_FOUND | NODE_011_NOT_FOUND | WINDOWS_NODE_7_NOT_FOUND }} FileNotFoundError */

const NODE_011_NOT_FOUND = /** @type {const} */ (-2);
const NODE_010_NOT_FOUND = /** @type {const} */ (34);
const WINDOWS_NODE_7_NOT_FOUND = /** @type {const} */ (-4058);
/** @type {(err: {}) => err is FileNotFoundError} */
function isFileNotFoundError(err) {
	return 'errno' in err && typeof err.errno === 'number' && /** @type {const} */ ([
		NODE_010_NOT_FOUND,
		NODE_011_NOT_FOUND,
		WINDOWS_NODE_7_NOT_FOUND,
	// @ts-expect-error this is fine
	]).indexOf(err.errno) > -1;
}

/** @type {(err: { message: string; errno: number, syscall?: string }, filename: string) => Error & { code: 'ENOENT'; errno: number; path: string; syscall?: 'open' }} */
function enoent(err, filename) {
	const message = `ENOENT${err.message.indexOf('no such file or directory') === 8 ? ': no such file or directory' : ''}, open '${filename}'`;
	/** @type {Error & { code: 'ENOENT'; errno: number; path: string; syscall?: 'open' }} */
	const expectedError = Object.assign(new Error(message), {
		code: /** @type {const} */ ('ENOENT'),
		errno: err.errno,
		path: filename,
	});
	if (hasOwn(err, 'syscall')) {
		expectedError.syscall = 'open';
	}
	return expectedError;
}

test('returns a file', async (t) => {
	const file = await jsonFile(testFilename);

	t.ok(file instanceof JSONFile, 'file is instance of JSONFile');
	t.ok(file instanceof JSONData, 'file is instance of JSONData');
});

test('returns an exception if the file is not found', async (t) => {
	try {
		await jsonFile('NOT A REAL FILE');
		t.fail();
	} catch (err) {
		t.ok(err, 'error is truthy');
		if (err) {
			t.ok(isFileNotFoundError(err), 'error number is correct');
			if (isFileNotFoundError(err)) {
				t.deepEqual(err, enoent(err, path.resolve('NOT A REAL FILE')), 'returns an error');
			}
		}
	}
});

test('returns an exception if the file has invalid JSON', async (t) => {
	try {
		await jsonFile(import.meta.filename || fileURLToPath(import.meta.url));
		t.fail();
	} catch (err) {
		t.ok(err instanceof SyntaxError, 'error is a SyntaxError');
		if (err instanceof SyntaxError) {
			t.equal(typeof err.message, 'string', 'err.message is a string');
			const expected = /^Unexpected token ['i]/;
			t.match(err.message, expected, 'gives the expected error');
		}
	}
});

test('format', async (t) => {
	const file = await jsonFile(testFilename);

	t.equal(file.format.indent, '\t', 'reads tabs');
	t.equal(file.format.trailing, true, 'reads trailing newline');
	t.deepEqual(
		file.format,
		{ __proto__: null, indent: '\t', trailing: true },
		'entire format is properly read',
	);

	t.test('no trailing newline', async (st) => {
		const noNewlineFile = await jsonFile(noNewlineFilename);

		st.notOk(noNewlineFile.format.trailing, 'reads no trailing newline');
		st.equal(noNewlineFile.format.indent, '   ', 'reads three spaces');
	});
});

test('#get(): file.data', async (st) => {
	const file = await jsonFile(testFilename);
	/** @typedef {Omit<typeof file, 'data'> & { data: import('./test.json') }} TestData */

	st.deepEqual(file.data, testContents, 'file.data matches expected');

	const value = await file.get('obj');
	st.notEqual(value, /** @type {TestData} */ (file).data.obj, 'get(key)->object is not the same reference');
});

test('#get(): with key', async (st) => {
	const file = await jsonFile(testFilename);

	await Promise.all(Object.entries(testContents).map(async ([key, keyContents]) => {
		const value = await file.get(key);
		st.deepEqual(value, keyContents, `data from get("${key}") matches`);
	}));
});

test('#get(): without key', async (s2t) => {
	const file = await jsonFile(testFilename);

	const getData = await file.get();

	s2t.deepEqual(getData, file.data, 'data from get() matches');
	s2t.notEqual(getData, file.data, 'data from get() is not the same reference');
});

test('#remove()', (st) => {
	st.test('with key', async (s2t) => {
		const file = await jsonFile(testFilename);
		const result = await file.remove('arr');

		s2t.equal(result, undefined, 'deletion successful');
		s2t.equal('arr' in file.data, false, 'key removed from data');
	});

	st.test('with an empty key', async (s2t) => {
		const file = await jsonFile(testFilename);
		try {
			await file.remove('');
			s2t.fail();
		} catch (err) {
			s2t.equal(err instanceof TypeError, true, 'err is TypeError');
		}
	});

	st.end();
});

test('#set()', async (t) => {
	const file = await jsonFile(testFilename);
	/** @typedef {Omit<typeof file, 'data'> & { data: import('./test.json') & { foobar?: unknown } }} TestData */

	t.equal(undefined, /** @type {TestData} */ (file).data.foobar, 'foo starts undefined');
	const data = {
		foobar: {
			bar: 'baz',
			quux: true,
		},
	};
	file.set(data);
	t.deepEqual(/** @type {TestData} */ (file).data.foobar, data.foobar, 'expected data is set');
	t.notEqual(/** @type {TestData} */ (file).data.foobar, data.foobar, 'data is not the same reference');
});

test('#set(): setting invalid data', async (st) => {
	const file = await jsonFile(testFilename);

	const error = new TypeError('object must be a plain object');

	// @ts-expect-error
	st.throws(() => { file.set(null); }, error, 'throws when given non-object');
	// @ts-expect-error
	st.throws(() => { file.set(true); }, error, 'throws when given non-object');
	// @ts-expect-error
	st.throws(() => { file.set([]); }, error, 'throws when given non-object');
	// @ts-expect-error
	st.throws(() => { file.set(() => {}); }, error, 'throws when given non-object');
	// @ts-expect-error
	st.throws(() => { file.set('foo'); }, error, 'throws when given non-object');
	// @ts-expect-error
	st.throws(() => { file.set(/f/); }, error, 'throws when given non-object');
});

test('returns an error when no file', async (t) => {
	const filename = path.join(process.cwd(), 'does not exist.json');
	try {
		await jsonFile(filename);
		t.fail();
	} catch (err) {
		t.ok(err, 'error is truthy');
		if (err) {
			t.ok(isFileNotFoundError(err), 'error number is correct');
			if (isFileNotFoundError(err)) {
				t.deepEqual(err, enoent(err, filename), 'returned an error');
			}
		}
	}
});

test('remembers filename', async (t) => {
	const file = await jsonFile(testFilename);

	t.equal(file.filename, testFilename, `filename equals ${testFilename}`);
});

test('saves properly', async (t) => {
	const file = await jsonFile(testFilename);

	t.equal(file.filename, testFilename, `filename equals ${testFilename}`);
	file.set({ foo: !testContents.foo });

	await file.save();

	const file2 = await jsonFile(testFilename);

	const value = await file2.get('foo');
	t.equal(value, !testContents.foo, 'value was properly saved');
	file2.set({ foo: testContents.foo }); // restore original value

	await file2.save();
});

test('#saveSync', (t) => {
	const file = sync(testFilename);
	file.set({ foo: !testContents.foo });
	try {
		file.saveSync();
		t.ok(true, 'saveSync: success');
	} finally {
		file.set({ foo: testContents.foo });
		file.saveSync();
		t.ok(true, 'saveSync, restore original: success');

		t.end();
	}
});

test('sync', (t) => {
	t.throws(() => { sync('not a filename'); }, 'nonexistent filename throws');

	const file = sync(testFilename);

	t.deepEqual(file.data, testContents, 'sync file data is expected data');
	t.equal(true, file instanceof JSONFile, 'file is JSONFile');
	t.equal(true, file instanceof JSONData, 'file is JSONData');

	t.end();
});

test('JSONData', (t) => {
	v.primitives.forEach((primitive) => {
		if (typeof primitive !== 'undefined' && typeof primitive !== 'bigint' && typeof primitive !== 'symbol') {
			const data = new JSONData(JSON.stringify(primitive));
			t.notOk(data && 'data' in data, `raw that parses to non-object (${primitive}) noops`);
		}
	});

	t.end();
});
