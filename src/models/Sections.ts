import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class Sections extends BaseEntity {
	@PrimaryColumn('bigint')
	public id: number = 0

	@Column()
	public url: string = ''

	@Column()
	public html_url: string = ''

	@Column({ nullable: true })
	public category_id: number = 0;

	@Column()
	public position: number = 0;

	@Column({ nullable: true })
	public sorting: string = ''

	@Column('datetime')
	public created_at: Date = new Date()

	@Column('datetime')
	public updated_at: Date = new Date()

	@Column({ nullable: true })
	public name: string = ''

	@Column({ nullable: true })
	public description: string = ''

	@Column()
	public locale: string = '';

	@Column()
	public source_locale: string = '';

	@Column()
	public outdated: boolean = false

	@Column({ nullable: true })
	public parent_section_id: number = 0;

	@Column({ nullable: true })
	public theme_template: string = '';

}
