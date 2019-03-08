import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Configuration extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id: number = 0;

	@Column({ length: 150 })
	public url: string = '';

	@Column({ length: 50 })
	public tableToParse: string = '';

	@Column('text')
	public scriptCustom: string = '';

	@Column()
	public beforeClean: boolean = false;

	@Column({ length: 30 })
	public incremental: string = '';

	@Column({ type: 'datetime', nullable: true })
	public lastExecuteAt: Date = new Date();

	@Column({ length: 20 })
	public schedule: string = '';

	@Column()
	public inExecution: boolean = false;

	@Column('int')
	public priority: number = 0;
}
