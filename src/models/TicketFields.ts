import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { TicketFormsOptions } from './TicketFormsOptions';

@Entity()
export class TicketFields extends BaseEntity {
	@Column()
	public url: string = '';

	@PrimaryColumn('bigint')
	public id: number = 0;

	@Column()
	public type: string = '';

	@Column()
	public title: string = '';

	@Column()
	public raw_type: string = '';

	@Column()
	public description: string = '';

	@Column()
	public raw_description: string = '';

	@Column()
	public position: number = 0;

	@Column()
	public active: boolean = true;

	@Column()
	public required: boolean = false;

	@Column()
	public collapsed_for_agents: boolean = false;

	@Column({ nullable: true })
	public regexp_for_validation: string = '';

	@Column({ nullable: true })
	public title_in_portal: string = '';

	@Column({ nullable: true })
	public raw_title_in_portal: string = '';

	@Column()
	public visible_in_portal: boolean = false;

	@Column()
	public editable_in_portal: boolean = false;

	@Column()
	public required_in_portal: boolean = false;

	@Column({ nullable: true })
	public tag: string = '';

	@Column('datetime')
	public created_at: Date = new Date();

	@Column('datetime')
	public updated_at: Date = new Date();

	@Column()
	public removable: boolean = false;

	@Column({ nullable: true })
	public agent_description: string = '';

	@OneToMany(
		(type) => TicketFormsOptions,
		(custom_field_options) => custom_field_options.ticket_fields,
	)
	public custom_field_options: TicketFormsOptions[] = [];
}
