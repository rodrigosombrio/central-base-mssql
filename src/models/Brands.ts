import { Request } from 'mssql';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Database } from '../services/database';

const db: Database = new Database();

@Entity()
export class Brands {
	@PrimaryColumn()
	public id: BigInteger;

	@Column()
	public name: string = '';

	@Column('datetime')
	public created_at: Date;

	@Column('datetime')
	public updated_at: Date;

	@Column()
	public brand_url: string = '';

	@Column()
	public has_help_center: boolean = false;

	@Column()
	public help_center_state: string;

	@Column()
	public active: boolean;

	@Column()
	public default: boolean;

	@Column()
	public host_mapping: string;

	@Column()
	public subdomain: string;

	@Column()
	public signature_template: string;

	@Column()
	public url: string;

	@Column()
	public is_deleted: boolean;
}
