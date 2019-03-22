import {
	BaseEntity,
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	PrimaryColumn,
} from 'typeorm';

import { TicketFields } from './TicketFields';

@Entity()
export class TicketForms extends BaseEntity {
	@Column()
	public url: string = '';

	@PrimaryColumn('bigint')
	public id: number = 0;

	@Column()
	public name: string = '';

	@Column()
	public raw_name: string = '';

	@Column()
	public display_name: string = '';

	@Column()
	public raw_display_name: string = '';

	@Column()
	public end_user_visible: boolean = false;

	@Column()
	public position: number = 0;

	@Column()
	public active: boolean = true;

	@Column()
	public default: boolean = false;

	@Column('datetime')
	public created_at: Date = new Date();

	@Column('datetime')
	public updated_at: Date = new Date();

	@Column()
	public in_all_brands: boolean = false;

	@ManyToMany((type) => TicketFields)
	@JoinTable()
	public ticket_field_ids: TicketFields[] = [];
}
