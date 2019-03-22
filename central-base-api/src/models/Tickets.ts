import { BaseEntity, Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
export class Tickets extends BaseEntity {
	@PrimaryColumn()
	public url: string = '';

	@Index({ unique: true })
	@Column('bigint')
	public id: number = 0;

	@Index('idx-external')
	@Column({ nullable: true })
	public external_id: string = '';

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

	@Column('datetime')
	public updated_at: Date = new Date();

	@Column({ nullable: true })
	public type: string = '';

	@Column({ nullable: true })
	public subject: string = '';

	@Column({ nullable: true })
	public raw_subject: string = '';

	@Column({ nullable: true, type: 'text' })
	public description: string = '';

	@Column({ nullable: true })
	public priority: string = '';

	@Column({ nullable: true })
	public status: string = '';

	@Column({ nullable: true })
	public recipient: string = '';

	@Index('idx-requester')
	@Column({ nullable: true, type: 'bigint' })
	public requester_id: number = 0;

	@Index('idx-submitter')
	@Column({ nullable: true, type: 'bigint' })
	public submitter_id: number = 0;

	@Column({ nullable: true, type: 'bigint' })
	public assignee_id: number = 0;

	@Column({ nullable: true, type: 'bigint' })
	public organization_id: number = 0;

	@Column({ nullable: true, type: 'bigint' })
	public group_id: number = 0;

	@Column({ nullable: true, type: 'simple-array' })
	public collaborator_ids: number = 0;

	@Column({ nullable: true, type: 'simple-array' })
	public follower_ids: number = 0;

	@Column({ nullable: true, type: 'simple-array' })
	public email_cc_ids: string = '';

	@Column({ nullable: true, type: 'bigint' })
	public forum_topic_id: number = 0;

	@Column({ nullable: true, type: 'bigint' })
	public problem_id: number = 0;

	@Column({ nullable: true })
	public has_incidents: boolean = false;

	@Column({ nullable: true })
	public is_public: boolean = false;

	@Column({ nullable: true, type: 'datetime' })
	public due_at: Date = new Date();

	@Column('simple-array')
	public tags: string = '';

	@Column({ nullable: true, type: 'simple-json' })
	public custom_fields: {
		key: string;
		value: string;
	} = {
		key: '',
		value: '',
	};

	@Column({ nullable: true, type: 'simple-json' })
	public satisfaction_rating: {
		score: string;
	} = {
		score: '',
	};

	@Column({ nullable: true, type: 'simple-array' })
	public sharing_agreement_ids: string = '';

	@Column({ nullable: true, type: 'simple-json' })
	public fields: {
		key: string;
		value: string;
	} = {
		key: '',
		value: '',
	};

	@Column({ nullable: true, type: 'simple-array' })
	public followup_ids: string = '';

	@Column({ nullable: true, type: 'bigint' })
	public ticket_form_id: number = 0;

	@Column({ nullable: true, type: 'bigint' })
	public brand_id: number = 0;

	@Column({ nullable: true })
	public satisfaction_probability: string = '';

	@Column({ nullable: true })
	public allow_channelback: boolean = false;

	@Column({ nullable: true })
	public allow_attachments: boolean = false;

	@Column({ nullable: true, type: 'bigint' })
	public generated_timestamp: number = 0;
}
