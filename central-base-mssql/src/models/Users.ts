import { BaseEntity, Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
export class Users extends BaseEntity {
	@Index({ unique: true })
	@Column('bigint')
	public id: number = 0;

	@PrimaryColumn()
	public url: string = '';

	@Index('idx-name')
	@Column()
	public name: string = '';

	@Index('idx-email')
	@Column()
	public email: string = '';

	@Column('datetime')
	public created_at: Date = new Date();

	@Column('datetime')
	public updated_at: Date = new Date();

	@Column()
	public time_zone: string = '';

	@Column()
	public iana_time_zone: string = '';

	@Column({ nullable: true })
	public phone: string = '';

	@Column({ nullable: true })
	public shared_phone_number: string = '';

	@Column({ nullable: true })
	public photo: string = '';

	@Column({ nullable: true })
	public locale_id: number = 0;

	@Column({ nullable: true })
	public locale: string = '';

	@Index('idx-organization')
	@Column()
	public organization_id: string = '';

	@Column({ nullable: true })
	public role: string = '';

	@Column({ nullable: true })
	public verified: boolean = false;

	@Index('idx-external')
	@Column({ nullable: true })
	public external_id: string = '';

	@Column('simple-array')
	public tags: string[] = [];

	@Column({ nullable: true })
	public alias: string = '';

	@Column({ nullable: true })
	public active: boolean = false;

	@Column({ nullable: true })
	public shared: boolean = false;

	@Column({ nullable: true })
	public shared_agent: boolean = false;

	@Column('datetime')
	public last_login_at: Date = new Date();

	@Column({ nullable: true })
	public two_factor_auth_enabled: boolean = false;

	@Column({ nullable: true })
	public signature: string = '';

	@Column({ type: 'text', nullable: true })
	public details: string = '';

	@Column({ type: 'text', nullable: true })
	public notes: string = '';

	@Index('idx-role')
	@Column({ nullable: true })
	public role_type: string = '';

	@Column({ nullable: true })
	public custom_role_id: number = 0;

	@Column()
	public moderator: boolean = false;

	@Column({ nullable: true })
	public ticket_restriction: string = '';

	@Column()
	public restricted_agent: boolean = false;

	@Column()
	public suspended: boolean = false;

	@Column()
	public chat_only: boolean = false;

	@Column({ nullable: true })
	public default_group_id: string = '';

	@Column({ nullable: true })
	public only_private_comments: boolean = false;

	@Column()
	public report_csv: boolean = false;

	@Column({ nullable: true, type: 'simple-json' })
	public user_fields: {
		key: string;
		value: string;
	} = {
		key: '',
		value: '',
	};
}
