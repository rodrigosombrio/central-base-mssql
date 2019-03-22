import { BaseEntity, Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
export class Groups extends BaseEntity {
	@Index({ unique: true })
	@Column('bigint')
	public id: number = 0;

	@Column()
	public name: string = '';

	@Column('datetime')
	public created_at: Date = new Date();

	@Column('datetime')
	public updated_at: Date = new Date();

	@PrimaryColumn()
	public url: string = '';

	@Column()
	public deleted: boolean = false;
}
