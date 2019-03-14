import { Brands } from '../models/Brands';
import { Groups } from '../models/Groups';
import { GroupsMemberships } from '../models/GroupsMemberships';
import { OrganizationFields } from '../models/OrganizationFields';
import { OrganizationMemberships } from '../models/OrganizationMemberships';
import { Organizations } from '../models/Organizations';
import { TicketEvents } from '../models/TicketEvents';
import { TicketFields } from '../models/TicketFields';
import { Tickets } from '../models/Tickets';
import { UserFields } from '../models/UserFields';
import { Users } from '../models/Users';

const classes = {
	brands: Brands,
	group_memberships: GroupsMemberships,
	groups: Groups,
	organization_fields: OrganizationFields,
	organization_memberships: OrganizationMemberships,
	organizations: Organizations,
	ticket_events: TicketEvents,
	ticket_fields: TicketFields,
	tickets: Tickets,
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
