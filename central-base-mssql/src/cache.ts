import NodeCache = require('node-cache');

const cache: NodeCache = new NodeCache();

interface ITypeSample {
	a: number;
	b: string;
	c: boolean;
}

export class Cache {
	public static set (key: string, value: any) {
		cache.set<ITypeSample>(key, value);
	}
	public static get (key: string) {
		return cache.get<ITypeSample>(key);
	}
}
