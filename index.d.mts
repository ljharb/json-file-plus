
export type JSONKey = string | number;
export type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };

export class JSONData {
	constructor(raw: string);

	format: {
		indent: '\t' | number;
		trailing: boolean;
	};

	data: Exclude<JSONValue, string | number | boolean | null>;

	get(key?: JSONKey): Promise<JSONValue>;

	set(obj: Record<JSONKey, JSONValue>): void;

	remove(key: JSONKey): void;

	stringify(): string;
}

export class JSONFile<T extends string = string> extends JSONData {
	constructor(filename: T, raw: string);

	filename: T;

	save(): Promise<void>;

	saveSync(): void;
}

export function sync<T extends string>(filename: T): JSONFile<T>;

export default function readJSON<T extends string>(filename: T): Promise<JSONFile<T>>;
