import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TicketEvents extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id_evt: number;

	@Column({ unique: true })
	public id: string = '';

	@Column('bigint')
	public ticket_id: number = 0;

	@Column('bigint')
	public timestamp: number = 0;

	@Column({ nullable: true, type: 'simple-json' })
	public child_events: string = '';

	@Column('datetime')
	public created_at: Date = new Date();

	@Column({ type: 'bigint', nullable: true })
	public updater_id: number = 0;

	@Column({ type: 'text', nullable: true })
	public via: string = '';

	@Column({ nullable: true, type: 'simple-json' })
	public system: string = '';

	@Column()
	public event_type: string = '';
}
