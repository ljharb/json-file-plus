
export type JSONKey = string | number;
export type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };

export class JSONData<K extends JSONKey, V extends JSONValue> {
	constructor(raw: string);

	format: {
		indent: '\t' | number;
		trailing: boolean;
	};

	data: Exclude<V, string | number | boolean | null>;

	get(key?: K): Promise<V>;

	set(obj: Record<K, V>): void;

	remove(key: K): void;

	stringify(): string;
}

export class JSONFile<T extends string = string, K extends JSONKey = JSONKey, V extends JSONValue = JSONValue> extends JSONData<K, V> {
	constructor(filename: T, raw: string);

	filename: T;

	save(): Promise<void>;

	saveSync(): void;
}

export function sync<T extends string>(filename: T): JSONFile<T>;

export default function readJSON<T extends string>(filename: T): Promise<JSONFile<T>>;
