import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Articles extends BaseEntity {
	@PrimaryColumn('bigint')
	public id: number = 0;

	@Column()
	public url: string = '';

	@Column()
	public html_url: string = '';

	@Column({ type: 'bigint', nullable: true })
	public author_id: number = 0;

	@Column()
	public draft: boolean = false;

	@Column()
	public promoted: boolean = false;

	@Column({ nullable: true })
	public position: number = 0;

	@Column({ nullable: true })
	public vote_sum: number = 0;

	@Column()
	public vote_count: number = 0;

	@Column({ type: 'bigint', nullable: true })
	public section_id: number = 0;

	@Column('datetime')
	public created_at: Date = new Date();

	@Column('datetime')
	public updated_at: Date = new Date();

	@Column({ nullable: true })
	public name: string = '';

	@Column({ nullable: true })
	public title: string = '';

	@Column({ nullable: true })
	public locale: string = '';

	@Column({ nullable: true })
	public source_locale: string = '';

	@Column()
	public outdated: boolean = false;

	@Column('simple-array')
	public outdated_locales: string[] = [];

	@Column({ type: 'datetime', nullable: true })
	public edited_at: Date = new Date();

	@Column({ type: 'bigint', nullable: true })
	public user_segment_id: number = 0;

	@Column({ type: 'bigint', nullable: true })
	public permission_group_id: number = 0;

	@Column('simple-array')
	public label_names: string[] = [];

	@Column({ type: 'text', nullable: true })
	public body: string = '';
}
