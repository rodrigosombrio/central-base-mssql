import { BaseEntity, Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
export class TicketsComments extends BaseEntity {
	@Column({ nullable: true })
	public type: string = '';

	@Index({ unique: true })
	@PrimaryColumn()
	public id: string = '';

	@Column({ type: 'bigint', nullable: true })
	public author_id: number = 0;

	@Column({ type: 'text', nullable: true })
	public body: string = '';

	@Column({ type: 'text', nullable: true })
	public html_body: string = '';

	@Column({ type: 'text', nullable: true })
	public plain_body: string = '';

	@Column({ nullable: true })
	public public: boolean = false;

	@Column({ nullable: true, type: 'simple-array' })
	public attachments: string = '';

	@Column({ type: 'bigint', nullable: true })
	public audit_id: number = 0;

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
		suspension_type_id: string;
	} = {
		system: {
			client: '',
			ip_address: '',
			location: '',
			latitude: 0,
			longitude: 0,
		},
		custom: '',
		suspension_type_id: '',
	};
}
