import { Brands } from '../models/Brands';

const classes = {
	brands: Brands,
};

export default class DynamicModel {
	constructor (className: string) {
		return classes[className];
	}
}
