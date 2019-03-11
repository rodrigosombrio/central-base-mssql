import { Brands } from '../models/Brands';
import { Groups } from '../models/Groups';
import { GroupsMemberships } from '../models/GroupsMemberships';
import { Organizations } from '../models/Organizations';
import { UserFields } from '../models/UserFields';
import { Users } from '../models/Users';

const classes = {
	brands: Brands,
	group_memberships: GroupsMemberships,
	groups: Groups,
	organizations: Organizations,
	user_fields: UserFields,
	users: Users,
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
