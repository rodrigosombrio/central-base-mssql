import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class SlaPolicies extends BaseEntity {
	@PrimaryColumn('bigint')
	public id: number = 0

	@Column()
	public url: string = ''

	@Column()
	public title: string = ''

	@Column()
	public position: number = 0;

	@Column({ nullable: true })
	public description: string = ''

	@Column('datetime')
	public created_at: Date = new Date()

	@Column('datetime')
	public updated_at: Date = new Date()

	@Column('simple-json')
	public filter: string = '';

	@Column({ nullable: true, type: 'simple-json' })
	public policy_metrics: {
		priority: string,
		metric: string,
		target: number,
		business_hours: boolean,
	} = {
		business_hours: false,
		metric: '',
		priority: '',
		target: 0,
	};

}
