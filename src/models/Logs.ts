import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Configuration } from './Configuration';

@Entity()
export class Logs extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id: number = 0;

	@Column()
	public key: string = '';

	@Column({ type: 'datetime', nullable: true })
	public startAt: Date = new Date();

	@Column({ nullable: true })
	public event: string = '';

	@Column({ type: 'text', nullable: true })
	public details: string = '';

	@ManyToOne((type) => Configuration, (config) => config.logs)
	public config: Configuration = new Configuration();
}
