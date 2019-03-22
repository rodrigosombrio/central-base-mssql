import { BaseEntity, Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
@Index(['user_id', 'group_id'])
export class GroupsMemberships extends BaseEntity {
	@Index({ unique: true })
	@Column('bigint')
	public id: number = 0;

	@Column('datetime')
	public created_at: Date = new Date();

	@Column('datetime')
	public updated_at: Date = new Date();

	@PrimaryColumn()
	public url: string = '';

	@Column()
	public default: boolean = false;

	@Column('bigint')
	public user_id: number = 0;

	@Column('bigint')
	public group_id: number = 0;
}
