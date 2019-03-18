import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class Categories extends BaseEntity {
	@PrimaryColumn('bigint')
	public id: number = 0

	@Column()
	public name: string = ''

	@Column('datetime')
	public created_at: Date = new Date()

	@Column('datetime')
	public updated_at: Date = new Date()

	@Column()
	public url: string = ''

	@Column()
	public html_url: string = ''

	@Column()
	public position: number = 0;

	@Column()
	public description: string = ''

	@Column()
	public locale: string = '';

	@Column()
	public source_locale: string = '';

	@Column()
	public outdated: boolean = false

}
