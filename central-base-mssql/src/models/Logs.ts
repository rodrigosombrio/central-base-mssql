import { BaseEntity, Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Configuration } from './Configuration';

@Entity()
export class Logs extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id: number = 0;

	@Column({ type: 'text', nullable: true })
	public key: string = '';

	@Column({ type: 'datetime', nullable: true })
	public startAt: Date = new Date();

	@Column({ nullable: true })
	public event: string = '';

	@Column({ type: 'text', nullable: true })
	public details: string = '';

	@Index()
	@Column({ nullable: true })
	public configId: number = 0;
}
