import { BaseEntity, Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
export class TicketsAudits extends BaseEntity {
	@Index({ unique: true })
	@PrimaryColumn('bigint')
	public id: string = '';

	@Index('idx-ticket')
	@Column({ type: 'bigint', nullable: true })
	public ticket_id: number = 0;

	@Column({ type: 'bigint', nullable: true })
	public author_id: number = 0;

	@Column({ nullable: true, type: 'simple-json' })
	public via: {
		channel: string;
		source: object;
	} = {
		channel: '',
		source: {},
	};

	@Column('datetime')
	public created_at: Date = new Date();

	@Column({ nullable: true, type: 'simple-json' })
	public metadata: {
		system: {
			client: string;
			ip_address: string;
			location: string;
			latitude: number;
			longitude: number;
		};
		custom: string;
		flag: number[];
		flags_options: object;
		trusted: boolean;
	} = {
		custom: '',
		flag: [0],
		flags_options: {},
		system: {
			client: '',
			ip_address: '',
			latitude: 0,
			location: '',
			longitude: 0,
		},
		trusted: false,
	};

	@Column({ nullable: true, type: 'simple-json' })
	public events: string[] = [];
}
