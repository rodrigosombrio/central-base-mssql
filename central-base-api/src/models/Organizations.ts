import { BaseEntity, Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
export class Organizations extends BaseEntity {
	@Index({ unique: true })
	@Column('bigint')
	public id: number = 0;

	@PrimaryColumn()
	public url: string = '';

	@Column()
	public name: string = '';

	@Column({ nullable: true })
	public shared_tickets: boolean = false;

	@Column({ nullable: true })
	public shared_comments: boolean = false;

	@Index('idx-external')
	@Column({ nullable: true })
	public external_id: string = '';

	@Column('datetime')
	public created_at: Date = new Date();

	@Column('datetime')
	public updated_at: Date = new Date();

	@Column('simple-array')
	public domain_names: string = '';

	@Column({ nullable: true })
	public details: string = '';

	@Column({ nullable: true, type: 'text' })
	public notes: string = '';

	@Column({ nullable: true })
	public group_id: string = '';

	@Column('simple-array')
	public tags: string[] = [];

	@Column({ nullable: true, type: 'simple-json' })
	public organization_fields: {
		key: string;
		value: string;
	} = {
		key: '',
		value: '',
	};
	@Column({ nullable: true, type: 'datetime' })
	public deleted_at: Date = new Date();
}
