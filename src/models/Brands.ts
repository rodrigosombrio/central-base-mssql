import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class Brands extends BaseEntity {
	@PrimaryColumn('bigint')
	public id: number = 0

	@Column()
	public name: string = ''

	@Column('datetime')
	public created_at: Date = new Date()

	@Column('datetime')
	public updated_at: Date = new Date()

	@Column()
	public brand_url: string = ''

	@Column()
	public has_help_center: boolean = false

	@Column()
	public help_center_state: string = ''

	@Column()
	public active: boolean = true

	@Column()
	public default: boolean = false

	@Column({nullable: true})
	public host_mapping: string = ''

	@Column({nullable: true})
	public subdomain: string = ''

	@Column({nullable: true})
	public signature_template: string = ''

	@Column()
	public url: string = ''

	@Column()
	public is_deleted: boolean = false

	@Column('simple-array')
	public ticket_form_ids: number[] = []

	@Column({nullable: true, type: 'simple-json'})
	public logo: {
		url: string
		id: number
		file_name: string
		content_url: string
		mapped_content_url: string
		content_type: string
		size: number
		width: number
		height: number
		inline: boolean,
	} = {
		content_type: '',
		content_url: '',
		file_name: '',
		height: 0,
		id: 0,
		inline: false,
		mapped_content_url: '',
		size: 0,
		url: '',
		width: 0,
	}
}
