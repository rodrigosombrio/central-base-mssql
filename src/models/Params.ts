import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Params extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id: number = 0;

	@Column()
	public value: string = '';

	@Column()
	public key: string = '';
}
