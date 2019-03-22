import { BaseEntity, Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
export class UserFields extends BaseEntity {
	@PrimaryColumn()
	public url: string = '';

	@Index({ unique: true })
	@Column('bigint')
	public id: number = 0;

	@Column({ nullable: true })
	public type: string = '';

	@Column({ nullable: true })
	public key: string = '';

	@Column({ nullable: true })
	public title: string = '';

	@Column('text')
	public description: string = '';

	@Column({ nullable: true })
	public raw_title: string = '';

	@Column('text')
	public raw_description: string = '';

	@Column({ nullable: true })
	public position: number = 0;

	@Column({ nullable: true })
	public active: boolean = true;

	@Column({ nullable: true })
	public system: boolean = false;

	@Column({ nullable: true })
	public regexp_for_validation: string = '';

	@Column({ nullable: true, type: 'simple-json' })
	public custom_field_options: string = '';

	@Column('datetime')
	public created_at: Date = new Date();

	@Column('datetime')
	public updated_at: Date = new Date();
}
