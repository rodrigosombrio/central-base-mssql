import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { TicketFields } from './TicketFields';

@Entity()
export class TicketFormsOptions extends BaseEntity {
	@PrimaryColumn('bigint')
	public id: number = 0;

	@Column()
	public name: string = '';

	@Column()
	public raw_name: string = '';

	@Column({ nullable: true })
	public value: string = '';

	@Column()
	public default: boolean = false;

	@ManyToOne(
		(type) => TicketFields,
		(ticket_fields) => ticket_fields.custom_field_options,
	)
	public ticket_fields: TicketFields = new TicketFields();
}
