import { BaseEntity } from 'typeorm';
import { Articles } from '../models/Articles';
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
import { CustomizationTickets } from './customization/tickets';

export interface IClasses {
	articles: any;
	brands: any;
	categories: any;
	group_memberships: any;
	groups: any;
	locales: any;
	organization_fields: any;
	organization_memberships: any;
	organizations: any;
	sections: any;
	ticket_events: any;
	ticket_fields: any;
	tickets: any;
	user_fields: any;
	users: any;
}

export interface ICustomization {
	tickets: any;
}

const classes: IClasses = {
	articles: Articles,
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

const customization: ICustomization = {
	tickets: CustomizationTickets,
};

export default class DynamicModel {
	private _schema: BaseEntity;
	private _custom: any;
	constructor (className: string) {
		this._schema = classes[className as keyof IClasses];
		this._custom = customization[className as keyof ICustomization];
	}
	public get schema () {
		return this._schema;
	}
	public get customization () {
		return this._custom;
	}
}
