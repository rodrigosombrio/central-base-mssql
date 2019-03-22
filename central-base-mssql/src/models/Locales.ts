import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Locales extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id: number = 0;

	@Column()
	public url: string = '';

	@Column()
	public locale: string = '';

	@Column()
	public name: string = '';

	@Column()
	public native_name: string = '';

	@Column()
	public presentation_name: string = '';

	@Column()
	public rtl: boolean = false;

	@Column()
	public default: boolean = false;

	@Column({ type: 'datetime', nullable: true })
	public created_at: Date = new Date()

	@Column('datetime')
	public updated_at: Date = new Date()

}
