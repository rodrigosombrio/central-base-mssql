import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Logo extends BaseEntity {
	@PrimaryColumn('bigint')
	public id: number = 0;

	@Column()
	public url: string = '';

	@Column()
	public file_name: string = '';

	@Column()
	public content_url: string = '';

	@Column()
	public mapped_content_url: string = '';

	@Column()
	public content_type: string = '';

	@Column()
	public size: number = 0;

	@Column()
	public width: number = 0;

	@Column()
	public height: number = 0;

	@Column()
	public inline: boolean = false;
}
