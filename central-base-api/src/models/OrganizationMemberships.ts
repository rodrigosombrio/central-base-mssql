import { BaseEntity, Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
@Index(['user_id', 'organization_id'])
export class OrganizationMemberships extends BaseEntity {
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
	public organization_id: number = 0;
}
