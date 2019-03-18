import { BaseEntity } from 'typeorm';
import { Brands } from '../models/Brands';
import { Categories } from '../models/Categories';
import { Groups } from '../models/Groups';
import { GroupsMemberships } from '../models/GroupsMemberships';
import { Locales } from '../models/Locales';
import { OrganizationFields } from '../models/OrganizationFields';
import { OrganizationMemberships } from '../models/OrganizationMemberships';
import { Organizations } from '../models/Organizations';
import { Sections } from '../models/Sections';
import { TicketEvents } from '../models/TicketEvents';
import { TicketFields } from '../models/TicketFields';
import { Tickets } from '../models/Tickets';
import { UserFields } from '../models/UserFields';
import { Users } from '../models/Users';
import { CustomeTickets } from './customization/tickets';

const classes = {
	brands: Brands,
	categories: Categories,
	group_memberships: GroupsMemberships,
	groups: Groups,
	locales: Locales,
	organization_fields: OrganizationFields,
	organization_memberships: OrganizationMemberships,
	organizations: Organizations,
	sections: Sections,
	ticket_events: TicketEvents,
	ticket_fields: TicketFields,
	tickets: Tickets,
	user_fields: UserFields,
	users: Users,
};

const customization = {
	tickets: CustomeTickets,
}

export default class DynamicModel {
	private _schema: BaseEntity;
	private _custom: any;
	constructor (className: string) {
		this._schema = classes[className];
		this._custom = customization[className];
	}
	public get schema () {
		return this._schema;
	}
	public get customization () {
		return this._custom;
	}
}
