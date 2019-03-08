import {
	BaseEntity,
	Column,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryColumn,
} from 'typeorm';
import { Logo } from './Logo';

@Entity()
export class Brands extends BaseEntity {
	@PrimaryColumn('bigint')
	public id: number = 0;

	@Column()
	public name: string = '';

	@Column('datetime')
	public created_at: Date = new Date();

	@Column('datetime')
	public updated_at: Date = new Date();

	@Column()
	public brand_url: string = '';

	@Column()
	public has_help_center: boolean = false;

	@Column()
	public help_center_state: string = '';

	@Column()
	public active: boolean = true;

	@Column()
	public default: boolean = false;

	@Column({ nullable: true })
	public host_mapping: string = '';

	@Column({ nullable: true })
	public subdomain: string = '';

	@Column({ nullable: true })
	public signature_template: string = '';

	@Column()
	public url: string = '';

	@Column()
	public is_deleted: boolean = false;

	@OneToOne((type) => Logo)
	@JoinColumn()
	public logo: Logo = new Logo();
}
