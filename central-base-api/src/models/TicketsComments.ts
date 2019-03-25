import { BaseEntity, Column, Entity, Index, PrimaryColumn } from 'typeorm';

export interface IAttach {
	id: number;
	url: string;
	file_name: string;
	content_url: string;
	mapped_content_url: string;
	content_type: string;
	size: number;
	width: number;
	height: number;
	inline: boolean;
	thumbnails: {};
}

@Entity()
export class TicketsComments extends BaseEntity {
	@Column({ nullable: true })
	public type: string = '';

	@Index({ unique: true })
	@PrimaryColumn()
	public id: string = '';

	@Column({ type: 'bigint', nullable: true })
	public author_id: number = 0;

	@Index('idx-ticket')
	@Column({ type: 'bigint', nullable: true })
	public ticket_id: number = 0;

	@Column({ type: 'text', nullable: true })
	public body: string = '';

	@Column({ type: 'text', nullable: true })
	public html_body: string = '';

	@Column({ type: 'text', nullable: true })
	public plain_body: string = '';

	@Column({ nullable: true })
	public public: boolean = false;

	@Column({ nullable: true, type: 'simple-json' })
	public attachments: {
		id: number;
		url: string;
		file_name: string;
		content_url: string;
		mapped_content_url: string;
		content_type: string;
		size: number;
		width: number;
		height: number;
		inline: boolean;
		thumbnails: {};
	} = {
		content_type: '',
		content_url: '',
		file_name: '',
		height: 0,
		id: 0,
		inline: true,
		mapped_content_url: '',
		size: 0,
		thumbnails: {},
		url: '',
		width: 0,
	};

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
