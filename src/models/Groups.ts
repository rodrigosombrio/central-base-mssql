import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Groups extends BaseEntity {
	@PrimaryColumn('bigint')
	public id: BigInt;

	@Column()
	public name: string = '';

	@Column('datetime')
	public created_at: Date = new Date();

	@Column('datetime')
	public updated_at: Date = new Date();

	@Column()
	public url: string = '';

	@Column()
	public deleted: boolean = false;
}
