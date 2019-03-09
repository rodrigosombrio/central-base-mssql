import { Brands } from '../models/Brands';
import { Groups } from '../models/Groups';

const classes = {
	brands: Brands,
	groups: Groups,
};

export default class DynamicModel {
	private _schema: any;
	constructor (className: string) {
		this._schema = classes[className];
	}
	public get schema () {
		return this._schema;
	}
}
