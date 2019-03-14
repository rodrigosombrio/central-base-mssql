import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class TicketFields extends BaseEntity {
	@PrimaryColumn()
	public url: string = '';

	@Column({ type: 'bigint', unique: true })
	public id: number = 0;

	@Column()
	public type: string = '';

	@Column()
	public title: string = '';

	@Column()
	public raw_title: string = '';

	@Column({ type: 'text', nullable: true })
	public description: string = '';

	@Column({ type: 'text', nullable: true })
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

	@Column({ nullable: true, type: 'simple-json' })
	public custom_field_options: string = '';

	@Column({ nullable: true, type: 'simple-array' })
	public system_field_options: string = '';

	@Column({ nullable: true })
	public sub_type_id: number = 0;
}
