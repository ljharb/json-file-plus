import { readFile, writeFile } from 'fs/promises';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import extend from 'node.extend';

/** @type {(key: unknown) => key is number | string} */
function checkKey(key) {
	if ((typeof key !== 'number' || !isFinite(key)) && (typeof key !== 'string' || key.length === 0)) {
		throw new TypeError('key must be a finite number or a nonempty string');
	}
}

/** @type {(value: unknown) => value is object} */
function isPlainObject(value) {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		return false;
	}
	const proto = Object.getPrototypeOf(value);
	return proto === Object.prototype || proto === null;
}

/** @type {import('.').JSONData} */
export class JSONData {
	format;

	constructor(raw) {
		const hasTrailingNewline = (/\n\n$/).test(raw);
		const indentMatch = String(raw).match(/^[ \t]+/m);
		const indent = (indentMatch && indentMatch[0]) || 2;

		if (raw) {
			const result = JSON.parse(raw);
			if (result && Object(result) === result) {
				this.data = result;
			}
		}

		this.format = {
			__proto__: null,
			indent,
			trailing: hasTrailingNewline,
		};
	}

	async get(key) {
		const value = arguments.length > 0 ? this.data[key] : { ...this.data };

		return isPlainObject(value) ? { ...value } : value;
	}

	set(obj) {
		if (!isPlainObject(obj)) {
			throw new TypeError('object must be a plain object');
		}
		extend(true, this.data, obj);
	}

	remove(key) {
		checkKey(key);

		const status = delete this.data[key];
		if (!status) {
			throw new Error('deletion failed');
		}
	}

	stringify() {
		const { trailing, indent } = this.format;
		const endingNewlines = trailing ? '\n\n' : '\n';
		return JSON.stringify(this.data, null, indent) + endingNewlines;
	}
}

/** @type {import('.').JSONFile} */
export class JSONFile extends JSONData {
	filename;

	constructor(filename, raw) {
		super(raw);

		this.filename = filename;
		Object.defineProperty(this, 'filename', {
			configurable: false,
			value: filename,
			writable: true,
		});

		const { format } = this;
		delete this.format;
		this.format = format;
	}

	async save() {
		return writeFile(this.filename, this.stringify());
	}

	saveSync() {
		writeFileSync(this.filename, this.stringify());
	}
}

/** @type {import('.').sync} */
export function sync(filename) {
	const raw = readFileSync(filename, 'utf8');

	return new JSONFile(filename, raw);
}

/** @type {import('.').default} */
export default async function readJSON(filename) {
	const raw = await readFile(resolve(filename), { encoding: 'utf8' });

	return new JSONFile(filename, raw);
}

readJSON.sync = sync;
readJSON.JSONData = JSONData;
readJSON.JSONFile = JSONFile;

export { readJSON as 'module.exports' };
